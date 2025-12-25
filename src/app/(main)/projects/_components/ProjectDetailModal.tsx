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
                <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-xl">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b">
                        <h2 className="text-2xl font-bold text-gray-900">Project Details</h2>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Project Image */}
                        <div className="w-full h-96 rounded-lg overflow-hidden bg-gray-100">
                            <img
                                src={project.image_url || "/PUComputing.png"}
                                alt={project.title}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Project Info */}
                        <div className="space-y-4">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <h3 className="text-3xl font-bold text-gray-900 mb-2">
                                        {project.title}
                                    </h3>
                                    {project.category && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Tag className="w-4 h-4" />
                                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                                                {project.category}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Vote Button */}
                                <div className="flex flex-col items-center gap-2">
                                    <button
                                        onClick={handleVoteToggle}
                                        disabled={isVoting}
                                        className={`group relative p-4 rounded-full transition-all duration-300 ${hasVoted
                                                ? "bg-red-50 hover:bg-red-100"
                                                : "bg-gray-50 hover:bg-gray-100"
                                            } ${isVoting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                                        title={status === "authenticated" ? (hasVoted ? "Remove vote" : "Vote for this project") : "Login to vote"}
                                    >
                                        <Heart
                                            className={`w-8 h-8 transition-all duration-300 ${hasVoted
                                                    ? "fill-red-500 text-red-500"
                                                    : "text-gray-400 group-hover:text-red-400"
                                                }`}
                                        />
                                        {isVoting && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                                            </div>
                                        )}
                                    </button>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-gray-900">{voteCount}</p>
                                        <p className="text-xs text-gray-500">{voteCount === 1 ? "vote" : "votes"}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="prose max-w-none">
                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {project.description}
                                </p>
                            </div>

                            {/* Metadata */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <User className="w-5 h-5" />
                                    <div>
                                        <p className="text-sm text-gray-500">Created by</p>
                                        <p className="font-medium">{project.user_name || "Unknown"}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-gray-600">
                                    <Calendar className="w-5 h-5" />
                                    <div>
                                        <p className="text-sm text-gray-500">Published on</p>
                                        <p className="font-medium">
                                            {new Date(project.created_at).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Project URL */}
                            {project.project_url && (
                                <div className="pt-4 border-t">
                                    <a
                                        href={project.project_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                        <ExternalLink className="w-5 h-5" />
                                        View Project
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
