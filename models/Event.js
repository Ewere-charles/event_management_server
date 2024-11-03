import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add event name"],
        unique: true,
        trim: true
    },
    date: {
        type: Date,
        required: [true, "Please add event date"]
    },
    location: {
        type: String,
        default: "To be announced" // Default value if not provided
    },
    description: {
        type: String,
        default: "No description provided" // Default value if not provided
    },
    numSpeaker: {
        type: Number,
        default: 0
    },
    speaker: {
        type: [String],
        default: []
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed', 'Upcoming', 'cancelled'],
        default: 'Pending'
    },
    category: {
        type: String,
        default: 'General'
    },
    organizer: {
        type: String,
        default: 'TBA'
    },
    maxAttendees: {
        type: Number,
        default: null
    },
    currentAttendees: {
        type: Number,
        default: 0
    },
    isVirtual: {
        type: Boolean,
        default: false
    },
    virtualLink: {
        type: String,
        default: null
    },
    tags: {
        type: [String],
        default: []
    },
    registrationDeadline: {
        type: Date,
        default: null
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

export default mongoose.model("Event", eventSchema);