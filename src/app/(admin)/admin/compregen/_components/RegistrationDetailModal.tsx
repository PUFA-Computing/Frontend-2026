// src/app/(admin)/admin/compregen/_components/RegistrationDetailModal.tsx
"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RegistrationRecord, CandidateMember } from "@/models/cpVcpRegistration";
import { User, Phone, BookOpen, Calendar, ShieldCheck } from "lucide-react";

interface Props {
  registration: RegistrationRecord | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function RegistrationDetailModal({ registration, isOpen, onOpenChange }: Props) {
  if (!registration) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-gray-100 pb-3">
          <DialogTitle className="text-gray-900 font-bold text-xl flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-blue-600" />
            Registration Detail — Cabinet: {registration.cabinet_name}
          </DialogTitle>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>Submitted at: {new Date(registration.submitted_at).toLocaleString()}</span>
          </div>
        </DialogHeader>

        {/* 3 Members Side-by-Side (or stacked on mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
          {/* CP */}
          <MemberCard
            role="Chairperson (CP)"
            member={registration.members.cp}
            bgColor="bg-blue-50/50"
            borderColor="border-blue-100"
          />

          {/* VCP1 */}
          <MemberCard
            role="Vice Chairperson 1"
            member={registration.members.vcp1}
            bgColor="bg-indigo-50/50"
            borderColor="border-indigo-100"
          />

          {/* VCP2 */}
          <MemberCard
            role="Vice Chairperson 2"
            member={registration.members.vcp2}
            bgColor="bg-purple-50/50"
            borderColor="border-purple-100"
          />
        </div>

        <div className="flex justify-end border-t border-gray-100 pt-3 mt-4">
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-lg"
          >
            Close Details
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* Helper Member Card Sub-Component */
interface MemberCardProps {
  role: string;
  member: CandidateMember;
  bgColor: string;
  borderColor: string;
}

function MemberCard({ role, member, bgColor, borderColor }: MemberCardProps) {
  // Try to resolve photo URL. The backend stores the photo_upload_id.
  // In a real staging environment, photos might be resolved via a GET API or stored S3 URL.
  // We check if photo_upload_id starts with a URL, or fall back.
  const isUrl = member.photo_upload_id?.startsWith("http") || member.photo_upload_id?.startsWith("/");
  const photoUrl = isUrl ? member.photo_upload_id : `/api/v1/compregen/photos/${member.photo_upload_id}`;

  return (
    <div className={`border ${borderColor} ${bgColor} rounded-2xl p-4 flex flex-col gap-4 shadow-sm`}>
      <h3 className="font-extrabold text-sm text-gray-800 tracking-wide uppercase border-b border-gray-200/50 pb-2">
        {role}
      </h3>

      {/* Member Photo */}
      <div className="relative aspect-[3/4] w-full max-w-[140px] mx-auto rounded-xl overflow-hidden border border-gray-200 bg-white shadow-md flex items-center justify-center">
        {member.photo_upload_id ? (
          <img
            src={photoUrl}
            alt={member.full_name}
            className="h-full w-full object-cover"
            onError={(e) => {
              // Fallback to placeholder UI on image loading error
              e.currentTarget.style.display = "none";
              e.currentTarget.parentElement?.classList.add("fallback-visible");
            }}
          />
        ) : null}
        
        {/* Fallback initials UI inside same box if image fails to render */}
        <div className="w-full h-full absolute inset-0 hidden [.fallback-visible_&]:flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400">
          <User className="h-10 w-10 text-gray-400 mb-1" />
          <span className="text-[10px] uppercase font-bold text-gray-400">Photo Error</span>
        </div>

        {!member.photo_upload_id && (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400">
            <User className="h-8 w-8 text-gray-400" />
            <span className="text-[10px] mt-1 font-bold text-gray-400">No Photo</span>
          </div>
        )}
      </div>

      {/* Member Details */}
      <div className="space-y-3 pt-2 text-sm text-gray-700">
        {/* Name */}
        <div className="flex items-start gap-2.5">
          <User className="h-4.5 w-4.5 text-gray-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Full Name</p>
            <p className="font-semibold text-gray-900 leading-tight">{member.full_name}</p>
          </div>
        </div>

        {/* Student ID */}
        <div className="flex items-start gap-2.5">
          <User className="h-4.5 w-4.5 text-gray-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Student ID</p>
            <p className="font-medium text-gray-800 leading-tight">{member.student_id}</p>
          </div>
        </div>

        {/* Major */}
        <div className="flex items-start gap-2.5">
          <BookOpen className="h-4.5 w-4.5 text-gray-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Major</p>
            <p className="font-medium text-gray-800 leading-tight">{member.major}</p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-start gap-2.5">
          <Phone className="h-4.5 w-4.5 text-gray-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Phone Number</p>
            <p className="font-medium text-gray-800 leading-tight">{member.phone_number}</p>
          </div>
        </div>

        {/* Nationality */}
        <div className="flex items-start gap-2.5">
          <svg className="h-4.5 w-4.5 text-gray-400 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Nationality</p>
            <p className="font-medium text-gray-800 leading-tight">{member.nationality || "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
