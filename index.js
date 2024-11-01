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

// Single CORS middleware configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || true, // Use environment variable or allow all
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

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

// Load database with enhanced error handling
const loadDatabase = async () => {
    const filePath = join(__dirname, 'db.json');
    
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            // Initialize with all required arrays and objects
            const defaultData = {
                event: [],
                latest: [],
                summary: {},
                registration: [],
                trash: [],
                notifications: [] // Initialize notifications array
            };
            
            try {
                await fs.writeFile(
                    filePath,
                    JSON.stringify(defaultData, null, 2)
                );
                return defaultData;
            } catch (writeError) {
                throw new Error(`Failed to create database file: ${writeError.message}`);
            }
        }
        
        throw new Error(`Database error: ${error.message}`);
    }
};

// Save database with enhanced error handling
const saveDatabase = async (data) => {
    const filePath = join(__dirname, 'db.json');
    
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
        throw new Error(`Failed to save database: ${error.message}`);
    }
};

// Routes
// Get all data with error response
app.get('/', async (req, res) => {
    try {
        const allData = await loadDatabase();
        res.status(200).json(allData);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to retrieve data',
            message: error.message
        });
    }
});

// Get latest events (corrected property name)
app.get('/latest', async (req, res) => {
    try {
        const allData = await loadDatabase();
        res.status(200).json(allData.latest); // Using correct property name
    } catch (error) {
        res.status(500).json({
            error: 'Failed to retrieve latest events',
            message: error.message
        });
    }
});

// Get all events with enhanced error handling
app.get('/event', async (req, res) => {
    try {
        const allData = await loadDatabase();
        res.status(200).json(allData.event);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to retrieve events',
            message: error.message
        });
    }
});

// Create new event with enhanced validation
app.post('/event', validateEventData, async (req, res) => {
    try {
        const allData = await loadDatabase();
        
        // Check for duplicate event names
        const existingEvent = allData.event.find(
            e => e.name.toLowerCase() === req.body.name.toLowerCase()
        );

        if (existingEvent) {
            return res.status(400).json({
                error: 'An event with this name already exists'
            });
        }

        const newEvent = {
            id: uuidv4(), // Using UUID instead of timestamp for better uniqueness
            ...req.body,
            createdAt: new Date().toISOString()
        };

        allData.event.unshift(newEvent);
        
        // Add notification for new event
        allData.notifications.unshift({
            id: uuidv4(),
            message: `New event "${newEvent.name}" has been created`,
            timestamp: new Date().toISOString(),
            type: 'new_event'
        });

        // Maintain notifications limit
        if (allData.notifications.length > 50) {
            allData.notifications = allData.notifications.slice(0, 50);
        }

        await saveDatabase(allData);
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to create event',
            message: error.message
        });
    }
});

// Delete notification with enhanced error handling
app.delete('/notifications/:id', async (req, res) => {
    try {
        const allData = await loadDatabase();
        const { id } = req.params;
        
        if (!Array.isArray(allData.notifications)) {
            allData.notifications = [];
            await saveDatabase(allData);
            return res.status(404).json({
                error: 'Notification not found'
            });
        }

        const notificationIndex = allData.notifications.findIndex(
            notification => notification.id === id
        );

        if (notificationIndex === -1) {
            return res.status(404).json({
                error: 'Notification not found'
            });
        }

        const deletedNotification = allData.notifications.splice(notificationIndex, 1)[0];
        await saveDatabase(allData);
        
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