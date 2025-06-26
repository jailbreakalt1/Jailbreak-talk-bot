# JAILBREAK Command Center

A futuristic cyberpunk-style dashboard with integrated AI assistant capabilities.

## Features

- **Cyberpunk UI**: Dark theme with neon accents and sci-fi styling
- **AI Chat Integration**: Powered by Google Gemini API
- **Voice Synthesis**: Text-to-speech using Deepgram API
- **Real-time Data**: System stats, weather, and world time
- **Interactive Elements**: Animated HUD, particle effects, and responsive design
- **Memory System**: Persistent conversation history

## Setup

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Configure API keys in `server.js`:
   - GEMINI_API_KEY (Google Gemini)
   - DEEPGRAM_API_KEY (Deepgram TTS)
   - WEATHER_API_KEY (OpenWeather - optional)
   - NEWS_API_KEY (NewsAPI - optional)

3. Start the server:
\`\`\`bash
npm start
\`\`\`

4. Open your browser to `http://localhost:5000`

## Usage

- Click "COMPUTER" button to open the AI chat interface
- Type messages to interact with JAILBREAK AI
- System stats and weather update automatically
- Voice responses play automatically when available

## Deployment

Ready for deployment on:
- Replit
- Render
- Heroku
- Any Node.js hosting platform

## API Endpoints

- `POST /chat` - Send messages to AI
- `GET /api/system-stats` - Get system statistics
- `GET /api/weather` - Get weather information
- `GET /health` - Health check

## File Structure

\`\`\`
├── server.js           # Main server file
├── public/
│   ├── index.html     # Main dashboard interface
│   ├── styles.css     # Cyberpunk styling
│   ├── script.js      # Frontend JavaScript
│   └── voice/         # Generated voice files
├── package.json       # Dependencies
└── README.md         # This file
