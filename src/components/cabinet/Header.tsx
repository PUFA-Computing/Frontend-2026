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
    <section className="relative w-full overflow-hidden bg-[#F5EDD0]">

      {/* ══════════════════════════════════════
          MOBILE LAYOUT  (hidden on lg+)
          Order: text block first → image below
      ══════════════════════════════════════ */}
      <div className="lg:hidden">

        {/* 1. Text block */}
        <motion.div
          className="relative bg-gradient-to-b from-[#EDE0BB]/80 to-[#F5EDD0] px-5 pt-24 pb-7"
          initial={{ opacity: 0, y: -8 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          {/* Back + badge row */}
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/cabinet/forcasion"
              className="inline-flex items-center border border-[#B8841E]/30 bg-[#FAF5E8]/70 px-3 py-1.5 text-xs font-serif font-medium text-[#0D1B3E] transition-all hover:bg-[#B8841E]/10"
            >
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
              Cabinet
            </Link>
            <div className="border border-[#B8841E]/30 bg-[#FAF5E8]/60 px-3 py-1">
              <p className="font-serif text-[9px] tracking-[0.2em] font-medium text-[#B8841E] uppercase">Division Spotlight</p>
            </div>
          </div>

          {/* Title */}
          <h1 className="font-display italic text-[2.7rem] leading-[1.0] text-[#0D1B3E] mb-4">
            {title}
          </h1>

          {/* Ornamental rule */}
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-[#B8841E]/50 to-transparent" />
            <span className="text-[#B8841E]/50 text-[10px]">✦</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#B8841E]/20" />
          </div>

          {/* Description */}
          <p className="font-serif text-[13.5px] leading-relaxed text-[#1A1A2E]/65">
            {description}
          </p>
        </motion.div>

        {/* 2. Image block */}
        <motion.div
          className="relative w-full px-5 pb-10"
          initial={{ opacity: 0, y: 12 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.18 }}
        >
          <div className="relative">
            {/* Editorial frame */}
            <div className="absolute -inset-1 border border-[#B8841E]/20" />

            {image2 ? (
              /* CnM — horizontal split */
              <div className="relative flex" style={{ aspectRatio: '16/9' }}>
                {/* Left */}
                <div className="relative flex-1 overflow-hidden bg-[#EDE0BB]">
                  <OptimizedImage
                    src={image} alt={`${title} — Communication`}
                    width={720} height={960}
                    className="w-full h-full object-cover object-top"
                    priority placeholder="blur" sizes="50vw"
                  />
                  <div className="absolute inset-0 bg-[#0D1B3E]/15" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0D1B3E]/65 to-transparent px-3 pb-2.5 pt-6">
                    <p className="font-display italic text-[#F5EDD0]/90 text-xs">Communication</p>
                  </div>
                </div>
                <div className="w-0.5 bg-[#F5EDD0] flex-shrink-0" />
                {/* Right */}
                <div className="relative flex-1 overflow-hidden bg-[#EDE0BB]">
                  <OptimizedImage
                    src={image2} alt={`${title} — Multimedia`}
                    width={720} height={960}
                    className="w-full h-full object-cover object-top"
                    priority placeholder="blur" sizes="50vw"
                  />
                  <div className="absolute inset-0 bg-[#0D1B3E]/15" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0D1B3E]/65 to-transparent px-3 pb-2.5 pt-6">
                    <p className="font-display italic text-[#F5EDD0]/90 text-xs">Multimedia</p>
                  </div>
                </div>
                {/* C&M floating label */}
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 bg-[#FAF5E8]/90 border border-[#B8841E]/30 px-2.5 py-0.5 z-10">
                  <p className="font-serif text-[9px] tracking-[0.18em] text-[#B8841E] uppercase whitespace-nowrap">C & M</p>
                </div>
              </div>
            ) : (
              /* Single image with overlay caption */
              <div className="relative w-full overflow-hidden bg-[#EDE0BB]" style={{ aspectRatio: '4/3' }}>
                <OptimizedImage
                  src={image || "/placeholder.svg"} alt={`${title} Division`}
                  width={1080} height={720}
                  className="w-full h-full object-cover object-top"
                  priority placeholder="blur" sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B3E]/55 via-[#0D1B3E]/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-10">
                  <p className="font-display italic text-[#F5EDD0]/90 text-base">{title} Division</p>
                </div>
              </div>
            )}

            {/* Gold corner accents */}
            <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-[#B8841E]/60" />
            <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-[#B8841E]/60" />
          </div>
        </motion.div>
      </div>

      {/* ══════════════════════════════════════
          DESKTOP LAYOUT  (hidden below lg)
          Left: text | Right: image
      ══════════════════════════════════════ */}
      <div className="hidden lg:block">
        <div className="relative bg-gradient-to-b from-[#EDE0BB]/80 to-[#F5EDD0] pt-32 pb-16">
          {/* Corner ornaments */}
          <div className="absolute top-28 left-8 w-12 h-12 border-l border-t border-[#B8841E]/40" />
          <div className="absolute top-28 right-8 w-12 h-12 border-r border-t border-[#B8841E]/40" />

          <div className="container mx-auto px-6 max-w-7xl">
            {/* Back button */}
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={isLoaded ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="mb-10"
            >
              <Link
                href="/cabinet/forcasion"
                className="inline-flex items-center border border-[#B8841E]/30 bg-[#FAF5E8]/60 px-4 py-2 text-sm font-serif font-medium text-[#0D1B3E] transition-all hover:bg-[#B8841E]/10"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Cabinet
              </Link>
            </motion.div>

            <div className="grid grid-cols-2 gap-20 items-center">
              {/* Text */}
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, x: -20 }}
                animate={isLoaded ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div>
                  <div className="inline-block border border-[#B8841E]/30 bg-[#FAF5E8]/60 px-4 py-1.5 mb-5">
                    <p className="font-serif text-xs tracking-[0.2em] font-medium text-[#B8841E] uppercase">Division Spotlight</p>
                  </div>
                  <h1 className="font-display italic text-6xl xl:text-7xl text-[#0D1B3E] leading-[0.95] mb-4">
                    {title}
                  </h1>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-px w-16 bg-gradient-to-r from-[#B8841E]/40 to-transparent" />
                    <span className="text-[#B8841E]/50 text-xs">✦</span>
                    <div className="h-px w-16 bg-gradient-to-l from-[#B8841E]/40 to-transparent" />
                  </div>
                </div>
                <p className="font-serif text-base lg:text-lg text-[#1A1A2E]/70 leading-relaxed max-w-xl">
                  {description}
                </p>
              </motion.div>

              {/* Image */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.7, delay: 0.35 }}
              >
                <div className="absolute -inset-3 border border-[#B8841E]/15" />

                {image2 ? (
                  <div className="relative flex gap-3" style={{ maxHeight: '480px' }}>
                    <div className="relative flex-1 bg-[#FAF5E8] flex items-center justify-center overflow-hidden" style={{ minHeight: '320px' }}>
                      <OptimizedImage src={image} alt={`${title} — Communication`} width={720} height={720}
                        className="w-full h-full object-contain" priority placeholder="blur" sizes="25vw" />
                      <div className="absolute inset-0 bg-[#0D1B3E]/5 mix-blend-multiply pointer-events-none" />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0D1B3E]/60 to-transparent px-3 pb-3 pt-8">
                        <p className="font-display italic text-[#F5EDD0]/90 text-sm">Communication</p>
                      </div>
                    </div>
                    <div className="w-px bg-[#B8841E]/30 flex-shrink-0" />
                    <div className="relative flex-1 bg-[#FAF5E8] flex items-center justify-center overflow-hidden" style={{ minHeight: '320px' }}>
                      <OptimizedImage src={image2} alt={`${title} — Multimedia`} width={720} height={720}
                        className="w-full h-full object-contain" priority placeholder="blur" sizes="25vw" />
                      <div className="absolute inset-0 bg-[#0D1B3E]/5 mix-blend-multiply pointer-events-none" />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0D1B3E]/60 to-transparent px-3 pb-3 pt-8">
                        <p className="font-display italic text-[#F5EDD0]/90 text-sm">Multimedia</p>
                      </div>
                    </div>
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-[#FAF5E8]/90 border border-[#B8841E]/30 px-3 py-1">
                      <p className="font-serif text-[10px] tracking-[0.18em] text-[#B8841E] uppercase whitespace-nowrap">Communication & Multimedia</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative overflow-hidden" style={{ minHeight: '360px', maxHeight: '480px' }}>
                    <OptimizedImage src={image || "/placeholder.svg"} alt={`${title} Division`}
                      width={1080} height={720} className="w-full h-full object-cover object-top"
                      priority placeholder="blur" sizes="50vw" />
                    <div className="absolute inset-0 bg-[#0D1B3E]/10 mix-blend-multiply pointer-events-none" />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0D1B3E]/60 to-transparent px-5 pb-4 pt-10">
                      <p className="font-display italic text-[#F5EDD0]/90 text-lg">{title} Division</p>
                    </div>
                  </div>
                )}

                <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[#B8841E]/50" />
                <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#B8841E]/50" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}
