import Link from "next/link";
import Button from "@/components/Button";
import { StudyProgramDataProps } from "@/lib/common.type";

export default function StudyProgCard({ title, article, link }: StudyProgramDataProps) {
  return (
    <div className="group w-full relative overflow-hidden">
      {/* Top gold rule */}
      <div className="h-px bg-gradient-to-r from-[#B8841E]/70 to-transparent mb-6 transition-all duration-500 group-hover:from-[#C9922A]" />

      {/* Title */}
      <h3 className="font-display italic text-2xl md:text-[1.6rem] text-[#0D1B3E] mb-1 leading-tight transition-colors duration-300 group-hover:text-[#B8841E]">
        {title}
      </h3>

      {/* Ornament */}
      <div className="flex items-center gap-2 mb-5">
        <div className="h-px w-8 bg-[#B8841E]/40" />
        <span className="text-[#B8841E]/50 text-xs">✦</span>
      </div>

      {/* Article text */}
      <p className="font-serif text-sm leading-relaxed text-[#1A1A2E]/60 min-h-[7rem] mb-7">
        {article}
      </p>

      {/* CTA — inline text link style */}
      <Link href={link || "/"} className="inline-flex items-center gap-2 font-serif text-sm text-[#B8841E] hover:text-[#0D1B3E] transition-colors duration-250 group/link">
        <span>Explore Program</span>
        <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-250" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7-7 7" />
        </svg>
      </Link>

      {/* Bottom rule */}
      <div className="h-px bg-gradient-to-r from-[#B8841E]/20 to-transparent mt-6" />
    </div>
  );
}