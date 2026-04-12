const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const pdf = require('pdf-parse');
const { matchJob, analyzeResume } = require('../services/ai.service');

const applyToJob = async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const studentId = req.user.id;

        // Check if already applied
        const existing = await Application.findOne({ job: jobId, student: studentId });
        if (existing) return res.status(400).json({ message: 'Already applied' });

        const job = await Job.findById(jobId);
        const student = await User.findById(studentId);

        if (!student.profile.resumeText) {
            return res.status(400).json({ message: 'Please upload resume first' });
        }

        // AI Matching
        const aiResult = await matchJob(student.profile.resumeText, job.description);

        const application = new Application({
            job: jobId,
            student: studentId,
            matchScore: aiResult.matchScore,
            missingSkills: aiResult.missingSkills
        });

        await application.save();
        res.status(201).json({ message: 'Applied successfully', application });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error applying' });
    }
};

const uploadResume = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        const dataBuffer = req.file.buffer;
        const pdfData = await pdf(dataBuffer);
        const resumeText = pdfData.text;

        // Analyze resume to get skills and suggestions
        const analysis = await analyzeResume(resumeText);

        await User.findByIdAndUpdate(req.user.id, {
            'profile.resumeText': resumeText,
            'profile.skills': analysis.skills,
            'profile.bio': analysis.summary
        });

        res.json({ message: 'Resume uploaded and analyzed', analysis });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error processing resume' });
    }
};

const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const applicants = await Application.find({ job: jobId })
            .populate('student', 'name email profile')
            .sort({ matchScore: -1 });

        res.json(applicants);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching applicants' });
    }
};

const getMyApplications = async (req, res) => {
    try {
        const apps = await Application.find({ student: req.user.id }).populate('job');
        res.json(apps);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching applications' });
    }
};

module.exports = { applyToJob, uploadResume, getApplicants, getMyApplications };
