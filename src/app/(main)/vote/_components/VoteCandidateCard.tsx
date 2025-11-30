// src/app/(main)/vote/_components/VoteCandidateCard.tsx

import React from 'react';
import { Candidate } from '@/models/candidate';
import { CheckCircle, Award, BookOpen } from 'lucide-react';
import Image from 'next/image';

interface VoteCandidateCardProps {
  candidate: Candidate;
  onCardClick: () => void;
  hasVoted: boolean;
  votedForThisCandidate: boolean;
  voteCount?: number;
}

export function VoteCandidateCard({
  candidate,
  onCardClick,
  hasVoted,
  votedForThisCandidate,
}: VoteCandidateCardProps) {
  const majorDisplay =
    candidate.major === "informatics" ? "Informatics" : "Information System";

  const majorColor = candidate.major === "informatics" 
    ? "from-blue-600 via-indigo-600 to-purple-600" 
    : "from-indigo-600 via-purple-600 to-pink-600";

  const majorBgColor = candidate.major === "informatics"
    ? "bg-blue-50 text-blue-700 border-blue-300"
    : "bg-purple-50 text-purple-700 border-purple-300";

  // Profile picture URL - use candidate's profile_picture or fallback to null
  // Only use if it starts with http or / to avoid errors with raw filenames
  const profilePictureUrl = candidate.profile_picture && 
    (candidate.profile_picture.startsWith("http") || candidate.profile_picture.startsWith("/"))
    ? candidate.profile_picture 
    : null;

  return (
    <div
      className={`
        group relative bg-white rounded-2xl overflow-visible
        transition-all duration-500 w-full max-w-[300px] mx-auto
        shadow-md hover:shadow-2xl hover:-translate-y-3
        ${!hasVoted ? 'cursor-pointer hover:shadow-indigo-500/30' : 'cursor-default'}
        ${votedForThisCandidate ? 'ring-4 ring-amber-500 ring-offset-4' : ''}
      `}
      onClick={onCardClick}
    >
      {/* Voted Badge - Floating */}
      {votedForThisCandidate && (
        <div className="absolute -top-3 -right-3 z-20 flex items-center gap-2 px-4 py-2.5
          bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 
          text-amber-900 rounded-full shadow-xl border-4 border-white
          animate-bounce">
          <Award className="w-5 h-5" fill="currentColor" />
          <span className="text-sm font-black tracking-wide uppercase">Voted</span>
        </div>
      )}

      {/* Inner wrapper with overflow-hidden for effects */}
      <div className="relative overflow-hidden rounded-2xl bg-white">

      {/* Decorative Corner Accent */}
      {!hasVoted && (
        <div className="absolute top-0 right-0 z-0 w-32 h-32 transition-opacity duration-700 pointer-events-none opacity-10 group-hover:opacity-20">
          <div className={`absolute top-0 right-0 w-full h-full bg-gradient-to-br ${majorColor} 
            transform rotate-45 translate-x-16 -translate-y-16 
            group-hover:scale-150 transition-transform duration-700`} />
        </div>
      )}

      {/* Profile Picture Container - Portrait with Gradient Border */}
      <div className="relative m-4 overflow-hidden rounded-xl z-0">
        {/* Gradient Border Effect */}
        {!hasVoted && (
          <div className={`absolute inset-0 bg-gradient-to-br ${majorColor} opacity-0 
            group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-md`} />
        )}
        
        <div className={`relative w-full aspect-[4/5] bg-gradient-to-br from-gray-100 to-gray-200 
          rounded-xl overflow-hidden border-4 border-white shadow-lg
          ${!hasVoted ? 'group-hover:border-transparent' : ''} transition-all duration-500`}>
          {profilePictureUrl ? (
            <Image
              src={profilePictureUrl}
              alt={candidate.name}
              fill
              className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-2"
              sizes="300px"
              priority
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center 
              bg-gradient-to-br ${majorColor}`}>
              <div className="font-black text-white text-7xl drop-shadow-lg">
                {candidate.name.charAt(0).toUpperCase()}
              </div>
            </div>
          )}

          {/* Overlay Gradient on Hover */}
          {!hasVoted && (
            <div className={`absolute inset-0 bg-gradient-to-t 
              from-indigo-900/80 via-purple-900/40 to-transparent 
              opacity-0 group-hover:opacity-100 transition-all duration-500`} />
          )}

          {/* Floating Info on Hover */}
          {!hasVoted && (
            <div className="absolute bottom-0 left-0 right-0 p-4 transition-transform duration-500 transform translate-y-full group-hover:translate-y-0">
              <div className="p-3 border border-indigo-200 rounded-lg shadow-xl bg-white/95 backdrop-blur-sm">
                <p className="text-sm font-bold text-center text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text">
                  Click to see Vision & Mission
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Candidate Info */}
      <div className="relative z-10 px-5 pb-5">
        {/* Name with Gradient Text on Hover */}
        <h3 className={`text-xl font-black text-gray-900 mb-3 leading-tight
          ${!hasVoted ? 'group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r' : ''} ${majorColor}
          transition-all duration-300`}>
          {candidate.name}
        </h3>

        {/* Badges Container */}
        <div className="flex flex-wrap gap-2 mb-2">
          {/* Major Badge */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full 
            border-2 ${majorBgColor}
            ${!hasVoted ? 'transition-all duration-300 group-hover:scale-105 group-hover:shadow-md' : ''}`}>
            <BookOpen className="w-3.5 h-3.5" />
            <span className="text-xs font-bold tracking-wide uppercase">
              {majorDisplay}
            </span>
          </div>

          {/* Class Badge */}
          {candidate.class && (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full 
              bg-gray-100 text-gray-700 border-2 border-gray-200
              ${!hasVoted ? 'transition-all duration-300 group-hover:scale-105 group-hover:shadow-md' : ''}`}>
              <Award className="w-3.5 h-3.5" />
              <span className="text-xs font-bold tracking-wide uppercase">
                Class {candidate.class}
              </span>
            </div>
          )}
        </div>

        {/* Vote Count Display (Optional) */}
        {votedForThisCandidate && (
          <div className="pt-3 mt-3 border-t-2 border-amber-100">
            <div className="flex items-center justify-center gap-2 text-amber-600">
              <CheckCircle className="w-5 h-5" fill="currentColor" />
              <span className="text-sm font-bold">You voted for this candidate!</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Accent Bar - Animated */}
      {!hasVoted && (
        <div className={`absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r ${majorColor}
          transform origin-left scale-x-0 group-hover:scale-x-100 
          transition-transform duration-700 ease-out`} />
      )}

      {/* Shimmer Effect */}
      {!hasVoted && (
        <div className="absolute inset-0 z-30 transition-transform duration-1000 ease-in-out -translate-x-full skew-x-12 pointer-events-none group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      )}

      {/* Glow Effect on Hover - Inside with inset-0 */}
      {!hasVoted && (
        <div className={`absolute inset-0 bg-gradient-to-br ${majorColor} 
          opacity-0 group-hover:opacity-10 transition-all duration-700 pointer-events-none 
          rounded-2xl`} />
      )}
      </div>
      {/* End of inner wrapper */}
    </div>
  );
}