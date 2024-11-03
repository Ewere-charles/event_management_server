// models/Summary.js
import mongoose from 'mongoose';

const summarySchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
    }, 
    title: {
        type: String,
        required: true,
        trim: true
    },
    rate: {
        type: String,
        required: true
    },
    percentage: {
        type: String,
        required: true,
        trim: true 
    }
}, {
    timestamps: true  // Moved timestamps option here as second argument
});

export default mongoose.model('Summary', summarySchema);