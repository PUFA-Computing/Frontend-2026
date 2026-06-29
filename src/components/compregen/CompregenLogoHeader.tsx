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
      <div className="flex items-center justify-center gap-3">
        {/* PU Logo */}
        <img
          src="/PU.png"
          alt="President University Logo"
          className="h-12 w-auto object-contain md:h-14 lg:h-16"
          onError={(e) => {
            e.currentTarget.src = "../../../PU.png";
          }}
        />
        {/* Computing Logo */}
        <img
          src="/logo/PUFA_Computing.png"
          alt="PUFA Computing Logo"
          className="h-12 w-auto object-contain md:h-14 lg:h-16"
          onError={(e) => {
            e.currentTarget.src = "../../../logo/PUFA_Computing.png";
          }}
        />
        {/* Compregen 2027 Logo (Fallback to beautiful CSS-based design if PNG is missing) */}
        <div className="relative h-12 w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 flex items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-md border border-white/20">
          <span className="text-[9px] md:text-[10px] font-black text-white tracking-widest text-center leading-tight">
            COMPRE<br/>2027
          </span>
        </div>
      </div>
    </div>
  );
}
