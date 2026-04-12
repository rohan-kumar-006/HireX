const Job = require('../models/Job');

const postJob = async (req, res) => {
    try {
        if (req.user.role !== 'recruiter') {
            return res.status(403).json({ message: 'Only recruiters can post jobs' });
        }

        const { title, description, requirements, location, salary, workType, salaryMin, salaryMax } = req.body;
        
        const job = new Job({
            title,
            description,
            requirements: typeof requirements === 'string' ? requirements.split(',').map(s => s.trim()) : requirements,
            recruiter: req.user.id,
            location,
            salary,
            workType,
            salaryMin,
            salaryMax
        });

        await job.save();
        res.status(201).json(job);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error posting job' });
    }
};

const getAllJobs = async (req, res) => {
    try {
        const { workType, minSalary, maxSalary, search } = req.query;
        let query = {};

        if (workType) query.workType = workType;
        if (minSalary) query.salaryMin = { $gte: Number(minSalary) };
        if (maxSalary) query.salaryMax = { $lte: Number(maxSalary) };
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const jobs = await Job.find(query).populate('recruiter', 'name').sort({ createdAt: -1 });
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

const getMyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ recruiter: req.user.id }).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching your jobs' });
    }
};

module.exports = { postJob, getAllJobs, getJobById, getMyJobs };
