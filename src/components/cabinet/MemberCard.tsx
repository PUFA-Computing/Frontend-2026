"use client"

import type React from "react"

import Link from "next/link"
import Image, { type StaticImageData } from "next/image"
import { motion } from "framer-motion"
import { Instagram, Linkedin, ExternalLink } from "lucide-react"
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
      whileHover={{ y: -5 }}
    >
      <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
        {/* Image container */}
        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Main image */}
          <div className="aspect-[3/4] relative">
            <Image
              src={image || "/placeholder.svg"}
              alt={`${name}'s Photo`}
              fill
              className="object-cover object-center transition-transform duration-500 ease-out"
              style={{
                transform: isHovered ? "scale(1.05)" : "scale(1)",
              }}
            />

            {/* Gradient overlay */}
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300"
              style={{
                opacity: isHovered ? 1 : 0,
              }}
            />
          </div>

          {/* Social media overlay */}
          {(linkedin || instagram) && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center gap-4 z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {linkedin && (
                <Link href={linkedin as string} target="_blank" rel="noopener noreferrer">
                  <motion.div
                    className="bg-white/90 p-3 rounded-full shadow-md hover:bg-green-50 transition-colors duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Linkedin className="w-5 h-5 text-green-600" />
                  </motion.div>
                </Link>
              )}

              {instagram && (
                <Link href={instagram as string} target="_blank" rel="noopener noreferrer">
                  <motion.div
                    className="bg-white/90 p-3 rounded-full shadow-md hover:bg-green-50 transition-colors duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Instagram className="w-5 h-5 text-green-600" />
                  </motion.div>
                </Link>
              )}
            </motion.div>
          )}

          {/* Position badge */}
          <div className="absolute bottom-0 left-0 right-0 px-4 py-2">
            <motion.div
              className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full inline-block shadow-sm"
              initial={{ y: 40, opacity: 0 }}
              animate={{
                y: isHovered ? 0 : 40,
                opacity: isHovered ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-xs font-medium text-green-700">{position}</p>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-grow flex flex-col justify-between">
          <div className="text-center">
            <h3 className="font-semibold text-lg text-slate-800 mb-1">{name}</h3>
            <p className="text-sm text-slate-500 hidden md:block">{position}</p>
          </div>

          {/* View profile button */}
          <motion.div className="mt-4 text-center" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="#"
              className="inline-flex items-center justify-center text-sm text-green-600 hover:text-green-700 font-medium"
            >
              <span>View Profile</span>
              <ExternalLink className="ml-1 w-3 h-3" />
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default MemberCard

