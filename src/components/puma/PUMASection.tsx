"use client"
import { motion } from "framer-motion"

interface PUMASectionProps {
  title: string
  slogan: string
  cabinet: string
}

function PUMASection({ title, slogan, cabinet }: PUMASectionProps) {
  return (
    <section className="hidden md:flex items-center justify-center py-12 lg:py-16">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto border-l-[5px] border-primary/80 text-gray-800 pl-6"
      >
        <div className="space-y-3">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight uppercase bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600"
          >
            {title}
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-2xl md:text-3xl font-semibold capitalize text-gray-700"
          >
            {slogan}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-lg md:text-xl lg:text-2xl font-medium uppercase text-gray-600"
          >
            {cabinet}
          </motion.p>
        </div>
      </motion.div>
    </section>
  )
}

export default PUMASection

