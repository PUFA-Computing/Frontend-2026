"use client";

import React, { useState } from "react";
import { RegistrationRecord } from "@/models/cpVcpRegistration";
import { Eye, Search, Calendar, FolderHeart, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Props {
  registrations: RegistrationRecord[];
  onViewDetails: (registration: RegistrationRecord) => void;
  onResetSession: (id: string) => void;
}

export default function RegistrationsTable({ registrations, onViewDetails, onResetSession }: Props) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter registrations by member name
  const filtered = registrations.filter((reg) => {
    const cpName = reg.members.cp?.full_name || "";
    const vcp1Name = reg.members.vcp1?.full_name || "";
    const vcp2Name = reg.members.vcp2?.full_name || "";
    
    return (
      cpName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vcp1Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vcp2Name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Get initials for avatar
  const getInitials = (name: string) => {
    if (!name) return "";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Format short name (e.g. Raka Darmawan -> Raka D.)
  const formatShortName = (name: string) => {
    if (!name) return "";
    const parts = name.trim().split(/\s+/);
    if (parts.length <= 1) return name;
    return `${parts[0]} ${parts[parts.length - 1][0]}.`;
  };

  // Format relative time (e.g. "Today 10:23", "Yesterday", or Date string)
  const formatSubmittedTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      const timeStr = date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
      
      if (diffDays === 0 && date.getDate() === now.getDate()) {
        return `Today ${timeStr}`;
      } else if (diffDays <= 1 && date.getDate() === new Date(now.getTime() - 86400000).getDate()) {
        return `Yesterday`;
      } else {
        return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
      }
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm overflow-hidden">
      {/* Table Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <FolderHeart className="h-5 w-5 text-blue-600" />
            Candidate Submissions
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Showing {filtered.length} of {registrations.length} registered candidate sets
          </p>
        </div>
        
        {/* Search Input */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search candidate names..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 bg-gray-50/50 border-gray-200 focus-visible:ring-blue-500 text-gray-900 text-xs rounded-xl"
          />
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto border border-gray-100 rounded-xl">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/70 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">Chairperson (CP)</th>
              <th className="py-3 px-4">VCP 1</th>
              <th className="py-3 px-4">VCP 2</th>
              <th className="py-3 px-4 w-[120px]">Submitted</th>
              <th className="py-3 px-4 w-[90px]">Status</th>
              <th className="py-3 px-4 w-[90px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-gray-400 font-medium text-xs">
                  No submissions found
                </td>
              </tr>
            ) : (
              filtered.map((reg) => {
                const status = (reg as any).status || "OK";
                
                return (
                  <tr
                    key={reg.id}
                    onClick={() => onViewDetails(reg)}
                    className="hover:bg-gray-50/40 transition-colors cursor-pointer group"
                  >
                    
                    {/* Chairperson */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-xs flex-shrink-0 border border-blue-100">
                          {getInitials(reg.members.cp?.full_name)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-gray-800 text-xs truncate max-w-[120px]">
                            {formatShortName(reg.members.cp?.full_name)}
                          </div>
                          <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                            ...{reg.members.cp?.student_id?.slice(-4) || "0000"}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    {/* VCP 1 */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-purple-50 text-purple-600 font-bold flex items-center justify-center text-xs flex-shrink-0 border border-purple-100">
                          {getInitials(reg.members.vcp1?.full_name)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-gray-800 text-xs truncate max-w-[120px]">
                            {formatShortName(reg.members.vcp1?.full_name)}
                          </div>
                          <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                            ...{reg.members.vcp1?.student_id?.slice(-4) || "0000"}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* VCP 2 */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-amber-50 text-amber-600 font-bold flex items-center justify-center text-xs flex-shrink-0 border border-amber-100">
                          {getInitials(reg.members.vcp2?.full_name)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-gray-800 text-xs truncate max-w-[120px]">
                            {formatShortName(reg.members.vcp2?.full_name)}
                          </div>
                          <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                            ...{reg.members.vcp2?.student_id?.slice(-4) || "0000"}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Submitted At */}
                    <td className="py-3.5 px-4 text-xs text-gray-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-gray-300" />
                        {formatSubmittedTime(reg.submitted_at)}
                      </span>
                    </td>

                    {/* Status Pill */}
                    <td className="py-3.5 px-4">
                      {status === "OK" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
                          <CheckCircle2 className="h-3 w-3 text-green-500" />
                          OK
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <AlertCircle className="h-3 w-3 text-amber-500" />
                          Review
                        </span>
                      )}
                    </td>

                    {/* Action buttons */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewDetails(reg);
                          }}
                          className="h-7 w-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition text-gray-400"
                          title="View Profile Details"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Reset session for ${reg.cabinet_name}?`)) {
                              onResetSession(reg.id);
                            }
                          }}
                          className="h-7 w-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition text-gray-400"
                          title="Reset Candidate Session"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
