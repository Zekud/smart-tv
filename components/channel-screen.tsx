"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, Clock, Bell, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChannelScreenProps {
  onWatchStream: () => void;
  onWatchPlanned: () => void;
  onWatchMyVideo: () => void;
}

export default function ChannelScreen({
  onWatchStream,
  onWatchPlanned,
  onWatchMyVideo,
}: ChannelScreenProps) {
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
        <div className="flex-1 relative">
          <div className="relative w-full ">
            <Image
              src="/images/vid-background.png"
              alt="Channel Banner"
              width={1000}
              height={500}
              className="w-full h-full object-cover"
            />
            {/* Left-to-right gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent"></div>

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

              <div className="flex items-center gap-4 mb-6">
                <div className="flex -space-x-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-black overflow-hidden"
                    >
                      <Image
                        src={`/images/nav9.png`}
                        alt={`User ${i + 1}`}
                        width={32}
                        height={32}
                      />
                    </div>
                  ))}
                </div>
                <span className="text-gray-300">30+ Online</span>
              </div>

              <div className="flex gap-4">
                <motion.button
                  className="bg-green-500 text-white px-6 py-3 rounded-full font-medium text-lg flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onWatchStream}
                >
                  <Play size={20} />
                  Join to Stream
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* My Videos section as full-width footer */}
      <div className="w-full p-4">
        <h3 className="text-xl font-bold mb-4 px-4">My Videos</h3>
        <div className="grid grid-cols-4 gap-4 px-4">
          {myVideos.map((video) => (
            <motion.div
              key={video.id}
              className="rounded-lg overflow-hidden cursor-pointer relative focus-visible:outline-primary focus-visible:outline-2 focus-visible:outline"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onWatchMyVideo}
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
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
