import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { v4 as uuidv4 } from 'uuid';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3001;

// Initialize in-memory database
const inMemoryDB = {
    event: [],
    latest: [],
    summary: {},
    registration: [],
    trash: [],
    notifications: []
};

// Single CORS middleware configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());
app.use(morgan('dev'));

// Data validation middleware
const validateEventData = (req, res, next) => {
    const { name, date, location, description } = req.body;
    
    if (!name || !date || !location || !description) {
        return res.status(400).json({
            error: 'Missing required fields',
            required: ['name', 'date', 'location', 'description']
        });
    }
    
    next();
};

// Routes
// Get all data
app.get('/', async (req, res) => {
    try {
        res.status(200).json(inMemoryDB);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to retrieve data',
            message: error.message
        });
    }
});

// Get latest events
app.get('/latest', async (req, res) => {
    try {
        res.status(200).json(inMemoryDB.latest);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to retrieve latest events',
            message: error.message
        });
    }
});

// Get all events
app.get('/event', async (req, res) => {
    try {
        res.status(200).json(inMemoryDB.event);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to retrieve events',
            message: error.message
        });
    }
});

// Create new event
app.post('/event', validateEventData, async (req, res) => {
    try {
        // Check for duplicate event names
        const existingEvent = inMemoryDB.event.find(
            e => e.name.toLowerCase() === req.body.name.toLowerCase()
        );

        if (existingEvent) {
            return res.status(400).json({
                error: 'An event with this name already exists'
            });
        }

        const newEvent = {
            id: uuidv4(),
            ...req.body,
            createdAt: new Date().toISOString()
        };

        inMemoryDB.event.unshift(newEvent);
        
        // Add notification for new event
        inMemoryDB.notifications.unshift({
            id: uuidv4(),
            message: `New event "${newEvent.name}" has been created`,
            timestamp: new Date().toISOString(),
            type: 'new_event'
        });

        // Maintain notifications limit
        if (inMemoryDB.notifications.length > 50) {
            inMemoryDB.notifications = inMemoryDB.notifications.slice(0, 50);
        }

        res.status(201).json(newEvent);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to create event',
            message: error.message
        });
    }
});

// Delete notification
app.delete('/notifications/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const notificationIndex = inMemoryDB.notifications.findIndex(
            notification => notification.id === id
        );

        if (notificationIndex === -1) {
            return res.status(404).json({
                error: 'Notification not found'
            });
        }

        const deletedNotification = inMemoryDB.notifications.splice(notificationIndex, 1)[0];
        
        res.status(200).json({
            message: 'Notification deleted successfully',
            notification: deletedNotification
        });
    } catch (error) {
        res.status(500).json({
            error: 'Failed to delete notification',
            message: error.message
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not found',
        message: `Cannot ${req.method} ${req.url}`
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
