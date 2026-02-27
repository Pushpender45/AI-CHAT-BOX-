import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Groq from 'groq-sdk';

// 1. CONFIGURATION
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

// 2. MIDDLEWARE
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? [/\.vercel\.app$/] // Allow any Vercel deployment
        : 'http://localhost:5173' // Default Vite dev port
}));
app.use(express.json({ limit: '10mb' }));

// 3. AI INITIALIZATION (Groq)
console.log('🔑 Groq API Key present:', !!process.env.GROQ_API_KEY);
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
console.log('🤖 Groq SDK Initialized');

// 4. ROUTES
app.get('/', (req, res) => {
    res.send('VisionChat AI Server is Running on Groq! 🚀');
});

/**
 * THE CORE AI ROUTE (Groq Version)
 */
app.post('/api/chat', async (req, res) => {
    console.log('📩 Incoming request to /api/chat (Groq)');
    console.log('📦 Request body:', JSON.stringify(req.body).substring(0, 100) + '...');
    try {
        const { text, image } = req.body;

        const messages = [
            {
                role: "user",
                content: [
                    { type: "text", text: text || "Analyze this image." },
                ],
            },
        ];

        if (image) {
            console.log('🖼️ Image detected in request');
            messages[0].content.push({
                type: "image_url",
                image_url: {
                    url: image,
                },
            });
        }

        const chatCompletion = await groq.chat.completions.create({
            "messages": messages,
            "model": "meta-llama/llama-4-scout-17b-16e-instruct",
            "temperature": 1,
            "max_completion_tokens": 1024,
            "top_p": 1,
            "stream": false,
            "stop": null
        });

        const aiText = chatCompletion.choices[0].message.content;
        console.log('✅ AI responded successfully');
        res.json({ text: aiText });

    } catch (error) {
        console.error('--- GROQ ERROR START ---');
        console.error('Error Name:', error.name);
        console.error('Status:', error.status);
        console.error('Message:', error.message);
        console.error('Stack:', error.stack);
        console.error('--- GROQ ERROR END ---');

        let customMessage = 'Groq AI failed to respond. Check if your API key is valid!';

        if (error.status === 429) {
            customMessage = 'Groq is very busy right now (Rate Limit). Please wait a few seconds and try again.';
        } else if (error.status === 400) {
            customMessage = `Bad Request: ${error.message}`;
        }

        res.status(error.status || 500).json({ error: customMessage });
    }
});

// 5. START SERVER
app.listen(PORT, () => {
    console.log(`✅ Server is purring on http://localhost:${PORT} (Using Groq)`);
});
