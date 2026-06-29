// src/app/(admin)/admin/compregen/_components/RegistrationsTable.tsx
"use client";

import React, { useState } from "react";
import { RegistrationRecord } from "@/models/cpVcpRegistration";
import { Eye, Search, Calendar, FolderHeart } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Props {
  registrations: RegistrationRecord[];
  onViewDetails: (registration: RegistrationRecord) => void;
}

export default function RegistrationsTable({ registrations, onViewDetails }: Props) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter registrations by cabinet name or member name
  const filtered = registrations.filter((reg) => {
    const matchesCabinet = reg.cabinet_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCp = reg.members.cp.full_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVcp1 = reg.members.vcp1.full_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVcp2 = reg.members.vcp2.full_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCabinet || matchesCp || matchesVcp1 || matchesVcp2;
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      {/* Table Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <FolderHeart className="h-5 w-5 text-blue-600" />
          Trio Registrations ({filtered.length})
        </h2>
        
        {/* Search Input */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search cabinet or names..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-gray-50 border-gray-300 focus-visible:ring-blue-500 text-gray-900"
          />
        </div>
      </div>

      {/* Table content */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Cabinet Name</th>
              <th className="py-3 px-4">Chairperson (CP)</th>
              <th className="py-3 px-4">VCP 1</th>
              <th className="py-3 px-4">VCP 2</th>
              <th className="py-3 px-4">Submitted At</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-gray-400 font-medium">
                  No registrations found
                </td>
              </tr>
            ) : (
              filtered.map((reg) => (
                <tr
                  key={reg.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  {/* Cabinet Name */}
                  <td className="py-3.5 px-4 font-bold text-gray-900">
                    {reg.cabinet_name}
                  </td>
                  
                  {/* CP Name */}
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-gray-800">{reg.members.cp.full_name}</div>
                    <div className="text-[10px] text-gray-400 font-medium">{reg.members.cp.student_id}</div>
                  </td>
                  
                  {/* VCP 1 */}
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-gray-800">{reg.members.vcp1.full_name}</div>
                    <div className="text-[10px] text-gray-400 font-medium">{reg.members.vcp1.student_id}</div>
                  </td>

                  {/* VCP 2 */}
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-gray-800">{reg.members.vcp2.full_name}</div>
                    <div className="text-[10px] text-gray-400 font-medium">{reg.members.vcp2.student_id}</div>
                  </td>

                  {/* Submitted Date */}
                  <td className="py-3.5 px-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-gray-400" />
                      {new Date(reg.submitted_at).toLocaleDateString()}
                    </span>
                  </td>

                  {/* Action view details */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onViewDetails(reg)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                      title="View Trio Profile Details"
                    >
                      <Eye className="h-3.5 w-3.5" /> Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-xs text-gray-400 font-medium">
        Showing {filtered.length} of {registrations.length} total registrations.
      </div>
    </div>
  );
}
