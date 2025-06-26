// Global variables
let currentAudio = null

// Update clock every second
function updateClock() {
  const now = new Date()
  const hours = now.getHours().toString().padStart(2, "0")
  const minutes = now.getMinutes().toString().padStart(2, "0")
  const seconds = now.getSeconds().toString().padStart(2, "0")

  const clockElement = document.getElementById("clock")
  if (clockElement) {
    clockElement.textContent = `${hours}:${minutes}:${seconds}`
  }
}

// Update taskbar time
function updateTaskbarTime() {
  const now = new Date()
  let hours = now.getHours()
  const minutes = now.getMinutes().toString().padStart(2, "0")
  const ampm = hours >= 12 ? "PM" : "AM"

  hours = hours % 12
  hours = hours ? hours : 12 // 0 should be 12

  const taskbarTimeElement = document.getElementById("taskbar-time")
  if (taskbarTimeElement) {
    taskbarTimeElement.textContent = `${hours}:${minutes} ${ampm}`
  }
}

// Fetch and update system stats
async function updateSystemStats() {
  try {
    const response = await fetch("/api/system-stats")
    const stats = await response.json()

    // Update CPU
    const cpuValue = document.getElementById("cpu-value")
    const cpuBar = document.querySelector(".cpu-bar")
    if (cpuValue && cpuBar) {
      cpuValue.textContent = `${stats.cpu}%`
      cpuBar.style.width = `${stats.cpu}%`
    }

    // Update GPU
    const gpuValue = document.getElementById("gpu-value")
    const gpuBar = document.querySelector(".gpu-bar")
    if (gpuValue && gpuBar) {
      gpuValue.textContent = `${stats.gpu}%`
      gpuBar.style.width = `${stats.gpu}%`
    }

    // Update Network
    const networkValue = document.getElementById("network-value")
    if (networkValue) {
      networkValue.textContent = `${stats.network} AMbps`
    }

    // Update Processes
    const processesValue = document.getElementById("processes-value")
    if (processesValue) {
      processesValue.textContent = stats.processes
    }

    // Update RAM
    const ram1 = document.getElementById("ram1")
    const ram2 = document.getElementById("ram2")
    if (ram1 && ram2) {
      ram1.textContent = `${stats.ram}%`
      ram2.textContent = `${Math.floor(stats.ram * 0.7)}%`
    }
  } catch (error) {
    console.error("Failed to fetch system stats:", error)
  }
}

// Fetch and update weather
async function updateWeather() {
  try {
    const response = await fetch("/api/weather")
    const weather = await response.json()

    const weatherDisplay = document.getElementById("weather-display")
    const weatherDetail = document.getElementById("weather-detail")

    const weatherText = `${weather.description}, ${Math.round(weather.temperature)}°`

    if (weatherDisplay) {
      weatherDisplay.textContent = weatherText
    }
    if (weatherDetail) {
      weatherDetail.textContent = weatherText
    }
  } catch (error) {
    console.error("Failed to fetch weather:", error)
  }
}

// Chat functionality
function openChat() {
  const modal = document.getElementById("chat-modal")
  if (modal) {
    modal.style.display = "block"
    document.getElementById("chat-input").focus()
  }
}

function closeChat() {
  const modal = document.getElementById("chat-modal")
  if (modal) {
    modal.style.display = "none"
  }

  // Stop any playing audio
  if (currentAudio) {
    currentAudio.pause()
    currentAudio = null
  }
}

function handleChatKeyPress(event) {
  if (event.key === "Enter") {
    sendMessage()
  }
}

async function sendMessage() {
  const input = document.getElementById("chat-input")
  const messagesContainer = document.getElementById("chat-messages")

  if (!input.value.trim()) return

  const userMessage = input.value.trim()
  input.value = ""

  // Add user message to chat
  const userMessageDiv = document.createElement("div")
  userMessageDiv.className = "message user"
  userMessageDiv.textContent = userMessage
  messagesContainer.appendChild(userMessageDiv)

  // Add loading message
  const loadingDiv = document.createElement("div")
  loadingDiv.className = "message ai loading"
  loadingDiv.textContent = "JAILBREAK is processing..."
  messagesContainer.appendChild(loadingDiv)

  // Scroll to bottom
  messagesContainer.scrollTop = messagesContainer.scrollHeight

  try {
    const response = await fetch("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userMessage }),
    })

    const data = await response.json()

    // Remove loading message
    messagesContainer.removeChild(loadingDiv)

    // Add AI response
    const aiMessageDiv = document.createElement("div")
    aiMessageDiv.className = "message ai"
    aiMessageDiv.textContent = data.reply
    messagesContainer.appendChild(aiMessageDiv)

    // Play voice if available
    if (data.voiceStreamUrl) {
      if (currentAudio) {
        currentAudio.pause()
      }
      currentAudio = new Audio(data.voiceStreamUrl)
      currentAudio.play().catch((error) => {
        console.error("Failed to play audio:", error)
      })
    }
  } catch (error) {
    console.error("Chat error:", error)

    // Remove loading message
    messagesContainer.removeChild(loadingDiv)

    // Add error message
    const errorDiv = document.createElement("div")
    errorDiv.className = "message ai"
    errorDiv.textContent = "SYSTEM ERROR: Connection failed. Please try again."
    messagesContainer.appendChild(errorDiv)
  }

  // Scroll to bottom
  messagesContainer.scrollTop = messagesContainer.scrollHeight
}

// Add click effects to action buttons
function addButtonEffects() {
  const actionButtons = document.querySelectorAll(".action-btn")

  actionButtons.forEach((button) => {
    button.addEventListener("click", function () {
      this.style.transform = "scale(0.95)"
      setTimeout(() => {
        this.style.transform = "scale(1)"
      }, 150)
    })
  })
}

// Add taskbar icon interactions
function addTaskbarEffects() {
  const taskbarIcons = document.querySelectorAll(".taskbar-icon")

  taskbarIcons.forEach((icon, index) => {
    icon.addEventListener("click", function () {
      // Remove active class from all icons
      taskbarIcons.forEach((i) => i.classList.remove("active"))
      // Add active class to clicked icon
      this.classList.add("active")
    })
  })
}

// Create particle effects
function createParticle() {
  const particle = document.createElement("div")
  particle.style.position = "absolute"
  particle.style.width = "2px"
  particle.style.height = "2px"
  particle.style.background = Math.random() > 0.5 ? "#00ffff" : "#ff0040"
  particle.style.left = Math.random() * window.innerWidth + "px"
  particle.style.top = window.innerHeight + "px"
  particle.style.pointerEvents = "none"
  particle.style.opacity = "0.7"
  particle.style.zIndex = "1"

  document.body.appendChild(particle)

  const animation = particle.animate(
    [
      { transform: "translateY(0px)", opacity: 0.7 },
      { transform: `translateY(-${window.innerHeight + 100}px)`, opacity: 0 },
    ],
    {
      duration: Math.random() * 3000 + 2000,
      easing: "linear",
    },
  )

  animation.onfinish = () => particle.remove()
}

// Initialize everything when page loads
document.addEventListener("DOMContentLoaded", () => {
  // Update clocks immediately
  updateClock()
  updateTaskbarTime()
  updateSystemStats()
  updateWeather()

  // Set up intervals
  setInterval(updateClock, 1000)
  setInterval(updateTaskbarTime, 1000)
  setInterval(updateSystemStats, 3000)
  setInterval(updateWeather, 300000) // Update weather every 5 minutes

  // Add interactive effects
  addButtonEffects()
  addTaskbarEffects()

  // Add some random glitch effects
  setInterval(() => {
    const title = document.querySelector(".jailbreak-title")
    if (title && Math.random() < 0.1) {
      title.style.textShadow = "0 0 30px #ff0040, 2px 0 0 #00ffff, -2px 0 0 #ff0040"
      setTimeout(() => {
        title.style.textShadow = "0 0 30px #ff0040"
      }, 100)
    }
  }, 2000)

  // Create particles occasionally
  setInterval(createParticle, 500)

  // Close chat modal when clicking outside
  document.getElementById("chat-modal").addEventListener("click", function (e) {
    if (e.target === this) {
      closeChat()
    }
  })
})

// Handle escape key to close chat
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeChat()
  }
})
