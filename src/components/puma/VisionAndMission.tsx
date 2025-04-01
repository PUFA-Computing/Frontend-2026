"use client"
import MissionSection from "./MissionSection"
import { motion } from "framer-motion"

interface VisionAndMissionProps {
  visi: string
  misi: string[]
}

function VisionAndMission({ visi, misi }: VisionAndMissionProps) {
  return (
    <section className="mx-auto w-full max-w-7xl py-16 px-4 lg:px-0">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 relative inline-block">
          VISION AND MISSION
          <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-gray-800 to-gray-400 transform -translate-y-2"></span>
        </h2>
      </motion.div>

      <div className="space-y-20">
        {/* Vision Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-8 md:grid-cols-3 items-start"
        >
          <div className="md:sticky md:top-24">
            <div className="relative">
              <h2 className="text-6xl md:text-7xl font-bold text-gray-800 bg-clip-text text-transparent bg-gradient-to-br from-gray-800 to-gray-500">
                Visi
              </h2>
              <div className="absolute -bottom-4 left-0 w-16 h-1 bg-gradient-to-r from-gray-800 to-transparent"></div>
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-gray-800">
              <p className="text-xl md:text-2xl font-medium text-gray-700 leading-relaxed">{visi}</p>
            </div>
          </div>
        </motion.div>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-8 md:grid-cols-3 items-start"
        >
          <div className="md:sticky md:top-24">
            <div className="relative">
              <h2 className="text-6xl md:text-7xl font-bold text-gray-800 bg-clip-text text-transparent bg-gradient-to-br from-gray-800 to-gray-500">
                Misi
              </h2>
              <div className="absolute -bottom-4 left-0 w-16 h-1 bg-gradient-to-r from-gray-800 to-transparent"></div>
            </div>
          </div>
          <div className="md:col-span-2">
            <MissionSection misi={misi} />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default VisionAndMission