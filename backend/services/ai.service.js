const axios = require('axios');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const analyzeResume = async (resumeText) => {
    try {
        const prompt = `Analyze this resume text and return a JSON object with: 
        1. "skills" (array of skills found)
        2. "summary" (brief 2 line summary)
        3. "suggestions" (array of 3 improvements)
        4. "positives" (array of 3 strengths)
        5. "negatives" (array of 3 weak points/missing areas)

        IMPORTANT: Return ONLY valid JSON.

        Resume: ${resumeText}`;


        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "mistralai/mixtral-8x7b-instruct",
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.3
            },
            {
                headers: {
                    "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const result = response.data.choices[0].message.content;

        try {
            return JSON.parse(result);
        } catch {
            console.error("Parse Error:", result);
            return { skills: [], summary: "Parsing error", suggestions: [], positives: [], negatives: [] };
        }

    } catch (error) {
        console.error("AI Error:", error.response?.data || error.message);
        return { skills: [], summary: "Error analyzing", suggestions: [], positives: [], negatives: [] };
    }

};

const matchJob = async (resumeText, jobDescription) => {
    try {
        const prompt = `Compare this resume text with the job description. 
        Return a JSON object with: 
        1. "matchScore" (a number between 0-100)
        2. "explanation" (one line feedback on why this score was given)

        IMPORTANT: Return ONLY valid JSON.
        
        Resume: ${resumeText}
        Job Description: ${jobDescription}`;

        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "mistralai/mixtral-8x7b-instruct",
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.3
            },
            {
                headers: {
                    "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const result = response.data.choices[0].message.content;

        try {
            return JSON.parse(result);
        } catch {
            console.error("Parse Error:", result);
            return { matchScore: 0, explanation: "Parsing error" };
        }

    } catch (error) {
        console.error("AI Match Error:", error.response?.data || error.message);
        return { matchScore: 0, explanation: "Error matching" };
    }
};

module.exports = { analyzeResume, matchJob };