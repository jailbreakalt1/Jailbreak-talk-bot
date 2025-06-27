// Matrix Rain Effect
class MatrixRain {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId)
    this.ctx = this.canvas.getContext("2d")
    this.jailbreakText = "JAILBREAK"
    this.fontSize = 16
    this.drops = []
    this.colors = []

    this.init()
    this.animate()

    window.addEventListener("resize", () => this.handleResize())
  }

  init() {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight

    const columns = this.canvas.width / this.fontSize

    for (let x = 0; x < columns; x++) {
      this.drops[x] = 1
      this.colors[x] = Math.random() > 0.5 ? "#00ffff" : "#ff0000"
    }
  }

  draw() {
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.03)"
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    this.ctx.font = this.fontSize + "px monospace"

    for (let i = 0; i < this.drops.length; i++) {
      if (Math.random() > 0.98) {
        this.colors[i] = Math.random() > 0.5 ? "#00ffff" : "#ff0000"
      }

      this.ctx.fillStyle = this.colors[i]
      this.ctx.shadowColor = this.colors[i]
      this.ctx.shadowBlur = 10

      const text = this.jailbreakText[Math.floor(Math.random() * this.jailbreakText.length)]
      this.ctx.fillText(text, i * this.fontSize, this.drops[i] * this.fontSize)

      if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.975) {
        this.drops[i] = 0
      }
      this.drops[i]++
    }

    this.ctx.shadowBlur = 0
  }

  animate() {
    this.draw()
    setTimeout(() => this.animate(), 25)
  }

  handleResize() {
    this.init()
  }
}

// Glitch Effect
class GlitchEffect {
  constructor(overlayId) {
    this.overlay = document.getElementById(overlayId)
    this.isActive = false
    this.glitchPhase = 0
  }

  start() {
    if (this.isActive) return
    this.isActive = true
    this.glitchCycle()
  }

  stop() {
    this.isActive = false
    this.overlay.classList.remove("active")
    this.clearGlitchBars()
  }

  glitchCycle() {
    if (!this.isActive) return

    this.glitchPhase = 1
    this.overlay.classList.add("active")
    this.createGlitchBars()

    setTimeout(() => {
      this.glitchPhase = 0
      this.overlay.classList.remove("active")
      this.clearGlitchBars()

      setTimeout(() => {
        if (this.isActive) this.glitchCycle()
      }, 1000)
    }, 2000)
  }

  createGlitchBars() {
    this.clearGlitchBars()

    const colors = ["red", "blue", "yellow", "white", "green"]
    const barCount = 5

    for (let i = 0; i < barCount; i++) {
      const bar = document.createElement("div")
      bar.className = `glitch-bar glitch-${colors[i % colors.length]}`
      bar.style.top = `${Math.random() * 100}%`
      bar.style.height = `${Math.random() * 3 + 1}px`
      bar.style.animationDuration = `${Math.random() * 0.1 + 0.05}s`
      this.overlay.appendChild(bar)
    }
  }

  clearGlitchBars() {
    const bars = this.overlay.querySelectorAll(".glitch-bar")
    bars.forEach((bar) => bar.remove())
  }
}

// Particle Text Effect
class ParticleText {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId)
    this.ctx = this.canvas.getContext("2d")
    this.particles = []
    this.isGlitching = false
    this.isSoundWave = false

    this.canvas.width = 800
    this.canvas.height = 200

    this.createTextParticles()
    this.animate()
  }

  createTextParticles() {
    this.ctx.font = "bold 120px Arial"
    this.ctx.fillStyle = "#ff0000"
    this.ctx.textAlign = "center"
    this.ctx.fillText("JAILBREAK", this.canvas.width / 2, this.canvas.height / 2 + 40)

    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
    const pixels = imageData.data

    this.particles = []

    for (let y = 0; y < this.canvas.height; y += 4) {
      for (let x = 0; x < this.canvas.width; x += 4) {
        const index = (y * this.canvas.width + x) * 4
        const alpha = pixels[index + 3]

        if (alpha > 128) {
          this.particles.push({
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

  setGlitching(isGlitching) {
    this.isGlitching = isGlitching
  }

  setSoundWave(isSoundWave) {
    this.isSoundWave = isSoundWave
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    const time = Date.now() * 0.005

    this.particles.forEach((particle) => {
      let targetX = particle.originalX
      let targetY = particle.originalY

      if (this.isSoundWave) {
        const waveAmplitude = 15
        const waveFrequency = 0.02
        const waveSpeed = time * 2

        targetX += Math.sin(particle.originalY * waveFrequency + waveSpeed + particle.waveOffset) * waveAmplitude
        targetY +=
          Math.cos(particle.originalX * waveFrequency + waveSpeed + particle.waveOffset) * (waveAmplitude * 0.5)
      }

      if (this.isGlitching) {
        const glitchIntensity = 30
        const glitchSpeed = time * 8

        targetX += Math.sin(glitchSpeed + particle.glitchOffset) * glitchIntensity * Math.random()
        targetY += Math.cos(glitchSpeed + particle.glitchOffset * 1.5) * glitchIntensity * Math.random()

        if (Math.random() > 0.95) {
          particle.color = Math.random() > 0.5 ? "#ff0000" : "#00ffff"
        }
      }

      particle.targetX = targetX
      particle.targetY = targetY

      const dx = particle.targetX - particle.currentX
      const dy = particle.targetY - particle.currentY

      particle.vx += dx * 0.02
      particle.vy += dy * 0.02

      particle.vx *= 0.95
      particle.vy *= 0.95

      particle.currentX += particle.vx
      particle.currentY += particle.vy

      if (!this.isGlitching && !this.isSoundWave) {
        particle.currentX += (Math.random() - 0.5) * 0.5
        particle.currentY += (Math.random() - 0.5) * 0.5
      }

      this.ctx.save()
      this.ctx.globalAlpha = particle.opacity
      this.ctx.shadowColor = particle.color
      this.ctx.shadowBlur = this.isGlitching ? 20 : this.isSoundWave ? 12 : 15
      this.ctx.fillStyle = particle.color
      this.ctx.beginPath()
      this.ctx.arc(particle.currentX, particle.currentY, particle.size, 0, Math.PI * 2)
      this.ctx.fill()
      this.ctx.restore()
    })

    requestAnimationFrame(() => this.animate())
  }
}

// Initialize effects when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.matrixRain = new MatrixRain("matrixCanvas")
  window.glitchEffect = new GlitchEffect("glitchOverlay")
  window.particleText = new ParticleText("particleCanvas")
})
