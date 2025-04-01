"use client"

import { useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, ChevronLeft } from "lucide-react"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/effect-cards"
import { Autoplay, Pagination, EffectCards, Navigation } from "swiper/modules"

interface MissionSectionProps {
  misi: string[]
}

export default function MissionSection({ misi }: MissionSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [showAllMissions, setShowAllMissions] = useState(false)

  // Toggle between carousel and list view
  const toggleView = () => {
    setShowAllMissions(!showAllMissions)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-700">Our Missions</h3>
        <button
          onClick={toggleView}
          className="text-sm font-medium px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700"
        >
          {showAllMissions ? "Show as Carousel" : "Show All"}
        </button>
      </div>

      {showAllMissions ? (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-6"
          >
            {misi.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-md border-l-4 border-gray-800"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-gray-600 flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed">{item}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      ) : (
        <div className="relative">
          <Swiper
            modules={[Autoplay, Pagination, EffectCards, Navigation]}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            effect="cards"
            grabCursor={true}
            navigation={{
              prevEl: ".swiper-button-prev",
              nextEl: ".swiper-button-next",
            }}
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex % misi.length)}
            className="mission-swiper h-[300px] sm:h-[250px]"
            loop={true}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
          >
            {misi.map((item, index) => (
              <SwiperSlide key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-800 to-gray-600 flex items-center justify-center text-white font-bold text-xl">
                      {index + 1}
                    </div>
                    <div className="h-1 flex-grow bg-gradient-to-r from-gray-800 to-transparent rounded-full"></div>
                  </div>

                  <p className="text-lg sm:text-xl text-gray-700 leading-relaxed flex-grow">{item}</p>

                  <div className="mt-4 text-right text-sm text-gray-500">
                    Mission {index + 1} of {misi.length}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom navigation buttons */}
          <button className="swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm w-10 h-10 rounded-full flex items-center justify-center shadow-md -ml-5 border border-gray-100">
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <button className="swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm w-10 h-10 rounded-full flex items-center justify-center shadow-md -mr-5 border border-gray-100">
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>

          {/* Progress indicator */}
          <div className="mt-6 flex justify-center gap-1.5">
            {misi.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === activeIndex ? "w-8 bg-gray-800" : "w-2 bg-gray-300"
                }`}
              ></div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}