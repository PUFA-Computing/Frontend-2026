"use client";

import React, { useState, useEffect } from "react";
import { Candidate } from "@/models/candidate";
import { fetchCandidates } from "@/services/api/candidate";
import VoteStatistics from "@/app/(admin)/admin/votes/_components/VoteStatistics";
import LeaderboardSection from "@/app/(admin)/admin/votes/_components/LeaderboardSection";
import CandidateTable from "@/app/(admin)/admin/votes/_components/CandidateTable";
import CandidateModal from "@/app/(admin)/admin/votes/_components/CandidateModal";
import { RefreshCw } from "lucide-react";

interface VoteDashboardClientProps {
  initialCandidates: Candidate[];
  accessToken: string;
}

export default function VoteDashboardClient({
  initialCandidates,
  accessToken,
}: VoteDashboardClientProps) {
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Auto-refresh every 10 seconds
  useEffect(() => {
    setLastUpdate(new Date()); // Set initial client-side date
    const interval = setInterval(async () => {
      await refreshCandidates();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const refreshCandidates = async () => {
    setIsRefreshing(true);
    const updated = await fetchCandidates();
    setCandidates(updated);
    setLastUpdate(new Date());
    setIsRefreshing(false);
  };

  const handleEdit = (candidate: Candidate) => {
    setEditingCandidate(candidate);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingCandidate(null);
  };

  const handleSuccess = async () => {
    await refreshCandidates();
    handleModalClose();
  };

  // Calculate statistics
  const totalVotes = candidates.reduce((sum, c) => sum + (c.vote_count || 0), 0);
  const itCandidates = candidates.filter((c) => c.major === "informatics");
  const isCandidates = candidates.filter((c) => c.major === "information system");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Vote Management Dashboard
            </h1>
            <p className="text-gray-600">
              Manage candidates and view real-time voting statistics
            </p>
          </div>
          <div className="flex items-center gap-4 self-end md:self-auto">
            <div className="text-right">
              <p className="text-sm text-gray-600">Last updated</p>
              <p className="text-sm text-gray-700 min-w-[80px] text-right">
                {lastUpdate ? lastUpdate.toLocaleTimeString() : "Loading..."}
              </p>
            </div>
            <button
              onClick={refreshCandidates}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 
                text-white rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <VoteStatistics
        totalCandidates={candidates.length}
        totalVotes={totalVotes}
        itCandidates={itCandidates.length}
        isCandidates={isCandidates.length}
      />

      {/* Leaderboards */}
      <LeaderboardSection
        itCandidates={itCandidates}
        isCandidates={isCandidates}
      />

      {/* Candidate Table */}
      <CandidateTable
        candidates={candidates}
        onEdit={handleEdit}
        onRefresh={refreshCandidates}
        accessToken={accessToken}
      />

      {/* Create/Edit Modal */}
      <CandidateModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
        candidate={editingCandidate}
        accessToken={accessToken}
      />
    </div>
  );
}
