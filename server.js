const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
// const nodemailer = require('nodemailer');

require('dotenv').config();
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));



// // CSV Writer setup
const csvWriter = createCsvWriter({
    path: 'user_info.csv',
    append: true,
    header: [
        {id: 'fname', title: 'FISRT NAME'},
        {id: 'lname', title: 'LAST NAME'},
        {id: 'company', title: 'COMPANY'},
        {id: 'email', title: 'EMAIL'}
    ]
});
// app.get('/form', (req, res) => {
//     res.sendFile(__dirname + 'public/form.html');
// });

// app.post('/submit', (req, res) => {
//     const data = [{
//         fname: req.body.fname,
//         lname: req.body.lname,
//         company: req.body.company,
//         email: req.body.email
//     }];

//     csvWriter
//         .writeRecords(data)
//         .then(() => {
//             console.log('Data added to csv file');
//             res.redirect('/index.html');
//         })
//         .catch(err => {
//             console.error('Error writing to csv:', err);
//             res.status(500).send('Error writing data');
//         });
// });

// Variables to store API keys
let openaiApiKey = null;
let geminiApiKey = null;

// Endpoint to handle form submission and store API keys
app.post('/submit-api-key', (req, res) => {
    openaiApiKey = req.body.oapiKey;
    geminiApiKey = req.body.gapiKey;

    console.log('Received OpenAI API Key:', openaiApiKey);
    console.log('Received Google Gemini API Key:', geminiApiKey);

    // res.send(`API Keys received: OpenAI (${openaiApiKey}) and Google Gemini (${geminiApiKey})`);
});

// Endpoint for generating text using both APIs
app.post('/api/generate', async (req, res) => {
    const { prompt } = req.body;
    console.log('Received prompt:', prompt);

    try {
        // Call OpenAI API for GPT-3.5
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

        // Call Google Gemini API
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
        const gpt2Result = geminiResponse.data.candidates[0].content.parts[0].text;

        // Combine both results
        const combinedContent = `Here is the content from ChatGPT: ${gpt1Result}\nHere is the content from Gemini: ${gpt2Result}`;

        // Determine the winner
        const winnerModel = gpt1Result.length > gpt2Result.length ? 'gpt-3.5-turbo' : 'gemini-pro';

        // Generate optimized result using the winner model
        let optimizedResult;

        if (winnerModel === 'gpt-3.5-turbo') {
            const optimizedResponse = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-3.5-turbo',
                    messages: [{ role: 'user', content: `Use the contents provided to get the best result:\n\n${combinedContent}` }],
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
            optimizedResult = optimizedResponse.data.candidates[0].content.parts[0].text;
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

// app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
// });

const nodemailer = require('nodemailer');
// require('dotenv').config();

// Configure Nodemailer with Fastmail
const transporter = nodemailer.createTransport({
    host: 'smtp.fastmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.FASTMAIL_USER,
        pass: process.env.FASTMAIL_PASSWORD
    }
});

app.post('/submit', (req, res) => {
    const data = [{
        fname: req.body.fname,
        lname: req.body.lname,
        company: req.body.company,
        email: req.body.email
    }];

    csvWriter
        .writeRecords(data)
        .then(async () => {
            console.log('Data added to csv file');

            // Send confirmation email
            const mailOptions = {
                from: process.env.FASTMAIL_USER, // sender address
                to: `${req.body.email}, gpt2024@fastmail.com`, // list of receivers
                subject: 'Thank you for your time! ', // Subject line
                text: `Hello ${req.body.fname},\n\n I just wanted to take a moment to express my heartfelt thanks to you for trying out my GPT app. \nYour support and feedback are invaluable to me, and I'm thrilled to have you as part of this journey. \nYour involvement is not just appreciated; it's essential in helping me improve and evolve. Please write me back with your feedback on "gpt2024@fastmail.com"\nThank you once again for your time and insights!
                \n I have recieved the following information:\n Name: ${req.body.fname } ${req.body.lname}\nEmail: ${req.body.email}\nCompany: ${req.body.company}

Warm regards,
Abhishek Bhardwaj.`, // plain text body
            };

            try {
                await transporter.sendMail(mailOptions);
                console.log('Confirmation email sent');
                res.redirect('/index.html');
            } catch (error) {
                console.error('Failed to send confirmation email:', error);
                res.status(500).send('Error sending email');
            }
        })
        .catch(err => {
            console.error('Error writing to csv:', err);
            res.status(500).send('Error writing data');
        });
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
