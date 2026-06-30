// src/components/compregen/CompregenLogoHeader.tsx
"use client";
import React from "react";

interface CompregenLogoHeaderProps {
  title?: string;
  subtitle?: string;
}

export default function CompregenLogoHeader({
  title = "Hello, Computizens!",
  subtitle = "Welcoming the Future Leaders of Computing",
}: CompregenLogoHeaderProps) {
  return (
    <div className="flex flex-col items-center justify-between gap-4 pb-4 border-b border-gray-200 md:flex-row md:gap-10">
      {/* Title & Welcoming Message */}
      <div className="text-center text-[#353535] md:text-left">
        <p className="text-sm font-normal text-gray-500 uppercase tracking-wider md:text-base">
          {title}
        </p>
        <h1 className="mt-1 text-xl font-extrabold text-gray-900 md:text-2xl lg:text-3xl">
          {subtitle}
        </h1>
      </div>

      {/* Logos Container */}
      <div className="flex items-center justify-center gap-2 flex-shrink-0 md:gap-3">
        {/* PU Logo */}
        <img
          src="/PU.png"
          alt="President University Logo"
          className="h-10 w-auto object-contain md:h-12 lg:h-12"
          onError={(e) => {
            e.currentTarget.src = "../../../PU.png";
          }}
        />
        {/* Computing Logo */}
        <img
          src="/logo/PUFA_Computing.png"
          alt="PUFA Computing Logo"
          className="h-10 w-auto object-contain md:h-12 lg:h-12"
          onError={(e) => {
            e.currentTarget.src = "../../../logo/PUFA_Computing.png";
          }}
        />
        {/* Compregen 2026 Logo */}
        <img
          id="compregen-logo-img"
          src="/logo/COMPREGEN 2026.png"
          alt="COMPREGEN 2026 Logo"
          className="h-10 w-auto object-contain md:h-12 lg:h-12"
          onError={(e) => {
            e.currentTarget.style.display = "none";
            const fallbackEl = document.getElementById("compregen-logo-fallback");
            if (fallbackEl) fallbackEl.style.display = "flex";
          }}
        />
        {/* Fallback to beautiful CSS-based design if PNG is missing */}
        <div 
          id="compregen-logo-fallback" 
          style={{ display: "none" }} 
          className="relative h-10 w-10 md:h-12 md:w-12 lg:h-12 lg:w-12 flex items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-md border border-white/20"
        >
          <span className="text-[8px] md:text-[9px] font-black text-white tracking-widest text-center leading-tight">
            COMPRE<br/>2026
          </span>
        </div>
      </div>
    </div>
  );
}
