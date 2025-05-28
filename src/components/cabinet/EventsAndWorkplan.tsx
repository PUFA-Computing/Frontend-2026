"use client"

import { useState } from "react"
import Button from "@/components/Button"
import { motion } from "framer-motion"
import { Calendar, ArrowRight } from "lucide-react"

interface EventsAndWorkplanProps {
  buttons: string[]
}

export default function EventsAndWorkplan({ buttons }: EventsAndWorkplanProps) {
  const [activeButton, setActiveButton] = useState<number | null>(null)

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-white to-green-50"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-green-100 rounded-full -mr-32 -mt-32 opacity-30"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-100 rounded-full -ml-48 -mb-48 opacity-30"></div>

      <div className="container mx-auto px-4 md:px-8 lg:px-16 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-12">
            <motion.div
              className="inline-flex items-center justify-center mb-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Calendar className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-sm font-medium uppercase tracking-wider text-green-600">Program Schedule</span>
            </motion.div>

            <motion.h2
              className="text-3xl md:text-4xl font-bold text-slate-800 mb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Events and Workplan
            </motion.h2>

            <motion.div
              className="w-20 h-1 bg-green-600 mx-auto rounded-full mb-6"
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            ></motion.div>

            <motion.p
              className="text-slate-600 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Explore our upcoming events and activities planned for this year.SOP
            </motion.p>
          </div>

          {/* Buttons grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {buttons.map((button, index) => (
              <motion.div key={index} variants={itemVariants} className="flex">
                <Button
                  variant={activeButton === index ? "primary" : "outline"}
                  size="lg"
                  className="w-full text-center justify-center group"
                  onClick={() => setActiveButton(index)}
                  // icon={<ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
                >
                  <span className="font-medium">{button}</span>
                </Button>
              </motion.div>
            ))}
          </motion.div>

          {/* View all events button */}
          <motion.div
            className="mt-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            {/* <Button variant="ghost" size="md" className="mx-auto">
              View All Events
            </Button> */}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

