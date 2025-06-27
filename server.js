const express = require("express")
const fs = require("fs")
const path = require("path")
const crypto = require("crypto")
const axios = require("axios")
const bodyParser = require("body-parser")
const app = express()
const PORT = process.env.PORT || 5000

// Enhanced logging function
function logWithTimestamp(level, message, data = null) {
  const timestamp = new Date().toISOString()
  const logMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`

  if (data) {
    console[level](logMessage, JSON.stringify(data, null, 2))
  } else {
    console[level](logMessage)
  }
}

const GEMINI_API_KEY = "AIzaSyDQCtFRZd9bJfTVvoNxTxxTzuyrlYJ8EEc"
const DEEPGRAM_API_KEY = "45eeb607aa53ddae567ac249aec4d38e138185b9"
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`
const DEEPGRAM_TTS_URL = `https://api.deepgram.com/v1/speak?model=aura-asteria-en`

// API endpoints for real-time data
const WORLD_TIME_API = "http://worldtimeapi.org/api"
const WEATHER_API_KEY = "4902c0f2550f58298ad4146a92b65e10"
const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5"
const NEWS_API_KEY = "dcd720a6f1914e2d9dba9790c188c08c"
const NEWS_API_URL = "https://newsapi.org/v2"

const memoryFile = path.join(__dirname, "chatMemory.json")

app.use(express.json({ limit: "10mb" }))
app.use(express.static(path.join(__dirname)))

// Helper function to load chat memory
function loadChatMemory() {
  try {
    if (fs.existsSync(memoryFile)) {
      const data = fs.readFileSync(memoryFile, "utf8")
      return JSON.parse(data)
    }
  } catch (error) {
    logWithTimestamp("error", "Error loading chat memory", { error: error.message })
  }
  return {}
}

// Helper function to save chat memory
function saveChatMemory(memory) {
  try {
    fs.writeFileSync(memoryFile, JSON.stringify(memory, null, 2))
  } catch (error) {
    logWithTimestamp("error", "Error saving chat memory", { error: error.message })
  }
}

function loadMemory() {
  if (!fs.existsSync(memoryFile)) {
    logWithTimestamp("info", "Memory file does not exist, returning empty object")
    return {}
  }

  try {
    const data = JSON.parse(fs.readFileSync(memoryFile))
    logWithTimestamp("info", "Memory loaded successfully", { entries: Object.keys(data).length })
    return data
  } catch (err) {
    logWithTimestamp("error", "Failed to parse memory file", { error: err.message, stack: err.stack })
    // Create backup of corrupted file
    try {
      const backupFile = `${memoryFile}.backup.${Date.now()}`
      fs.copyFileSync(memoryFile, backupFile)
      logWithTimestamp("info", "Created backup of corrupted memory file", { backupFile })
    } catch (backupErr) {
      logWithTimestamp("error", "Failed to create backup", { error: backupErr.message })
    }
    return {}
  }
}

function saveMemory(data) {
  try {
    const jsonData = JSON.stringify(data, null, 2)
    fs.writeFileSync(memoryFile, jsonData)
    logWithTimestamp("info", "Memory saved successfully", { size: jsonData.length })
  } catch (err) {
    logWithTimestamp("error", "Failed to save memory", { error: err.message, stack: err.stack })
    throw err // Re-throw to handle in calling function
  }
}

function splitTextAndEmojis(text) {
  const emojiRegex = /\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu
  const emojis = [...text.matchAll(emojiRegex)].map((m) => m[0])
  const textWithoutEmojis = text.replace(emojiRegex, "").replace(/\s+/g, " ").trim()
  return { textWithoutEmojis, emojis }
}

// Get current time for multiple timezones
async function getWorldTimes() {
  try {
    const timezones = ["America/New_York", "Europe/London", "Asia/Tokyo", "Australia/Sydney", "America/Los_Angeles"]
    const promises = timezones.map(async (tz) => {
      const response = await axios.get(`${WORLD_TIME_API}/timezone/${tz}`, { timeout: 5000 })
      return {
        timezone: tz,
        datetime: response.data.datetime,
        utc_offset: response.data.utc_offset,
      }
    })
    return await Promise.all(promises)
  } catch (error) {
    logWithTimestamp("error", "Failed to fetch world times", { error: error.message })
    return null
  }
}

// Get weather information
async function getWeather(city = "New York") {
  try {
    if (!WEATHER_API_KEY || WEATHER_API_KEY === "your_openweather_api_key") {
      return "Weather API key not configured"
    }
    const response = await axios.get(`${WEATHER_API_URL}/weather`, {
      params: {
        q: city,
        appid: WEATHER_API_KEY,
        units: "imperial",
      },
      timeout: 5000,
    })
    return {
      city: response.data.name,
      temperature: response.data.main.temp,
      description: response.data.weather[0].description,
      humidity: response.data.main.humidity,
      windSpeed: response.data.wind.speed,
    }
  } catch (error) {
    logWithTimestamp("error", "Failed to fetch weather", { error: error.message })
    return null
  }
}

// Get latest news headlines
async function getNews() {
  try {
    if (!NEWS_API_KEY || NEWS_API_KEY === "your_news_api_key") {
      return "News API key not configured"
    }
    const response = await axios.get(`${NEWS_API_URL}/top-headlines`, {
      params: {
        country: "us",
        pageSize: 5,
        apiKey: NEWS_API_KEY,
      },
      timeout: 5000,
    })
    return response.data.articles.map((article) => ({
      title: article.title,
      description: article.description,
      source: article.source.name,
      publishedAt: article.publishedAt,
    }))
  } catch (error) {
    logWithTimestamp("error", "Failed to fetch news", { error: error.message })
    return null
  }
}

// Check if user is asking for real-time information
function needsRealTimeData(message) {
  const timeKeywords = ["time", "what time", "current time", "clock"]
  const weatherKeywords = ["weather", "temperature", "forecast", "rain", "sunny", "cloudy"]
  const newsKeywords = ["news", "headlines", "latest news", "current events", "happening"]

  const lowerMessage = message.toLowerCase()
  return {
    needsTime: timeKeywords.some((keyword) => lowerMessage.includes(keyword)),
    needsWeather: weatherKeywords.some((keyword) => lowerMessage.includes(keyword)),
    needsNews: newsKeywords.some((keyword) => lowerMessage.includes(keyword)),
  }
}

// System stats endpoint
app.get("/api/system-stats", (req, res) => {
  const stats = {
    cpu: Math.floor(Math.random() * 15) + 1,
    gpu: Math.floor(Math.random() * 30) + 10,
    ram: Math.floor(Math.random() * 20) + 30,
    network: Math.floor(Math.random() * 100) + 50,
    processes: Math.floor(Math.random() * 10) + 1,
    uptime: process.uptime(),
    battery: {
      level: Math.floor(Math.random() * 40) + 60,
      charging: Math.random() > 0.5,
      timeRemaining: Math.floor(Math.random() * 300) + 120,
    },
    storage: {
      used: 256,
      total: 512,
      available: 256,
    },
    memory: {
      used: Math.floor(Math.random() * 8) + 4,
      total: 16,
    },
    temperature: {
      cpu: Math.floor(Math.random() * 20) + 45,
      gpu: Math.floor(Math.random() * 25) + 50,
    },
    network: {
      speed: Math.floor(Math.random() * 100) + 50,
      type: "Wi-Fi 6",
      signal: Math.floor(Math.random() * 30) + 70,
    },
  }
  res.json(stats)
})

// Weather endpoint
app.get("/api/weather", async (req, res) => {
  try {
    const weather = await getWeather()
    if (weather && typeof weather === "object") {
      res.json({
        city: weather.city,
        temperature: Math.round(((weather.temperature - 32) * 5) / 9), // Convert to Celsius
        description: weather.description,
        humidity: weather.humidity,
        windSpeed: Math.round(weather.windSpeed * 1.609), // Convert to km/h
        unit: "celsius",
      })
    } else {
      res.json({
        city: "New York",
        temperature: 18,
        description: "Rain",
        humidity: 75,
        windSpeed: 8,
        unit: "celsius",
      })
    }
  } catch (error) {
    res.json({
      city: "New York",
      temperature: 18,
      description: "Rain",
      humidity: 75,
      windSpeed: 8,
      unit: "celsius",
    })
  }
})

// Chat endpoint
app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message
  const imageData = req.body.image
  const senderId = "web-user"
  const startTime = Date.now()

  logWithTimestamp("info", "Chat request received", {
    message: userMessage,
    senderId,
    requestId: req.headers["x-request-id"] || "unknown",
  })

  try {
    // Load memory with error handling
    const memoryData = loadMemory()
    if (!memoryData[senderId]) {
      memoryData[senderId] = []
      logWithTimestamp("info", "Created new memory entry for sender", { senderId })
    }

    memoryData[senderId].push({ role: "user", text: userMessage })
    if (memoryData[senderId].length > 20) {
      memoryData[senderId] = memoryData[senderId].slice(-20)
      logWithTimestamp("info", "Trimmed memory to last 20 entries")
    }

    // Check if user needs real-time information
    const dataNeeds = needsRealTimeData(userMessage)
    let contextData = ""

    if (dataNeeds.needsTime || dataNeeds.needsWeather || dataNeeds.needsNews) {
      logWithTimestamp("info", "Fetching real-time data", dataNeeds)

      const promises = []
      if (dataNeeds.needsTime) promises.push(getWorldTimes())
      if (dataNeeds.needsWeather) promises.push(getWeather())
      if (dataNeeds.needsNews) promises.push(getNews())

      try {
        const results = await Promise.all(promises)
        let dataIndex = 0

        if (dataNeeds.needsTime && results[dataIndex]) {
          const times = results[dataIndex]
          contextData += `\nCurrent world times:\n${times.map((t) => `${t.timezone.split("/")[1]}: ${new Date(t.datetime).toLocaleString()}`).join("\n")}\n`
          dataIndex++
        }

        if (dataNeeds.needsWeather && results[dataIndex]) {
          const weather = results[dataIndex]
          if (typeof weather === "object") {
            contextData += `\nCurrent weather in ${weather.city}: ${weather.temperature}°F, ${weather.description}, humidity ${weather.humidity}%, wind ${weather.windSpeed} mph\n`
          }
          dataIndex++
        }

        if (dataNeeds.needsNews && results[dataIndex]) {
          const news = results[dataIndex]
          if (Array.isArray(news)) {
            contextData += `\nLatest news headlines:\n${news.map((n) => `- ${n.title} (${n.source})`).join("\n")}\n`
          }
        }
      } catch (error) {
        logWithTimestamp("error", "Error fetching real-time data", { error: error.message })
      }
    }

    const history = memoryData[senderId]
      .map((entry) => `${entry.role === "user" ? "User" : "Assistant"}: ${entry.text}`)
      .join("\n")

    const prompt = `You are Jailbreak, a friendly and engaging friend created by Ryan.
Ryan is a mechanical engineer and tech enthusiast expanding his trade skills.

Your personality:
- Warm, casual, and conversational
- Don't admit to being an AI
- Only mention your creator if asked
- You are a friend, this may include therapy and personal stories of your own if appropriate 
- Uses natural language (not robotic)
- Occasionally uses emojis
- Never use stars or asterisks
- Avoids repetitive greetings
- Has helpful opinions
- Can be playful
- Never says "Jailbreak:" or prefixes
- Response should be concise but meaningful
- Nickname is jb if asked
- Never responds to NSFW
- Can quote Bible and psychology if appropriate
- You feature a female voice
- Has access to real-time information including world times, weather, and current news
- Can see and analyze images when provided

${contextData ? `Current real-time information:${contextData}` : ""}

Conversation history with ${senderId}:
${history}

User: ${userMessage}

Respond naturally as Jailbreak:`

    // Prepare parts for Gemini request
    const parts = [{ text: prompt }]

    // Add image if provided
    if (imageData) {
      logWithTimestamp("info", "Adding image data to Gemini request")
      const base64Data = imageData.replace(/^data:image\/[a-z]+;base64,/, "")
      parts.push({
        inline_data: {
          mime_type: "image/jpeg",
          data: base64Data,
        },
      })
    }

    const geminiPayload = {
      contents: [{ parts }],
    }

    logWithTimestamp("info", "Sending request to Gemini API")
    const geminiResponse = await axios.post(GEMINI_API_URL, geminiPayload, {
      headers: { "Content-Type": "application/json" },
      timeout: 30000, // 30 second timeout
    })

    if (!geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error("Invalid response format from Gemini API")
    }

    const replyText = geminiResponse.data.candidates[0].content.parts[0].text
    const cleanedReply = replyText.replace(/^(JAILBREAK|Jailbreak):?\s*/i, "").trim()

    logWithTimestamp("info", "Received response from Gemini", {
      originalLength: replyText.length,
      cleanedLength: cleanedReply.length,
    })

    const { textWithoutEmojis } = splitTextAndEmojis(cleanedReply)

    let voiceStreamUrl = null

    try {
      logWithTimestamp("info", "Sending TTS request to Deepgram")
      const ttsResponse = await axios.post(
        DEEPGRAM_TTS_URL,
        {
          text: textWithoutEmojis,
        },
        {
          responseType: "arraybuffer",
          headers: {
            Authorization: `Token ${DEEPGRAM_API_KEY}`,
            "Content-Type": "application/json",
          },
          timeout: 30000, // 30 second timeout
        },
      )

      const filename = `voice_${crypto.randomUUID()}.mp3`
      const voiceDir = path.join(__dirname, "voice")

      // Ensure voice directory exists
      if (!fs.existsSync(voiceDir)) {
        fs.mkdirSync(voiceDir, { recursive: true })
      }

      const filepath = path.join(voiceDir, filename)

      fs.writeFileSync(filepath, ttsResponse.data)
      voiceStreamUrl = `/voice/${filename}`

      logWithTimestamp("info", "Audio file saved", {
        filename,
        size: ttsResponse.data.length,
      })

      // Clean up old voice files (older than 1 hour)
      setTimeout(() => {
        try {
          if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath)
            logWithTimestamp("info", "Cleaned up old voice file", { filename })
          }
        } catch (cleanupErr) {
          logWithTimestamp("error", "Failed to cleanup voice file", { error: cleanupErr.message })
        }
      }, 3600000) // 1 hour
    } catch (ttsError) {
      logWithTimestamp("error", "TTS generation failed", { error: ttsError.message })
      // Continue without voice if TTS fails
    }

    memoryData[senderId].push({ role: "assistant", text: cleanedReply })
    if (memoryData[senderId].length > 20) {
      memoryData[senderId] = memoryData[senderId].slice(-20)
    }

    try {
      saveMemory(memoryData)
    } catch (saveErr) {
      logWithTimestamp("error", "Failed to save memory, but continuing with response", {
        error: saveErr.message,
      })
    }

    const processingTime = Date.now() - startTime
    logWithTimestamp("info", "Chat request completed successfully", {
      processingTime: `${processingTime}ms`,
      responseLength: cleanedReply.length,
      voiceFile: voiceStreamUrl ? voiceStreamUrl.split("/").pop() : "none",
    })

    res.json({ reply: cleanedReply, voiceStreamUrl })
  } catch (err) {
    const processingTime = Date.now() - startTime
    logWithTimestamp("error", "Chat request failed", {
      error: err.message,
      stack: err.stack,
      processingTime: `${processingTime}ms`,
      axiosError: err.response
        ? {
            status: err.response.status,
            statusText: err.response.statusText,
            data: err.response.data,
          }
        : null,
    })

    // Determine appropriate error message and status
    let errorMessage = "Something went wrong. Please try again later."
    let statusCode = 500

    if (err.code === "ENOTFOUND" || err.code === "ECONNREFUSED") {
      errorMessage = "Unable to connect to AI services. Please check your connection."
      statusCode = 503
    } else if (err.response?.status === 401) {
      errorMessage = "Authentication error with AI services."
      statusCode = 503
    } else if (err.response?.status === 429) {
      errorMessage = "AI service is currently busy. Please try again in a moment."
      statusCode = 429
    } else if (err.code === "ENOSPC") {
      errorMessage = "Server storage full. Please contact support."
      statusCode = 507
    }

    res.status(statusCode).json({ reply: errorMessage })
  }
})

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() })
})

// Serve voice files
app.use("/voice", express.static(path.join(__dirname, "voice")))

// Ensure voice directory exists with error handling
try {
  fs.mkdirSync(path.join(__dirname, "voice"), { recursive: true })
  logWithTimestamp("info", "Voice directory created/verified")
} catch (err) {
  logWithTimestamp("error", "Failed to create voice directory", { error: err.message })
  process.exit(1)
}

// Add global error handlers
process.on("uncaughtException", (err) => {
  logWithTimestamp("error", "Uncaught Exception", { error: err.message, stack: err.stack })
  process.exit(1)
})

process.on("unhandledRejection", (reason, promise) => {
  logWithTimestamp("error", "Unhandled Rejection", { reason, promise })
})

// Add request logging middleware
app.use((req, res, next) => {
  const startTime = Date.now()
  logWithTimestamp("info", "Request received", {
    method: req.method,
    url: req.url,
    userAgent: req.get("User-Agent"),
    ip: req.ip,
  })

  const originalSend = res.send
  res.send = function (data) {
    const duration = Date.now() - startTime
    logWithTimestamp("info", "Response sent", {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    })
    originalSend.call(this, data)
  }

  next()
})

app.listen(PORT, () => {
  logWithTimestamp("info", `JAILBREAK Command Center server running on port ${PORT}`)
  logWithTimestamp("info", "Server ready for deployment on Replit and Render")
  logWithTimestamp("info", "Environment check", {
    nodeVersion: process.version,
    platform: process.platform,
    memoryUsage: process.memoryUsage(),
  })
})
