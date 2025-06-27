# 🤖 Jailbreak AI - Pure HTML/JS/CSS Version

A futuristic AI voice assistant interface built with pure HTML, JavaScript, and CSS - no frameworks required!

## ✨ Features

- 🎤 **Voice Recognition**: Real-time speech-to-text
- 🔊 **Text-to-Speech**: Natural voice synthesis  
- 📷 **Camera Integration**: Live video with image analysis
- 🌍 **Real-time Data**: Weather, news, world times
- 🧠 **AI Memory**: Persistent conversation history
- 🎨 **Futuristic UI**: Matrix animations, glitch effects, particle text
- 📱 **Responsive Design**: Works on desktop and mobile

## 🚀 Quick Start

### 1. Clone or Download
\`\`\`bash
git clone <your-repo-url>
cd jailbreak-ai-html
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Run the Application
\`\`\`bash
npm start
\`\`\`

### 4. Open in Browser
Navigate to `http://localhost:5000`

## 🎮 Usage

### Voice Commands
- **"turn on camera"** / **"turn off camera"** - Control camera
- Ask about **weather**, **time**, or **news**
- Normal conversation with Jailbreak AI

### Manual Controls
- Type messages in the input field
- Click microphone button to toggle voice recognition
- Click camera button to manually control video feed

## 🎨 Visual Effects

### Matrix Rain
- Animated falling "JAILBREAK" characters
- Dynamic color changes (cyan/red)
- Responsive to screen size

### Particle Text
- "JAILBREAK" title made of animated particles
- **Sound Wave Effect**: When listening (particles wave)
- **Glitch Effect**: When AI is speaking (particles scatter)

### Glitch Overlay
- Multi-colored glitch bars during AI responses
- Screen distortion effects
- Synchronized with AI speech

## 📁 File Structure

\`\`\`
jailbreak-ai-html/
├── index.html          # Main HTML file
├── server.js           # Backend server
├── package.json        # Dependencies
├── css/
│   └── styles.css      # All styling
├── js/
│   ├── main.js         # Main application logic
│   └── effects.js      # Visual effects (Matrix, Glitch, Particles)
└── voice/              # Generated voice files (auto-created)
\`\`\`

## 🔧 Customization

### Personality
Edit the AI prompt in `server.js` around line 200:
\`\`\`javascript
const prompt = `You are Jailbreak, a friendly and engaging friend...`
\`\`\`

### Visual Effects
Modify parameters in `js/effects.js`:
- Matrix rain speed: Change `setTimeout` value in `animate()`
- Particle behavior: Adjust physics in `ParticleText.animate()`
- Glitch intensity: Modify `createGlitchBars()` parameters

### Colors & Styling
Update `css/styles.css`:
- Primary colors: `#00ffff` (cyan), `#ff0000` (red)
- Background effects: `.background-circles`
- Card styling: `.card` classes

## 🌐 Deployment

### Replit
1. Create new Repl, select "Import from GitHub"
2. Paste your repository URL
3. Click "Run" - that's it!

### Render/Railway
1. Connect GitHub repository
2. Build command: `npm install`
3. Start command: `npm start`
4. Deploy

### Local Development
\`\`\`bash
npm start
# Server runs on http://localhost:5000
\`\`\`

## 🔊 Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Voice Recognition | ✅ | ⚠️ | ⚠️ | ✅ |
| Camera Access | ✅ | ✅ | ✅ | ✅ |
| Audio Playback | ✅ | ✅ | ✅ | ✅ |
| Visual Effects | ✅ | ✅ | ✅ | ✅ |

⚠️ = Limited support for `webkitSpeechRecognition`

## 🛠️ Troubleshooting

### Voice Recognition Not Working
- Ensure microphone permissions are granted
- Try Chrome/Edge for best compatibility
- Check browser console for errors

### Camera Not Working  
- Grant camera permissions when prompted
- Ensure camera isn't being used by another app
- Try refreshing the page

### No Audio Response
- Check speaker/headphone volume
- Verify internet connection for TTS service
- Look for audio file generation errors in console

### Visual Effects Not Loading
- Ensure JavaScript is enabled
- Check browser console for errors
- Try hard refresh (Ctrl+F5)

## 🔑 API Keys (Pre-configured)

The following services are already configured:
- ✅ Google Gemini AI (Text generation)
- ✅ Deepgram (Text-to-speech)  
- ✅ OpenWeatherMap (Weather data)
- ✅ NewsAPI (News headlines)

## 📊 System Requirements

- **Node.js**: 16.0.0 or higher
- **RAM**: 512MB minimum
- **Storage**: 100MB for dependencies
- **Network**: Internet connection required for AI services

## 🎯 Performance Tips

### For Better Performance:
- Use Chrome or Edge for optimal voice recognition
- Close other tabs using microphone/camera
- Ensure stable internet connection
- Clear browser cache if experiencing issues

### For Mobile:
- Use landscape orientation for better layout
- Tap screen to wake device before voice commands
- Ensure microphone permissions are granted

## 🔄 Updates & Maintenance

### Auto-cleanup:
- Voice files are automatically deleted after 1 hour
- Chat memory is limited to last 20 messages per user
- System stats update every 2 seconds

### Manual cleanup:
\`\`\`bash
# Clear all voice files
rm -rf voice/*

# Reset chat memory
rm chatMemory.json
\`\`\`

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Verify all permissions are granted
3. Try different browser
4. Check network connection
5. Restart the server

## 🎉 Enjoy Your AI Assistant!

Your Jailbreak AI is now ready to chat, listen, and respond with a futuristic interface that works entirely in the browser!
