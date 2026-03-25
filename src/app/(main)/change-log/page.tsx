// @ts-nocheck
import React from "react";

function SectionRule() {
  return (
    <div className="flex items-center gap-3 my-8">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#B8841E]/30" />
      <span className="text-[#B8841E]/50 text-xs">✦</span>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#B8841E]/30" />
    </div>
  );
}

const entries = [
  {
    version: "v2.1.0",
    date: "March 2026",
    tag: "Design Overhaul",
    title: "Redesign — \"Parchment & Ink\" Concept",
    changes: [
      {
        category: "Design System",
        items: [
          "Complete website redesign from a generic dark/purple pattern to the editorial \"Parchment & Ink\" concept.",
          "New color palette: cream (#F5EDD0), navy (#0D1B3E), and gold (#B8841E) as the primary design tokens.",
          "Editorial typography: Cormorant Garamond (display/italic headings) and Lora (body text).",
          "Rule-based ornamental system: thin gold lines, corner frames, and \"✦\" symbols as visual anchors.",
          "Homepage background replaced with a WebP format (PUFA-2026.webp) for better performance.",
        ],
      },
      {
        category: "Component Updates",
        items: [
          "Division Header component: added support for split-panel dual image display (e.g. CnM — Communication & Multimedia).",
          "CnM division page: Communication and Multimedia photos displayed side-by-side at natural proportions.",
          "RnT division page: member photo temporarily replaced with an editorial \"Coming Soon\" placeholder.",
          "SwiperCard member component: card layout updated to match the Parchment & Ink palette.",
          "EventsAndWorkplan section: event and workplan design updated throughout.",
          "All pages (Events, News, Projects, Aspirations, Cabinet) now adopt the new design pattern.",
        ],
      },
    ],
  },
  {
    version: "v2.0.0",
    date: "March 2026",
    tag: "Major Release",
    title: "Aurascendia 2026 — New Cabinet",
    changes: [
      {
        category: "Cabinet Replacement",
        items: [
          "Cabinet transition from Formative Cascade 2025 to Aurascendia 2026.",
          "All member data, photos, and positions updated to reflect the new 2025–2026 cabinet structure.",
          "Addition of a new division: Entrepreneurship as the ninth division.",
          "Updated cabinet vision & mission: \"Grow Together, Impact Further\".",
          "Events & Workplan updated to follow the Aurascendia 2026 Work Program.",
          "Event timeline expanded to cover September 2025 through November 2026.",
        ],
      },
    ],
  },
  {
    version: "v1.0.0",
    date: "2025",
    tag: "Initial Release",
    title: "Formative Cascade 2025 — First Launch",
    changes: [
      {
        category: "General",
        items: [
          "First launch of the PUFA Computing website with the Formative Cascade 2025 cabinet.",
          "Core features: homepage, events, news, aspirations, projects, and cabinet pages.",
          "User authentication system with email verification.",
          "Go backend integration with PostgreSQL database.",
        ],
      },
    ],
  },
];

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-[#F5EDD0] text-[#1A1A2E] pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-3xl">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-serif text-xs tracking-[0.25em] uppercase text-[#B8841E] mb-4">
            Website Updates
          </p>
          <h1 className="font-display italic text-6xl md:text-7xl text-[#0D1B3E] leading-[0.95] mb-4">
            Changelog
          </h1>
          <SectionRule />
          <p className="font-serif text-base text-[#1A1A2E]/60 max-w-md mx-auto">
            History of changes and updates to the PUFA Computing website, recorded chronologically.
          </p>
        </div>

        {/* Entries */}
        <div className="relative">
          {/* Timeline spine */}
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-[#B8841E]/40 via-[#B8841E]/20 to-transparent" />

          <div className="space-y-16">
            {entries.map((entry, i) => (
              <div key={i} className="relative pl-10">
                {/* Dot */}
                <div className="absolute left-0 top-[6px] w-3.5 h-3.5 rounded-full bg-[#B8841E] border-4 border-[#F5EDD0] shadow-[0_0_0_1px_rgba(184,132,30,0.4)]" />

                {/* Header */}
                <div className="flex flex-wrap items-center gap-3 mb-1">
                  <span className="font-display italic text-[#B8841E] text-xl">{entry.version}</span>
                  <div className="inline-block border border-[#B8841E]/30 bg-[#FAF5E8] px-2.5 py-0.5">
                    <span className="font-serif text-[10px] tracking-[0.18em] uppercase text-[#B8841E]">{entry.tag}</span>
                  </div>
                  <span className="font-serif text-xs text-[#1A1A2E]/40 ml-auto">{entry.date}</span>
                </div>

                <h2 className="font-display italic text-2xl md:text-3xl text-[#0D1B3E] mb-6 leading-tight">
                  {entry.title}
                </h2>

                {/* Changes */}
                <div className="space-y-6">
                  {entry.changes.map((group, j) => (
                    <div key={j}>
                      <p className="font-serif text-[11px] tracking-[0.2em] uppercase text-[#B8841E]/70 mb-3">
                        {group.category}
                      </p>
                      <ul className="space-y-2.5">
                        {group.items.map((item, k) => (
                          <li key={k} className="flex gap-3 items-start">
                            <span className="text-[#B8841E]/50 mt-[5px] text-xs flex-shrink-0">—</span>
                            <span className="font-serif text-[14px] text-[#1A1A2E]/75 leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Separator */}
                {i < entries.length - 1 && (
                  <div className="mt-12 h-px bg-gradient-to-r from-[#B8841E]/20 via-[#B8841E]/10 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
