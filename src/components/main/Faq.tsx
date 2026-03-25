import { FaqProps } from "@/lib/common.type";

export default function Faq({ title, content, status }: FaqProps) {
  return (
    <details open={status === "open"}
      className="group border-b border-[#B8841E]/20 last:border-b-0">
      <summary className="flex cursor-pointer items-center justify-between gap-4 py-5 pr-1 select-none list-none">
        <h2 className="font-serif text-base font-medium text-[#1A1A2E]/85 group-hover:text-[#B8841E] transition-colors duration-250 leading-snug">
          {title}
        </h2>
        {/* Minimal +/– toggle */}
        <span className="flex-shrink-0 w-5 h-5 relative text-[#B8841E]/60 group-hover:text-[#B8841E] transition-colors duration-250">
          <span className="absolute top-1/2 left-0 right-0 h-px bg-current transform -translate-y-1/2" />
          <span className="absolute top-0 bottom-0 left-1/2 w-px bg-current transform -translate-x-1/2 transition-all duration-300 group-open:opacity-0 group-open:scale-y-0" />
        </span>
      </summary>
      <p className="pb-5 font-serif text-sm sm:text-base leading-relaxed text-[#1A1A2E]/55 pr-6">
        {content}
      </p>
    </details>
  );
}
