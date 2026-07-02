"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { RegistrationRecord, CandidateMember } from "@/models/cpVcpRegistration";
import { X, User, Phone, BookOpen, Calendar, ShieldCheck, RefreshCw, Download, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  registration: RegistrationRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onResetSession: (id: string) => void;
}

export default function RegistrationDetailDrawer({ registration, isOpen, onClose, onResetSession }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!registration || !mounted) return null;

  // Format date
  const submittedDate = new Date(registration.submitted_at).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[9999] bg-black"
          />

          {/* Drawer container */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-[10000] w-full max-w-md bg-white shadow-2xl border-l border-gray-200 flex flex-col h-full overflow-hidden"
          >
            {/* Drawer Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs tracking-wider uppercase mb-1">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Submission Detail</span>
                </div>
                <h2 className="text-lg font-bold text-gray-900 truncate">
                  Candidate Profiles
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Submission Date Card */}
              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3.5 flex items-center gap-3">
                <Calendar className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">Submitted At</p>
                  <p className="text-sm font-semibold text-gray-800">{submittedDate}</p>
                </div>
              </div>

              {/* Candidates Details */}
              <div className="space-y-6">
                {/* Chairperson */}
                <MemberSection
                  title="Chairperson (CP)"
                  member={registration.members.cp}
                  accentColor="blue"
                />

                {/* VCP 1 */}
                <MemberSection
                  title="Vice Chairperson 1"
                  member={registration.members.vcp1}
                  accentColor="indigo"
                />

                {/* VCP 2 */}
                <MemberSection
                  title="Vice Chairperson 2"
                  member={registration.members.vcp2}
                  accentColor="purple"
                />
              </div>

              {/* Photos Summary Grid */}
              <div className="border-t border-gray-100 pt-5">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Photos Overview
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <PhotoThumbnail label="CP" member={registration.members.cp} />
                  <PhotoThumbnail label="VCP 1" member={registration.members.vcp1} />
                  <PhotoThumbnail label="VCP 2" member={registration.members.vcp2} />
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  if (confirm(`Are you sure you want to reset this registration session?`)) {
                    onResetSession(registration.id);
                  }
                }}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 border border-red-200 text-red-600 hover:bg-red-50 bg-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Reset Session
              </button>
              <button
                onClick={() => {
                  // Mock export
                  alert("Exporting entry details...");
                }}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 border border-gray-200 text-gray-700 hover:bg-gray-100 bg-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                <Download className="h-3.5 w-3.5" />
                Export Entry
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

/* Helper Member Section */
function MemberSection({
  title,
  member,
  accentColor,
}: {
  title: string;
  member: CandidateMember;
  accentColor: "blue" | "indigo" | "purple";
}) {
  const accentClasses = {
    blue: {
      bg: "bg-blue-50/50",
      border: "border-blue-100",
      badge: "bg-blue-100 text-blue-800",
    },
    indigo: {
      bg: "bg-indigo-50/50",
      border: "border-indigo-100",
      badge: "bg-indigo-100 text-indigo-800",
    },
    purple: {
      bg: "bg-purple-50/50",
      border: "border-purple-100",
      badge: "bg-purple-100 text-purple-800",
    },
  }[accentColor];

  const photoUrl = member.photo_upload_id?.startsWith("http") || member.photo_upload_id?.startsWith("/")
    ? member.photo_upload_id
    : `/api/v1/compregen/photos/${member.photo_upload_id}`;

  return (
    <div className={`border ${accentClasses.border} ${accentClasses.bg} rounded-2xl p-4 space-y-4 shadow-sm`}>
      <div className="flex items-center justify-between border-b border-gray-200/50 pb-2">
        <h3 className="font-extrabold text-xs tracking-wider uppercase text-gray-800">{title}</h3>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${accentClasses.badge}`}>
          Candidate
        </span>
      </div>

      <div className="flex items-start gap-4">
        {/* Photo Thumbnail */}
        <div className="relative aspect-[3/4] w-20 flex-shrink-0 rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm flex items-center justify-center">
          {member.photo_upload_id ? (
            <img
              src={photoUrl}
              alt={member.full_name}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.parentElement?.classList.add("fallback-visible");
              }}
            />
          ) : null}
          
          <div className="w-full h-full absolute inset-0 hidden [.fallback-visible_&]:flex flex-col items-center justify-center bg-gray-100 text-gray-400">
            <User className="h-6 w-6" />
          </div>

          {!member.photo_upload_id && (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-300">
              <User className="h-6 w-6" />
            </div>
          )}
        </div>

        {/* Text Details */}
        <div className="min-w-0 flex-1 space-y-2 text-xs">
          <div>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Full Name</p>
            <p className="font-semibold text-gray-900 truncate leading-tight mt-0.5">
              {member.full_name}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Student ID</p>
              <p className="font-medium text-gray-800 leading-tight mt-0.5">{member.student_id}</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Nationality</p>
              <p className="font-medium text-gray-800 leading-tight mt-0.5">{member.nationality || "Indonesian"}</p>
            </div>
          </div>

          <div>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Major</p>
            <div className="flex items-center gap-1 text-gray-700 mt-0.5">
              <BookOpen className="h-3 w-3 text-gray-400 flex-shrink-0" />
              <span className="truncate">{member.major}</span>
            </div>
          </div>

          <div>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Phone Number</p>
            <div className="flex items-center gap-1 text-gray-700 mt-0.5">
              <Phone className="h-3 w-3 text-gray-400 flex-shrink-0" />
              <span>{member.phone_number}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Helper Photo Thumbnail for general overview grid */
function PhotoThumbnail({ label, member }: { label: string; member: CandidateMember }) {
  const photoUrl = member.photo_upload_id?.startsWith("http") || member.photo_upload_id?.startsWith("/")
    ? member.photo_upload_id
    : `/api/v1/compregen/photos/${member.photo_upload_id}`;

  return (
    <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex flex-col items-center justify-center shadow-sm">
      {member.photo_upload_id ? (
        <img
          src={photoUrl}
          alt={member.full_name}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
            e.currentTarget.parentElement?.classList.add("fallback-visible");
          }}
        />
      ) : null}

      <div className="w-full h-full absolute inset-0 hidden [.fallback-visible_&]:flex flex-col items-center justify-center bg-gray-100 text-gray-400">
        <User className="h-6 w-6 text-gray-300" />
        <span className="text-[9px] font-bold text-gray-400 mt-0.5">{label}</span>
      </div>

      {!member.photo_upload_id && (
        <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
          <User className="h-6 w-6" />
          <span className="text-[9px] font-bold text-gray-400 mt-0.5">{label}</span>
        </div>
      )}

      {member.photo_upload_id && (
        <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[8px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider backdrop-blur-sm">
          {label}
        </span>
      )}
    </div>
  );
}
