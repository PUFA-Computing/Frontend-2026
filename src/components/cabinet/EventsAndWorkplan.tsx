"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar } from "lucide-react"

interface EventsAndWorkplanProps {
  buttons: string[]
}

export default function EventsAndWorkplan({ buttons }: EventsAndWorkplanProps) {
  const [activeButton, setActiveButton] = useState<number | null>(null)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-[#FAF5E8]">
      {/* Subtle background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-[#B8841E]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-16 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-14">
            <motion.div
              className="inline-flex items-center justify-center border border-[#B8841E]/30 bg-[#F5EDD0]/60 px-4 py-1.5 shadow-parch-sm mb-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Calendar className="h-4 w-4 text-[#B8841E] mr-2" />
              <span className="font-serif text-xs tracking-[0.2em] font-medium text-[#B8841E] uppercase">Program Schedule</span>
            </motion.div>

            <motion.h2
              className="font-display italic text-5xl md:text-6xl text-[#0D1B3E] mb-5"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Events & Workplan
            </motion.h2>

            {/* Ornamental rule */}
            <motion.div
              className="flex items-center justify-center gap-3 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#B8841E]/40" />
              <span className="text-[#B8841E]/50 text-xs">✦</span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#B8841E]/40" />
            </motion.div>

            <motion.p
              className="font-serif text-[#1A1A2E]/60 max-w-xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Explore our upcoming events and activities curated for this academic year.
            </motion.p>
          </div>

          {/* Program grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {buttons.map((button, index) => (
              <motion.button
                key={index}
                variants={itemVariants}
                onClick={() => setActiveButton(index === activeButton ? null : index)}
                className={`w-full text-center px-6 py-4 font-serif text-sm tracking-wide border transition-all duration-300
                  ${activeButton === index
                    ? "bg-[#0D1B3E] text-[#F5EDD0] border-[#0D1B3E] shadow-parch-lg"
                    : "bg-[#F5EDD0]/60 text-[#0D1B3E] border-[#B8841E]/25 hover:border-[#B8841E]/60 hover:bg-[#B8841E]/5 hover:shadow-parch-sm"
                  }`}
              >
                {button}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
