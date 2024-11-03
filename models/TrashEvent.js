// models/TrashEvent.js
import mongoose from 'mongoose';

const trashEventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    deletedAt: {
        type: Date,
        default: Date.now
    },
    originalData: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    }
});

export default mongoose.model("TrashEvent", trashEventSchema);
