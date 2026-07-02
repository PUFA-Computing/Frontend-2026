"use client";

import React, { useState, useEffect } from "react";
import { RegistrationRecord, WhitelistMember, VerificationAttempt } from "@/models/cpVcpRegistration";
import RegistrationsTable from "./RegistrationsTable";
import RegistrationDetailDrawer from "./RegistrationDetailDrawer";
import {
  Users,
  RefreshCw,
  Link2,
  Lock,
  Unlock,
  ShieldCheck,
  Plus,
  Upload,
  AlertTriangle,
  Copy,
  ExternalLink,
  Mail,
  BookOpen,
  ArrowLeft,
  CheckCircle2,
  Trash2,
  FileSpreadsheet,
  Calendar
} from "lucide-react";
import {
  getRegistrations,
  getActiveInviteLink,
  closeInviteLink,
  generateInviteLink,
  getWhitelistMembers,
  addWhitelistMember,
  importWhitelistCsv,
  getVerificationAttempts,
  resetCandidateSession
} from "@/services/api/cpVcpRegistration";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import Link from "next/link";

interface Props {
  initialRegistrations: RegistrationRecord[];
  accessToken: string;
}

export default function CompregenAdminClient({ initialRegistrations, accessToken }: Props) {
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>(initialRegistrations);
  const [activeLink, setActiveLink] = useState<{ token: string; url: string; created_at?: string; status?: string; submissions?: number } | null>(null);
  const [whitelist, setWhitelist] = useState<WhitelistMember[]>([]);
  const [attempts, setAttempts] = useState<VerificationAttempt[]>([]);
  
  const [selectedReg, setSelectedReg] = useState<RegistrationRecord | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Modals / forms states
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isImportCsvOpen, setIsImportCsvOpen] = useState(false);
  
  const [newMember, setNewMember] = useState({
    student_id: "",
    full_name: "",
    campus_email: "",
    major: "Informatics"
  });
  
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isSubmittingMember, setIsSubmittingMember] = useState(false);
  const [isSubmittingCsv, setIsSubmittingCsv] = useState(false);

  const [copied, setCopied] = useState(false);

  // Fetch all secondary data on load
  const loadDashboardData = async (silent = false) => {
    if (!silent) setIsRefreshing(true);
    try {
      const [regsData, linkData, whitelistData, attemptsData] = await Promise.all([
        getRegistrations(accessToken),
        getActiveInviteLink(),
        getWhitelistMembers(),
        getVerificationAttempts()
      ]);

      setRegistrations(regsData.registrations || []);
      setActiveLink(linkData);
      setWhitelist(whitelistData.whitelist || []);
      setAttempts(attemptsData.attempts || []);

      if (!silent) toast.success("Dashboard data updated!");
    } catch (error) {
      console.error("[Admin] Failed to load dashboard data:", error);
      if (!silent) toast.error("Failed to load some dashboard statistics");
    } finally {
      if (!silent) setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData(true);
  }, []);

  const handleRefresh = () => {
    loadDashboardData(false);
  };

  const handleCopyLink = () => {
    if (!activeLink?.url) return;
    navigator.clipboard.writeText(activeLink.url);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  // Close invite link
  const handleCloseLink = async () => {
    if (!activeLink?.token) return;
    setIsClosing(true);
    try {
      const res = await closeInviteLink(activeLink.token);
      if (res.success) {
        toast.success("Invite link closed successfully!");
        loadDashboardData(true);
      }
    } catch (e) {
      toast.error("Failed to close invite link");
    } finally {
      setIsClosing(false);
    }
  };

  // Generate new invite link
  const handleGenerateLink = async () => {
    setIsGenerating(true);
    try {
      const res = await generateInviteLink(accessToken);
      if (res.token) {
        toast.success("New active token generated!");
        loadDashboardData(true);
      }
    } catch (e) {
      toast.error("Failed to generate link");
    } finally {
      setIsGenerating(false);
    }
  };

  // Add whitelist member
  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.student_id || !newMember.full_name || !newMember.campus_email) {
      toast.error("Please fill in all whitelisted member fields");
      return;
    }
    
    setIsSubmittingMember(true);
    try {
      const res = await addWhitelistMember(newMember);
      if (res.success) {
        toast.success("Member added to whitelist!");
        setIsAddMemberOpen(false);
        setNewMember({
          student_id: "",
          full_name: "",
          campus_email: "",
          major: "Informatics"
        });
        loadDashboardData(true);
      }
    } catch (e) {
      toast.error("Failed to add whitelisted member");
    } finally {
      setIsSubmittingMember(false);
    }
  };

  // Import whitelist CSV
  const handleImportCsv = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvFile) {
      toast.error("Please select a CSV file first");
      return;
    }
    
    setIsSubmittingCsv(true);
    try {
      const res = await importWhitelistCsv(csvFile);
      if (res.success) {
        toast.success(`Imported ${res.importedCount} whitelist members!`);
        setIsImportCsvOpen(false);
        setCsvFile(null);
        loadDashboardData(true);
      }
    } catch (e) {
      toast.error("Failed to import CSV file");
    } finally {
      setIsSubmittingCsv(false);
    }
  };

  // Reset candidate session
  const handleResetSession = async (id: string) => {
    try {
      const res = await resetCandidateSession(id);
      if (res.success) {
        toast.success("Registration session has been cleared!");
        setIsDrawerOpen(false);
        setSelectedReg(null);
        loadDashboardData(true);
      }
    } catch (e) {
      toast.error("Failed to reset registration session");
    }
  };

  const handleViewDetails = (reg: RegistrationRecord) => {
    setSelectedReg(reg);
    setIsDrawerOpen(true);
  };

  // Stats calculation
  const totalRegistered = registrations.length;
  const whitelistCount = whitelist.length;
  const lastSubmission = registrations.length > 0 
    ? [...registrations].sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime())[0]
    : null;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header breadcrumb & title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/80 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link 
              href="/admin" 
              className="inline-flex items-center justify-center p-1.5 border border-gray-200 bg-white rounded-lg hover:bg-gray-50 text-gray-500 hover:text-gray-900 transition-all shadow-sm"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Administration Panels
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            Compregen Candidate Registrations
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 max-w-2xl leading-relaxed">
            Manage student-run Chairperson (CP) & Vice Chairperson (VCP) candidate submission workflows, whitelist BEM candidate eligibility, and monitor invite link token access.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center justify-center gap-1.5 py-2 px-3.5 border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 font-bold rounded-xl text-xs shadow-sm transition disabled:opacity-50"
            title="Refresh List"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Summary Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Registered Trios */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition duration-200">
          <div className="h-11 w-11 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center flex-shrink-0">
            <Users className="h-5.5 w-5.5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Registered Trios</p>
            <h3 className="text-xl font-black text-gray-900 mt-0.5">{totalRegistered}</h3>
            <p className="text-[10px] text-gray-400 mt-0.5">candidate sets submitted</p>
          </div>
        </div>

        {/* Invite Link Status */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition duration-200">
          <div className={`h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 border ${
            activeLink?.status === "active" 
              ? "bg-green-50 text-green-600 border-green-100" 
              : "bg-red-50 text-red-600 border-red-100"
          }`}>
            {activeLink?.status === "active" ? <Unlock className="h-5.5 w-5.5" /> : <Lock className="h-5.5 w-5.5" />}
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Link Status</p>
            <span className={`inline-flex items-center gap-1 mt-0.5 text-sm font-bold ${
              activeLink?.status === "active" ? "text-green-600" : "text-red-600"
            }`}>
              {activeLink?.status === "active" ? "Active" : "Closed"}
            </span>
            <p className="text-[10px] text-gray-400 mt-0.5">
              {activeLink?.status === "active" ? "Accepting candidate profiles" : "Registration link locked"}
            </p>
          </div>
        </div>

        {/* Last Submission Info */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition duration-200">
          <div className="h-11 w-11 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="h-5.5 w-5.5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Last Submission</p>
            <h3 className="text-sm font-bold text-gray-900 mt-0.5 truncate">
              {lastSubmission ? lastSubmission.members.cp.full_name : "None yet"}
            </h3>
            <p className="text-[10px] text-gray-400 truncate mt-0.5">
              {lastSubmission 
                ? new Date(lastSubmission.submitted_at).toLocaleDateString("id-ID", { hour: "numeric", minute: "numeric" })
                : "No data available"}
            </p>
          </div>
        </div>

        {/* Eligible Members Whitelist Size */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition duration-200">
          <div className="h-11 w-11 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="h-5.5 w-5.5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Eligible Whitelist</p>
            <h3 className="text-xl font-black text-gray-900 mt-0.5">{whitelistCount}</h3>
            <p className="text-[10px] text-gray-400 mt-0.5">members authorized to register</p>
          </div>
        </div>
      </div>

      {/* Two Column Layout (Invite Link Management + Failed attempts logging) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel 1: Registration Invite Link management */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-4">
              <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                Registration Invite Token
              </h3>
            </div>
            {activeLink ? (
              <div className="space-y-4">
                <div className="rounded-xl bg-gray-50 border border-gray-150 p-3 flex items-center justify-between gap-2 overflow-hidden shadow-inner">
                  <span className="text-xs font-mono text-gray-600 truncate select-all">
                    {activeLink.url}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handleCopyLink}
                      className="h-7 w-7 rounded-lg border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition"
                      title="Copy invite URL"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <a
                      href={activeLink.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-7 w-7 rounded-lg border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition"
                      title="Open registration site"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>

                <div className="flex gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-gray-400" />
                    Issued: {activeLink.created_at ? new Date(activeLink.created_at).toLocaleDateString("id-ID") : "Unknown"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 text-gray-400" />
                    {activeLink.submissions !== undefined ? activeLink.submissions : totalRegistered} submissions
                  </span>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center bg-gray-50/50 border border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400">
                <Link2 className="h-8 w-8 text-gray-300 mb-2" />
                <p className="text-xs font-semibold text-gray-700">No active token invite link</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Generate a new invite token link to accept submissions.</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleCloseLink}
              disabled={isClosing || !activeLink || activeLink.status === "closed"}
              className="flex-1 py-2.5 border border-red-200 hover:bg-red-50 disabled:bg-gray-100 disabled:border-gray-200 text-red-600 disabled:text-gray-400 font-bold rounded-xl text-xs transition shadow-sm flex items-center justify-center gap-1.5"
            >
              <Lock className="h-3.5 w-3.5" />
              Close Link
            </button>
            <button
              onClick={handleGenerateLink}
              disabled={isGenerating}
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold rounded-xl text-xs transition shadow flex items-center justify-center gap-1.5"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isGenerating ? "animate-spin" : ""}`} />
              New Invite Link
            </button>
          </div>
        </div>

        {/* Panel 2: Verification Attempts Lockout Logger */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-4">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <h3 className="text-sm font-bold text-gray-900">
                Failed Verification Logger
              </h3>
            </div>

            <div className="space-y-2 max-h-[120px] overflow-y-auto pr-1">
              {attempts.length === 0 ? (
                <p className="text-center py-6 text-xs text-gray-400 font-medium">
                  No failed verification attempts recorded
                </p>
              ) : (
                attempts.map((att) => (
                  <div
                    key={att.id}
                    className="flex items-center justify-between p-2.5 border border-gray-100 bg-gray-50/50 rounded-xl text-xs hover:border-gray-250 transition"
                  >
                    <div>
                      <div className="font-semibold text-gray-900">Unknown Candidate</div>
                      <div className="text-[10px] text-gray-400 font-mono mt-0.5">{att.student_id_attempted}</div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      {/* Attempt Dots */}
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, index) => {
                          const isUsed = index < (att.attempts_count || 1);
                          return (
                            <span
                              key={index}
                              className={`h-1.5 w-1.5 rounded-full ${
                                isUsed ? "bg-red-500" : "bg-gray-200"
                              }`}
                            />
                          );
                        })}
                      </div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                        att.attempts_count >= 5 
                          ? "bg-red-100 text-red-800 border border-red-200" 
                          : "bg-amber-100 text-amber-800 border border-amber-200"
                      }`}>
                        {att.attempts_count}/5 attempts
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="text-center text-[10px] text-gray-400 font-medium">
            Shows candidate ID verification failures. Users are locked out for 30 minutes after 5 failures.
          </div>
        </div>
      </div>

      {/* Main registrations table */}
      <RegistrationsTable
        registrations={registrations}
        onViewDetails={handleViewDetails}
        onResetSession={handleResetSession}
      />

      {/* Whitelist Panel */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-blue-600" />
              Candidate Whitelist Eligibility
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Student IDs whitelisted to represent candidate chairperson and vice chairpersons.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddMemberOpen(true)}
              className="py-1.5 px-3 border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Member
            </button>
            <button
              onClick={() => setIsImportCsvOpen(true)}
              className="py-1.5 px-3 border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition"
            >
              <Upload className="h-3.5 w-3.5" />
              Import CSV
            </button>
          </div>
        </div>

        {/* Whitelist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {whitelist.map((member) => (
            <div
              key={member.student_id}
              className="border border-gray-200/80 bg-gray-50/40 rounded-2xl p-3.5 flex items-center justify-between gap-3 hover:shadow-sm hover:border-gray-300 transition duration-200"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-8.5 w-8.5 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-xs flex-shrink-0 border border-blue-200">
                  {member.full_name?.substring(0, 2).toUpperCase() || "CP"}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-gray-900 text-xs truncate max-w-[120px]">
                    {member.full_name}
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono leading-none mt-1">
                    {member.student_id}
                  </div>
                </div>
              </div>

              <div>
                {member.registered ? (
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-green-100 text-green-700 border border-green-200">
                    <CheckCircle2 className="h-2.5 w-2.5 text-green-500" />
                    Registered
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-gray-100 text-gray-500 border border-gray-200">
                    Not yet
                  </span>
                )}
              </div>
            </div>
          ))}

          {/* "+X More Members" Card */}
          <div className="border border-dashed border-gray-300 rounded-2xl p-4 flex items-center justify-center text-gray-400 bg-gray-50/20 hover:bg-gray-50 transition cursor-pointer">
            <span className="text-xs font-bold text-gray-500">+14 more BEM members</span>
          </div>
        </div>
      </div>

      {/* Slide-over Side Drawer Detail */}
      <RegistrationDetailDrawer
        registration={selectedReg}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedReg(null);
        }}
        onResetSession={handleResetSession}
      />

      {/* Modal dialog: Add whitelist member */}
      <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
        <DialogContent className="sm:max-w-md bg-white rounded-2xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-gray-900 font-extrabold flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-blue-600" />
              Add Whitelist Candidate
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddMember} className="space-y-4 py-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Student ID
              </label>
              <Input
                type="text"
                placeholder="e.g. 001202400112"
                value={newMember.student_id}
                onChange={(e) => setNewMember({ ...newMember, student_id: e.target.value })}
                className="h-10 bg-gray-50/50 border-gray-200 text-xs focus-visible:ring-blue-600 rounded-xl"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Full Name
              </label>
              <Input
                type="text"
                placeholder="e.g. Raka Darmawan"
                value={newMember.full_name}
                onChange={(e) => setNewMember({ ...newMember, full_name: e.target.value })}
                className="h-10 bg-gray-50/50 border-gray-200 text-xs focus-visible:ring-blue-600 rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Campus Email
              </label>
              <Input
                type="email"
                placeholder="e.g. name@student.president.ac.id"
                value={newMember.campus_email}
                onChange={(e) => setNewMember({ ...newMember, campus_email: e.target.value })}
                className="h-10 bg-gray-50/50 border-gray-200 text-xs focus-visible:ring-blue-600 rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Major
              </label>
              <Input
                type="text"
                placeholder="e.g. Informatics"
                value={newMember.major}
                onChange={(e) => setNewMember({ ...newMember, major: e.target.value })}
                className="h-10 bg-gray-50/50 border-gray-200 text-xs focus-visible:ring-blue-600 rounded-xl"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-gray-150 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddMemberOpen(false)}
                className="h-9 hover:bg-gray-50 border-gray-200 text-gray-600 text-xs font-semibold rounded-xl"
              >
                Close
              </Button>
              <Button
                type="submit"
                disabled={isSubmittingMember}
                className="h-9 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl px-4"
              >
                {isSubmittingMember ? "Adding..." : "Add Candidate"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal dialog: Import CSV */}
      <Dialog open={isImportCsvOpen} onOpenChange={setIsImportCsvOpen}>
        <DialogContent className="sm:max-w-md bg-white rounded-2xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-gray-900 font-extrabold flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-blue-600" />
              Import Candidates CSV
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleImportCsv} className="space-y-5 py-4">
            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 hover:bg-gray-50/80 transition cursor-pointer relative">
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              {csvFile ? (
                <p className="text-xs font-bold text-gray-800 truncate max-w-xs">{csvFile.name}</p>
              ) : (
                <>
                  <p className="text-xs font-semibold text-gray-700">Choose Whitelist CSV File</p>
                  <p className="text-[10px] text-gray-400 mt-1">Select a formatted CSV file (.csv)</p>
                </>
              )}
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-gray-150">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsImportCsvOpen(false);
                  setCsvFile(null);
                }}
                className="h-9 hover:bg-gray-50 border-gray-200 text-gray-600 text-xs font-semibold rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmittingCsv || !csvFile}
                className="h-9 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl px-4"
              >
                {isSubmittingCsv ? "Importing..." : "Import CSV"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
