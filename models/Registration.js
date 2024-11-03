import mongoose from 'mongoose';

//models/Registrations
const registrationSchema = new mongoose.Schema({
    height: {
        type: Number,
        required: true
    },
    monthLg: {
        type: String,
        required: true,
        trim: true
    },
    monthSm: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Registration', registrationSchema);