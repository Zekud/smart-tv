"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import HomeScreen from "@/components/home-screen";
import ChannelScreen from "@/components/channel-screen";
import PlayerScreen from "@/components/player-screen";
import MaintenanceScreen from "@/components/maintenance-screen";
import PlannedStreamsScreen from "@/components/planned-streams-screen";
import { KeyboardNavigation } from "@/components/keyboard-navigation";
import { AnimatedBackground } from "@/components/animated-background";

export default function Home() {
  const router = useRouter();
  const [currentScreen, setCurrentScreen] = useState("planned-streams"); // Changed from "home" to "planned-streams"
  const [activeNavItem, setActiveNavItem] = useState("stream"); // Set "stream" as active by default
  const [playerType, setPlayerType] = useState<
    "live" | "planned" | "my-videos"
  >("live");
  const [selectedVideoId, setSelectedVideoId] = useState<string>("1");

  // Simulate TV remote control navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
        case "ArrowDown":
        case "ArrowLeft":
        case "ArrowRight":
          // Handle navigation between focusable elements
          break;
        case "Enter":
          // Handle selection
          break;
        case "Escape":
        case "Backspace":
          // Handle back navigation
          if (currentScreen !== "home") {
            setCurrentScreen("home");
            setActiveNavItem("destpek"); // Reset active nav item when going back to home
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentScreen]);

  // Handle navigation item selection
  const handleNavigation = (item: string) => {
    setActiveNavItem(item);
    if (item === "stream") {
      setCurrentScreen("planned-streams");
    } else if (item === "maintenance") {
      setCurrentScreen("maintenance");
    } else {
      setCurrentScreen("home");
    }
  };

  // Handle channel selection
  const handleChannelSelect = (videoId?: string) => {
    if (videoId) {
      setSelectedVideoId(videoId);
    }
    setCurrentScreen("channel");
  };

  // Handle watch stream
  const handleWatchStream = (type: "live" | "planned" | "my-videos") => {
    setPlayerType(type);
    setCurrentScreen("player");
  };

  // Navigate to full video player
  const navigateToVideoPlayer = (type: "live" | "recorded", id = "1") => {
    router.push(`/player/${type}/${id}`);
  };

  return (
    <main className="relative w-full h-screen overflow-hidden">
      <AnimatedBackground />
      <KeyboardNavigation>
        <Navbar activeItem={activeNavItem} onNavigate={handleNavigation} />

        {currentScreen === "home" && (
          <HomeScreen
            onChannelSelect={handleChannelSelect}
            onWatchStream={handleWatchStream}
            onOpenFullPlayer={navigateToVideoPlayer}
          />
        )}

        {currentScreen === "channel" && (
          <ChannelScreen
            onWatchStream={() => navigateToVideoPlayer("live", selectedVideoId)}
            onWatchPlanned={() => handleWatchStream("planned")}
            onWatchMyVideo={() => navigateToVideoPlayer("recorded")}
          />
        )}

        {currentScreen === "player" && (
          <PlayerScreen
            onBack={() => setCurrentScreen("channel")}
            type={playerType}
            onOpenFullPlayer={navigateToVideoPlayer}
          />
        )}

        {currentScreen === "maintenance" && (
          <MaintenanceScreen onBack={() => setCurrentScreen("home")} />
        )}

        {currentScreen === "planned-streams" && (
          <PlannedStreamsScreen
            onChannelSelect={handleChannelSelect}
            onWatchLive={(videoId) => handleChannelSelect(videoId)}
            onWatchPlanned={() => handleWatchStream("planned")}
          />
        )}
      </KeyboardNavigation>
    </main>
  );
}
