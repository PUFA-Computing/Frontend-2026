// src/app/(main)/vote/_components/VotingBanner.tsx

import React from 'react';
import { Trophy, Users, CheckCircle, Sparkles } from 'lucide-react';

interface VotingBannerProps {
  userMajor: string;
  userYear: string;
  totalCandidates: number;
  hasVoted: boolean;
}

export function VotingBanner({
  userMajor,
  userYear,
  totalCandidates,
  hasVoted,
}: VotingBannerProps) {
  const majorDisplay =
    userMajor === "informatics" ? "Informatics" : "Information System";
  
  return (
    <div className="relative w-full flex flex-col items-center justify-center pt-32 pb-24 overflow-hidden bg-[#F5EDD0]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#EDE0BB]/80 to-[#F5EDD0]" />
      
      {/* Top corner ornaments */}
      <div className="absolute top-28 left-8 w-12 h-12 border-l border-t border-[#B8841E]/40 hidden md:block" />
      <div className="absolute top-28 right-8 w-12 h-12 border-r border-t border-[#B8841E]/40 hidden md:block" />
      
      <div className="relative container mx-auto px-6 max-w-7xl z-10 flex flex-col items-center text-center">
        <div className="relative z-10 max-w-3xl flex flex-col items-center text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center justify-center border border-[#B8841E]/30 bg-[#FAF5E8]/60 px-4 py-1.5 shadow-parch-sm">
            <p className="flex items-center gap-2 font-serif text-xs tracking-[0.2em] font-medium text-[#B8841E] uppercase">
              <Trophy className="w-3.5 h-3.5" />
              CS Major Leader Election {userYear}
            </p>
          </div>
          
          {/* Title */}
          <h1 className="mb-6 text-5xl font-display italic text-[#0D1B3E] sm:text-6xl md:text-7xl leading-[1.1]">
            Vote for Your Next <span className="block text-[#B8841E]">Major Leader</span>
          </h1>
          
          {/* Ornamental rule */}
          <div className="flex items-center justify-center gap-3 w-full mb-6">
              <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#B8841E]/40" />
              <span className="text-[#B8841E]/50 text-xs">✦</span>
              <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#B8841E]/40" />
          </div>
          
          {/* Description */}
          <p className="mb-10 text-lg font-serif text-[#1A1A2E]/65 max-w-2xl text-balance">
            Be part of the movement to select the next {majorDisplay} Major Leader who will connect, lead, and inspire across the Faculty of Computing.
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 px-6 py-2.5 border border-[#B8841E]/30 bg-[#FAF5E8]/50 font-serif shadow-parch-sm">
              <Users className="w-4 h-4 text-[#B8841E]" />
              <span className="font-medium text-[#0D1B3E]">
                {totalCandidates} Candidate{totalCandidates !== 1 ? "s" : ""}
              </span>
            </div>
            
            <div className="flex items-center gap-2 px-6 py-2.5 border border-[#B8841E]/30 bg-[#FAF5E8]/50 font-serif shadow-parch-sm">
              <Sparkles className="w-4 h-4 text-[#B8841E]" />
              <span className="font-medium text-[#0D1B3E]">{majorDisplay}</span>
            </div>
            
            {hasVoted && (
              <div className="flex items-center gap-2 px-6 py-2.5 border border-green-800 bg-[#E8F5E9] font-serif shadow-parch-sm">
                <CheckCircle className="w-4 h-4 text-green-700" />
                <span className="font-medium text-green-800 tracking-wide">You Voted!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}