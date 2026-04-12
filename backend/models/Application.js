const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    matchScore: { type: Number, default: 0 },
    missingSkills: [String],
    status: { type: String, enum: ['applied', 'accepted', 'rejected'], default: 'applied' }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
