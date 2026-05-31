"use client"
import { motion } from "framer-motion"

interface AboutProps {
  content: string
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
}

function About({ content }: AboutProps) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      className="py-20 relative"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#0D1B3E]/4 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-3">
          <span className="h-5 w-1 rounded-full bg-[#B8841E]" />
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B8841E]">Who We Are</p>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-[#0D1B3E] mb-10">About Us</h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_24px_rgba(13,27,62,0.06)] p-8 md:p-14 relative overflow-hidden group hover:shadow-[0_8px_40px_rgba(13,27,62,0.10)] transition-shadow duration-500"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#B8841E]/5 rounded-full blur-3xl group-hover:bg-[#B8841E]/8 transition-all duration-700" />
          <p className="relative text-[#3D4D6A] text-lg md:text-xl leading-[1.9] font-light tracking-wide">{content}</p>
        </motion.div>
      </div>
    </motion.section>
  )
}

export default About