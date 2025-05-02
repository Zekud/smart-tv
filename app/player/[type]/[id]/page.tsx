"use client"

import { useRouter } from "next/navigation"
import VideoPlayerPage from "@/components/video-player-page"

interface PlayerPageProps {
  params: {
    type: string
    id: string
  }
}

export default function PlayerPage({ params }: PlayerPageProps) {
  const router = useRouter()
  const videoType = params.type === "live" ? "live" : "recorded"

  const handleBack = () => {
    router.back()
  }

  return <VideoPlayerPage videoType={videoType} videoId={params.id} onBack={handleBack} />
}
