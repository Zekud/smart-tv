"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ThumbsUp,
  Clock,
  Bell,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PlayerScreenProps {
  onBack: () => void;
  type: "live" | "planned" | "my-videos";
  onOpenFullPlayer?: (type: "live" | "recorded", id?: string) => void;
}

export default function PlayerScreen({
  onBack,
  type = "live",
  onOpenFullPlayer,
}: PlayerScreenProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("2:17:25");
  const [showReminder, setShowReminder] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [focusedCategory, setFocusedCategory] = useState("stream-destpek");
  const categories = [
    {
      id: "stream-destpek",
      label: "Stream Destpek",
      src: "/images/sidebar-1.jpg",
    },
    { id: "tv-channels", label: "TV Channels", src: "/images/sidebar-2.jpg" },
    { id: "live-streams", label: "Live Streams", src: "/images/sidebar-3.jpg" },
  ];

  const myVideos = [
    {
      id: "1",
      title: "Video Title",
      date: "12.12.2023",
      thumbnail:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-02%20135332-TmOAy5QI6a0LjBKNDuwPeNx16OyDKb.png",
    },
    {
      id: "2",
      title: "Video Title",
      date: "12.12.2023",
      thumbnail:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-02%20135332-TmOAy5QI6a0LjBKNDuwPeNx16OyDKb.png",
    },
    {
      id: "3",
      title: "Video Title",
      date: "12.12.2023",
      thumbnail:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-02%20135332-TmOAy5QI6a0LjBKNDuwPeNx16OyDKb.png",
    },
    {
      id: "4",
      title: "Video Title",
      date: "12.12.2023",
      thumbnail:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-02%20135332-TmOAy5QI6a0LjBKNDuwPeNx16OyDKb.png",
    },
  ];

  // Simulate video progress
  useEffect(() => {
    if (isPlaying && type === "my-videos") {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsPlaying(false);
            return 100;
          }

          // Update current time based on progress
          const totalSeconds = 2 * 60 * 60 + 17 * 60 + 25; // 2:17:25
          const currentSeconds = Math.floor((prev / 100) * totalSeconds);
          const minutes = Math.floor(currentSeconds / 60) % 60;
          const hours = Math.floor(currentSeconds / 3600);
          const seconds = currentSeconds % 60;

          if (hours > 0) {
            setCurrentTime(
              `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
                .toString()
                .padStart(2, "0")}`
            );
          } else {
            setCurrentTime(`${minutes}:${seconds.toString().padStart(2, "0")}`);
          }

          return prev + 0.05;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isPlaying, type]);

  // Auto-hide controls after inactivity
  useEffect(() => {
    if (showControls && type === "my-videos") {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }

      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 5000);
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [showControls, type]);

  const handleUserActivity = () => {
    setShowControls(true);
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || type !== "my-videos") return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const newProgress = (clickPosition / rect.width) * 100;

    setProgress(Math.min(100, Math.max(0, newProgress)));
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const handleOpenFullPlayer = () => {
    if (onOpenFullPlayer) {
      if (type === "live") {
        onOpenFullPlayer("live", "1");
      } else if (type === "my-videos") {
        onOpenFullPlayer("recorded", "1");
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar with categories */}
        <div className="w-64 pr-6">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              className={cn(
                "mb-4 rounded-xl cursor-pointer transition-all overflow-hidden",
                focusedCategory === category.id
                  ? "ring-2 ring-white ring-opacity-50"
                  : "hover:ring-2 hover:ring-white hover:ring-opacity-25"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFocusedCategory(category.id)}
            >
              <div className="relative rounded-xl w-full aspect-video">
                <Image
                  src={category.src}
                  alt={category.label}
                  width={256}
                  height={144}
                  className="object-cover w-full h-full rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-75 rounded-xl"></div>
                <h3 className="absolute bottom-0 left-0 w-full p-4 text-lg font-medium text-white">
                  {category.label}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main content area */}
        <div
          className="flex-1 relative"
          onMouseMove={handleUserActivity}
          onClick={handleUserActivity}
        >
          {/* Video content with left-to-right gradient overlay */}
          <div className="relative w-full h-full">
            {type === "my-videos" ? (
              <>
                <div
                  className="w-full h-full cursor-pointer"
                  onClick={handleOpenFullPlayer}
                >
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    poster="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Player%20%284%29-e79xVLl9FAoOgGx7b5qhzHMJcSqVyy.png"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                </div>
                {/* Left side content overlay for My Videos */}
                <div className="absolute left-0 top-0 bottom-0 w-1/3 flex flex-col justify-between p-8">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Image
                        src="/placeholder.svg?height=40&width=40"
                        alt="Italian Flag"
                        width={40}
                        height={40}
                        className="rounded"
                      />
                    </div>
                    <h1 className="text-4xl font-bold mb-2">HOMEMADE</h1>
                    <h2 className="text-3xl font-bold mb-1">Italian Recipes</h2>
                    <p className="text-lg text-gray-300 mb-4">
                      FOR ALL THE FAMILY
                    </p>

                    <div className="mt-8">
                      <Image
                        src="/placeholder.svg?height=200&width=200"
                        alt="Pasta dish"
                        width={200}
                        height={200}
                        className="rounded"
                      />
                      <h3 className="text-xl font-bold mt-2">Ragù bolognese</h3>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div
                  className="w-full h-full cursor-pointer"
                  onClick={type === "live" ? handleOpenFullPlayer : undefined}
                >
                  <Image
                    src={
                      type === "live"
                        ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-02%20135332-TmOAy5QI6a0LjBKNDuwPeNx16OyDKb.png"
                        : "/images/vid-background.png"
                    }
                    alt="Channel Banner"
                    width={1920}
                    height={1080}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Left-to-right gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent"></div>
              </>
            )}

            {/* Channel info for Live and Planned */}
            {type !== "my-videos" && (
              <div className="absolute top-0 left-0 p-8 w-1/2">
                <h1 className="text-5xl font-bold mb-2">Channel Name</h1>
                <h2 className="text-2xl text-gray-300 mb-4">Owner Name</h2>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2 bg-gray-700 bg-opacity-80 px-4 py-2 rounded-lg">
                    <ThumbsUp size={20} />
                    <span className="font-medium">159K</span>
                  </div>

                  <div className="bg-gray-700 bg-opacity-80 px-4 py-2 rounded-lg">
                    12+
                  </div>

                  <div className="bg-gray-700 bg-opacity-80 px-4 py-2 rounded-lg">
                    Life Style
                  </div>
                </div>

                {type === "live" && (
                  <>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex -space-x-2">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <div
                            key={i}
                            className="w-8 h-8 rounded-full border-2 border-black overflow-hidden"
                          >
                            <Image
                              src={`/placeholder.svg?height=32&width=32`}
                              alt={`User ${i + 1}`}
                              width={32}
                              height={32}
                            />
                          </div>
                        ))}
                      </div>
                      <span className="text-gray-300">30+ Online</span>
                    </div>

                    <button
                      className="bg-green-500 text-white px-6 py-3 rounded-full font-medium text-lg flex items-center gap-2"
                      onClick={handleOpenFullPlayer}
                    >
                      <Play size={20} />
                      Join to Stream
                    </button>
                  </>
                )}

                {type === "planned" && (
                  <button
                    className="bg-primary text-white px-6 py-3 rounded-full font-medium text-lg flex items-center gap-2"
                    onClick={() => setShowReminder(true)}
                  >
                    <Clock size={20} />
                    Next Streaming
                  </button>
                )}
              </div>
            )}

            {/* Video controls for My Videos */}
            {type === "my-videos" && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 p-4"
                initial={{ opacity: 1, y: 0 }}
                animate={{
                  opacity: showControls ? 1 : 0,
                  y: showControls ? 0 : 20,
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Progress bar */}
                <div
                  ref={progressBarRef}
                  className="relative w-full h-2 mb-4 cursor-pointer"
                  onClick={handleProgressBarClick}
                >
                  <div className="absolute top-0 left-0 right-0 h-full bg-gray-700 rounded-full">
                    <div
                      className="h-full bg-red-600 rounded-full"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div
                    className="absolute top-1/2 h-4 w-4 bg-white rounded-full -translate-y-1/2"
                    style={{ left: `${progress}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-gray-300 text-sm">Past Stream</div>

                  <div className="flex items-center gap-6">
                    {/* Skip back 15s */}
                    <motion.button
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-white bg-opacity-20"
                      whileHover={{
                        scale: 1.1,
                        backgroundColor: "rgba(255, 255, 255, 0.3)",
                      }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <div className="relative">
                        <SkipBack size={20} />
                        <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-bold">
                          15
                        </span>
                      </div>
                    </motion.button>

                    {/* Play/Pause */}
                    <motion.button
                      className="w-12 h-12 flex items-center justify-center rounded-full bg-white bg-opacity-20 border border-white border-opacity-40"
                      whileHover={{
                        scale: 1.1,
                        backgroundColor: "rgba(255, 255, 255, 0.3)",
                      }}
                      whileTap={{ scale: 0.9 }}
                      onClick={togglePlayPause}
                    >
                      {isPlaying ? (
                        <Pause size={24} />
                      ) : (
                        <Play size={24} className="ml-1" />
                      )}
                    </motion.button>

                    {/* Skip forward 15s */}
                    <motion.button
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-white bg-opacity-20"
                      whileHover={{
                        scale: 1.1,
                        backgroundColor: "rgba(255, 255, 255, 0.3)",
                      }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <div className="relative">
                        <SkipForward size={20} />
                        <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-bold">
                          15
                        </span>
                      </div>
                    </motion.button>
                  </div>

                  <div className="text-gray-300 text-sm">{duration}</div>
                </div>

                <div className="mt-2 flex justify-between">
                  <h2 className="text-lg font-medium">Streaming Title</h2>
                  <div className="flex items-center gap-2">
                    <Eye size={16} />
                    <span className="text-sm">159K</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* My Videos section as full-width footer */}
      {type !== "my-videos" && (
        <div className="w-full p-4">
          <div className="bg-gray-800 bg-opacity-50 px-4 py-2 rounded-md inline-block mb-4">
            <h3 className="text-xl font-bold">My Videos</h3>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {myVideos.map((video, index) => (
              <div
                key={index}
                className="rounded-lg overflow-hidden cursor-pointer relative focus-visible:outline-primary focus-visible:outline-2 focus-visible:outline"
                onClick={() => {
                  if (onOpenFullPlayer) {
                    onOpenFullPlayer("recorded", `${index + 1}`);
                  }
                }}
              >
                <div className="relative w-full h-40">
                  <Image
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    width={280}
                    height={160}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-0 left-0 right-0 p-3">
                    <h4 className="font-medium">{video.title}</h4>
                    <p className="text-sm text-gray-300">{video.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reminder popup */}
      <AnimatePresence>
        {showReminder && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              // Close when clicking outside the popup
              if (e.target === e.currentTarget) {
                setShowReminder(false);
              }
            }}
          >
            <motion.div
              className="bg-gray-800 rounded-lg p-6 w-96 shadow-xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="flex justify-center mb-4">
                <Clock size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-center mb-2">
                Next Streaming Title
              </h3>
              <p className="text-center text-gray-400 mb-4">Tomorrow</p>
              <p className="text-center text-2xl font-bold mb-6">18:00</p>

              <motion.button
                className="w-full bg-white bg-opacity-20 text-white py-2 rounded-full flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowReminder(false)}
              >
                <Bell size={20} />
                Remind me
              </motion.button>

              <div className="mt-6 flex items-center justify-center gap-2">
                <div className="flex -space-x-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-gray-800 overflow-hidden"
                    >
                      <Image
                        src={`/placeholder.svg?height=32&width=32`}
                        alt={`User ${i + 1}`}
                        width={32}
                        height={32}
                      />
                    </div>
                  ))}
                </div>
                <span className="text-gray-400">30+ Waiting</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
