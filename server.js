const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

//RECIEVE API KEYS
// In-memory storage for API keys (temporary solution)
let openaiApiKey = null;
let geminiApiKey = null;
app.post('/api/save-keys', (req, res) => {
    const { gemini, openai } = req.body;
    // Store API keys securely
    openaiApiKey = openai; 
    geminiApiKey = gemini;

    console.log('Received and stored API keys.'); // For debugging
    // Log the received API keys (for debugging purposes)
    console.log('Received Google Gemini API Key:', geminiApiKey);
    console.log('Received OpenAI API Key:', openaiApiKey);

    // Here, you can use the API keys in your server-side code
    // For example, you might save them in a database, or use them immediately in a request

    // Respond back to the client
    res.json({ message: 'API keys received successfully' });
});

// Endpoint for generating text using both APIs
app.post('/api/generate', async (req, res) => {
    const { prompt } = req.body;
    console.log('Received prompt:', prompt);

    try {
        // Call OpenAI API for GPT-1
        const openAiResponse = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 100,
            },
            {
                headers: {
                    Authorization: `Bearer ${openaiApiKey}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        // Call Google Gemini API for GPT-2
        const geminiResponse = await axios.post(
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
                    'x-goog-api-key': geminiApiKey,
                },
            }
        );

        // Extract responses
        const gpt1Result = openAiResponse.data.choices[0].message.content;
        const gpt2Result = geminiResponse.data.candidates[0].content.parts[0].text; // Adjust based on actual response structure

        // Combine both results
        const combinedContent = `${gpt1Result}\n${gpt2Result}`;

        // Determine the winner
        const winnerModel = gpt1Result.length > gpt2Result.length ? 'gpt-3.5-turbo' : 'gemini-pro';

        // Generate optimized result using the winner model
        let optimizedResult;

        if (winnerModel === 'gpt-3.5-turbo') {
            const optimizedResponse = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-3.5-turbo',
                    messages: [{ role: 'user', content: `Optimize the following content:\n\n${combinedContent}` }],
                    max_tokens: 150,
                },
                {
                    headers: {
                        Authorization: `Bearer ${openaiApiKey}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            optimizedResult = optimizedResponse.data.choices[0].message.content;
        } else {
            const optimizedResponse = await axios.post(
                'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent',
                {
                    contents: [
                        {
                            role: 'user',
                            parts: [{ text: `Optimize the following content:\n\n${combinedContent}` }],
                        },
                    ],
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-goog-api-key': geminiApiKey,
                    },
                }
            );
            optimizedResult = optimizedResponse.data.candidates[0].content.parts[0].text; // Adjust based on actual response structure
        }

        // Send back results
        res.json({
            gpt1Result,
            gpt2Result,
            optimizedResult,
        });
    } catch (error) {
        console.error('Error generating text:', error.response?.data || error.message);
        res.status(500).send('Error generating text');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});




// const express = require('express');
// const bodyParser = require('body-parser');
// const axios = require('axios');
// const fs = require('fs');
// const readline = require('readline');
// require('dotenv').config();

// const app = express();
// const port = process.env.PORT || 3000;
// const cors = require('cors');

// app.use(cors());

// app.use(bodyParser.json());
// app.use(express.static('public'));

// // Function to prompt for API keys and save to .env
// async function promptForApiKeys() {
//     const rl = readline.createInterface({
//         input: process.stdin,
//         output: process.stdout,
//     });

//     const question = (query) => new Promise((resolve) => rl.question(query, resolve));

//     if (!process.env.OPENAI_API_KEY) {
//         const openAiApiKey = await question('Enter your OpenAI API Key: ');
//         fs.appendFileSync('/Users/abhbhard2/Desktop/gpt-app/gpt-integration/.env', `OPENAI_API_KEY=${openAiApiKey}\n`);
//     }

//     if (!process.env.GOOGLE_GEMINI_API_KEY) {
//         const googleGeminiApiKey = await question('Enter your Google Gemini API Key: ');
//         fs.appendFileSync('/Users/abhbhard2/Desktop/gpt-app/gpt-integration/.env', `GOOGLE_GEMINI_API_KEY=${googleGeminiApiKey}\n`);
//     }

//     rl.close();
//     console.log('API keys saved to .env file.');
// }

// (async () => {
//     await promptForApiKeys();
//     require('dotenv').config(); // Reload .env after updating

//     app.post('/api/generate', async (req, res) => {
//         const { prompt } = req.body;
//         console.log('Received prompt:', prompt);

//         try {
//             // Call OpenAI API for GPT-1
//             const openAiResponse = await axios.post(
//                 'https://api.openai.com/v1/chat/completions',
//                 {
//                     model: 'gpt-3.5-turbo',
//                     messages: [{ role: 'user', content: prompt }],
//                     max_tokens: 100,
//                 },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//                         'Content-Type': 'application/json',
//                     },
//                 }
//             );

//             // Call Google Gemini API for GPT-2
//             const geminiResponse = await axios.post(
//                 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent',
//                 {
//                     contents: [
//                         {
//                             role: 'user',
//                             parts: [{ text: prompt }],
//                         },
//                     ],
//                 },
//                 {
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'x-goog-api-key': process.env.GOOGLE_GEMINI_API_KEY,
//                     },
//                 }
//             );

//             // Extract responses
//             const gpt1Result = openAiResponse.data.choices[0].message.content;
//             const gpt2Result = geminiResponse.data.candidates[0].content.parts[0].text; // Adjust based on actual response structure

//             // Combine both results
//             const combinedContent = `${gpt1Result}\n${gpt2Result}`;

//             // Determine the winner
//             const winnerModel = gpt1Result.length > gpt2Result.length ? 'gpt-3.5-turbo' : 'gemini-pro';

//             // Generate optimized result using the winner model
//             let optimizedResult;

//             if (winnerModel === 'gpt-3.5-turbo') {
//                 const optimizedResponse = await axios.post(
//                     'https://api.openai.com/v1/chat/completions',
//                     {
//                         model: 'gpt-3.5-turbo',
//                         messages: [{ role: 'user', content: `Optimize the following content:\n\n${combinedContent}` }],
//                         max_tokens: 150,
//                     },
//                     {
//                         headers: {
//                             Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//                             'Content-Type': 'application/json',
//                         },
//                     }
//                 );
//                 optimizedResult = optimizedResponse.data.choices[0].message.content;
//             } else {
//                 const optimizedResponse = await axios.post(
//                     'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent',
//                     {
//                         contents: [
//                             {
//                                 role: 'user',
//                                 parts: [{ text: `Optimize the following content:\n\n${combinedContent}` }],
//                             },
//                         ],
//                     },
//                     {
//                         headers: {
//                             'Content-Type': 'application/json',
//                             'x-goog-api-key': ge,
//                         },
//                     }
//                 );
//                 optimizedResult = optimizedResponse.data.candidates[0].content.parts[0].text; // Adjust based on actual response structure
//             }

//             // Send back results
//             res.json({
//                 gpt1Result,
//                 gpt2Result,
//                 optimizedResult,
//             });
//         } catch (error) {
//             console.error('Error generating text:', error.response?.data || error.message);
//             res.status(500).send('Error generating text');
//         }
//     });

//     app.listen(port, () => {
//         console.log(`Server running on port ${port}`);
//     });
// })();
