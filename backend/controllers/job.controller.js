const Job = require('../models/Job');

const postJob = async (req, res) => {
    try {
        if (req.user.role !== 'recruiter') {
            return res.status(403).json({ message: 'Only recruiters can post jobs' });
        }

        const { title, description, requirements, location, salary } = req.body;
        
        const job = new Job({
            title,
            description,
            requirements: requirements.split(',').map(s => s.trim()),
            recruiter: req.user.id,
            location,
            salary
        });

        await job.save();
        res.status(201).json(job);
    } catch (err) {
        res.status(500).json({ message: 'Error posting job' });
    }
};

const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find().populate('recruiter', 'name');
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching jobs' });
    }
};

const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('recruiter', 'name email');
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.json(job);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching job' });
    }
};

module.exports = { postJob, getAllJobs, getJobById };
