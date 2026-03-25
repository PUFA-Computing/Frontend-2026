import Image from "next/image"
import Logo from "@/assets/aurascendialogo.png"
import Logo2 from "@/assets/PUComSci.png"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

function SectionRule() {
  return (
    <div className="flex items-center gap-3 justify-center my-6">
      <div className="h-px w-24 bg-gradient-to-r from-transparent to-[#B8841E]/40" />
      <span className="text-[#B8841E]/60 text-xs">✦</span>
      <div className="h-px w-24 bg-gradient-to-l from-transparent to-[#B8841E]/40" />
    </div>
  )
}

const divisions = [
  { title: "Board of Director", link: "forcasion/board-of-director", desc: "Chairperson, Vice Chairperson, Secretary and Treasurer — the highest governing body." },
  { title: "External Relations", link: "forcasion/external-relation", desc: "Organizes activities with parties outside campus and builds community relationships." },
  { title: "Internal Relations", link: "forcasion/internal-relation", desc: "Strengthens bonds between students, lecturers, alumni, and PUMA – PUFA." },
  { title: "Art and Sport", link: "forcasion/art-and-sport", desc: "Develops interest in arts and sports, organizing competitions for computing students." },
  { title: "Communication & Multimedia", link: "forcasion/communication-and-multimedia", desc: "Manages PUFA Computing social media and creates multimedia content templates." },
  { title: "Research & Technology", link: "forcasion/research-and-technology", desc: "Develops creative technology ideas and shares knowledge to grow computing resources." },
  { title: "Student Dev & Competition", link: "forcasion/student-development-and-competition", desc: "Improves student quality and academic competitiveness within and beyond the faculty." },
  { title: "Student Welfare Advocacy", link: "forcasion/student-welfare-advocacy", desc: "Bridges students and campus, accommodating aspirations and student welfare." },
  { title: "Entrepreneurship", link: "forcasion/entrepreneur", desc: "New division developing interests and talents in entrepreneurship and business." },
]

const timelineEvents = [
  { date: "September 2025", entries: [{ title: "COMPUTING STORE", desc: "A merchandise and resource initiative where students can access exclusive PUFA Computing products." }] },
  { date: "November 2025", entries: [
    { title: "COMPSHADOW I", desc: "COMPSHADOW I welcomes new students." },
    { title: "COMPCRUSADER", desc: "COMPCRUSADER showcases skills." },
    { title: "CSML", desc: "CSML develops faculty leadership." }
  ] },
  { date: "December 2025", entries: [{ title: "COMPBRAINTS I", desc: "Knowledge and innovation competition showcasing intellectual and creative problem-solving skills." }] },
  { date: "January 2026", entries: [{ title: "COMPBRAINTS II", desc: "Second edition with new formats and categories advancing critical thinking and innovation." }] },
  { date: "February 2026", entries: [{ title: "CSGO", desc: "A sports and gaming event fostering friendly competition and camaraderie in the computing community." }] },
  { date: "March 2026", entries: [
    { title: "SOSPRO I", desc: "SOSPRO I focuses on community service." },
    { title: "PUFA IFTAR", desc: "PUFA IFTAR is a special Ramadhan gathering." }
  ] },
  { date: "May 2026", entries: [{ title: "COMPSTUD", desc: "Academic development with workshops, seminars, and educational sessions." }] },
  { date: "June 2026", entries: [{ title: "COMPSCIGALA", desc: "A prestigious gala celebrating CS faculty achievements, talents, and milestones." }] },
  { date: "July 2026", entries: [
    { title: "COMPSHADOW II", desc: "COMPSHADOW II offers deeper insights." },
    { title: "COMPCONNECT", desc: "COMPCONNECT links students with alumni and industry." }
  ] },
  { date: "October 2026", entries: [
    { title: "COMPREGEN", desc: "COMPREGEN re-energizes the community." },
    { title: "COMPSPHERE", desc: "COMPSPHERE showcases student projects and innovations." }
  ] },
  { date: "November 2026", entries: [{ title: "COMPSHADOW (FAREWELL)", desc: "Farewell event celebrating graduating students' journey and achievements." }] },
]

export default function Page() {
  return (
    <div className="min-h-screen bg-[#F5EDD0] text-[#1A1A2E]">

      {/* ══ HERO ══ */}
      <section className="relative w-full flex items-center justify-center pt-24 sm:pt-32 pb-14 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#EDE0BB]/80 to-[#F5EDD0]" />

        {/* Top corner ornaments — desktop only */}
        <div className="absolute top-28 left-8 w-12 h-12 border-l border-t border-[#B8841E]/40 hidden sm:block" />
        <div className="absolute top-28 right-8 w-12 h-12 border-r border-t border-[#B8841E]/40 hidden sm:block" />

        <div className="relative container mx-auto px-4 sm:px-6 flex flex-col items-center text-center max-w-4xl">
          {/* Logo — Rounded Square */}
          <div className="relative animate-float mb-8 md:mb-10 group">
            <div className="absolute -inset-1.5 rounded-[2rem] bg-gradient-to-br from-[#B8841E] via-[#D9A84A] to-[#B8841E] blur-md opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-glow-pulse" />
            <Image
              src={Logo}
              alt="Aurascendia Logo"
              priority
              className="relative w-28 sm:w-40 md:w-52 h-auto rounded-[2rem] border border-[#B8841E]/40 bg-[#0D1B3E] p-3 shadow-parch-xl"
            />
          </div>

          <p className="section-label mb-4 tracking-[0.25em]">Aurascendia 2026</p>
          <h1 className="font-display italic text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#0D1B3E] mb-4 leading-[0.9]">
            The Cabinet
          </h1>

          <SectionRule />

          <p className="font-serif italic text-[#1A1A2E]/60 text-base sm:text-lg md:text-xl max-w-xl text-balance">
            &ldquo;Grow Together, Impact Further&rdquo;
          </p>
        </div>
      </section>

      {/* ══ VISION & MISSION (Centered Layout) ══ */}
      <section className="py-24 sm:py-32 bg-[#FAF5E8]">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <SectionRule />

          <div className="my-16">
            <h2 className="font-display italic text-4xl sm:text-5xl text-[#B8841E] mb-6">Our Vision</h2>
            <p className="font-serif text-lg sm:text-xl leading-relaxed text-[#0D1B3E]/80 text-balance mx-auto">
              To build a faculty association that focuses on strengthening student potential to contribute meaningfully to the academic, non-academic, and social growth of the faculty and university.
            </p>
          </div>

          <SectionRule />

          <div className="my-16">
            <h2 className="font-display italic text-4xl sm:text-5xl text-[#B8841E] mb-10">Our Mission</h2>
            <div className="flex flex-col gap-8 text-left max-w-2xl mx-auto">
              {[
                { key: "Nurture", desc: "Strengthen integrity and thoughtful behavior in all actions." },
                { key: "Oblige", desc: "Commit to responsibility with sincerity for collective student interest." },
                { key: "Build", desc: "Foster empathy, collaboration, and inclusive leadership." },
                { key: "Lead", desc: "Represent with integrity and lead with transparency." },
                { key: "Empower", desc: "Support academic and non-academic excellence through impactful initiatives." },
              ].map(({ key, desc }) => (
                <div key={key} className="flex flex-col sm:flex-row gap-2 sm:gap-6 items-center sm:items-start text-center sm:text-left group">
                  <span className="font-display italic text-2xl tracking-wide text-[#B8841E] min-w-[100px] group-hover:text-[#D9A84A] transition-colors">{key}</span>
                  <span className="h-px w-8 bg-[#B8841E]/30 mt-4 hidden sm:block" />
                  <span className="font-serif text-base text-[#1A1A2E]/70 leading-relaxed sm:mt-1">{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ DIVISIONS (Centered Grid/List Pattern) ══ */}
      <section id="divisions" className="py-24 sm:py-32 bg-[#F5EDD0]">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-16">
            <p className="section-label mb-4">Structure</p>
            <h2 className="font-display italic text-5xl sm:text-6xl text-[#0D1B3E]">Our Divisions</h2>
            <SectionRule />
          </div>

          {/* Centered frames for divisions */}
          <div className="grid gap-6 max-w-4xl mx-auto md:grid-cols-2 lg:grid-cols-3">
            {divisions.map((div, i) => (
              <Link key={i} href={div.link}
                className="group flex flex-col items-center text-center p-8 bg-[#FAF5E8]/80 border border-[#B8841E]/20 hover:border-[#B8841E]/50 transition-all duration-300 hover:shadow-parch-md hover:-translate-y-1 rounded-sm">

                {/* Ornamental top line */}
                <div className="w-10 h-px bg-[#B8841E]/40 mb-5 group-hover:w-16 group-hover:bg-[#B8841E] transition-all duration-300" />

                <h3 className="font-display italic text-[1.4rem] text-[#0D1B3E] mb-3 leading-snug px-2">
                  {div.title}
                </h3>
                <p className="font-serif text-[13px] text-[#1A1A2E]/60 leading-relaxed mb-6 flex-1">
                  {div.desc}
                </p>

                <span className="text-[11px] font-serif uppercase tracking-widest text-[#B8841E]/80 group-hover:text-[#B8841E] transition-colors inline-flex items-center gap-2">
                  Explore <ChevronRight className="h-3 w-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TIMELINE (Center Spine) ══ */}
      <section id="timeline" className="py-24 sm:py-32 bg-[#FAF5E8] relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-[#B8841E]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="container relative mx-auto px-6 max-w-5xl z-10">
          <div className="text-center mb-20">
            <p className="section-label mb-4">2025 — 2026</p>
            <h2 className="font-display italic text-5xl sm:text-6xl text-[#0D1B3E]">Event Timeline</h2>
            <SectionRule />
            <p className="font-serif text-sm text-[#1A1A2E]/60 max-w-md mx-auto mt-6">
              A comprehensive workplan of events curated to elevate the student experience throughout the academic year.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Center Spine Line */}
            <div className="absolute left-[24px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#B8841E]/40 to-transparent md:-translate-x-1/2" />

            <div className="space-y-16 md:space-y-0">
              {timelineEvents.map((ev, i) => {
                const isEven = i % 2 === 0;
                return (
                  <div key={i} className={`relative flex flex-col md:flex-row items-start ${isEven ? 'md:flex-row-reverse' : ''} md:h-64`}>

                    {/* Center Dot */}
                    <div className="absolute left-[24px] md:left-1/2 top-4 md:top-8 w-3 h-3 rounded-full bg-[#B8841E] border-4 border-[#FAF5E8] shadow-[0_0_0_1px_rgba(184,132,30,0.3)] transform -translate-x-[5.5px] md:-translate-x-1/2 z-10 text-center" />

                    {/* Desktop Content spacing */}
                    <div className="hidden md:block md:w-1/2" />

                    {/* Content Card */}
                    <div className={`ml-14 md:ml-0 md:w-1/2 group ${isEven ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'} pt-1 md:pt-[22px]`}>
                      <p className="section-label text-[#B8841E]/70 mb-4">{ev.date}</p>
                      
                      <div className="flex flex-col gap-6">
                        {ev.entries.map((e, j) => (
                          <div key={j}>
                            <h3 className="font-display italic text-[1.4rem] text-[#0D1B3E] leading-tight mb-1 group-hover:text-[#B8841E] transition-colors">{e.title}</h3>
                            <p className="font-serif text-[13px] text-[#1A1A2E]/60 leading-relaxed text-balance">
                              {e.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )
              })}
            </div>

            {/* Bottom ornament for timeline */}
            <div className="absolute bottom-[-40px] left-[24px] md:left-1/2 transform -translate-x-1/2 text-[#B8841E]/40 text-xs">
              ✦
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
