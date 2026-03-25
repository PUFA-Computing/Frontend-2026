"use client"

import type React from "react"
import Link from "next/link"
import Image, { type StaticImageData } from "next/image"
import { motion } from "framer-motion"
import { Instagram, Linkedin } from "lucide-react"
import type { UrlObject } from "url"
import { useState } from "react"

interface MemberCardProps {
  image: string | StaticImageData
  name: string
  position: string
  instagram?: string | UrlObject
  linkedin?: string | UrlObject
}

const MemberCard: React.FC<MemberCardProps> = ({ image, name, position, instagram, linkedin }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4 }}
    >
      <div className="bg-[#FAF5E8] border border-[#B8841E]/20 overflow-hidden transition-all duration-300 hover:border-[#B8841E]/50 hover:shadow-parch-md h-full flex flex-col">
        {/* Image */}
        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="aspect-[3/4] relative">
            <Image
              src={image || "/placeholder.svg"}
              alt={`${name}'s Photo`}
              fill
              className="object-cover object-center transition-transform duration-500 ease-out"
              style={{ transform: isHovered ? "scale(1.04)" : "scale(1)" }}
            />
            {/* Parchment tint */}
            <div className="absolute inset-0 bg-[#0D1B3E]/10 mix-blend-multiply pointer-events-none" />
            {/* Hover dark overlay */}
            <div
              className="absolute inset-0 bg-gradient-to-t from-[#0D1B3E]/70 to-transparent pointer-events-none transition-opacity duration-300"
              style={{ opacity: isHovered ? 1 : 0 }}
            />
          </div>

          {/* Social on hover */}
          {(linkedin || instagram) && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center gap-3 z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.25 }}
            >
              {linkedin && (
                <Link href={linkedin as string} target="_blank" rel="noopener noreferrer">
                  <motion.div
                    className="bg-[#FAF5E8]/90 border border-[#B8841E]/30 p-2.5 shadow-parch-sm hover:bg-[#F5EDD0] transition-colors duration-200"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Linkedin className="w-4 h-4 text-[#0D1B3E]" />
                  </motion.div>
                </Link>
              )}
              {instagram && (
                <Link href={instagram as string} target="_blank" rel="noopener noreferrer">
                  <motion.div
                    className="bg-[#FAF5E8]/90 border border-[#B8841E]/30 p-2.5 shadow-parch-sm hover:bg-[#F5EDD0] transition-colors duration-200"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Instagram className="w-4 h-4 text-[#0D1B3E]" />
                  </motion.div>
                </Link>
              )}
            </motion.div>
          )}

          {/* Position badge — visible on hover */}
          <motion.div
            className="absolute bottom-3 left-3 right-3 z-10"
            animate={{ y: isHovered ? 0 : 12, opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="bg-[#FAF5E8]/90 border border-[#B8841E]/20 px-3 py-1.5 inline-block">
              <p className="font-serif text-[11px] font-medium text-[#B8841E] uppercase tracking-wider">{position}</p>
            </div>
          </motion.div>
        </div>

        {/* Info */}
        <div className="px-5 py-4 flex-grow flex flex-col justify-between border-t border-[#B8841E]/15">
          <div className="text-center">
            <h3 className="font-display italic text-lg text-[#0D1B3E] leading-tight mb-1">{name}</h3>
            <p className="font-serif text-[11px] text-[#B8841E]/70 uppercase tracking-wider">{position}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default MemberCard
