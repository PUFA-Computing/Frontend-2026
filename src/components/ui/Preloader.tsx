"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Logo from "@/assets/PUComSci.png"

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Only show preloader once per session
    const hasLoaded = sessionStorage.getItem("pufa_has_loaded")
    
    if (hasLoaded) {
      setIsLoading(false)
      return
    }

    // Set a timer for the preloader duration (e.g., 2.5 seconds)
    const timer = setTimeout(() => {
      setIsLoading(false)
      sessionStorage.setItem("pufa_has_loaded", "true")
    }, 2500)

    // Force scroll to top while loading
    window.scrollTo(0, 0)
    document.body.style.overflow = 'hidden'
    
    return () => {
      clearTimeout(timer)
      document.body.style.overflow = 'unset'
    }
  }, [])

  return (
    <AnimatePresence onExitComplete={() => { document.body.style.overflow = 'unset' }}>
      {isLoading && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#F5EDD0] overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ 
            y: "-100%", 
            opacity: 0,
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
          }}
        >
          {/* Parchment background texture */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#EDE0BB]/80 to-[#F5EDD0]" />
          
          {/* Decorative ornaments */}
          <div className="absolute top-8 left-8 w-16 h-16 border-l border-t border-[#B8841E]/40" />
          <div className="absolute top-8 right-8 w-16 h-16 border-r border-t border-[#B8841E]/40" />
          <div className="absolute bottom-8 left-8 w-16 h-16 border-l border-b border-[#B8841E]/40" />
          <div className="absolute bottom-8 right-8 w-16 h-16 border-r border-b border-[#B8841E]/40" />

          {/* Central content */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Logo Sequence */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, filter: "blur(10px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="relative w-24 h-24 sm:w-32 sm:h-32 mb-8 bg-[#0D1B3E] rounded-2xl p-4 border-2 border-[#B8841E]/40 shadow-parch-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-[#B8841E]/20 to-transparent rounded-2xl mix-blend-overlay" />
              <Image
                src={Logo}
                alt="PUFA Computing Logo"
                fill
                className="object-contain p-2"
                priority
              />
            </motion.div>

            {/* Typography Sequence */}
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.33, 1, 0.68, 1] }}
                className="font-display italic text-4xl sm:text-5xl md:text-6xl text-[#0D1B3E]"
              >
                PUFA Computing
              </motion.h1>
            </div>

            {/* Decorative divider */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8, ease: "easeInOut" }}
              className="flex items-center gap-3 mt-6"
            >
              <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-[#B8841E]/50 origin-right" />
              <span className="text-[#B8841E] text-xs animate-pulse">✦</span>
              <div className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-[#B8841E]/50 origin-left" />
            </motion.div>

            {/* Loading text indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="mt-8 font-serif text-[10px] sm:text-xs tracking-[0.3em] uppercase text-[#1A1A2E]/50"
            >
              <span className="animate-pulse">Loading Experience</span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
