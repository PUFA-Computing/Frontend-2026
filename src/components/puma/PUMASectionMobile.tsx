"use client"

import Image from "next/image"
import { motion } from "framer-motion"

interface PUMASectionMobileProps {
  logo: string
  title: string
  slogan: string
  cabinet: string
}

function PUMASectionMobile({ logo, title, slogan, cabinet }: PUMASectionMobileProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex items-center justify-center py-8 md:hidden gap-6 px-4"
    >
      <div className="relative w-[100px] h-[100px]">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Image
            src={logo || "/placeholder.svg"}
            alt={`${title}'s Logo`}
            width={1080}
            height={1920}
            className="object-contain drop-shadow-md"
          />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="border-l-4 border-gray-800/80 pl-4 py-2"
      >
        <div className="space-y-2">
          <h1 className="font-extrabold uppercase text-2xl text-gray-800 tracking-tight">{title}</h1>
          <h2 className="text-base font-semibold text-gray-700 leading-tight">{slogan}</h2>
          <p className="text-sm font-medium uppercase text-gray-600">{cabinet}</p>
        </div>
      </motion.div>
    </motion.section>
  )
}

export default PUMASectionMobile

