"use client"
import MissionSection from "./MissionSection"
import { motion } from "framer-motion"

interface VisionAndMissionProps {
  visi: string
  misi: string[]
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
}

function VisionAndMission({ visi, misi }: VisionAndMissionProps) {
  return (
    <section className="py-20 relative">
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#B8841E]/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="mb-14 relative z-10"
      >
        <div className="flex items-center gap-3 mb-3">
          <span className="h-5 w-1 rounded-full bg-[#B8841E]" />
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B8841E]">Purpose & Direction</p>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-[#0D1B3E]">Vision & Mission</h2>
      </motion.div>

      <div className="space-y-6 relative z-10">
        {/* Vision */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="bg-[#0D1B3E] rounded-3xl p-8 md:p-12 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#B8841E]/10 rounded-full blur-3xl" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B8841E] mb-2">Vision</p>
              <h3 className="text-5xl md:text-6xl font-bold text-white/10 select-none">V</h3>
            </div>
            <div className="lg:col-span-9">
              <p className="text-white/85 text-xl leading-relaxed font-light italic">"{visi}"</p>
            </div>
          </div>
        </motion.div>

        {/* Mission */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_24px_rgba(13,27,62,0.06)] p-8 md:p-12 relative overflow-hidden"
        >
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#0D1B3E]/4 rounded-full blur-3xl" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B8841E] mb-2">Mission</p>
              <h3 className="text-5xl md:text-6xl font-bold text-[#0D1B3E]/10 select-none">M</h3>
            </div>
            <div className="lg:col-span-9">
              <MissionSection misi={misi} />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default VisionAndMission