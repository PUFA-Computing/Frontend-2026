"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { majorPage } from "@/lib/page"
import { redirect } from "next/navigation"
import { useState, use } from "react"
import NextImage from "next/image"

interface StudyProgramPageProps {
  params: Promise<{ slug: string }>
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" },
  }),
}

export default function StudyProgramPage({ params }: StudyProgramPageProps) {
  const { slug } = use(params)
  const programData = majorPage.find((program) => program.slug === slug)

  if (!programData) {
    redirect("/404")
  }

  const { image, vision, mission, profession, description, lecturers, name } = programData

  const chiefLecturers = lecturers.filter(
    (l) => l.position === "Head of Study Program" || l.position === "Dean Faculty of Computing"
  )
  const regularLecturers = lecturers.filter(
    (l) => l.position !== "Head of Study Program" && l.position !== "Dean Faculty of Computing"
  )

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <div className="relative h-[70vh] min-h-[520px] w-full overflow-hidden">
        <Image
          fill
          src={image || "/placeholder.svg"}
          alt={name}
          className="object-cover object-center"
          priority
        />
        {/* layered overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D1B3E]/95 via-[#0D1B3E]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B3E]/80 via-transparent to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-center">
          <div className="container mx-auto max-w-6xl px-6 pt-12">
            <motion.div
              initial="hidden"
              animate="visible"
              className="max-w-2xl"
            >
              <motion.span
                variants={fadeUp}
                custom={0}
                className="inline-block mb-5 px-4 py-1.5 rounded-full border border-[#B8841E]/60 bg-[#B8841E]/15 text-[#d4a84b] text-xs font-semibold uppercase tracking-[0.2em]"
              >
                Faculty of Computing · Study Program
              </motion.span>
              <motion.h1
                variants={fadeUp}
                custom={1}
                className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6"
              >
                {name}
              </motion.h1>
              <motion.div
                variants={fadeUp}
                custom={2}
                className="h-1 w-20 bg-[#B8841E] rounded-full mb-6"
              />
              <motion.p
                variants={fadeUp}
                custom={3}
                className="text-white/75 text-lg leading-relaxed font-light max-w-xl"
              >
                {description.split(" ").slice(0, 25).join(" ")}…
              </motion.p>
            </motion.div>
          </div>
        </div>

        {/* bottom fade-to-page */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#F8F9FC] to-transparent" />
      </div>

      {/* ── BODY ─────────────────────────────────────────────────────── */}
      <div className="container mx-auto max-w-6xl px-6 pt-12 pb-28 relative z-10">

        {/* ── ABOUT ── */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mb-12"
        >
          <SectionLabel>About the Program</SectionLabel>
          <div className="mt-5 bg-white rounded-3xl border border-gray-100 shadow-[0_4px_24px_rgba(13,27,62,0.06)] p-8 md:p-12 relative overflow-hidden group hover:shadow-[0_8px_40px_rgba(13,27,62,0.10)] transition-shadow duration-500">
            <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-[#B8841E]/5 blur-3xl group-hover:bg-[#B8841E]/10 transition-all duration-700" />
            <p className="relative text-[#3D4D6A] text-lg leading-[1.9] font-light">{description}</p>
          </div>
        </motion.section>

        {/* ── CAREER + VISION & MISSION ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
          {/* Career Prospects */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="lg:col-span-2"
          >
            <SectionLabel>Career Prospects</SectionLabel>
            <div className="mt-5 bg-white rounded-3xl border border-gray-100 shadow-[0_4px_24px_rgba(13,27,62,0.06)] p-8 h-[calc(100%-2.5rem)] group hover:shadow-[0_8px_40px_rgba(13,27,62,0.10)] transition-shadow duration-500 relative overflow-hidden">
              <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-[#0D1B3E]/4 blur-3xl group-hover:bg-[#0D1B3E]/8 transition-all duration-700" />
              <ul className="space-y-3 relative">
                {profession.map((item, i) => (
                  <motion.li
                    key={i}
                    custom={i}
                    variants={fadeUp}
                    className="flex items-center gap-3 group/item"
                  >
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#B8841E]/10 flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-[#B8841E] group-hover/item:scale-125 transition-transform" />
                    </span>
                    <span className="text-[#3D4D6A] font-medium text-sm leading-snug group-hover/item:text-[#0D1B3E] transition-colors">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.section>

          {/* Vision & Mission */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="lg:col-span-3"
          >
            <SectionLabel>Vision & Mission</SectionLabel>
            <div className="mt-5 space-y-5">
              {/* Vision Card */}
              <div className="bg-[#0D1B3E] rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#B8841E]/10 rounded-full blur-3xl" />
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B8841E] mb-4">Vision</p>
                <p className="text-white/90 text-base md:text-lg leading-relaxed font-light relative">
                  "{vision[0]}"
                </p>
              </div>

              {/* Mission Cards */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_24px_rgba(13,27,62,0.06)] p-8 relative overflow-hidden">
                <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-[#B8841E]/5 rounded-full blur-3xl" />
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B8841E] mb-5">Mission</p>
                <ol className="space-y-4 relative">
                  {mission.map((item, i) => (
                    <li key={i} className="flex gap-4 items-start">
                      <span className="flex-shrink-0 mt-0.5 w-6 h-6 rounded-full bg-[#0D1B3E] text-white text-[10px] font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <p className="text-[#3D4D6A] text-sm leading-relaxed font-light">{item}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </motion.section>
        </div>

        {/* ── LECTURERS ── */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <div className="flex items-end justify-between mb-5">
            <SectionLabel>Our Faculty</SectionLabel>
            <p className="text-xs text-[#8A9AB7] font-medium">
              ⚠ Information may not reflect the current academic year
            </p>
          </div>

          {/* Chief / Featured */}
          {chiefLecturers.length > 0 && (
            <div className="mb-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B8841E] mb-4">Leadership</p>
              <div className="flex flex-wrap gap-6">
                {chiefLecturers.map((lec, i) => (
                  <FeaturedLecturerCard
                    key={i}
                    name={lec.name}
                    position={lec.position}
                    image={lec.image.src}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Regular grid */}
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8A9AB7] mb-4">Lecturers</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {regularLecturers.map((lec, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fadeUp}
                className="group bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(13,27,62,0.05)] overflow-hidden hover:shadow-[0_8px_30px_rgba(13,27,62,0.12)] hover:-translate-y-1 transition-all duration-400"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B3E]/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <NextImage
                    src={lec.image.src || "/placeholder.svg"}
                    alt={lec.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-[#0D1B3E] font-semibold text-sm leading-snug line-clamp-2 group-hover:text-[#B8841E] transition-colors">{lec.name}</h3>
                  <p className="text-[#8A9AB7] text-xs mt-1">{lec.position}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  )
}

// ── Sub-components ─────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-5 w-1 rounded-full bg-[#B8841E]" />
      <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#0D1B3E]">{children}</h2>
    </div>
  )
}

function FeaturedLecturerCard({ name, position, image }: { name: string; position: string; image: string }) {
  return (
    <div className="flex items-center gap-4 bg-[#0D1B3E] rounded-2xl p-4 pr-6 min-w-0 max-w-sm group hover:bg-[#0D1B3E]/90 transition-colors">
      <div className="relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden ring-2 ring-[#B8841E]/40">
        <NextImage src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#B8841E] mb-1">{position}</p>
        <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2">{name}</h3>
      </div>
    </div>
  )
}
