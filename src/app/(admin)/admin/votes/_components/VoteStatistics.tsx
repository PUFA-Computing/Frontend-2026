"use client";

import React from "react";
import { Users, TrendingUp, Code, Database } from "lucide-react";

interface VoteStatisticsProps {
  totalCandidates: number;
  totalVotes: number;
  itCandidates: number;
  isCandidates: number;
}

export default function VoteStatistics({
  totalCandidates,
  totalVotes,
  itCandidates,
  isCandidates,
}: VoteStatisticsProps) {
  const stats = [
    {
      title: "Total Candidates",
      value: totalCandidates,
      icon: Users,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
    },
    {
      title: "Total Votes",
      value: totalVotes,
      icon: TrendingUp,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-500/10 to-pink-500/10",
    },
    {
      title: "IT Candidates",
      value: itCandidates,
      icon: Code,
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-500/10 to-emerald-500/10",
    },
    {
      title: "IS Candidates",
      value: isCandidates,
      icon: Database,
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-500/10 to-red-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="relative overflow-hidden rounded-xl bg-white border border-gray-200 p-6 
              hover:shadow-lg transition-all duration-300 group"
          >
            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} 
                    shadow-lg group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>

              <h3 className="text-gray-600 text-sm font-medium mb-1">
                {stat.title}
              </h3>
              <p className="text-4xl font-bold text-gray-900">
                {stat.value.toLocaleString()}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
