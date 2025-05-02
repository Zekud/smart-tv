"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Play, Clock, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface HomeScreenProps {
  onChannelSelect: (videoId?: string) => void;
  onWatchStream: (type: "live" | "planned" | "my-videos") => void;
  onOpenFullPlayer: (type: "live" | "recorded", id?: string) => void;
}

export default function HomeScreen({
  onChannelSelect,
  onWatchStream,
  onOpenFullPlayer,
}: HomeScreenProps) {
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

  const mainCat = [
    {
      id: "stream-destpek",
      label: "Stream Destpek",
      src: "/images/planned.png",
    },
    {
      id: "tv-channels",
      label: "TV Channels",
      src: "/images/vid-bg-right.png",
    },
    { id: "live-streams", label: "Live Streams", src: "/images/plannd2.png" },
    {
      id: "new-category",
      label: "New Category",
      src: "/images/planned.png",
    },
    {
      id: "another-category",
      label: "Another Category",
      src: "/images/vid-bg-right.png",
    },
    {
      id: "more-categories",
      label: "More Categories",
      src: "/images/plannd2.png",
    },
  ];

  return (
    <div className="w-full h-full pt-4 px-6">
      <div className="flex">
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
        <div className="flex-1">
          <div className="bg-gray-800 bg-opacity-50 px-4 py-2 rounded-md inline-block mb-6">
            <h2 className="text-xl font-bold">Featured Content</h2>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {mainCat.map((category, index) => (
              <motion.div
                key={index}
                className="rounded-lg overflow-hidden cursor-pointer relative"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (index % 3 === 0) {
                    // For live content, go to channel screen first
                    onChannelSelect(`${index + 1}`);
                  } else if (index % 3 === 1) {
                    onWatchStream("planned");
                  } else {
                    onOpenFullPlayer("recorded", `${index + 1}`);
                  }
                }}
              >
                <div className="relative w-full ">
                  <Image
                    src={category.src}
                    alt={`Featured content ${index + 1}`}
                    width={520}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                  {/* Gradient overlay from left (lighter) to right (darker) */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to to-black/85"></div>

                  {/* Channel info at the TOP RIGHT */}
                  <div className="absolute top-0 right-0 p-3 text-right">
                    <h3 className="text-lg font-medium">Channel Name</h3>
                    <div className="flex items-center mt-1 gap-2 justify-end">
                      <div className="flex items-center gap-1 bg-gray-700 bg-opacity-80 text-xs px-2 py-1 rounded">
                        <ThumbsUp size={12} />
                        <span>159K</span>
                      </div>
                      <div className="bg-gray-700 bg-opacity-80 text-xs px-2 py-1 rounded">
                        {index % 2 === 0 ? "Life Style" : "Politic"}
                      </div>
                    </div>
                  </div>

                  {index % 3 === 0 && (
                    <div className="absolute top-3 left-3 bg-red-600 text-white text-xs px-2 py-1 rounded">
                      LIVE
                    </div>
                  )}

                  {/* Time indicator or Watch Now button */}
                  <div className="absolute bottom-3 right-3">
                    {index % 3 === 0 ? (
                      <button className="flex items-center gap-1.5 bg-red-600 text-white text-sm px-3 py-1.5 rounded-full">
                        <Play size={14} className="ml-0.5" />
                        Watch Now
                      </button>
                    ) : (
                      <div className="bg-gray-700 bg-opacity-80 text-white text-xs px-3 py-1.5 rounded-md flex items-center gap-1.5">
                        <Clock size={14} className="text-gray-300" />
                        Today 18:00
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
