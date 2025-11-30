"use client";

import React from 'react';
import { Candidate } from '@/models/candidate';
import { X, Target, Flag, AlertTriangle } from 'lucide-react';
import Image from 'next/image';

interface VoteModalProps {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
  onVote: (candidateId: number) => void;
  isVoting: boolean;
  hasVoted?: boolean;
}

// Helper function to split text into bullet points
const formatTextAsBullets = (text: string): string[] => {
  // Split by newlines only (mission points are entered separately in admin)
  const lines = text.split('\n').map(item => item.trim()).filter(item => item.length > 0);
  
  // If we have multiple lines, use them as bullet points
  // Otherwise return as single item
  return lines.length > 1 ? lines : [text];
};

export function VoteModal({
  candidate,
  isOpen,
  onClose,
  onVote,
  isVoting,
  hasVoted = false,
}: VoteModalProps) {
  if (!isOpen || !candidate) return null;

  const majorDisplay =
    candidate.major === "informatics" ? "Informatics" : "Information System";

  const handleVoteClick = () => {
    if (!isVoting) {
      onVote(candidate.id);
    }
  };

  // Format vision and mission as bullet points
  const visionPoints = candidate.vision ? formatTextAsBullets(candidate.vision) : [];
  const missionPoints = candidate.mission ? formatTextAsBullets(candidate.mission) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div 
        className="absolute inset-0" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden 
        animate-in fade-in zoom-in duration-300 flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white/90 hover:bg-white rounded-full 
            shadow-lg transition-all duration-200 hover:scale-110 group"
          disabled={isVoting}
        >
          <X className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
        </button>

        {/* Left Side - Candidate Info & Image */}
        <div className="md:w-2/5 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 md:p-8 
          flex flex-col items-center justify-center relative overflow-hidden flex-shrink-0">
          
          {/* Decorative Background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-blue-500 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500 rounded-full blur-3xl" />
          </div>

          {/* Profile Picture */}
          <div className="relative w-32 h-32 md:w-48 md:h-48 mb-4 md:mb-6 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white z-10">
            {candidate.profile_picture ? (
              <Image
                src={candidate.profile_picture}
                alt={candidate.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 128px, 192px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400">
                <div className="text-4xl md:text-6xl font-bold text-white">
                  {candidate.name.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
          </div>

          {/* Candidate Info */}
          <div className="text-center z-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">
              {candidate.name}
            </h2>
            
            <p className="text-sm text-gray-600 font-medium mb-2 md:mb-3">
              {majorDisplay}
            </p>
            
            {candidate.class && (
              <div className="inline-flex items-center px-3 py-1 md:px-4 md:py-2 bg-gradient-to-r from-blue-500 to-purple-500 
                text-white rounded-full text-xs md:text-sm font-bold shadow-lg">
                Class {candidate.class}
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Vision, Mission & Vote Button */}
        <div className="md:w-3/5 flex flex-col md:h-[90vh] overflow-hidden bg-white min-h-0">
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6">
            {/* Vision */}
            {candidate.vision && (
              <div className="group">
                <div className="flex items-center gap-3 mb-3 sticky top-0 bg-white z-10 py-2">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
                    Vision
                  </h3>
                </div>
                <div className="pl-14">
                  {visionPoints.length > 1 ? (
                    <ul className="space-y-2 text-gray-700 leading-relaxed list-disc list-outside">
                      {visionPoints.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-700 leading-relaxed">
                      {candidate.vision}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Mission */}
            {candidate.mission && (
              <div className="group">
                <div className="flex items-center gap-3 mb-3 sticky top-0 bg-white z-10 py-2">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md">
                    <Flag className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
                    Mission
                  </h3>
                </div>
                <div className="pl-14">
                  {missionPoints.length > 1 ? (
                    <ul className="space-y-2 text-gray-700 leading-relaxed list-disc list-outside">
                      {missionPoints.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-700 leading-relaxed">
                      {candidate.mission}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Fallback if no vision/mission */}
            {!candidate.vision && !candidate.mission && (
              <div className="flex items-center justify-center h-32">
                <p className="text-gray-400 italic">
                  No vision or mission statement provided.
                </p>
              </div>
            )}
          </div>

          {/* Footer - Vote Button & Warning */}
          <div className="p-6 md:p-10 border-t border-gray-100 bg-gray-50/50 flex-shrink-0 space-y-4">
            <div className="flex justify-end">
              <button
                onClick={handleVoteClick}
                disabled={isVoting || hasVoted}
                className={`w-full md:w-auto group relative px-8 py-4 
                  ${hasVoted 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-2xl hover:scale-105'}
                  text-white font-bold text-lg rounded-xl shadow-xl
                  disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100
                  transition-all duration-300 overflow-hidden`}
              >
                {/* Shimmer Effect (only if not voted) */}
                {!hasVoted && (
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full 
                    transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                )}
                
                <span className="relative z-10">
                  {isVoting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Voting...
                    </span>
                  ) : hasVoted ? (
                    'Voted'
                  ) : (
                    'VOTE'
                  )}
                </span>
              </button>
            </div>

            {/* Warning Message */}
            {hasVoted ? (
              <div className="flex items-start gap-2 px-3 py-2 bg-red-50/80 
                border border-red-200/60 rounded-lg">
                <AlertTriangle className="w-3.5 h-3.5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed text-red-800">
                  <span className="font-semibold">Notice:</span> You have already voted for a candidate.
                </p>
              </div>
            ) : (
              <div className="flex items-start gap-2 px-3 py-2 bg-amber-50/80 
                border border-amber-200/60 rounded-lg">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed text-amber-800">
                  <span className="font-semibold">Warning:</span> Your vote will be recorded immediately and{' '}
                  <span className="font-semibold">cannot be changed</span>.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}