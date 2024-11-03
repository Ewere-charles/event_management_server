//config/dbConnection

import mongoose from "mongoose";

const connectDb = async (retries = 5) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            // Clear any existing connections
            if (mongoose.connections[0].readyState) {
                await mongoose.disconnect();
            }

            const connect = await mongoose.connect(process.env.CONNECTION_STRING, {
                serverSelectionTimeoutMS: 10000,
                socketTimeoutMS: 45000,
                family: 4,
                retryWrites: true,
                w: 'majority'
            });

            console.log(
                "Database connected:",
                connect.connection.host,
                connect.connection.name
            );

            // Add connection event handlers
            mongoose.connection.on('error', err => {
                console.error('MongoDB error:', err);
            });

            mongoose.connection.on('disconnected', () => {
                console.log('MongoDB disconnected');
            });

            mongoose.connection.on('connected', () => {
                console.log('MongoDB connected');
            });

            return connect;
        } catch (err) {
            console.error(`Connection attempt ${attempt} failed:`, err.message);
            
            if (err.name === 'MongoServerSelectionError') {
                console.error('\nTroubleshooting steps:');
                console.error('1. Check if your IP is whitelisted in MongoDB Atlas');
                console.error('2. Verify your username and password');
                console.error('3. Confirm the database name in your connection string');
                console.error('4. Ensure your MongoDB Atlas cluster is running');
                console.error('5. Check if your MongoDB Atlas free tier hasn\'t expired\n');
            }

            if (attempt === retries) {
                console.error('All connection attempts failed');
                throw err;
            }

            // Wait before retrying (exponential backoff)
            const waitTime = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
            console.log(`Waiting ${waitTime}ms before retry...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
    }
};

export default connectDb;