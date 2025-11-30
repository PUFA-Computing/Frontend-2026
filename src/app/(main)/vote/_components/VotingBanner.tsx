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
    <div className="relative px-4 py-24 overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-800 to-purple-900 sm:px-6 md:px-8 lg:px-16">
      {/* Decorative elements */}
      <div className="absolute w-40 h-40 bg-blue-500 rounded-full -left-20 -top-20 opacity-10" />
      <div className="absolute bg-purple-500 rounded-full -right-20 bottom-10 h-60 w-60 opacity-10" />
      <div className="absolute transform -translate-x-1/2 -translate-y-1/2 bg-indigo-500 rounded-full left-1/2 top-1/2 h-80 w-80 opacity-5" />
      
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-2 h-2 rounded-full top-1/4 left-1/4 bg-amber-400 animate-ping" style={{ animationDelay: "0s" }} />
        <div className="absolute w-2 h-2 rounded-full top-3/4 right-1/4 bg-amber-400 animate-ping" style={{ animationDelay: "1s" }} />
        <div className="absolute w-2 h-2 rounded-full top-1/2 left-3/4 bg-amber-400 animate-ping" style={{ animationDelay: "2s" }} />
      </div>
      
      <div className="relative mx-auto max-w-7xl">
        <div className="relative z-10 max-w-3xl">
          {/* Badge */}
          <div className="inline-block px-4 py-1 mb-6 rounded-full bg-indigo-500/20 backdrop-blur-sm">
            <p className="flex items-center gap-2 text-sm font-medium text-indigo-100">
              <Trophy className="w-4 h-4" />
              Computer Science Major Leader Election {userYear}
            </p>
          </div>
          
          {/* Title */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Vote for Your Next{" "}
            <br />
            <span className="text-amber-400">Major Leader</span>
          </h1>
          
          {/* Description */}
          <p className="mb-8 text-xl text-indigo-100">
            Be part of the movement to select the next {majorDisplay} Major Leader who will connect, lead, and inspire across the Faculty of Computing.
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2 px-4 py-2 border rounded-full border-white/30 bg-white/10 backdrop-blur-sm">
              <Users className="w-5 h-5 text-amber-400" />
              <span className="font-medium text-white">
                {totalCandidates} Candidate{totalCandidates !== 1 ? "s" : ""}
              </span>
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2 border rounded-full border-white/30 bg-white/10 backdrop-blur-sm">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span className="font-medium text-white">{majorDisplay}</span>
            </div>
            
            {hasVoted && (
              <div className="flex items-center gap-2 px-4 py-2 border rounded-full border-green-300/50 bg-green-500/20 backdrop-blur-sm">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span className="font-medium text-green-100">You Voted!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}