// src/app/(admin)/admin/compregen/_components/CompregenAdminClient.tsx
"use client";

import React, { useState } from "react";
import { RegistrationRecord } from "@/models/cpVcpRegistration";
import GenerateLinkModal from "./GenerateLinkModal";
import RegistrationsTable from "./RegistrationsTable";
import RegistrationDetailModal from "./RegistrationDetailModal";
import { Users, FileSpreadsheet, RefreshCw } from "lucide-react";
import { getRegistrations } from "@/services/api/cpVcpRegistration";
import toast from "react-hot-toast";

interface Props {
  initialRegistrations: RegistrationRecord[];
  accessToken: string;
}

export default function CompregenAdminClient({ initialRegistrations, accessToken }: Props) {
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>(initialRegistrations);
  const [selectedReg, setSelectedReg] = useState<RegistrationRecord | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await getRegistrations(accessToken);
      setRegistrations(res.registrations || []);
      toast.success("Registrations list updated!");
    } catch (error) {
      toast.error("Failed to refresh registrations list");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleViewDetails = (reg: RegistrationRecord) => {
    setSelectedReg(reg);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Compregen 2027 Registration
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage submitted Chairperson (CP) & Vice Chairperson (VCP) candidate profiles and invite tokens.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 border border-gray-200 hover:bg-gray-50 rounded-lg text-gray-500 transition disabled:opacity-50"
            title="Refresh List"
          >
            <RefreshCw className={`h-4.5 w-4.5 ${isRefreshing ? "animate-spin" : ""}`} />
          </button>

          {/* Generate Token Link Button Modal */}
          <GenerateLinkModal accessToken={accessToken} />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Total Registrations */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Cabinets Registered</p>
            <p className="text-2xl font-black text-gray-900 mt-0.5">{registrations.length}</p>
          </div>
        </div>

        {/* Total Candidates */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <FileSpreadsheet className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Candidates Listed</p>
            <p className="text-2xl font-black text-gray-900 mt-0.5">{registrations.length * 3}</p>
          </div>
        </div>
      </div>

      {/* Table Component */}
      <RegistrationsTable
        registrations={registrations}
        onViewDetails={handleViewDetails}
      />

      {/* Detail Dialog Modal */}
      <RegistrationDetailModal
        registration={selectedReg}
        isOpen={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </div>
  );
}
