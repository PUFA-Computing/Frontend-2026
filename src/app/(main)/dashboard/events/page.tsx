import React from "react";
import RegisteredEvents from "@/app/(main)/dashboard/events/_components/RegisteredEvents";

export default function Page() {
    return (
        <div className="space-y-6">

            {/* ── Page heading ── */}
            <div>
                <p className="font-serif text-[10px] tracking-[0.22em] uppercase text-[#B8841E] mb-1">Dashboard</p>
                <h1 className="font-display italic text-3xl sm:text-4xl text-[#0D1B3E]">My Events</h1>
                <div className="flex items-center gap-3 mt-3">
                    <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-[#B8841E]/40 to-transparent" />
                    <span className="text-[#B8841E]/40 text-[10px]">✦</span>
                    <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-[#B8841E]/40 to-transparent" />
                </div>
                <p className="font-serif text-sm text-[#1A1A2E]/50 mt-3 max-w-xl">
                    Track and manage all the events you've registered for. Stay updated with event details and status changes.
                </p>
            </div>

            {/* ── Events card ── */}
            <div className="bg-[#FAF5E8] border border-[#B8841E]/20 rounded-sm shadow-sm overflow-hidden">
                {/* Card header */}
                <div className="px-5 py-4 border-b border-[#B8841E]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <h2 className="font-display italic text-xl text-[#0D1B3E] flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-[#B8841E]">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 7V3M16 7V3M3 11H21M5 4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4Z" />
                        </svg>
                        Registered Events
                    </h2>
                </div>
                <RegisteredEvents />
            </div>
        </div>
    );
}
