"use client";

import { useState, useEffect } from "react";
import { ProjectResponse } from "@/models/project";
import { X, Calendar, User, Tag, ExternalLink, Heart } from "lucide-react";
import { voteProject, unvoteProject, checkHasVoted } from "@/services/api/project";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface ProjectDetailModalProps {
    project: ProjectResponse | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function ProjectDetailModal({
    project,
    isOpen,
    onClose,
}: ProjectDetailModalProps) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [hasVoted, setHasVoted] = useState(false);
    const [voteCount, setVoteCount] = useState(0);
    const [isVoting, setIsVoting] = useState(false);

    // Check if user has voted when modal opens
    useEffect(() => {
        const checkVoteStatus = async () => {
            if (!project || !session?.user?.access_token) {
                setHasVoted(false);
                return;
            }

            try {
                const voted = await checkHasVoted(project.id, session.user.access_token);
                setHasVoted(voted);
            } catch (error) {
                console.error("Error checking vote status:", error);
                setHasVoted(false);
            }
        };

        if (isOpen && project) {
            setVoteCount(project.vote_count || 0);
            if (status === "authenticated") {
                checkVoteStatus();
            }
        }
    }, [isOpen, project, session, status]);

    // Prevent background scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const handleVoteToggle = async () => {
        if (!project) return;

        // Check if user is authenticated
        if (status !== "authenticated" || !session?.user?.access_token) {
            // Redirect to login
            router.push("/auth/signin");
            return;
        }

        setIsVoting(true);

        try {
            if (hasVoted) {
                // Unvote
                await unvoteProject(project.id, session.user.access_token);
                setHasVoted(false);
                setVoteCount(prev => Math.max(0, prev - 1));
            } else {
                // Vote
                await voteProject(project.id, session.user.access_token);
                setHasVoted(true);
                setVoteCount(prev => prev + 1);
            }
        } catch (error: any) {
            console.error("Error toggling vote:", error);
            // Show error message to user
            alert(error.response?.data?.message?.[0] || "Failed to update vote. Please try again.");
        } finally {
            setIsVoting(false);
        }
    };

    if (!isOpen || !project) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative w-full max-w-5xl bg-[#FAF5E8] rounded-xl shadow-[0_8px_30px_rgba(13,27,62,0.3)] border border-[#B8841E]/20 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-[#B8841E]/20 bg-[#F5EDD0]/50 backdrop-blur-sm">
                        <h2 className="text-2xl font-display font-bold text-[#0D1B3E]">Project Details</h2>
                        <button
                            onClick={onClose}
                            className="p-2 text-[#1A1A2E]/50 hover:text-[#B8841E] hover:bg-[#B8841E]/10 rounded-full transition-all"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col md:flex-row overflow-y-auto max-h-[80vh] md:max-h-[70vh]">
                        {/* Left Sidebar (Image, Metadata, Team) */}
                        <div className="w-full md:w-[45%] lg:w-[50%] shrink-0 border-r border-[#B8841E]/20 bg-[#E5D5A5]/10 p-6 flex flex-col gap-6">
                            {/* Project Image */}
                            <div className="w-full h-64 sm:h-72 lg:h-[350px] rounded-lg overflow-hidden bg-[#E5D5A5]/30 shadow-md">
                                <img
                                    src={project.image_url || "/PUComputing.png"}
                                    alt={project.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Metadata */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-[#1A1A2E]/60">
                                    <div className="p-2 bg-[#E5D5A5]/40 text-[#B8841E] rounded-full">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-serif uppercase tracking-wider text-[#1A1A2E]/50">Created by</p>
                                        <p className="font-medium font-serif text-[#0D1B3E]">{project.user_name || "Unknown"}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-[#1A1A2E]/60">
                                    <div className="p-2 bg-[#E5D5A5]/40 text-[#B8841E] rounded-full">
                                        <Calendar className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-serif uppercase tracking-wider text-[#1A1A2E]/50">Published on</p>
                                        <p className="font-medium font-serif text-[#0D1B3E]">
                                            {new Date(project.created_at).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Team Information Compact */}
                            <div className="pt-5 border-t border-[#B8841E]/20 space-y-4">
                                <h4 className="text-base font-display font-medium text-[#0D1B3E] flex items-center gap-2">
                                    <span className="h-4 w-1 rounded-full bg-[#B8841E]"></span>
                                    Team Information
                                </h4>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-[#E5D5A5]/30 px-3 py-2 border border-[#B8841E]/15 rounded-lg shadow-sm">
                                        <p className="text-[10px] font-serif text-[#B8841E] font-semibold uppercase tracking-[0.15em] mb-0.5">Major</p>
                                        <p className="text-sm font-serif font-medium text-[#0D1B3E] truncate">
                                            {project.major === 'information_system' ? 'IS' :
                                                project.major === 'informatics' ? 'IT' : (project.major || '-')}
                                        </p>
                                    </div>
                                    <div className="bg-[#E5D5A5]/30 px-3 py-2 border border-[#B8841E]/15 rounded-lg shadow-sm">
                                        <p className="text-[10px] font-serif text-[#B8841E] font-semibold uppercase tracking-[0.15em] mb-0.5">Batch</p>
                                        <p className="text-sm font-serif font-medium text-[#0D1B3E]">{project.batch || '-'}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[10px] font-serif text-[#1A1A2E]/50 mb-2 font-semibold uppercase tracking-wider">Members</p>
                                    <div className="space-y-2">
                                        {project.project_members && project.project_members.length > 0 ? (
                                            project.project_members.map((member, index) => (
                                                <div key={index} className="flex items-center justify-between bg-[#FAF5E8] border border-[#B8841E]/20 p-2 rounded-lg shadow-parch-sm">
                                                    <div className="flex items-center gap-2 overflow-hidden">
                                                        <div className="w-6 h-6 shrink-0 rounded-full bg-[#E5D5A5]/50 flex items-center justify-center text-[#B8841E]">
                                                            <User className="w-3 h-3" />
                                                        </div>
                                                        <span className="font-serif font-medium text-[#0D1B3E] text-[13px] truncate">{member}</span>
                                                    </div>
                                                    {project.linkedin_profiles && project.linkedin_profiles[index] && (
                                                        <a
                                                            href={project.linkedin_profiles[index]}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-[#B8841E] hover:text-[#D9A84A] p-1.5 hover:bg-[#B8841E]/10 shrink-0 rounded-full transition-colors"
                                                            title="LinkedIn"
                                                        >
                                                            <ExternalLink className="w-3.5 h-3.5" />
                                                        </a>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-xs font-serif text-[#1A1A2E]/40 italic">No members specified</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Content (Title, Description, Actions) */}
                        <div className="w-full md:w-[55%] lg:w-[50%] p-6 space-y-6 flex flex-col bg-transparent">
                            
                            {/* Title & Vote Row */}
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <h3 className="text-4xl lg:text-5xl font-display font-bold text-[#0D1B3E] mb-3 leading-tight tracking-tight">
                                        {project.title}
                                    </h3>
                                    {project.category && (
                                        <div className="flex items-center gap-2 text-sm font-serif text-[#1A1A2E]/70 mt-2">
                                            <Tag className="w-4 h-4 text-[#B8841E]" />
                                            <span className="px-3 py-1 bg-[#0D1B3E] text-[#EDD085] rounded-full font-semibold border border-[#B8841E]/30 shadow-sm text-xs tracking-wide">
                                                {project.category}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Vote Button */}
                                <div className="flex flex-col items-center gap-2 shrink-0">
                                    <button
                                        onClick={handleVoteToggle}
                                        disabled={isVoting}
                                        className={`group relative p-4 rounded-full transition-all duration-300 ${hasVoted
                                            ? "bg-red-900/10 hover:bg-red-900/20 border-red-500/30"
                                            : "bg-[#E5D5A5]/30 hover:bg-[#E5D5A5]/60 hover:border-[#B8841E]/40 border-transparent border"
                                            } ${isVoting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                                        title={status === "authenticated" ? (hasVoted ? "Remove vote" : "Vote for this project") : "Login to vote"}
                                    >
                                        <Heart
                                            className={`w-7 h-7 lg:w-8 lg:h-8 transition-all duration-300 ${hasVoted
                                                ? "fill-[#dc2626] text-[#dc2626]"
                                                : "text-[#1A1A2E]/40 group-hover:text-[#dc2626]"
                                                }`}
                                        />
                                        {isVoting && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-6 h-6 border-2 border-[#1A1A2E]/20 border-t-[#B8841E] rounded-full animate-spin"></div>
                                            </div>
                                        )}
                                    </button>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold font-display text-[#0D1B3E]">{voteCount}</p>
                                        <p className="text-[10px] font-serif text-[#1A1A2E]/50 uppercase tracking-[0.2em]">{voteCount === 1 ? "VOTE" : "VOTES"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Project URL Primary CTA */}
                            {project.project_url && (
                                <div className="pt-2">
                                    <a
                                        href={project.project_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center w-full px-5 py-3.5 rounded-lg bg-[#FAF5E8] border border-[#B8841E] gap-2 text-[#0D1B3E] hover:text-[#B8841E] hover:bg-[#F0E6C8] transition-all duration-300 font-serif font-medium shadow-parch-sm group"
                                    >
                                        <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                        Launch / View Live Project
                                    </a>
                                </div>
                            )}

                            {/* Description */}
                            <div className="prose max-w-none flex-grow">
                                <h4 className="text-xl font-display font-medium text-[#0D1B3E] mb-4 flex items-center gap-2">
                                    <span className="h-6 w-1.5 rounded-full bg-[#B8841E]"></span>
                                    About this Project
                                </h4>
                                <div className="bg-white/50 p-6 rounded-lg border border-[#B8841E]/15 shadow-sm">
                                    <p className="text-[#1A1A2E]/85 font-serif text-[16px] lg:text-[17px] leading-relaxed whitespace-pre-wrap">
                                        {project.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end p-5 border-t border-[#B8841E]/20 bg-[#F5EDD0]/50 backdrop-blur-sm">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 font-serif font-medium tracking-wide text-[#F5EDD0] bg-[#0D1B3E] rounded-md hover:bg-[#152347] hover:shadow-lg transition-all duration-300"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
