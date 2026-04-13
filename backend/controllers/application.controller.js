const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const pdf = require('pdf-parse');
const { matchJob, analyzeResume } = require('../services/ai.service');

const applyToJob = async (req, res) => {
    try {
        if (req.user.role === 'recruiter') {
            return res.status(403).json({ message: 'Recruiters cannot apply for jobs' });
        }

        const jobId = req.params.jobId;
        const studentId = req.user.id;

        const existing = await Application.findOne({ job: jobId, student: studentId });
        if (existing) {
            console.log(`[DUPLICATE DETECTED] User ${studentId} already applied to Job ${jobId}`);
            return res.status(400).json({ message: 'Already applied' });
        }

        const job = await Job.findById(jobId);
        const student = await User.findById(studentId);

        if (!student.profile.resume) {
            return res.status(400).json({ message: 'Please upload your resume in your profile first' });
        }

        // 1. Skill Based Matching (Simple logic)
        const userSkills = student.profile.skills || [];
        const jobSkills = job.requirements || [];
        const matchedSkills = userSkills.filter(skill => 
            jobSkills.some(js => js.toLowerCase() === skill.toLowerCase())
        );
        
        const skillScore = jobSkills.length > 0 
            ? (matchedSkills.length / jobSkills.length) * 100 
            : 100;

        // 2. AI Based Matching
        const aiResult = await matchJob(student.profile.resumeText || "", job.description);
        console.log(aiResult," Ai Score");
        
        // 3. Combine Scores
        const finalMatchScore = Math.round((skillScore + aiResult.matchScore) / 2);
        console.log(finalMatchScore," finalMatchScore");

        // 4. Calculate Missing Skills manually (from structured data)
        const missingSkills = jobSkills.filter(skill => 
            !userSkills.some(us => us.toLowerCase() === skill.toLowerCase())
        );
        
        const application = new Application({
            job: jobId,
            student: studentId,
            matchScore: finalMatchScore,
            missingSkills: missingSkills
        });

        await application.save();
        console.log(`[APPLICATION CREATED] User ${studentId} applied to Job ${jobId}`);
        res.status(201).json({ message: 'Applied successfully!', application });
    } catch (err) {
        if (err.code === 11000) {
            console.log(`[DB DUPLICATE PREVENTED] User ${req.user.id} tried applying again to Job ${req.params.jobId}`);
            return res.status(400).json({ message: 'Already applied' });
        }
        console.error("Error in applyToJob:", err);
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
            'profile.resumeName': req.file.originalname,
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
        const apps = await Application.find({ student: req.user.id })
            .populate({
                path: 'job',
                populate: { path: 'recruiter', select: 'name' }
            });
        res.json(apps);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching applications' });
    }
};

const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;

        if (req.user.role !== 'recruiter') {
            return res.status(403).json({ message: 'Only recruiters can update status' });
        }

        const application = await Application.findByIdAndUpdate(
            applicationId,
            { status },
            { new: true }
        );

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        res.json({ message: `Application ${status}`, application });
    } catch (err) {
        res.status(500).json({ message: 'Error updating status' });
    }
};

module.exports = { applyToJob, uploadResume, getApplicants, getMyApplications, updateStatus };
