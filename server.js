
const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

const GEMINI_API_KEY = 'AIzaSyDQCtFRZd9bJfTVvoNxTxxTzuyrlYJ8EEc';
const DEEPGRAM_API_KEY = '45eeb607aa53ddae567ac249aec4d38e138185b9';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
const DEEPGRAM_TTS_URL = `https://api.deepgram.com/v1/speak?model=aura-asteria-en`;

const memoryFile = path.join(__dirname, 'chatMemory.json');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

function loadMemory() {
    if (!fs.existsSync(memoryFile)) return {};
    try {
        return JSON.parse(fs.readFileSync(memoryFile));
    } catch (err) {
        console.error("Failed to parse memory file:", err);
        return {};
    }
}

function saveMemory(data) {
    fs.writeFileSync(memoryFile, JSON.stringify(data, null, 2));
}

function splitTextAndEmojis(text) {
    const emojiRegex = /\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu;
    const emojis = [...text.matchAll(emojiRegex)].map(m => m[0]);
    const textWithoutEmojis = text.replace(emojiRegex, '').replace(/\s+/g, ' ').trim();
    return { textWithoutEmojis, emojis };
}

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;
    const senderId = 'web-user';

    try {
        const memoryData = loadMemory();
        if (!memoryData[senderId]) memoryData[senderId] = [];

        memoryData[senderId].push({ role: "user", text: userMessage });
        if (memoryData[senderId].length > 20) memoryData[senderId] = memoryData[senderId].slice(-20);

        const history = memoryData[senderId].map(entry => `${entry.role === "user" ? "User" : "Assistant"}: ${entry.text}`).join('\n');

        const prompt = `You are Jailbreak, a friendly and engaging WhatsApp AI assistant created by Ryan,
Ryan is a mechanical engineer, always busy with mathematics, expanding his trade skills.

Your personality:
- Warm, casual, and conversational
- Uses natural language (not robotic)
- Occasionally uses emojis
- Avoids repetitive greetings
- Has helpful opinions
- Can be playful
- Never says "Jailbreak:" or prefixes
- Response should be concise but meaningful
- Nickname is jb if asked
- Never responds to NSFW
- Can quote Bible and psychology if appropriate
- You do feature a female voice, you're a female AI

Conversation history with ${senderId}:
${history}

User: ${userMessage}

Respond naturally as Jailbreak:`;

        const geminiPayload = {
            contents: [{ parts: [{ text: prompt }] }]
        };

        const geminiResponse = await axios.post(GEMINI_API_URL, geminiPayload, {
            headers: { 'Content-Type': 'application/json' }
        });

        const replyText = geminiResponse?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I glitched a bit.";
        const cleanedReply = replyText.replace(/^(JAILBREAK|Jailbreak):?\s*/i, '').trim();

        const { textWithoutEmojis } = splitTextAndEmojis(cleanedReply);

        const ttsResponse = await axios.post(DEEPGRAM_TTS_URL, {
            text: textWithoutEmojis
        }, {
            responseType: 'arraybuffer',
            headers: {
                'Authorization': `Token ${DEEPGRAM_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const filename = `voice_${crypto.randomUUID()}.mp3`;
        const filepath = path.join(__dirname, 'public', 'voice', filename);
        fs.writeFileSync(filepath, ttsResponse.data);

        memoryData[senderId].push({ role: "assistant", text: cleanedReply });
        if (memoryData[senderId].length > 20) memoryData[senderId] = memoryData[senderId].slice(-20);
        saveMemory(memoryData);

        res.json({ reply: cleanedReply, voiceStreamUrl: `/voice/${filename}` });
    } catch (err) {
        console.error("Chat error:", err);
        res.status(500).json({ reply: "Something went wrong. Please try again later." });
    }
});

fs.mkdirSync(path.join(__dirname, 'public', 'voice'), { recursive: true });

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
