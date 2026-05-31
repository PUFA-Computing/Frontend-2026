"use client"

import Image from "next/image"
import { motion } from "framer-motion"

interface LogoSectionProps {
  image: string
  title: string
  description: string | React.ReactNode
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
}

export default function LogoSection({ image, title, description }: LogoSectionProps) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      className="py-20 relative"
    >
      {/* Section label */}
      <div className="flex items-center gap-3 mb-3">
        <span className="h-5 w-1 rounded-full bg-[#B8841E]" />
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B8841E]">Identity</p>
      </div>
      <h2 className="text-4xl md:text-5xl font-bold text-[#0D1B3E] mb-12">Logo Philosophy</h2>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        viewport={{ once: true }}
        className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_24px_rgba(13,27,62,0.06)] overflow-hidden"
      >
        <div className="flex flex-col lg:flex-row">
          {/* Logo panel */}
          <div className="lg:w-72 flex-shrink-0 bg-[#0D1B3E] flex items-center justify-center p-12">
            <div className="relative w-40 h-40 group">
              <div className="absolute inset-0 rounded-2xl bg-[#B8841E]/25 blur-2xl group-hover:bg-[#B8841E]/40 transition-all duration-700" />
              <div className="relative z-10 w-full h-full bg-white/10 rounded-2xl border border-white/15 backdrop-blur-sm p-4 flex items-center justify-center">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${title} logo`}
                  fill
                  className="object-contain p-4 transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            </div>
          </div>

          {/* Description panel */}
          <div className="flex-1 p-8 md:p-12">
            <h3 className="text-xl md:text-2xl font-bold text-[#0D1B3E] mb-6 leading-snug">{title}</h3>
            <div className="text-[#3D4D6A] text-base leading-relaxed font-light">{description}</div>
          </div>
        </div>
      </motion.div>
    </motion.section>
  )
}


