"use client"
import { motion } from "framer-motion"

interface AboutProps {
  content: string
}

function About({ content }: AboutProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="flex flex-col items-center justify-center px-4 py-16 sm:py-20 lg:py-24"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 relative inline-block">
            About
            <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-gray-800 to-gray-400 transform -translate-y-2"></span>
          </h2>
        </div>

        <motion.article
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="prose prose-lg md:prose-xl lg:prose-2xl max-w-none text-gray-700 font-medium leading-relaxed"
        >
          {content}
        </motion.article>
      </div>
    </motion.section>
  )
}

export default About