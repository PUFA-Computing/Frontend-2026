import React from "react";

export default function DashboardNewsPage() {
    return (
        <div className="space-y-6">

            {/* ── Page heading ── */}
            <div>
                <p className="font-serif text-[10px] tracking-[0.22em] uppercase text-[#B8841E] mb-1">Dashboard</p>
                <h1 className="font-display italic text-3xl sm:text-4xl text-[#0D1B3E]">News</h1>
                <div className="flex items-center gap-3 mt-3">
                    <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-[#B8841E]/40 to-transparent" />
                    <span className="text-[#B8841E]/40 text-[10px]">✦</span>
                    <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-[#B8841E]/40 to-transparent" />
                </div>
            </div>

            {/* ── Coming soon card ── */}
            <div className="bg-[#FAF5E8] border border-[#B8841E]/20 rounded-sm shadow-sm">
                <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-[#B8841E]/10 border border-[#B8841E]/20 flex items-center justify-center mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-[#B8841E]">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                    </div>
                    <h2 className="font-display italic text-2xl text-[#0D1B3E] mb-2">Coming Soon</h2>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#B8841E]/30" />
                        <span className="text-[#B8841E]/40 text-[10px]">✦</span>
                        <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#B8841E]/30" />
                    </div>
                    <p className="font-serif text-sm text-[#1A1A2E]/50 max-w-sm leading-relaxed">
                        Personalized news and updates are on their way. Stay tuned!
                    </p>
                </div>
            </div>
        </div>
    );
}
