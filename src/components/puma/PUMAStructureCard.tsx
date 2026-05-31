"use client"
import { motion } from "framer-motion"

interface PUMAStructureCardProps {
  division: string
  description: string
  color1?: string
  color2?: string
  index?: number
}

export default function PUMAStructureCard({ division, description, index = 0 }: PUMAStructureCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(13,27,62,0.06)] h-full overflow-hidden group hover:shadow-[0_12px_40px_rgba(13,27,62,0.12)] transition-shadow duration-500"
    >
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[#0D1B3E] to-[#B8841E]" />

      <div className="p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-[#0D1B3E]/5 flex items-center justify-center">
            <span className="text-[#B8841E] font-bold text-xs">{String(index + 1).padStart(2, "0")}</span>
          </div>
          <h3 className="text-[#0D1B3E] font-bold text-base leading-snug uppercase tracking-wide group-hover:text-[#B8841E] transition-colors duration-300">
            {division}
          </h3>
        </div>

        <div className="h-px bg-gradient-to-r from-gray-200 to-transparent mb-4" />

        <p className="text-[#5A6B8A] text-sm leading-relaxed font-light">{description}</p>
      </div>
    </motion.div>
  )
}
