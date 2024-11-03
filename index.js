import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import connectDb from './config/dbConnection.js';
import Event from './models/Event.js';
import TrashEvent from './models/TrashEvent.js';
import Notification from './models/Notification.js';
import Summary from './models/Summary.js';
import latestNews from './models/LatestNews.js';
import Registration from './models/Registration.js';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3001;

// CORS Configuration - PLACE THIS BEFORE OTHER MIDDLEWARE
app.use(cors({
    origin: ['http://127.0.0.1:5501', 'http://localhost:5501', 'https://event-management-woad-beta.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));



// Connect to MongoDB
connectDb().then(() => {
    console.log('MongoDB connection initialized');
}).catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
    console.log('Successfully connected to MongoDB.');
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

// Middleware
app.use(express.json());
app.use(morgan('dev'));


// Routes
// Add this near your other routes
app.get('/', (req, res) => {
    res.json({
        message: 'API is running',
        status: 'healthy',
        endpoints: {
            events: '/event',
            notifications: '/notifications',
            trash: '/trash'
        }
    });
});

// Get all events
app.get('/event', async (req, res) => {
    try {
        const events = await Event.find().sort({ createdAt: -1 });
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get specific event
app.get('/event/:event', async (req, res) => {
    try {
        const eventName = req.params.event.toLowerCase();
        const event = await Event.findOne({
            name: new RegExp(`^${eventName}$`, 'i')
        });
        
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new event
app.post('/event', async (req, res) => {
    try {
        const { name, date } = req.body;
        
        // Only check for the minimum required fields
        if (!name || !date) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['name', 'date'],
                message: 'Only name and date are required. All other fields are optional.'
            });
        }

        // Create event with all possible fields from the request body
        const eventData = {
            name,
            date,
            ...req.body  // This will include any additional fields sent in the request
        };

        const event = await Event.create(eventData);

        // Create a notification that includes info about optional fields
        const providedFields = Object.keys(req.body).filter(key => key !== 'name' && key !== 'date');
        const notificationMessage = `New event "${name}" has been created` + 
            (providedFields.length ? ` with details for: ${providedFields.join(', ')}` : '');

        await Notification.create({
            message: notificationMessage,
            type: 'update'
        });

        // Get schema paths from the Event model
        const schemaFields = Object.keys(Event.schema.paths).filter(
            path => !['_id', '__v', 'createdAt', 'updatedAt'].includes(path)
        );
        
        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            event,
            providedFields: Object.keys(req.body),
            defaultedFields: schemaFields.filter(field => !req.body.hasOwnProperty(field))
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                error: 'An event with this name already exists'
            });
        }
        console.error('Error creating event:', error);
        res.status(500).json({ 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Update event
app.put('/event/:event', async (req, res) => {
    try {
        const eventName = req.params.event.toLowerCase();
        const event = await Event.findOneAndUpdate(
            { name: new RegExp(`^${eventName}$`, 'i') },
            req.body,
            { new: true, runValidators: true }
        );

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        await Notification.create({
            message: `Event "${event.name}" has been updated`,
            type: 'update'
        });

        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete event (move to trash)
app.delete('/event/:event', async (req, res) => {
    try {
        const eventName = req.params.event.toLowerCase();
        const event = await Event.findOne({
            name: new RegExp(`^${eventName}$`, 'i')
        });

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Move to trash
        await TrashEvent.create({
            name: event.name,
            date: event.date,
            location: event.location,
            description: event.description,
            originalData: event.toObject()
        });

        // Delete from events
        await event.deleteOne();

        await Notification.create({
            message: `Event "${event.name}" has been temporarily deleted`,
            type: 'temporary_delete'
        });

        res.status(200).json({
            message: 'Event moved to trash successfully',
            event
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get trash
app.get('/trash', async (req, res) => {
    try {
        const trashedEvents = await TrashEvent.find().sort({ deletedAt: -1 });
        res.status(200).json(trashedEvents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Restore from trash
app.get('/trash/:trash', async (req, res) => {
    try {
        const trashName = req.params.trash.toLowerCase();
        const trashedEvent = await TrashEvent.findOne({
            name: new RegExp(`^${trashName}$`, 'i')
        });

        if (!trashedEvent) {
            return res.status(404).json({ error: 'Event not found in trash' });
        }

        // Restore to events
        const restoredEvent = await Event.create({
            name: trashedEvent.name,
            date: trashedEvent.date,
            location: trashedEvent.location,
            description: trashedEvent.description
        });

        // Remove from trash
        await trashedEvent.deleteOne();

        await Notification.create({
            message: `Event "${restoredEvent.name}" has been restored`,
            type: 'restored_event'
        });

        res.status(200).json({
            message: 'Event restored successfully',
            event: restoredEvent
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Permanently delete from trash
app.delete('/trash/:trash', async (req, res) => {
    try {
        const trashName = req.params.trash.toLowerCase();
        const trashedEvent = await TrashEvent.findOneAndDelete({
            name: new RegExp(`^${trashName}$`, 'i')
        });

        if (!trashedEvent) {
            return res.status(404).json({ error: 'Event not found in trash' });
        }

        await Notification.create({
            message: `Event "${trashedEvent.name}" has been permanently deleted`,
            type: 'permanent_delete'
        });

        res.status(200).json({
            message: 'Event permanently deleted',
            event: trashedEvent
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get notifications
app.get('/notifications', async (req, res) => {
    try {
        const notifications = await Notification.find()
            .sort({ timestamp: -1 })
            .limit(50);
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete notification
app.delete('/notifications/:id', async (req, res) => {
    try {
        const notification = await Notification.findByIdAndDelete(req.params.id);
        
        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        res.status(200).json({
            message: 'Notification deleted successfully',
            notification
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Routes for Summary
app.get('/summaries', async (req, res) => {
    try {
        const summaries = await Summary.find()
            .populate('eventId')
            .sort({ createdAt: -1 });
        res.status(200).json(summaries);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/summaries', async (req, res) => {
    try {
        const summary = await Summary.create(req.body);
        await Notification.create({
            message: `New summary "${summary.title}" has been created`,
            type: 'update'
        });
        res.status(201).json(summary);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Routes for Latest News
app.get('/latest-news', async (req, res) => {
    try {
        const news = await latestNews.find()
            .sort({ createdAt: -1 });
        res.status(200).json(news);
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
});

app.post('/latest-news', async (req, res) => {
    try {
        const { newsHeadline, newsNote, newsImg } = req.body;

        // Validate required fields
        if (!newsHeadline || !newsNote || !newsImg) {
            return res.status(400).json({
                success: false,
                error: 'All fields are required (newsHeadline, newsNote, newsImg)'
            });
        }

        const news = await latestNews.create({
            newsHeadline,
            newsNote,
            newsImg
        });

        // Create notification for new news
        await Notification.create({
            message: `New news item "${newsHeadline}" has been published`,
            type: 'news'
        });

        res.status(201).json({
            success: true,
            data: news
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Routes for Registration
app.get('/registrations', async (req, res) => {
    try {
        const registrations = await Registration.find()
            .sort({ createdAt: -1 });
        res.status(200).json(registrations);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.post('/registrations', async (req, res) => {
    try {
        const { height, monthLg, monthSm } = req.body;

        // Validate required fields
        if (!height || !monthLg || !monthSm) {
            return res.status(400).json({
                success: false,
                error: 'All fields are required (height, monthLg, monthSm)'
            });
        }

        // Validate height is a number
        if (typeof height !== 'number') {
            return res.status(400).json({
                success: false,
                error: 'Height must be a number'
            });
        }

        const registration = await Registration.create({
            height,
            monthLg,
            monthSm
        });

        // Create notification for new registration
        await Notification.create({
            message: `New registration data added for month ${monthLg}`,
            type: 'registration'
        });

        res.status(201).json({
            success: true,
            data: registration
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});



// Start server only after database connection
mongoose.connection.once('open', () => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});

export default app;
