// src/index.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import morgan from 'morgan';
import { v4 as uuidv4 } from 'uuid';

// Get directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3001;
    
// Middleware
// More specific CORS setup
app.use(cors({
    origin: true, // or specifically list your frontend URL like 'http://127.0.0.1:5501'
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));


app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev')); // Logging middleware

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

// Load database
const loadDatabase = async () => {
    try {
        const filePath = join(__dirname, 'db.json');
        console.log('Attempting to read from:', filePath); // Debug log
        
        const data = await fs.readFile(filePath, 'utf8');
        console.log('Data read successfully:', data); // Debug log
        
        return JSON.parse(data);
    } catch (error) {
        console.error('Detailed error:', {
            message: error.message,
            code: error.code,
            path: join(__dirname, 'db.json')
        });
        
        // If file doesn't exist, create it with default structure
        if (error.code === 'ENOENT') {
            const defaultData = {
                event: [],
                latest: [],
                summary: {},
                registration: [],
                trash: []
            };
            
            await fs.writeFile(
                join(__dirname, 'db.json'),
                JSON.stringify(defaultData, null, 2)
            );
            
            return defaultData;
        }
        
        throw new Error(`Failed to load database: ${error.message}`);
    }
};

// Save database
const saveDatabase = async (data) => {
    try {
        await fs.writeFile(
            join(__dirname, 'db.json'),
            JSON.stringify(data, null, 2)
        );
    } catch (error) {
        console.error('Error saving database:', error);
        throw new Error('Failed to save database');
    }
};

// Routes

// Get all data
app.get('/', async (req, res, next) => {
    try {
        const allData = await loadDatabase();
        res.status(200).json(allData);
    } catch (error) {
        next(error);
    }
});

// Get all events
app.get('/event', async (req, res, next) => {
    try {
        const allData = await loadDatabase();
        res.status(200).json(allData.event);
    } catch (error) {
        next(error);
    }
});

// Get latest events
app.get('/latest', async (req, res, next) => {
    try {
        const allData = await loadDatabase();
        res.status(200).json(allData.latestNews);
    } catch (error) {
        next(error);
    }
});

// Get summary
app.get('/summary', async (req, res, next) => {
    try {
        const allData = await loadDatabase();
        res.status(200).json(allData.summary);
    } catch (error) {
        next(error);
    }
});

// Get registration data
app.get('/registration', async (req, res, next) => {
    try {
        const allData = await loadDatabase();
        res.status(200).json(allData.registration);
    } catch (error) {
        next(error);
    }
});

// Get trash data
app.get('/trash', async (req, res, next) => {
    try {
        const allData = await loadDatabase();
        res.status(200).json(allData.trash);
    } catch (error) {
        next(error);
    }
});


app.get('/notifications', async (req, res, next) => {
    try {
        const allData = await loadDatabase();
        res.status(200).json(allData.notifications);
    } catch (error) {
        next(error);
    }
});
// Get specific event
app.get('/event/:event', async (req, res, next) => {
    try {
        const allData = await loadDatabase();
        const eventParam = req.params.event.toLowerCase();
        const selectedEvent = allData.event.find(
            item => item.name.toLowerCase() === eventParam
        );
        
        if (!selectedEvent) {
            return res.status(404).json({
                error: `Event not found: ${eventParam}`
            });
        }
        
        res.status(200).json(selectedEvent);
    } catch (error) {
        next(error);
    }
});

// Restore event from trash
app.get('/trash/:trash', async (req, res, next) => {
    try {
        const allData = await loadDatabase();
        const trashParam = req.params.trash.toLowerCase();
        const trashIndex = allData.trash.findIndex(
            item => item.name.toLowerCase() === trashParam
        );

        if (trashIndex === -1) {
            return res.status(404).json({
                error: 'Event not found in trash'
            });
        }

        // Move from trash to events
        const restoredEvent = allData.trash[trashIndex];
        allData.event.unshift(restoredEvent);
        allData.trash.splice(trashIndex, 1);

        
        // Add notification
        allData.notifications.unshift({
            id: uuidv4(),
            message: `"${trashParam}" has been successfully restored`,
            timestamp: new Date().toISOString(),
            type: 'restored_event'
        });

        // Keep only last 50 notifications
        if (allData.notifications.length > 50) {
            allData.notifications = allData.notifications.slice(0, 50);
        }


        await saveDatabase(allData);
        
        res.status(200).json({
            message: 'Event restored successfully',
            event: restoredEvent
        });
    } catch (error) {
        next(error);
    }
});

// Create new event
app.post('/event', validateEventData, async (req, res, next) => {
    try {
        const allData = await loadDatabase();
        const newEvent = {
            id: Date.now().toString(),
            ...req.body,
            createdAt: new Date().toISOString()
        };

        // Check for duplicate event names
        const existingEvent = allData.event.find(
            e => e.name.toLowerCase() === newEvent.name.toLowerCase()
        );

        if (existingEvent) {
            return res.status(400).json({
                error: 'An event with this name already exists'
            });
        }

        allData.event.unshift(newEvent);
        await saveDatabase(allData);

        res.status(201).json(newEvent);
    } catch (error) {
        next(error);
    }
});

// Update event
app.put('/event/:event', async (req, res, next) => {
    try {
        const allData = await loadDatabase();
        const eventParam = req.params.event.toLowerCase();
        const eventIndex = allData.event.findIndex(
            item => item.name.toLowerCase() === eventParam
        );

        if (eventIndex === -1) {
            return res.status(404).json({
                error: 'Event not found'
            });
        }

        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({
                error: 'No data provided to update'
            });
        }

        // Update event while preserving existing fields
        allData.event[eventIndex] = {
            ...allData.event[eventIndex],
            ...req.body,
            updatedAt: new Date().toISOString()
        };

        
        // Add notification
        allData.notifications.unshift({
            id: uuidv4(),
            message: `"${eventParam}" was updated successfully`,
            timestamp: new Date().toISOString(),
            type: 'update'
        });

        // Keep only last 50 notifications
        if (allData.notifications.length > 50) {
            allData.notifications = allData.notifications.slice(0, 50);
        }


        await saveDatabase(allData);
        
        res.status(200).json(allData.event[eventIndex]);
    } catch (error) {
        next(error);
    }
});

// Delete event (move to trash)
app.delete('/event/:event', async (req, res, next) => {
    try {
        const allData = await loadDatabase();
        const eventParam = req.params.event.toLowerCase();
        const eventIndex = allData.event.findIndex(
            item => item.name.toLowerCase() === eventParam
        );

        if (eventIndex === -1) {
            return res.status(404).json({
                error: 'Event not found'
            });
        }

        // Move to trash
        const deletedEvent = allData.event[eventIndex];
        deletedEvent.deletedAt = new Date().toISOString();
        allData.trash.push(deletedEvent);
        
        // Remove from events
        allData.event.splice(eventIndex, 1);
        
        // Add notification
        allData.notifications.unshift({
            id: uuidv4(),
            message: `Event "${deletedEvent.name}" has been temporary deleted, you can recover it later from trash`,
            timestamp: new Date().toISOString(),
            type: 'temporary_delete'
        });

        // Keep only last 50 notifications
        if (allData.notifications.length > 50) {
            allData.notifications = allData.notifications.slice(0, 50);
        }


        await saveDatabase(allData);
        
        res.status(200).json({
            message: 'Event moved to trash successfully',
            event: deletedEvent
        });
    } catch (error) {
        next(error);
    }
});

app.delete('/trash/:trash', async (req, res, next) => {
    try {
        const allData = await loadDatabase();
        const trashParam = req.params.trash.toLowerCase();
        const trashIndex = allData.trash.findIndex(
            item => item.name.toLowerCase() === trashParam
        );

        if (trashIndex === -1) {
            return res.status(404).json({
                error: 'Event not found in trash'
            });
        }

        // Remove from trash
        const deletedEvent = allData.trash.splice(trashIndex, 1)[0];

        // Add notification
        allData.notifications.unshift({
            id: uuidv4(),
            message: `Event "${deletedEvent.name}" has been permanently deleted`,
            timestamp: new Date().toISOString(),
            type: 'permanent_delete'
        });

        // Keep only last 50 notifications
        if (allData.notifications.length > 50) {
            allData.notifications = allData.notifications.slice(0, 50);
        }

        await saveDatabase(allData);
        
        res.status(200).json({
            message: 'Event permanently deleted',
            event: deletedEvent
        });
    } catch (error) {
        next(error);
    }
});


// Delete a specific notification
app.delete('/notifications/:id', async (req, res, next) => {
    try {
        const allData = await loadDatabase();
        const { id } = req.params;
        
        // Initialize notifications array if it doesn't exist
        if (!Array.isArray(allData.notifications)) {
            allData.notifications = [];
        }

        const notificationIndex = allData.notifications.findIndex(
            notification => notification.id === id
        );

        if (notificationIndex === -1) {
            return res.status(404).json({
                error: 'Notification not found'
            });
        }

        // Remove the notification
        const deletedNotification = allData.notifications.splice(notificationIndex, 1)[0];

        await saveDatabase(allData);
        
        res.status(200).json({
            message: 'Notification deleted successfully',
            notification: deletedNotification
        });
    } catch (error) {
        console.error('Error deleting notification:', error);
        next(error);
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
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