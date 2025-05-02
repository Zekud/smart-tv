"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"

interface MaintenanceScreenProps {
  onBack: () => void
}

export default function MaintenanceScreen({ onBack }: MaintenanceScreenProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="relative w-96 h-96 mx-auto">
          <Image
            src="/placeholder.svg?height=400&width=400"
            alt="Maintenance"
            width={400}
            height={400}
            className="w-full h-full object-contain"
          />
        </div>

        <h1 className="text-3xl font-bold mt-8 mb-4">This section is currently under maintenance</h1>

        <p className="text-xl text-gray-400 mb-8 max-w-2xl">
          We're working hard to improve your experience. Please check back later.
        </p>

        <motion.button
          className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-medium"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
        >
          <ArrowLeft size={20} />
          Go Back
        </motion.button>
      </motion.div>
    </div>
  )
}
