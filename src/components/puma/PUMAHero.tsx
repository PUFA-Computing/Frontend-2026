"use client"
import { motion } from "framer-motion"
import Image from "next/image"

interface PUMAHeroProps {
  image: string
  logo: string
  title: string
  slogan: string
  cabinet: string
}

export default function PUMAHero({ image, logo, title, slogan, cabinet }: PUMAHeroProps) {
  return (
    <div className="relative w-full min-h-[90vh] flex items-center overflow-hidden bg-[#0D1B3E] mb-12">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={image}
          alt={`${title} Background`}
          fill
          className="object-cover opacity-25"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D1B3E] via-[#0D1B3E]/80 to-[#0D1B3E]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B3E] via-transparent to-transparent" />
      </div>

      {/* Decorative orbs */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[#B8841E]/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-[#0D1B3E]/50 blur-[100px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 container mx-auto max-w-6xl px-6 pt-10 flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-16">
        {/* Logo + glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="flex-shrink-0 flex flex-col items-center lg:items-start"
        >
          <div className="relative w-36 h-36 md:w-48 md:h-48">
            <div className="absolute inset-0 rounded-[2rem] bg-[#B8841E]/20 blur-2xl animate-pulse" />
            <div className="relative z-10 w-full h-full bg-white/5 backdrop-blur-sm rounded-[2rem] border border-white/10 p-5 flex items-center justify-center">
              <Image
                src={logo}
                alt={`${title} Logo`}
                fill
                className="object-contain p-5"
              />
            </div>
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
          className="flex-1"
        >
          <span className="inline-block mb-5 px-4 py-1.5 rounded-full border border-[#B8841E]/40 bg-[#B8841E]/10 text-[#d4a84b] text-[10px] font-bold uppercase tracking-[0.25em]">
            Computing Student Association
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-4">{title}</h1>
          <div className="h-0.5 w-16 bg-[#B8841E] rounded-full mb-5" />
          <p className="text-white/70 text-lg md:text-xl font-light italic mb-4 leading-relaxed">{slogan}</p>
          <p className="text-[#B8841E] text-sm font-semibold uppercase tracking-[0.2em]">{cabinet}</p>
        </motion.div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
        <svg className="relative block w-full h-16 md:h-24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118,130.83,119.5,193.39,105.7,236.4,96,279.3,77.5,321.39,56.44Z" fill="#F8F9FC" />
        </svg>
      </div>
    </div>
  )
}

