const axios = require('axios');

const generateOpenAIResponse = async (prompt, maxTokens = 100) => {
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: maxTokens,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Error generating OpenAI response:', error.response?.data || error.message);
        throw new Error('Failed to generate OpenAI response');
    }
};

module.exports = generateOpenAIResponse;
