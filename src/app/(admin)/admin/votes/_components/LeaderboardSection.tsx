"use client";

import React from "react";
import { Candidate } from "@/models/candidate";
import { Trophy, Medal, Award } from "lucide-react";
import Image from "next/image";

interface LeaderboardSectionProps {
  itCandidates: Candidate[];
  isCandidates: Candidate[];
}

export default function LeaderboardSection({
  itCandidates,
  isCandidates,
}: LeaderboardSectionProps) {
  // Sort by vote count and get top 5
  const topIT = [...itCandidates]
    .sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0))
    .slice(0, 5);

  const topIS = [...isCandidates]
    .sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0))
    .slice(0, 5);

  const maxVotesIT = Math.max(...topIT.map((c) => c.vote_count || 0), 1);
  const maxVotesIS = Math.max(...topIS.map((c) => c.vote_count || 0), 1);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 1:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 2:
        return <Award className="w-5 h-5 text-orange-500" />;
      default:
        return <span className="text-gray-500 font-bold">{index + 1}</span>;
    }
  };

  const renderLeaderboard = (
    candidates: Candidate[],
    maxVotes: number,
    title: string,
    gradient: string
  ) => (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-lg bg-gradient-to-br ${gradient}`}>
          <Trophy className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      </div>

      <div className="space-y-4">
        {candidates.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No candidates yet</p>
        ) : (
          candidates.map((candidate, index) => {
            const votePercentage = ((candidate.vote_count || 0) / maxVotes) * 100;

            return (
              <div
                key={candidate.id}
                className="relative group hover:scale-[1.02] transition-transform duration-200"
              >
                {/* Background Bar */}
                <div className="absolute inset-0 bg-gray-50 rounded-xl" />
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-10 rounded-xl 
                    transition-all duration-500`}
                  style={{ width: `${votePercentage}%` }}
                />

                {/* Content */}
                <div className="relative flex items-center gap-4 p-4">
                  {/* Rank */}
                  <div className="flex-shrink-0 w-8 flex items-center justify-center">
                    {getRankIcon(index)}
                  </div>

                  {/* Profile Picture */}
                  <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-gray-200 flex-shrink-0">
                    {candidate.profile_picture ? (
                      <Image
                        src={candidate.profile_picture}
                        alt={candidate.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${gradient}`}>
                        <span className="text-white font-bold text-lg">
                          {candidate.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Name & Class */}
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-semibold truncate">
                      {candidate.name}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Class {candidate.class || "N/A"}
                    </p>
                  </div>

                  {/* Vote Count */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-2xl font-bold text-gray-900">
                      {candidate.vote_count || 0}
                    </p>
                    <p className="text-gray-500 text-xs">votes</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {renderLeaderboard(
        topIT,
        maxVotesIT,
        "🏆 IT Leaderboard",
        "from-blue-500 to-cyan-500"
      )}
      {renderLeaderboard(
        topIS,
        maxVotesIS,
        "🏆 IS Leaderboard",
        "from-purple-500 to-pink-500"
      )}
    </div>
  );
}