const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: ['student', 'recruiter'] },

    profile: {
        skills: [String],
        bio: String,
        college: String,
        linkedin: String, 
        portfolio: String,
        resume: String,
        resumeText: String,
        resumeName: String,
        
        companyName: String, 
        companyDescription: String,
        ongoingProjects: String,
        
        googleId: String
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
