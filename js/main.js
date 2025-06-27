// Main Application Logic
class JailbreakAI {
  constructor() {
    this.isListening = false
    this.isSpeaking = false
    this.isTyping = false
    this.isLoading = false
    this.isCameraOn = false
    this.cameraStream = null
    this.recognition = null
    this.recognitionActive = false
    this.typingTimeout = null

    this.systemStats = {
      cpu: 4,
      gpu: 17,
      ram: 39,
      network: 55,
      processes: 3,
      battery: { level: 85, charging: true },
    }

    this.weather = {
      city: "Unknown",
      temperature: 18,
      description: "Rain",
    }

    this.initializeElements()
    this.initializeSpeechRecognition()
    this.initializeEventListeners()
    this.startSystemUpdates()
    this.updateTime()
    this.updateScreenResolution()

    // Auto-start listening after 2 seconds
    setTimeout(() => {
      if (!this.isSpeaking && !this.isTyping) {
        this.startListening()
      }
    }, 2000)
  }

  initializeElements() {
    // Get all DOM elements
    this.elements = {
      currentTime: document.getElementById("currentTime"),
      taskbarTime: document.getElementById("taskbarTime"),
      messageInput: document.getElementById("messageInput"),
      sendButton: document.getElementById("sendButton"),
      micButton: document.getElementById("micButton"),
      micIcon: document.getElementById("micIcon"),
      speakerButton: document.getElementById("speakerButton"),
      speakerIcon: document.getElementById("speakerIcon"),
      cameraToggle: document.getElementById("cameraToggle"),
      cameraIcon: document.getElementById("cameraIcon"),
      cameraVideo: document.getElementById("cameraVideo"),
      cameraPlaceholder: document.getElementById("cameraPlaceholder"),
      statusText: document.getElementById("statusText"),
      responseDisplay: document.getElementById("responseDisplay"),
      responseText: document.getElementById("responseText"),
      loadingIndicator: document.getElementById("loadingIndicator"),
      audioPlayer: document.getElementById("audioPlayer"),
      captureCanvas: document.getElementById("captureCanvas"),
      micStatus: document.getElementById("micStatus"),
      screenRes: document.getElementById("screenRes"),
      cpuValue: document.getElementById("cpuValue"),
      cpuProgress: document.getElementById("cpuProgress"),
      gpuValue: document.getElementById("gpuValue"),
      gpuProgress: document.getElementById("gpuProgress"),
      networkValue: document.getElementById("networkValue"),
      processValue: document.getElementById("processValue"),
      weatherText: document.getElementById("weatherText"),
      batteryText: document.getElementById("batteryText"),
      batteryStatus: document.getElementById("batteryStatus"),
      batteryIcon: document.getElementById("batteryIcon"),
    }
  }

  initializeSpeechRecognition() {
    const webkitSpeechRecognition = window.webkitSpeechRecognition
    if (webkitSpeechRecognition) {
      this.recognition = new webkitSpeechRecognition()
      this.recognition.continuous = true
      this.recognition.interimResults = true

      this.recognition.onstart = () => {
        this.recognitionActive = true
        this.isListening = true
        this.updateUI()
      }

      this.recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join("")

        if (event.results[event.results.length - 1].isFinal) {
          this.elements.messageInput.value = transcript

          // Check for camera commands
          const lowerTranscript = transcript.toLowerCase()
          if (lowerTranscript.includes("turn on camera") || lowerTranscript.includes("start camera")) {
            this.startCamera()
          } else if (lowerTranscript.includes("turn off camera") || lowerTranscript.includes("stop camera")) {
            this.stopCamera()
          }

          this.sendMessage(transcript)
        }
      }

      this.recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error)
        this.isListening = false
        this.updateUI()
      }

      this.recognition.onend = () => {
        this.recognitionActive = false
        this.isListening = false
        this.updateUI()

        // Auto-restart if conditions are met
        if (!this.isSpeaking && !this.isTyping && !this.isLoading) {
          setTimeout(() => {
            if (!this.recognitionActive && !this.isSpeaking && !this.isTyping && !this.isLoading) {
              this.startListening()
            }
          }, 1000)
        }
      }
    }
  }

  initializeEventListeners() {
    // Input handling
    this.elements.messageInput.addEventListener("input", (e) => {
      this.handleInputChange(e.target.value)
    })

    this.elements.messageInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.sendMessage(this.elements.messageInput.value)
      }
    })

    // Button clicks
    this.elements.sendButton.addEventListener("click", () => {
      this.sendMessage(this.elements.messageInput.value)
    })

    this.elements.micButton.addEventListener("click", () => {
      this.toggleMicrophone()
    })

    this.elements.cameraToggle.addEventListener("click", () => {
      this.toggleCamera()
    })

    // Audio ended event
    this.elements.audioPlayer.addEventListener("ended", () => {
      this.isSpeaking = false
      this.updateUI()

      // Restart microphone after speaking
      if (!this.isTyping && !this.recognitionActive) {
        setTimeout(() => {
          this.startListening()
        }, 500)
      }
    })
  }

  handleInputChange(value) {
    this.isTyping = true
    this.updateUI()

    // Stop microphone when typing
    if (this.recognition && this.recognitionActive) {
      this.recognition.stop()
    }

    // Clear existing timeout
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout)
    }

    // Set new timeout to detect when user stops typing
    this.typingTimeout = setTimeout(() => {
      this.isTyping = false
      this.updateUI()

      // Restart microphone if conditions are met
      if (!this.isSpeaking && !this.isLoading && !this.recognitionActive) {
        this.startListening()
      }
    }, 2000)
  }

  startListening() {
    if (this.recognition && !this.recognitionActive) {
      try {
        this.recognition.start()
      } catch (error) {
        console.error("Error starting speech recognition:", error)
      }
    }
  }

  toggleMicrophone() {
    if (!this.recognition) return

    try {
      if (this.recognitionActive) {
        this.recognition.stop()
      } else {
        this.recognition.start()
      }
    } catch (error) {
      console.error("Error toggling microphone:", error)
    }
  }

  async startCamera() {
    try {
      this.cameraStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: false,
      })

      this.elements.cameraVideo.srcObject = this.cameraStream
      this.isCameraOn = true
      this.updateUI()
    } catch (error) {
      console.error("Error accessing camera:", error)
    }
  }

  stopCamera() {
    if (this.cameraStream) {
      this.cameraStream.getTracks().forEach((track) => track.stop())
      this.cameraStream = null
      this.isCameraOn = false
      this.updateUI()
    }
  }

  toggleCamera() {
    if (this.isCameraOn) {
      this.stopCamera()
    } else {
      this.startCamera()
    }
  }

  captureImage() {
    if (!this.isCameraOn || !this.elements.cameraVideo) return null

    const canvas = this.elements.captureCanvas
    const video = this.elements.cameraVideo
    const ctx = canvas.getContext("2d")

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    ctx.drawImage(video, 0, 0)

    return canvas.toDataURL("image/jpeg", 0.8)
  }

  async sendMessage(text) {
    if (!text.trim() || this.isLoading) return

    this.isLoading = true
    this.isSpeaking = true
    this.updateUI()

    // Stop microphone when responding
    if (this.recognition && this.recognitionActive) {
      this.recognition.stop()
    }

    try {
      const imageData = this.isCameraOn ? this.captureImage() : null

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          image: imageData,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      this.showResponse(data.reply)

      // Play voice response if available
      if (data.voiceStreamUrl) {
        this.elements.audioPlayer.src = data.voiceStreamUrl
        this.elements.audioPlayer.play()
      } else {
        // Simulate speaking for demo
        setTimeout(() => {
          this.isSpeaking = false
          this.updateUI()

          // Restart microphone after speaking
          if (!this.isTyping && !this.recognitionActive) {
            setTimeout(() => {
              this.startListening()
            }, 500)
          }
        }, 3000)
      }
    } catch (error) {
      console.error("Error sending message:", error)
      this.showResponse("Sorry, I encountered an error. Please try again.")

      // Simulate speaking for error message
      setTimeout(() => {
        this.isSpeaking = false
        this.updateUI()

        // Restart microphone after error
        if (!this.isTyping && !this.recognitionActive) {
          setTimeout(() => {
            this.startListening()
          }, 500)
        }
      }, 2000)
    } finally {
      this.isLoading = false
      this.elements.messageInput.value = ""
      this.updateUI()
    }
  }

  showResponse(text) {
    this.elements.responseText.textContent = text
    this.elements.responseDisplay.style.display = "block"

    // Hide response after 10 seconds
    setTimeout(() => {
      this.elements.responseDisplay.style.display = "none"
    }, 10000)
  }

  updateUI() {
    // Update status text
    if (this.isSpeaking) {
      this.elements.statusText.textContent = "AI Speaking..."
      if (window.glitchEffect) window.glitchEffect.start()
      if (window.particleText) window.particleText.setGlitching(true)
    } else if (this.isTyping) {
      this.elements.statusText.textContent = "User Typing..."
      if (window.glitchEffect) window.glitchEffect.stop()
      if (window.particleText) window.particleText.setGlitching(false)
    } else if (this.isListening) {
      this.elements.statusText.textContent = "Listening..."
      if (window.glitchEffect) window.glitchEffect.stop()
      if (window.particleText) {
        window.particleText.setGlitching(false)
        window.particleText.setSoundWave(true)
      }
    } else {
      this.elements.statusText.textContent = "Voice Assistant Active"
      if (window.glitchEffect) window.glitchEffect.stop()
      if (window.particleText) {
        window.particleText.setGlitching(false)
        window.particleText.setSoundWave(false)
      }
    }

    // Update microphone button
    if (this.isListening) {
      this.elements.micButton.classList.add("active")
      this.elements.micIcon.textContent = "🎤"
      this.elements.micStatus.textContent = "On"
      this.elements.micStatus.classList.add("active")
    } else {
      this.elements.micButton.classList.remove("active")
      this.elements.micIcon.textContent = "🎤"
      this.elements.micStatus.textContent = "Off"
      this.elements.micStatus.classList.remove("active")
    }

    // Update speaker button
    if (this.isSpeaking) {
      this.elements.speakerButton.classList.add("active")
      this.elements.speakerIcon.textContent = "🔊"
    } else {
      this.elements.speakerButton.classList.remove("active")
      this.elements.speakerIcon.textContent = "🔊"
    }

    // Update camera
    if (this.isCameraOn) {
      this.elements.cameraVideo.style.display = "block"
      this.elements.cameraPlaceholder.style.display = "none"
      this.elements.cameraIcon.textContent = "📷"
    } else {
      this.elements.cameraVideo.style.display = "none"
      this.elements.cameraPlaceholder.style.display = "flex"
      this.elements.cameraIcon.textContent = "📷"
    }

    // Update loading indicator
    if (this.isLoading) {
      this.elements.loadingIndicator.style.display = "flex"
    } else {
      this.elements.loadingIndicator.style.display = "none"
    }

    // Update send button
    this.elements.sendButton.disabled = this.isLoading || !this.elements.messageInput.value.trim()
  }

  updateTime() {
    const now = new Date()
    const timeString = now.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
    const timeString12 = now.toLocaleTimeString("en-US", {
      hour12: true,
      hour: "numeric",
      minute: "2-digit",
    })

    this.elements.currentTime.textContent = timeString
    this.elements.taskbarTime.textContent = timeString12

    setTimeout(() => this.updateTime(), 1000)
  }

  updateScreenResolution() {
    this.elements.screenRes.textContent = `${screen.width} x ${screen.height}`
  }

  async fetchSystemStats() {
    try {
      const response = await fetch("/api/system-stats")
      if (response.ok) {
        const data = await response.json()
        this.systemStats = data
        this.updateSystemStatsUI()
      }
    } catch (error) {
      console.error("Error fetching system stats:", error)
    }
  }

  async fetchWeather() {
    try {
      const response = await fetch("/api/weather")
      if (response.ok) {
        const data = await response.json()
        this.weather = data
        this.updateWeatherUI()
      }
    } catch (error) {
      console.error("Error fetching weather:", error)
    }
  }

  updateSystemStatsUI() {
    this.elements.cpuValue.textContent = `${this.systemStats.cpu}%`
    this.elements.cpuProgress.style.width = `${this.systemStats.cpu}%`

    this.elements.gpuValue.textContent = `${this.systemStats.gpu}%`
    this.elements.gpuProgress.style.width = `${this.systemStats.gpu}%`

    this.elements.networkValue.textContent = `${this.systemStats.network.speed} Mbps`
    this.elements.processValue.textContent = this.systemStats.processes

    this.elements.batteryText.textContent = `${this.systemStats.battery.level}%`
    this.elements.batteryStatus.textContent = this.systemStats.battery.charging ? "Charging" : "Battery"
    this.elements.batteryIcon.textContent = this.systemStats.battery.charging ? "🔌" : "🔋"
  }

  updateWeatherUI() {
    this.elements.weatherText.textContent = `${this.weather.description}, ${this.weather.temperature}°`
  }

  startSystemUpdates() {
    // Fetch initial data
    this.fetchSystemStats()
    this.fetchWeather()

    // Update system stats every 2 seconds
    setInterval(() => {
      this.fetchSystemStats()
    }, 2000)

    // Update weather every 5 minutes
    setInterval(() => {
      this.fetchWeather()
    }, 300000)
  }
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.jailbreakAI = new JailbreakAI()
})
