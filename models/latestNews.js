// models/LatestNews.js
import mongoose from 'mongoose';

const latestNewsSchema = new mongoose.Schema({
    newsHeadline: {
        type: String,
        required: true,
        trim: true
    },
    newsNote: {
        type: String,
        required: true,
        trim: true
    },
    newsImg: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});

export default mongoose.model('LatestNews', latestNewsSchema);