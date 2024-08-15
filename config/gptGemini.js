const axios = require('axios');
const generateGeminiResponse = require('./gptGemini'); 

const generateGeminiResponse = async (prompt) => {
    try {
        const response = await axios.post(
            'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent',
            {
                contents: [
                    {
                        role: 'user',
                        parts: [{ text: prompt }],
                    },
                ],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': process.env.GOOGLE_GEMINI_API_KEY,
                },
            }
        );
        return response.data.candidates[0].content.parts[0].text; // Adjust based on actual response structure
    } catch (error) {
        console.error('Error generating Gemini response:', error.response?.data || error.message);
        throw new Error('Failed to generate Gemini response');
    }
};

module.exports = generateGeminiResponse;
