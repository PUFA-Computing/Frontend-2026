"use client"

import Image from "next/image"
import { motion } from "framer-motion"

interface LogoSectionProps {
  image: string
  title: string
  description: string | React.ReactNode
}

export default function LogoSection({ image, title, description }: LogoSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="mx-auto max-w-7xl py-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 relative inline-block">
          Logo Philosophy
          <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-gray-800 to-gray-400 transform -translate-y-2"></span>
        </h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        viewport={{ once: true }}
        className="flex flex-col lg:flex-row items-center gap-10 mt-10"
      >
        <div className="relative w-[250px] h-[250px] flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl transform rotate-3"></div>
          <Image
            src={image || "/placeholder.svg"}
            alt={`${title}'s logo`}
            height={250}
            width={250}
            className="relative z-10 h-[250px] w-[250px] object-contain p-4 rounded-2xl bg-black"
          />
        </div>

        <div className="flex flex-col items-center lg:items-start space-y-6 max-w-2xl">
          <h3 className="inline-block rounded-lg border-2 border-gray-800 px-6 py-3 text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-700 text-white">
            {title}
          </h3>
          <div className="text-lg sm:text-xl text-gray-700 leading-relaxed">{description}</div>
        </div>
      </motion.div>
    </motion.section>
  )
}

