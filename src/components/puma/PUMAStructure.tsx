"use client"
import PUMAStructureCard from "./PUMAStructureCard"
import { motion } from "framer-motion"

interface PUMAStructureProps {
  divisions: {
    division: string
    description: string
  }[]
  color1?: string
  color2?: string
}

export default function PUMAStructure({ divisions }: PUMAStructureProps) {
  return (
    <section className="py-20 relative">
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#0D1B3E]/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="mb-14 relative z-10"
      >
        <div className="flex items-center gap-3 mb-3">
          <span className="h-5 w-1 rounded-full bg-[#B8841E]" />
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B8841E]">Organization</p>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-[#0D1B3E]">Divisions</h2>
        <p className="text-[#5A6B8A] mt-3 text-base font-light max-w-lg">Our organizational divisions working together to serve and empower Computing students.</p>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 relative z-10">
        {divisions.map((division, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            viewport={{ once: true }}
            className="h-full"
          >
            <PUMAStructureCard
              division={division.division}
              description={division.description}
              index={index}
            />
          </motion.div>
        ))}
      </div>
    </section>
  )
}


