// models/Notification.js
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['update', 'temporary_delete', 'permanent_delete', 'restored_event', 'news', 'registration',],
        default: 'update'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Notification', notificationSchema);