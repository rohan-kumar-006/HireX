const Groq = require('groq-sdk');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const analyzeResume = async (resumeText) => {
    try {
        const prompt = `Analyze this resume text and return a JSON object with: 
        1. "skills" (array of skills found)
        2. "summary" (brief 2 line summary)
        3. "suggestions" (array of 3 improvements)
        Resume: ${resumeText}`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama3-8b-8192',
            response_format: { type: "json_object" }
        });

        return JSON.parse(chatCompletion.choices[0].message.content);
    } catch (error) {
        console.error("AI Error:", error);
        return { skills: [], summary: "Error analyzing", suggestions: [] };
    }
};

const matchJob = async (resumeText, jobDescription) => {
    try {
        const prompt = `Compare this resume text with the job description. 
        Return a JSON object with: 
        1. "matchScore" (a number between 0-100)
        2. "missingSkills" (array of skills required but not in resume)
        3. "feedback" (one line feedback)
        
        Resume: ${resumeText}
        Job Description: ${jobDescription}`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama3-8b-8192',
            response_format: { type: "json_object" }
        });

        return JSON.parse(chatCompletion.choices[0].message.content);
    } catch (error) {
        console.error("AI Match Error:", error);
        return { matchScore: 0, missingSkills: [], feedback: "Error matching" };
    }
};

module.exports = { analyzeResume, matchJob };
