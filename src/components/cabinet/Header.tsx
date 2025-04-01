"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"

interface HeaderProps {
  title: string
  description: string
  image: string
}

export default function Header({ title, description, image }: HeaderProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full -mr-32 -mt-32 opacity-70" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-50 rounded-full -ml-48 -mb-48 opacity-70" />
        <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-green-400 rounded-full" />
        <div className="absolute top-1/4 right-1/3 w-6 h-6 bg-green-200 rounded-full" />
        <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-green-300 rounded-full" />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
      </div>

      <div className="container mx-auto px-4 md:px-8 lg:px-12 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
          {/* Text content */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={isLoaded ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center space-x-2 text-green-600">
              <div className="h-px w-8 bg-green-600"></div>
              <span className="text-sm font-medium uppercase tracking-wider">Division Spotlight</span>
            </div>

            <div className="relative pl-5 md:pl-8 border-l-4 border-green-500">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-wide text-slate-800 mb-2">
                {title}
              </h1>

              <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-extralight uppercase tracking-wider text-slate-400">
                  Division
                </h2>

                <p className="text-base md:text-lg text-slate-600 max-w-md leading-relaxed">{description}</p>
              </div>
            </div>

            <motion.div
              className="pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {/* <button className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-300 group">
                Learn More
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button> */}
            </motion.div>
          </motion.div>

          {/* Image container */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <div className="relative z-20 rounded-lg overflow-hidden shadow-2xl">
              <Image
                src={image || "/placeholder.svg"}
                alt={`${title} Division`}
                width={1080}
                height={720}
                className="w-full h-auto object-cover rounded-lg"
              />

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-tr from-green-900/20 to-transparent pointer-events-none"></div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 border-4 border-green-500 rounded-lg z-10"></div>
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-green-100 rounded-lg z-10"></div>

            {/* Dots pattern (replacing the DOTTED image) */}
            <div className="absolute -bottom-12 -left-12 w-48 h-48 z-0">
              <div className="grid grid-cols-6 gap-2">
                {[...Array(36)].map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-green-300"></div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

