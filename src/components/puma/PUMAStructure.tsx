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

export default function PUMAStructure({ divisions, color1, color2 }: PUMAStructureProps) {
  return (
    <section className="mx-auto max-w-7xl py-16">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 relative inline-block">
          DIVISIONS
          <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-gray-800 to-gray-400 transform -translate-y-2"></span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 px-4 md:px-6">
        {divisions.map((division, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <PUMAStructureCard
              division={division.division}
              description={division.description}
              color1={color1}
              color2={color2}
            />
          </motion.div>
        ))}
      </div>
    </section>
  )
}

