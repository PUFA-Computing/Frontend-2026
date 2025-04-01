"use client"
import { motion } from "framer-motion"

interface PUMAStructureCardProps {
  division: string
  description: string
  color1?: string
  color2?: string
}

export default function PUMAStructureCard({ division, description, color1, color2 }: PUMAStructureCardProps) {
  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, ${color1}, ${color2})`,
  }

  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      transition={{ duration: 0.2 }}
      className="rounded-xl bg-white p-6 shadow-lg border border-gray-100 h-full"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="h-6 w-6 rounded-full shadow-inner" style={gradientStyle}></div>
        <h3 className="text-xl font-bold uppercase text-gray-800 tracking-wide">{division}</h3>
      </div>

      <div className="h-px w-full bg-gradient-to-r from-gray-200 to-transparent mb-4"></div>

      <p className="text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
  )
}
