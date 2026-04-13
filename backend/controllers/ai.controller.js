const pdf = require('pdf-parse');
const { analyzeResume } = require('../services/ai.service');

const processResumeAnalysis = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No resume file uploaded' });

        const dataBuffer = req.file.buffer;
        const pdfData = await pdf(dataBuffer);
        const resumeText = pdfData.text;

        const analysis = await analyzeResume(resumeText);
        const role = req.user.role;

        let filteredAnalysis = { summary: analysis.summary };

        if (role === 'student') {
            filteredAnalysis.positives = analysis.positives;
            filteredAnalysis.suggestions = analysis.suggestions;
        } else if (role === 'recruiter') {
            filteredAnalysis.skills = analysis.skills;
            filteredAnalysis.negatives = analysis.negatives;
        }

        res.json(filteredAnalysis);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error analyzing resume' });
    }
};

module.exports = { processResumeAnalysis };
