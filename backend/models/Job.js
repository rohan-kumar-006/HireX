const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    requirements: [String],
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    location: String,
    salary: String,
    workType: { type: String, enum: ['Remote', 'On-site'], default: 'On-site' },
    salaryMin: Number,
    salaryMax: Number,
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
