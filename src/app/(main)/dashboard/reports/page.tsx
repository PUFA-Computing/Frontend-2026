import React from "react";

export default function ReportsPage() {
    return (
        <div className="space-y-6">

            {/* ── Page heading ── */}
            <div>
                <p className="font-serif text-[10px] tracking-[0.22em] uppercase text-[#B8841E] mb-1">Dashboard</p>
                <h1 className="font-display italic text-3xl sm:text-4xl text-[#0D1B3E]">Reports</h1>
                <div className="flex items-center gap-3 mt-3">
                    <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-[#B8841E]/40 to-transparent" />
                    <span className="text-[#B8841E]/40 text-[10px]">✦</span>
                    <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-[#B8841E]/40 to-transparent" />
                </div>
            </div>

            {/* ── Coming soon card ── */}
            <div className="bg-[#FAF5E8] border border-[#B8841E]/20 rounded-sm shadow-sm">
                <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                    {/* Ornament icon */}
                    <div className="w-16 h-16 rounded-full bg-[#B8841E]/10 border border-[#B8841E]/20 flex items-center justify-center mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-[#B8841E]">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V13C9 11.8954 8.10457 11 7 11H5C3.89543 11 3 11.8954 3 13V19C3 20.1046 3.89543 21 5 21H7C8.10457 21 9 20.1046 9 19ZM9 19V9C9 7.89543 9.89543 7 11 7H13C14.1046 7 15 7.89543 15 9V19M9 19C9 20.1046 9.89543 21 11 21H13C14.1046 21 15 20.1046 15 19M15 19V5C15 3.89543 15.8954 3 17 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H17C15.8954 21 15 20.1046 15 19Z" />
                        </svg>
                    </div>
                    <h2 className="font-display italic text-2xl text-[#0D1B3E] mb-2">Coming Soon</h2>
                    {/* Ornament rule */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#B8841E]/30" />
                        <span className="text-[#B8841E]/40 text-[10px]">✦</span>
                        <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#B8841E]/30" />
                    </div>
                    <p className="font-serif text-sm text-[#1A1A2E]/50 max-w-sm leading-relaxed">
                        We&apos;re working on something meaningful. Reports and analytics will be available soon.
                    </p>
                </div>
            </div>
        </div>
    );
}
