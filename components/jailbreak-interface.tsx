"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Mic,
  MicOff,
  Send,
  Camera,
  CameraOff,
  Volume2,
  VolumeX,
  Wifi,
  CloudRain,
  Battery,
  BatteryCharging,
  Thermometer,
  HardDrive,
  MemoryStick,
} from "lucide-react"

interface SystemStats {
  cpu: number
  gpu: number
  ram: number
  network: number
  processes: number
  uptime: number
  battery: {
    level: number
    charging: boolean
    timeRemaining: number
  }
  storage: {
    used: number
    total: number
    available: number
  }
  memory: {
    used: number
    total: number
  }
  temperature: {
    cpu: number
    gpu: number
  }
  network: {
    speed: number
    type: string
    signal: number
  }
}

interface WeatherData {
  city: string
  temperature: number
  description: string
  humidity: number
  windSpeed: number
  unit: string
}

// Matrix Effect Component
function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const jailbreakText = "JAILBREAK"
    const fontSize = 16
    const columns = canvas.width / fontSize

    const drops: number[] = []
    const colors: string[] = []

    for (let x = 0; x < columns; x++) {
      drops[x] = 1
      colors[x] = Math.random() > 0.5 ? "#00ffff" : "#ff0000" // Random cyan or red
    }

    function draw() {
      if (!ctx || !canvas) return

      ctx.fillStyle = "rgba(0, 0, 0, 0.03)" // Less fade for brighter effect
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = fontSize + "px monospace"

      for (let i = 0; i < drops.length; i++) {
        // Randomly change color occasionally
        if (Math.random() > 0.98) {
          colors[i] = Math.random() > 0.5 ? "#00ffff" : "#ff0000"
        }

        ctx.fillStyle = colors[i]
        ctx.shadowColor = colors[i]
        ctx.shadowBlur = 10

        const text = jailbreakText[Math.floor(Math.random() * jailbreakText.length)]
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }

      ctx.shadowBlur = 0 // Reset shadow
    }

    const interval = setInterval(draw, 25) // Faster for more dynamic effect

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      clearInterval(interval)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 opacity-40 pointer-events-none" />
}

// Glitch Effect Component
function GlitchEffect({ isActive }: { isActive: boolean }) {
  const [glitchPhase, setGlitchPhase] = useState(0)

  useEffect(() => {
    if (!isActive) return

    const glitchCycle = () => {
      // 2 seconds of glitch
      setGlitchPhase(1)
      setTimeout(() => {
        // 1 second pause
        setGlitchPhase(0)
        setTimeout(() => {
          if (isActive) glitchCycle()
        }, 1000)
      }, 2000)
    }

    glitchCycle()
  }, [isActive])

  if (!isActive || glitchPhase === 0) return null

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {/* Red glitch bars */}
      <div
        className="absolute w-full h-1 bg-red-500 opacity-80 animate-pulse"
        style={{
          top: `${Math.random() * 100}%`,
          animation: "glitch-red 0.1s infinite",
        }}
      />
      <div
        className="absolute w-full h-2 bg-red-500 opacity-60"
        style={{
          top: `${Math.random() * 100}%`,
          animation: "glitch-red 0.15s infinite",
        }}
      />

      {/* Blue glitch bars */}
      <div
        className="absolute w-full h-1 bg-blue-500 opacity-70"
        style={{
          top: `${Math.random() * 100}%`,
          animation: "glitch-blue 0.12s infinite",
        }}
      />
      <div
        className="absolute w-full h-3 bg-blue-400 opacity-50"
        style={{
          top: `${Math.random() * 100}%`,
          animation: "glitch-blue 0.18s infinite",
        }}
      />

      {/* Yellow glitch bars */}
      <div
        className="absolute w-full h-1 bg-yellow-400 opacity-80"
        style={{
          top: `${Math.random() * 100}%`,
          animation: "glitch-yellow 0.08s infinite",
        }}
      />

      {/* White glitch bars */}
      <div
        className="absolute w-full h-1 bg-white opacity-90"
        style={{
          top: `${Math.random() * 100}%`,
          animation: "glitch-white 0.06s infinite",
        }}
      />

      {/* Green glitch bars */}
      <div
        className="absolute w-full h-2 bg-green-400 opacity-60"
        style={{
          top: `${Math.random() * 100}%`,
          animation: "glitch-green 0.14s infinite",
        }}
      />

      {/* Screen distortion overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent animate-pulse" />
      <div className="absolute inset-0 bg-gradient-to-l from-transparent via-blue-500/10 to-transparent animate-pulse" />
    </div>
  )
}

// Particle Text Component
function ParticleText({ isGlitching, isSoundWave }: { isGlitching: boolean; isSoundWave: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<any[]>([])
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 800
    canvas.height = 200

    // Create text particles
    const createTextParticles = () => {
      ctx.font = "bold 120px Arial"
      ctx.fillStyle = "#ff0000"
      ctx.textAlign = "center"
      ctx.fillText("JAILBREAK", canvas.width / 2, canvas.height / 2 + 40)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const pixels = imageData.data

      particlesRef.current = []

      for (let y = 0; y < canvas.height; y += 4) {
        for (let x = 0; x < canvas.width; x += 4) {
          const index = (y * canvas.width + x) * 4
          const alpha = pixels[index + 3]

          if (alpha > 128) {
            particlesRef.current.push({
              x: x,
              y: y,
              targetX: x,
              targetY: y,
              originalX: x,
              originalY: y,
              currentX: x + (Math.random() - 0.5) * 100,
              currentY: y + (Math.random() - 0.5) * 100,
              vx: 0,
              vy: 0,
              size: Math.random() * 2 + 1,
              opacity: Math.random() * 0.8 + 0.2,
              color: Math.random() > 0.7 ? "#00ffff" : "#ff0000",
              glitchOffset: Math.random() * Math.PI * 2,
              waveOffset: Math.random() * Math.PI * 2,
            })
          }
        }
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const time = Date.now() * 0.005

      particlesRef.current.forEach((particle, index) => {
        let targetX = particle.originalX
        let targetY = particle.originalY

        // Sound wave effect when listening
        if (isSoundWave) {
          const waveAmplitude = 15
          const waveFrequency = 0.02
          const waveSpeed = time * 2

          targetX += Math.sin(particle.originalY * waveFrequency + waveSpeed + particle.waveOffset) * waveAmplitude
          targetY +=
            Math.cos(particle.originalX * waveFrequency + waveSpeed + particle.waveOffset) * (waveAmplitude * 0.5)
        }

        // Glitch effect when speaking
        if (isGlitching) {
          const glitchIntensity = 30
          const glitchSpeed = time * 8

          targetX += Math.sin(glitchSpeed + particle.glitchOffset) * glitchIntensity * Math.random()
          targetY += Math.cos(glitchSpeed + particle.glitchOffset * 1.5) * glitchIntensity * Math.random()

          // Random color changes during glitch
          if (Math.random() > 0.95) {
            particle.color = Math.random() > 0.5 ? "#ff0000" : "#00ffff"
          }
        }

        particle.targetX = targetX
        particle.targetY = targetY

        // Move towards target position
        const dx = particle.targetX - particle.currentX
        const dy = particle.targetY - particle.currentY

        particle.vx += dx * 0.02
        particle.vy += dy * 0.02

        particle.vx *= 0.95
        particle.vy *= 0.95

        particle.currentX += particle.vx
        particle.currentY += particle.vy

        // Add some random movement
        if (!isGlitching && !isSoundWave) {
          particle.currentX += (Math.random() - 0.5) * 0.5
          particle.currentY += (Math.random() - 0.5) * 0.5
        }

        // Draw particle with glow
        ctx.save()
        ctx.globalAlpha = particle.opacity
        ctx.shadowColor = particle.color
        ctx.shadowBlur = isGlitching ? 20 : isSoundWave ? 12 : 15
        ctx.fillStyle = particle.color
        ctx.beginPath()
        ctx.arc(particle.currentX, particle.currentY, particle.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    createTextParticles()
    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      particlesRef.current = []
    }
  }, [isGlitching, isSoundWave])

  return (
    <div className="flex justify-center items-center">
      <canvas
        ref={canvasRef}
        width={800}
        height={200}
        className="absolute"
        style={{ filter: isGlitching ? "blur(1px)" : "blur(0.5px)" }}
      />
    </div>
  )
}

export function JailbreakInterface() {
  // State management
  const [isListening, setIsListening] = useState(true) // Default to true
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [message, setMessage] = useState("")
  const [response, setResponse] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [systemStats, setSystemStats] = useState<SystemStats>({
    cpu: 4,
    gpu: 17,
    ram: 39,
    network: 55,
    processes: 3,
    uptime: 0,
    battery: {
      level: 85,
      charging: true,
      timeRemaining: 240,
    },
    storage: {
      used: 256,
      total: 512,
      available: 256,
    },
    memory: {
      used: 8,
      total: 16,
    },
    temperature: {
      cpu: 55,
      gpu: 62,
    },
    network: {
      speed: 75,
      type: "Wi-Fi 6",
      signal: 85,
    },
  })
  const [weather, setWeather] = useState<WeatherData>({
    city: "Unknown",
    temperature: 18,
    description: "Rain",
    humidity: 75,
    windSpeed: 8,
    unit: "celsius",
  })
  const [currentTime, setCurrentTime] = useState(new Date())
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [deviceInfo, setDeviceInfo] = useState({
    userAgent: "",
    platform: "",
    language: "",
    cookieEnabled: false,
    onLine: true,
    screenResolution: "",
    colorDepth: 0,
    pixelRatio: 1,
    timezone: "",
    batterySupported: false,
  })

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const recognitionRef = useRef<any>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const recognitionActiveRef = useRef(false)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Handle typing detection
  const handleInputChange = useCallback(
    (value: string) => {
      setMessage(value)
      setIsTyping(true)

      // Stop microphone when typing
      if (recognitionRef.current && recognitionActiveRef.current) {
        recognitionRef.current.stop()
      }

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      // Set new timeout to detect when user stops typing
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false)
        // Restart microphone if not speaking and not loading
        if (!isSpeaking && !isLoading && recognitionRef.current && !recognitionActiveRef.current) {
          try {
            recognitionRef.current.start()
          } catch (_) {
            /* ignore if already started */
          }
        }
      }, 2000) // 2 seconds after stopping typing
    },
    [isSpeaking, isLoading],
  )

  // Get device information
  useEffect(() => {
    if (typeof window !== "undefined") {
      const getDeviceInfo = async () => {
        const info = {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          language: navigator.language,
          cookieEnabled: navigator.cookieEnabled,
          onLine: navigator.onLine,
          screenResolution: `${screen.width} x ${screen.height}`,
          colorDepth: screen.colorDepth,
          pixelRatio: window.devicePixelRatio,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          batterySupported: "getBattery" in navigator,
        }
        setDeviceInfo(info)

        // Try to get battery info if supported
        if ("getBattery" in navigator) {
          try {
            const battery = await (navigator as any).getBattery()
            setSystemStats((prev) => ({
              ...prev,
              battery: {
                level: Math.round(battery.level * 100),
                charging: battery.charging,
                timeRemaining:
                  battery.dischargingTime === Number.POSITIVE_INFINITY ? 0 : Math.round(battery.dischargingTime / 60),
              },
            }))
          } catch (error) {
            console.log("Battery API not available")
          }
        }
      }
      getDeviceInfo()
    }
  }, [])

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true

      recognitionRef.current.onstart = () => {
        recognitionActiveRef.current = true
        setIsListening(true)
      }

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join("")

        if (event.results[event.results.length - 1].isFinal) {
          setMessage(transcript)
          // Check for camera commands
          const lowerTranscript = transcript.toLowerCase()
          if (lowerTranscript.includes("turn on camera") || lowerTranscript.includes("start camera")) {
            startCamera()
          } else if (lowerTranscript.includes("turn off camera") || lowerTranscript.includes("stop camera")) {
            stopCamera()
          }
          handleSendMessage(transcript)
        }
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error)
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        recognitionActiveRef.current = false
        setIsListening(false)
        // Auto-restart if not speaking, not typing, and not loading
        if (!isSpeaking && !isTyping && !isLoading) {
          setTimeout(() => {
            if (recognitionRef.current && !recognitionActiveRef.current && !isSpeaking && !isTyping && !isLoading) {
              try {
                recognitionRef.current.start()
              } catch (_) {
                /* ignore if already started */
              }
            }
          }, 1000)
        }
      }
    }
  }, [isSpeaking, isTyping, isLoading])

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: false,
      })
      setCameraStream(stream)
      setIsCameraOn(true)

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
    }
  }, [])

  // Stop camera
  const stopCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop())
      setCameraStream(null)
      setIsCameraOn(false)
    }
  }, [cameraStream])

  // Toggle microphone
  const toggleMicrophone = useCallback(() => {
    if (!recognitionRef.current) return

    try {
      if (recognitionActiveRef.current) {
        recognitionRef.current.stop()
      } else {
        recognitionRef.current.start()
      }
    } catch (err) {
      // Ignore "recognition has already started" errors caused by rapid re-invocation
      if ((err as DOMException).name !== "InvalidStateError") {
        console.error("SpeechRecognition error:", err)
      }
    }
  }, [])

  // Capture image from video
  const captureImage = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return null

    const canvas = canvasRef.current
    const video = videoRef.current
    const ctx = canvas.getContext("2d")

    if (!ctx) return null

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    ctx.drawImage(video, 0, 0)

    return canvas.toDataURL("image/jpeg", 0.8)
  }, [])

  // Send message to backend
  const handleSendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return

      setIsLoading(true)
      setResponse("")
      setIsSpeaking(true)

      // Stop microphone when responding
      if (recognitionRef.current && recognitionActiveRef.current) {
        recognitionRef.current.stop()
      }

      try {
        const imageData = isCameraOn ? captureImage() : null

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
        setResponse(data.reply)

        // Play voice response (if available)
        if (data.voiceStreamUrl) {
          if (audioRef.current) {
            audioRef.current.src = data.voiceStreamUrl
            audioRef.current.play()
            audioRef.current.onended = () => {
              setIsSpeaking(false)
              // Clean up audio file
              fetch(data.voiceStreamUrl, { method: "DELETE" }).catch(() => {})
              // Restart microphone after speaking
              if (!isTyping && recognitionRef.current && !recognitionActiveRef.current) {
                setTimeout(() => {
                  try {
                    recognitionRef.current.start()
                  } catch (_) {
                    /* ignore if already started */
                  }
                }, 500)
              }
            }
          }
        } else {
          // Simulate speaking for demo (since we don't have real TTS)
          setTimeout(() => {
            setIsSpeaking(false)
            // Restart microphone after speaking
            if (!isTyping && recognitionRef.current && !recognitionActiveRef.current) {
              setTimeout(() => {
                try {
                  recognitionRef.current.start()
                } catch (_) {
                  /* ignore if already started */
                }
              }, 500)
            }
          }, 3000)
        }
      } catch (error) {
        console.error("Error sending message:", error)
        setResponse("Sorry, I encountered an error. Please try again.")
        // Simulate speaking for error message
        setTimeout(() => {
          setIsSpeaking(false)
          // Restart microphone after error
          if (!isTyping && recognitionRef.current && !recognitionActiveRef.current) {
            setTimeout(() => {
              try {
                recognitionRef.current.start()
              } catch (_) {
                /* ignore if already started */
              }
            }, 500)
          }
        }, 2000)
      } finally {
        setIsLoading(false)
        setMessage("")
      }
    },
    [isLoading, isCameraOn, captureImage, isTyping],
  )

  // Fetch system stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/system-stats", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          cache: "no-store",
        })

        if (res.ok) {
          const data = await res.json()
          setSystemStats(data)
        } else {
          console.warn("Failed to fetch system stats:", res.status)
        }
      } catch (error) {
        console.error("Error fetching system stats:", error)
      }
    }

    fetchStats()
    const interval = setInterval(fetchStats, 2000)
    return () => clearInterval(interval)
  }, [])

  // Fetch weather
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch("/api/weather", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          cache: "no-store",
        })

        if (res.ok) {
          const data = await res.json()
          setWeather(data)
        } else {
          console.warn("Failed to fetch weather:", res.status)
        }
      } catch (error) {
        console.error("Error fetching weather:", error)
      }
    }

    fetchWeather()
    const interval = setInterval(fetchWeather, 300000) // Every 5 minutes
    return () => clearInterval(interval)
  }, [])

  // Update time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Auto-start microphone by default
  useEffect(() => {
    // Auto-start listening after 2 seconds
    setTimeout(() => {
      if (recognitionRef.current && !recognitionActiveRef.current && !isSpeaking && !isTyping) {
        try {
          recognitionRef.current.start()
        } catch (_) {
          /* ignore if already started */
        }
      }
    }, 2000)

    return () => {
      // Clean up camera stream on unmount
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop())
      }
      // Clean up typing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [cameraStream, isSpeaking, isTyping])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  const formatBatteryTime = (minutes: number) => {
    if (minutes === 0) return "∞"
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono relative overflow-hidden">
      {/* Matrix Rain Background */}
      <MatrixRain />

      {/* Glitch Effect Overlay */}
      <GlitchEffect isActive={isSpeaking} />

      {/* Animated background circles */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-[800px] h-[800px] border border-red-500/30 rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-cyan-400/20 rounded-full animate-spin"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-red-500/20 rounded-full animate-ping"></div>
        </div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 h-screen p-6">
        {/* Top Time Display */}
        <div className="text-center mb-6">
          <div className="text-6xl font-bold text-red-500 tracking-wider animate-pulse">{formatTime(currentTime)}</div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
          {/* Left Column */}
          <div className="col-span-3 space-y-6">
            {/* Camera Feed */}
            <Card className="bg-black/80 border-cyan-400 border-2 relative overflow-hidden h-48">
              <div className="absolute top-2 left-2 text-cyan-400 text-sm font-bold z-10">VISUAL</div>
              <div className="absolute top-2 right-2 text-cyan-400 text-sm z-10">03</div>
              {isCameraOn ? (
                <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-900/50">
                  <div className="text-center">
                    <Camera className="w-16 h-16 text-cyan-400/30 mx-auto mb-2" />
                    <div className="text-cyan-400/50 text-sm">Camera Off</div>
                    <div className="text-cyan-400/30 text-xs mt-1">Say "turn on camera"</div>
                  </div>
                </div>
              )}
              <div className="absolute bottom-2 left-2 z-10">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={isCameraOn ? stopCamera : startCamera}
                  className="text-cyan-400 hover:text-white bg-black/50"
                >
                  {isCameraOn ? <CameraOff className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
                </Button>
              </div>
            </Card>

            {/* System Stats */}
            <Card className="bg-black/80 border-cyan-400 border-2 p-4 flex-1">
              <div className="text-cyan-400 font-bold mb-4">SYSTEM</div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-cyan-400">CPU</span>
                  <span className="text-red-500">{systemStats.cpu}%</span>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded">
                  <div
                    className="bg-red-500 h-2 rounded transition-all duration-500"
                    style={{ width: `${systemStats.cpu}%` }}
                  ></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-cyan-400">GPU</span>
                  <span className="text-cyan-400">{systemStats.gpu}%</span>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded">
                  <div
                    className="bg-cyan-400 h-2 rounded transition-all duration-500"
                    style={{ width: `${systemStats.gpu}%` }}
                  ></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-cyan-400">Network</span>
                  <span className="text-cyan-400">{systemStats.network.speed} AMbps</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-cyan-400">Processes</span>
                  <span className="text-cyan-400">{systemStats.processes}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Center Column */}
          <div className="col-span-6 flex flex-col items-center justify-center relative">
            {/* Particle-based Jailbreak Title */}
            <div className="relative mb-12 flex justify-center items-center w-full">
              <ParticleText isGlitching={isSpeaking} isSoundWave={isListening} />
            </div>

            {/* Status indicator */}
            <div className="text-center text-cyan-400/50 text-lg">
              {isSpeaking
                ? "AI Speaking..."
                : isTyping
                  ? "User Typing..."
                  : isListening
                    ? "Listening..."
                    : "Voice Assistant Active"}
            </div>
          </div>

          {/* Right Column */}
          <div className="col-span-3 space-y-6">
            {/* Uptime */}
            <Card className="bg-black/80 border-cyan-400 border-2 p-4">
              <div className="text-cyan-400 font-bold mb-2">UPTIME</div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-cyan-400">39%</span>
                  <span className="text-cyan-400">29%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-cyan-400">RAM</span>
                  <span className="text-cyan-400">RAM</span>
                </div>
              </div>
            </Card>

            {/* Weather & Battery */}
            <Card className="bg-black/80 border-cyan-400 border-2 p-4">
              <div className="text-cyan-400 font-bold mb-2">WEATHER & BATTERY</div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CloudRain className="w-5 h-5 text-cyan-400" />
                  <div>
                    <div className="text-cyan-400">
                      {weather.description}, {weather.temperature}°
                    </div>
                    <div className="text-sm text-cyan-400/70">Plugged in</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {systemStats.battery.charging ? (
                    <BatteryCharging className="w-5 h-5" />
                  ) : (
                    <Battery className="w-5 h-5" />
                  )}
                  <div>
                    <div className="text-cyan-400">{systemStats.battery.level}%</div>
                    <div className="text-sm text-cyan-400/70">
                      {systemStats.battery.charging ? "Charging" : "Battery"}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Meta Information */}
            <Card className="bg-black/80 border-cyan-400 border-2 p-4 flex-1">
              <div className="text-cyan-400 font-bold mb-4">META</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-cyan-400">Device</span>
                  <span className="text-cyan-400">DESKTOP-XYZ123</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyan-400">OS</span>
                  <span className="text-cyan-400">Windows 11</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyan-400">Storage</span>
                  <span className="text-cyan-400">256 GB / 254 6.475 GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyan-400">Microphone</span>
                  <span className={isListening ? "text-green-400" : "text-cyan-400"}>{isListening ? "On" : "Off"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyan-400">Internet</span>
                  <span className="text-cyan-400">Wi-Fi</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyan-400">Resolution</span>
                  <span className="text-cyan-400">1920 x 1080</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-6 space-y-4">
          {/* Input Area */}
          <div className="flex items-center space-x-4">
            <div className="flex-1 flex space-x-2">
              <Input
                value={message}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage(message)}
                placeholder="Type your message or use voice..."
                className="bg-black/80 border-cyan-400 text-cyan-400 placeholder-cyan-400/50 h-12"
                disabled={isLoading}
              />
              <Button
                onClick={() => handleSendMessage(message)}
                disabled={isLoading || !message.trim()}
                className="bg-cyan-400/20 border border-cyan-400 text-cyan-400 hover:bg-cyan-400/30 h-12 px-6"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>

            <Button
              onClick={toggleMicrophone}
              className={`${
                isListening
                  ? "bg-red-500/20 border-red-500 text-red-500 animate-pulse"
                  : "bg-cyan-400/20 border-cyan-400 text-cyan-400"
              } hover:bg-opacity-30 h-12 px-6`}
            >
              {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </Button>

            <Button
              className={`${
                isSpeaking
                  ? "bg-green-500/20 border-green-500 text-green-500 animate-pulse"
                  : "bg-cyan-400/20 border-cyan-400 text-cyan-400"
              } hover:bg-opacity-30 h-12 px-6`}
            >
              {isSpeaking ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </Button>
          </div>

          {/* Bottom Taskbar */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              <div className="w-10 h-10 border-2 border-red-500 bg-red-500/20 flex items-center justify-center">
                <Thermometer className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 border-2 border-red-500 bg-red-500/20 flex items-center justify-center">
                <HardDrive className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 border-2 border-red-500 bg-red-500/20 flex items-center justify-center">
                <MemoryStick className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 border-2 border-cyan-400 bg-cyan-400/20 flex items-center justify-center">
                <Wifi className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 border-2 border-cyan-400 bg-cyan-400/20 flex items-center justify-center">
                <Camera className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 border-2 border-red-500 bg-red-500/20 flex items-center justify-center">
                {systemStats.battery.charging ? (
                  <BatteryCharging className="w-5 h-5" />
                ) : (
                  <Battery className="w-5 h-5" />
                )}
              </div>
            </div>

            <div className="flex items-center space-x-6 text-cyan-400">
              <div className="flex items-center space-x-2">
                <Wifi className="w-5 h-5" />
                <span>4:26 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Response Display */}
      {response && (
        <div className="fixed bottom-32 left-6 right-6 bg-black/90 border border-cyan-400 p-4 rounded-lg z-50">
          <div className="text-cyan-400 font-bold mb-2">JAILBREAK RESPONSE:</div>
          <div className="text-cyan-400">{response}</div>
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="text-cyan-400 text-xl animate-pulse">Processing...</div>
        </div>
      )}

      {/* Hidden elements */}
      <canvas ref={canvasRef} className="hidden" />
      <audio ref={audioRef} className="hidden" />

      <style jsx>{`
        @keyframes glitch-red {
          0% {
            transform: translateX(0);
          }
          20% {
            transform: translateX(-2px);
          }
          40% {
            transform: translateX(2px);
          }
          60% {
            transform: translateX(-1px);
          }
          80% {
            transform: translateX(1px);
          }
          100% {
            transform: translateX(0);
          }
        }
        @keyframes glitch-blue {
          0% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(1px);
          }
          50% {
            transform: translateX(-1px);
          }
          75% {
            transform: translateX(2px);
          }
          100% {
            transform: translateX(0);
          }
        }
        @keyframes glitch-yellow {
          0% {
            transform: translateX(0);
          }
          33% {
            transform: translateX(-3px);
          }
          66% {
            transform: translateX(3px);
          }
          100% {
            transform: translateX(0);
          }
        }
        @keyframes glitch-white {
          0% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(-1px);
          }
          100% {
            transform: translateX(1px);
          }
        }
        @keyframes glitch-green {
          0% {
            transform: translateX(0);
          }
          30% {
            transform: translateX(2px);
          }
          70% {
            transform: translateX(-2px);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  )
}
