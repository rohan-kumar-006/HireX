const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: ['student', 'recruiter'], required: true },
    profile: {
        skills: [String],
        bio: String,
        college: String,
        experience: String,
        resumeUrl: String,
        resumeText: String,
        googleId: String
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
