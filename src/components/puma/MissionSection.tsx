"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface MissionSectionProps {
  misi: string[]
}

export default function MissionSection({ misi }: MissionSectionProps) {
  const [active, setActive] = useState(0)

  const prev = () => setActive((i) => (i - 1 + misi.length) % misi.length)
  const next = () => setActive((i) => (i + 1) % misi.length)

  return (
    <div className="space-y-6">
      {/* Carousel view */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-[#F8F9FC] rounded-2xl p-7 border border-gray-100 min-h-[140px] flex flex-col justify-between"
          >
            <p className="text-[#3D4D6A] text-base leading-relaxed font-light">{misi[active]}</p>
            <div className="flex items-center justify-between mt-5">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B8841E]">
                Mission {String(active + 1).padStart(2, "0")} / {String(misi.length).padStart(2, "0")}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={prev}
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#0D1B3E] hover:border-[#0D1B3E] hover:text-white transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={next}
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#0D1B3E] hover:border-[#0D1B3E] hover:text-white transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5 justify-center">
        {misi.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === active ? "w-8 bg-[#B8841E]" : "w-2 bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>

      {/* All missions list */}
      <details className="group">
        <summary className="text-xs font-semibold text-[#8A9AB7] uppercase tracking-[0.15em] cursor-pointer hover:text-[#0D1B3E] transition-colors list-none flex items-center gap-2 pt-2">
          <span className="flex-1 h-px bg-gray-200" />
          <span>View all missions</span>
          <ChevronRight className="w-3.5 h-3.5 group-open:rotate-90 transition-transform" />
          <span className="flex-1 h-px bg-gray-200" />
        </summary>
        <div className="mt-4 space-y-3">
          {misi.map((item, i) => (
            <div key={i} className="flex gap-4 items-start p-4 rounded-xl bg-[#F8F9FC] border border-gray-100">
              <span className="flex-shrink-0 mt-0.5 w-6 h-6 rounded-full bg-[#0D1B3E] text-white text-[10px] font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <p className="text-[#3D4D6A] text-sm leading-relaxed font-light">{item}</p>
            </div>
          ))}
        </div>
      </details>
    </div>
  )
}