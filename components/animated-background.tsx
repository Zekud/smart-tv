"use client"

import { useEffect, useRef } from "react"

export function AnimatedBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const appRef = useRef<any>(null)

  useEffect(() => {
    // Only import and initialize Pixi.js on the client side
    const initPixi = async () => {
      if (!containerRef.current) return

      try {
        // Dynamically import Pixi.js only on the client side
        const PIXI = await import("pixi.js")

        // Create Pixi Application
        const app = new PIXI.Application({
          width: window.innerWidth,
          height: window.innerHeight,
          backgroundColor: 0x000000,
          antialias: true,
          resolution: window.devicePixelRatio || 1,
          autoDensity: true,
        })

        appRef.current = app

        // Safely append the canvas to the DOM
        if (containerRef.current) {
          // In newer versions of PIXI, app.view is already the HTMLCanvasElement
          const canvas = app.view as HTMLCanvasElement
          containerRef.current.appendChild(canvas)
        }

        // Create gradient background
        const background = new PIXI.Graphics()
        background.beginFill(0x000000)
        background.drawRect(0, 0, app.screen.width, app.screen.height)
        background.endFill()
        app.stage.addChild(background)

        // Create animated particles
        const particlesContainer = new PIXI.Container()
        app.stage.addChild(particlesContainer)

        const particles: PIXI.Graphics[] = []
        const numParticles = 50

        for (let i = 0; i < numParticles; i++) {
          const particle = new PIXI.Graphics()
          const size = Math.random() * 4 + 1
          const alpha = Math.random() * 0.5 + 0.1

          particle.beginFill(0x00c853, alpha)
          particle.drawCircle(0, 0, size)
          particle.endFill()

          particle.x = Math.random() * app.screen.width
          particle.y = Math.random() * app.screen.height

          // Add custom properties for animation
          const particleExt = particle as PIXI.Graphics & {
            speedX: number
            speedY: number
            baseAlpha: number
            pulseSpeed: number
            pulseOffset: number
          }

          particleExt.speedX = (Math.random() - 0.5) * 0.5
          particleExt.speedY = (Math.random() - 0.5) * 0.5
          particleExt.baseAlpha = alpha
          particleExt.pulseSpeed = Math.random() * 0.02 + 0.01
          particleExt.pulseOffset = Math.random() * Math.PI * 2

          particlesContainer.addChild(particle)
          particles.push(particle)
        }

        // Add glow filter to particles container
        const blurFilter = new PIXI.BlurFilter()
        blurFilter.blur = 5
        blurFilter.quality = 5
        particlesContainer.filters = [blurFilter]

        // Animation loop
        app.ticker.add((delta) => {
          const time = app.ticker.lastTime / 1000

          particles.forEach((particle) => {
            const p = particle as PIXI.Graphics & {
              speedX: number
              speedY: number
              baseAlpha: number
              pulseSpeed: number
              pulseOffset: number
            }

            // Move particle
            p.x += p.speedX * delta
            p.y += p.speedY * delta

            // Pulse alpha
            p.alpha = p.baseAlpha * (0.5 + 0.5 * Math.sin(time * p.pulseSpeed + p.pulseOffset))

            // Wrap around screen
            if (p.x < -10) p.x = app.screen.width + 10
            if (p.x > app.screen.width + 10) p.x = -10
            if (p.y < -10) p.y = app.screen.height + 10
            if (p.y > app.screen.height + 10) p.y = -10
          })
        })

        // Handle resize
        const handleResize = () => {
          app.renderer.resize(window.innerWidth, window.innerHeight)
          background.clear()
          background.beginFill(0x000000)
          background.drawRect(0, 0, app.screen.width, app.screen.height)
          background.endFill()
        }

        window.addEventListener("resize", handleResize)

        return () => {
          window.removeEventListener("resize", handleResize)

          // Properly destroy the application
          if (app) {
            app.destroy(true, { children: true, texture: true, baseTexture: true })
          }

          // Safely remove the canvas
          if (containerRef.current && app.view) {
            try {
              containerRef.current.removeChild(app.view as HTMLCanvasElement)
            } catch (e) {
              console.log("Error removing canvas:", e)
            }
          }
        }
      } catch (error) {
        console.error("Error initializing PIXI.js:", error)
      }
    }

    initPixi()
  }, [])

  return <div ref={containerRef} className="pixi-container" />
}
