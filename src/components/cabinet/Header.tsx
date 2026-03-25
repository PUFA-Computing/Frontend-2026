"use client"

import OptimizedImage from "@/components/ui/OptimizedImage"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface HeaderProps {
  title: string
  description: string
  image: string
  image2?: string
}

export default function Header({ title, description, image, image2 }: HeaderProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <section className="relative w-full flex flex-col items-center justify-center pt-32 pb-16 overflow-hidden bg-[#F5EDD0]">
      {/* Parchment gradient bg */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#EDE0BB]/80 to-[#F5EDD0]" />

      {/* Corner ornaments */}
      <div className="absolute top-28 left-8 w-12 h-12 border-l border-t border-[#B8841E]/40 hidden md:block" />
      <div className="absolute top-28 right-8 w-12 h-12 border-r border-t border-[#B8841E]/40 hidden md:block" />

      <div className="relative container mx-auto px-6 max-w-7xl z-10">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={isLoaded ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <Link
            href="/cabinet/forcasion"
            className="inline-flex items-center rounded-none border border-[#B8841E]/30 bg-[#FAF5E8]/60 px-4 py-2 text-sm font-serif font-medium text-[#0D1B3E] transition-all hover:bg-[#B8841E]/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cabinet
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* Text */}
          <motion.div
            className="space-y-8 text-center lg:text-left"
            initial={{ opacity: 0, x: -20 }}
            animate={isLoaded ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div>
              <div className="inline-block border border-[#B8841E]/30 bg-[#FAF5E8]/60 px-4 py-1.5 shadow-parch-sm mb-6">
                <p className="font-serif text-xs tracking-[0.2em] font-medium text-[#B8841E] uppercase">Division Spotlight</p>
              </div>
              <h1 className="font-display italic text-5xl md:text-6xl lg:text-7xl text-[#0D1B3E] leading-[0.95] mb-4">
                {title}
              </h1>
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-8">
                <div className="h-px w-16 bg-gradient-to-r from-[#B8841E]/40 to-transparent" />
                <span className="text-[#B8841E]/50 text-xs">✦</span>
                <div className="h-px w-16 bg-gradient-to-l from-[#B8841E]/40 to-transparent" />
              </div>
            </div>
            <p className="font-serif text-base md:text-lg text-[#1A1A2E]/70 leading-relaxed max-w-xl mx-auto lg:mx-0 text-balance">
              {description}
            </p>
          </motion.div>

          {/* Image — dual panel for CnM, single for others */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.35 }}
          >
            <div className="absolute -inset-3 border border-[#B8841E]/15 hidden md:block" />

            {image2 ? (
              /* ── Split-panel for Communication & Multimedia ── */
              <div className="relative flex gap-3" style={{ maxHeight: '480px' }}>
                {/* Left panel — Mulmed */}
                <div className="relative flex-1 bg-[#FAF5E8] flex items-center justify-center overflow-hidden rounded-sm" style={{ minHeight: '320px' }}>
                  <OptimizedImage
                    src={image}
                    alt={`${title} — Communication`}
                    width={720}
                    height={720}
                    className="w-full h-full object-contain"
                    priority={true}
                    placeholder="blur"
                    sizes="25vw"
                  />
                  <div className="absolute inset-0 bg-[#0D1B3E]/5 mix-blend-multiply pointer-events-none" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0D1B3E]/60 to-transparent px-3 pb-3 pt-8">
                    <p className="font-display italic text-[#F5EDD0]/90 text-sm">Communication</p>
                  </div>
                </div>
                {/* Divider */}
                <div className="w-px bg-[#B8841E]/30 flex-shrink-0" />
                {/* Right panel — Com */}
                <div className="relative flex-1 bg-[#FAF5E8] flex items-center justify-center overflow-hidden rounded-sm" style={{ minHeight: '320px' }}>
                  <OptimizedImage
                    src={image2}
                    alt={`${title} — Multimedia`}
                    width={720}
                    height={720}
                    className="w-full h-full object-contain"
                    priority={true}
                    placeholder="blur"
                    sizes="25vw"
                  />
                  <div className="absolute inset-0 bg-[#0D1B3E]/5 mix-blend-multiply pointer-events-none" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0D1B3E]/60 to-transparent px-3 pb-3 pt-8">
                    <p className="font-display italic text-[#F5EDD0]/90 text-sm">Multimedia</p>
                  </div>
                </div>
                {/* Floating badge */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-[#FAF5E8]/90 border border-[#B8841E]/30 px-3 py-1 shadow-parch-sm">
                  <p className="font-serif text-[10px] tracking-[0.2em] text-[#B8841E] uppercase whitespace-nowrap">Communication & Multimedia</p>
                </div>
              </div>
            ) : (
              /* ── Single image for all other divisions ── */
              <div className="relative overflow-hidden" style={{ minHeight: '360px' }}>
                <OptimizedImage
                  src={image || "/placeholder.svg"}
                  alt={`${title} Division`}
                  width={1080}
                  height={720}
                  className="w-full h-full object-cover"
                  priority={true}
                  placeholder="blur"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-[#0D1B3E]/10 mix-blend-multiply pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0D1B3E]/60 to-transparent px-5 pb-4 pt-10">
                  <p className="font-display italic text-[#F5EDD0]/90 text-lg">{title} Division</p>
                </div>
              </div>
            )}

            {/* Gold corner accents */}
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[#B8841E]/50" />
            <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#B8841E]/50" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
