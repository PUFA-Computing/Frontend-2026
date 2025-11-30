"use client";

import React, { useState } from "react";
import { Candidate } from "@/models/candidate";
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { deleteCandidate } from "@/services/api/candidate";
import toast from "react-hot-toast";

interface CandidateTableProps {
  candidates: Candidate[];
  onEdit: (candidate: Candidate) => void;
  onRefresh: () => void;
  accessToken: string;
}

export default function CandidateTable({
  candidates,
  onEdit,
  onRefresh,
  accessToken,
}: CandidateTableProps) {
  const [filterMajor, setFilterMajor] = useState<string>("all");
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  // Filter candidates
  const filteredCandidates = candidates.filter((candidate) => {
    const matchesMajor =
      filterMajor === "all" || candidate.major === filterMajor;
    return matchesMajor;
  });

  const handleDelete = async (candidate: Candidate) => {
    if (
      !confirm(
        `Are you sure you want to delete ${candidate.name}? This action cannot be undone.`
      )
    ) {
      return;
    }

    setIsDeleting(candidate.id);
    const result = await deleteCandidate(candidate.id, accessToken);

    if (result.success) {
      toast.success("Candidate deleted successfully");
      onRefresh();
    } else {
      toast.error(result.message || "Failed to delete candidate");
    }
    setIsDeleting(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">All Candidates</h2>

        <div className="flex items-center gap-4 self-end sm:self-auto">
          {/* Filter by Major */}
          <select
            value={filterMajor}
            onChange={(e) => setFilterMajor(e.target.value)}
            className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg 
              text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Majors</option>
            <option value="informatics">Informatics</option>
            <option value="information system">Information System</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-4 px-4 text-gray-600 font-semibold">
                Candidate
              </th>
              <th className="text-left py-4 px-4 text-gray-600 font-semibold">
                Major
              </th>
              <th className="text-left py-4 px-4 text-gray-600 font-semibold">
                Class
              </th>
              <th className="text-left py-4 px-4 text-gray-600 font-semibold">
                Vision
              </th>
              <th className="text-left py-4 px-4 text-gray-600 font-semibold">
                Mission
              </th>
              <th className="text-center py-4 px-4 text-gray-600 font-semibold">
                Votes
              </th>
              <th className="text-right py-4 px-4 text-gray-600 font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredCandidates.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-gray-400">
                  No candidates found
                </td>
              </tr>
            ) : (
              filteredCandidates.map((candidate) => (
                <tr
                  key={candidate.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  {/* Candidate */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-gray-200 flex-shrink-0">
                        {candidate.profile_picture && (candidate.profile_picture.startsWith("http") || candidate.profile_picture.startsWith("/")) ? (
                          <Image
                            src={candidate.profile_picture}
                            alt={candidate.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                            onError={(e) => {
                              // Fallback to placeholder on error
                              e.currentTarget.style.display = "none";
                              e.currentTarget.parentElement?.classList.add("fallback-visible");
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500">
                            <span className="text-white font-bold text-sm">
                              {candidate.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <span className="text-gray-900 font-medium">
                        {candidate.name}
                      </span>
                    </div>
                  </td>

                  {/* Major */}
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        candidate.major === "informatics"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {candidate.major === "informatics" ? "IT" : "IS"}
                    </span>
                  </td>

                  {/* Class */}
                  <td className="py-4 px-4 text-gray-700">
                    {candidate.class || "N/A"}
                  </td>

                  {/* Vision */}
                  <td className="py-4 px-4 text-gray-700 max-w-xs">
                    <p className="truncate">
                      {candidate.vision || "No vision provided"}
                    </p>
                  </td>

                  {/* Mission */}
                  <td className="py-4 px-4 text-gray-700 max-w-xs">
                    <p className="truncate">
                      {candidate.mission || "No mission provided"}
                    </p>
                  </td>

                  {/* Votes */}
                  <td className="py-4 px-4 text-center">
                    <span className="text-2xl font-bold text-gray-900">
                      {candidate.vote_count || 0}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(candidate)}
                        className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 
                          rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(candidate)}
                        disabled={isDeleting === candidate.id}
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-600 
                          rounded-lg transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Results Count */}
      <div className="mt-4 text-sm text-gray-500">
        Showing {filteredCandidates.length} of {candidates.length} candidates
      </div>
    </div>
  );
}