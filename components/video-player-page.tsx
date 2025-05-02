"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  ArrowLeft,
  Settings,
  ThumbsUp,
  MessageSquare,
  Share2,
  Eye,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface VideoPlayerPageProps {
  videoType: "live" | "recorded"
  videoId?: string
  onBack: () => void
}

export default function VideoPlayerPage({ videoType = "recorded", videoId = "1", onBack }: VideoPlayerPageProps) {
  const router = useRouter()
  const [isPlaying, setIsPlaying] = useState(true)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isBuffering, setIsBuffering] = useState(false)
  const [showInfo, setShowInfo] = useState(true)
  const [quality, setQuality] = useState("1080p")
  const [showSettings, setShowSettings] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const playerRef = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const volumeBarRef = useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const settingsRef = useRef<HTMLDivElement>(null)

  // Video metadata
  const videoData = {
    title: videoType === "live" ? "Live Cooking Show" : "Italian Pasta Masterclass",
    channel: "Cooking Channel",
    views: "159K",
    likes: "24K",
    comments: "1.2K",
    description:
      "Learn how to make authentic Italian pasta from a professional chef. This comprehensive masterclass covers everything from making fresh pasta dough to creating delicious sauces that complement your pasta perfectly. Chef Marco demonstrates traditional techniques passed down through generations.",
    tags: ["Cooking", "Italian", "Pasta", "Food"],
  }

  // Recommended videos
  const recommendedVideos = [
    {
      id: "1",
      title: "Pizza Making Masterclass",
      views: "98K",
      duration: "1:24:15",
      thumbnail: "/placeholder.svg?height=90&width=160",
    },
    {
      id: "2",
      title: "Italian Desserts",
      views: "76K",
      duration: "42:30",
      thumbnail: "/placeholder.svg?height=90&width=160",
    },
    {
      id: "3",
      title: "Risotto Techniques",
      views: "112K",
      duration: "38:45",
      thumbnail: "/placeholder.svg?height=90&width=160",
    },
    {
      id: "4",
      title: "Wine Pairing for Italian Food",
      views: "64K",
      duration: "55:20",
      thumbnail: "/placeholder.svg?height=90&width=160",
    },
  ]

  // Handle video events
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
      setProgress((video.currentTime / video.duration) * 100)
    }

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
    }

    const handlePlay = () => {
      setIsPlaying(true)
    }

    const handlePause = () => {
      setIsPlaying(false)
    }

    const handleWaiting = () => {
      setIsBuffering(true)
    }

    const handlePlaying = () => {
      setIsBuffering(false)
    }

    const handleVolumeChange = () => {
      setVolume(video.volume)
      setIsMuted(video.muted)
    }

    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("loadedmetadata", handleLoadedMetadata)
    video.addEventListener("play", handlePlay)
    video.addEventListener("pause", handlePause)
    video.addEventListener("waiting", handleWaiting)
    video.addEventListener("playing", handlePlaying)
    video.addEventListener("volumechange", handleVolumeChange)

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("loadedmetadata", handleLoadedMetadata)
      video.removeEventListener("play", handlePlay)
      video.removeEventListener("pause", handlePause)
      video.removeEventListener("waiting", handleWaiting)
      video.removeEventListener("playing", handlePlaying)
      video.removeEventListener("volumechange", handleVolumeChange)
    }
  }, [])

  // Auto-hide controls after inactivity
  useEffect(() => {
    if (showControls) {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }

      controlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false)
          setShowInfo(false)
        }
      }, 3000)
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [showControls, isPlaying])

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  // Handle clicks outside settings panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false)
      }
    }

    if (showSettings) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showSettings])

  // Handle user activity
  const handleUserActivity = () => {
    setShowControls(true)
    if (videoType === "recorded") {
      setShowInfo(true)
    }
  }

  // Toggle play/pause
  const togglePlayPause = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }

  // Toggle mute
  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !video.muted
    setIsMuted(!isMuted)
  }

  // Handle volume change
  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!volumeBarRef.current) return

    const rect = volumeBarRef.current.getBoundingClientRect()
    const clickPosition = e.clientX - rect.left
    const newVolume = Math.min(1, Math.max(0, clickPosition / rect.width))

    const video = videoRef.current
    if (video) {
      video.volume = newVolume
      setVolume(newVolume)
      if (newVolume === 0) {
        video.muted = true
        setIsMuted(true)
      } else if (isMuted) {
        video.muted = false
        setIsMuted(false)
      }
    }
  }

  // Handle progress bar click
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || videoType === "live") return

    const rect = progressBarRef.current.getBoundingClientRect()
    const clickPosition = e.clientX - rect.left
    const newProgress = (clickPosition / rect.width) * 100
    const newTime = (duration * newProgress) / 100

    const video = videoRef.current
    if (video) {
      video.currentTime = newTime
      setProgress(newProgress)
    }
  }

  // Skip forward/backward
  const handleSkip = (seconds: number) => {
    const video = videoRef.current
    if (!video || videoType === "live") return

    const newTime = Math.min(Math.max(0, video.currentTime + seconds), video.duration)
    video.currentTime = newTime
  }

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!playerRef.current) return

    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
    } else {
      document.exitFullscreen()
    }
  }

  // Format time (seconds to MM:SS or HH:MM:SS)
  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return "0:00"

    const hours = Math.floor(timeInSeconds / 3600)
    const minutes = Math.floor((timeInSeconds % 3600) / 60)
    const seconds = Math.floor(timeInSeconds % 60)

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div
      ref={playerRef}
      className={cn(
        "relative w-full h-full bg-black overflow-hidden",
        isFullscreen ? "fixed inset-0 z-50" : "",
        showDetails && !isFullscreen ? "overflow-y-auto" : "",
      )}
      onMouseMove={handleUserActivity}
      onClick={handleUserActivity}
    >
      {/* Video container */}
      <div className={cn("relative w-full", showDetails && !isFullscreen ? "h-[60vh]" : "h-full")}>
        {/* Video */}
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          poster={
            videoType === "live"
              ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Series%20%284%29.png-9guPUt9nMsLRoqgVnptc3yoUXzpC09.jpeg"
              : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Player%20%284%29-e79xVLl9FAoOgGx7b5qhzHMJcSqVyy.png"
          }
          autoPlay
          playsInline
          onClick={togglePlayPause}
          src={videoType === "live" ? undefined : undefined} // Add actual video sources when available
        />

        {/* Buffering indicator */}
        {isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Video info overlay (top) */}
        <motion.div
          className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/80 to-transparent"
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: showInfo ? 1 : 0, y: showInfo ? 0 : -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center" onClick={onBack}>
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold">{videoData.title}</h1>
              <p className="text-gray-300">{videoData.channel}</p>
            </div>
          </div>
        </motion.div>

        {/* Video controls overlay (bottom) */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent"
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : 20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Progress bar (only for recorded videos) */}
          {videoType === "recorded" && (
            <div
              ref={progressBarRef}
              className="relative w-full h-2 mb-4 cursor-pointer"
              onClick={handleProgressBarClick}
            >
              <div className="absolute top-0 left-0 right-0 h-full bg-gray-700 rounded-full">
                <div className="h-full bg-red-600 rounded-full" style={{ width: `${progress}%` }}></div>
              </div>
              <div
                className="absolute top-1/2 h-4 w-4 bg-white rounded-full -translate-y-1/2"
                style={{ left: `${progress}%` }}
              ></div>
            </div>
          )}

          {/* Controls row */}
          <div className="flex items-center justify-between">
            {/* Left controls */}
            <div className="flex items-center gap-4">
              {/* Play/Pause */}
              <button
                className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                onClick={togglePlayPause}
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
              </button>

              {/* Skip buttons (only for recorded videos) */}
              {videoType === "recorded" && (
                <>
                  <button
                    className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                    onClick={() => handleSkip(-15)}
                  >
                    <div className="relative">
                      <SkipBack size={20} />
                      <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-bold">
                        15
                      </span>
                    </div>
                  </button>

                  <button
                    className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                    onClick={() => handleSkip(15)}
                  >
                    <div className="relative">
                      <SkipForward size={20} />
                      <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-bold">
                        15
                      </span>
                    </div>
                  </button>
                </>
              )}

              {/* Volume control */}
              <div className="flex items-center gap-2">
                <button
                  className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                  onClick={toggleMute}
                >
                  {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>

                <div ref={volumeBarRef} className="relative w-24 h-2 cursor-pointer" onClick={handleVolumeChange}>
                  <div className="absolute top-0 left-0 right-0 h-full bg-gray-700 rounded-full">
                    <div
                      className="h-full bg-white rounded-full"
                      style={{ width: `${isMuted ? 0 : volume * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Time display (only for recorded videos) */}
              {videoType === "recorded" && (
                <div className="text-sm text-gray-300">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              )}

              {/* Live indicator */}
              {videoType === "live" && <div className="bg-red-600 text-white text-sm px-3 py-1 rounded-full">LIVE</div>}
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-4">
              {/* Video stats */}
              <div className="flex items-center gap-4 mr-4">
                <div className="flex items-center gap-1">
                  <Eye size={16} />
                  <span className="text-sm">{videoData.views}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsUp size={16} />
                  <span className="text-sm">{videoData.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare size={16} />
                  <span className="text-sm">{videoData.comments}</span>
                </div>
              </div>

              {/* Settings */}
              <button
                className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings size={20} />
              </button>

              {/* Share */}
              <button className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                <Share2 size={20} />
              </button>

              {/* Fullscreen toggle */}
              <button
                className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                onClick={toggleFullscreen}
              >
                {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
              </button>
            </div>
          </div>

          {/* Settings panel */}
          {showSettings && (
            <div
              ref={settingsRef}
              className="absolute bottom-20 right-6 bg-gray-900 rounded-lg p-4 w-64 max-h-[60vh] overflow-y-auto"
            >
              <h3 className="text-lg font-medium mb-2">Settings</h3>

              <div className="mb-4">
                <p className="text-sm text-gray-400 mb-1">Quality</p>
                <div className="flex flex-col gap-2">
                  {["1080p", "720p", "480p", "360p", "Auto"].map((q) => (
                    <button
                      key={q}
                      className={cn(
                        "text-left px-3 py-1.5 rounded hover:bg-white/10",
                        quality === q ? "bg-white/20" : "",
                      )}
                      onClick={() => setQuality(q)}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-1">Playback Speed</p>
                <div className="flex flex-col gap-2">
                  {["0.5x", "0.75x", "Normal", "1.25x", "1.5x", "2x"].map((speed) => (
                    <button key={speed} className="text-left px-3 py-1.5 rounded hover:bg-white/10">
                      {speed}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Video details section (scrollable) */}
      {!isFullscreen && (
        <div className="w-full bg-black">
          <button
            className="w-full py-3 flex items-center justify-center border-t border-gray-800 hover:bg-gray-900 transition-colors"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </button>

          {showDetails && (
            <div className="p-6 max-h-[40vh] overflow-y-auto">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">{videoData.title}</h2>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gray-700"></div>
                    <span className="font-medium">{videoData.channel}</span>
                  </div>
                  <button className="bg-red-600 text-white px-4 py-1 rounded-full text-sm">Subscribe</button>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {videoData.tags.map((tag) => (
                    <span key={tag} className="bg-gray-800 px-3 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="text-gray-300">{videoData.description}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">Recommended Videos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recommendedVideos.map((video) => (
                    <div key={video.id} className="flex gap-3 cursor-pointer hover:bg-gray-900 p-2 rounded-lg">
                      <div className="w-40 h-24 bg-gray-800 rounded overflow-hidden flex-shrink-0">
                        <img
                          src={video.thumbnail || "/placeholder.svg"}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">{video.title}</h4>
                        <p className="text-sm text-gray-400">{video.views} views</p>
                        <p className="text-sm text-gray-400">{video.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
