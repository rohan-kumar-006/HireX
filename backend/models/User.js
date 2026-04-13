const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: ['student', 'recruiter'], required: true },
    profile: {
        // Shared & Student Fields
        skills: [String],
        bio: String,
        college: String,
        linkedin: String, // New
        portfolio: String, // New
        resume: String,
        resumeText: String,
        resumeName: String,
        
        // Recruiter Specific Fields
        companyName: String, // New
        companyDescription: String, // New
        ongoingProjects: String, // New
        
        googleId: String
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
