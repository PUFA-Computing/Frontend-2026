"use client";

import { useState } from "react";
import { ProjectResponse } from "@/models/project";
import { X, Calendar, User, Tag, ExternalLink, Check, XCircle } from "lucide-react";
import { approveProject, rejectProject } from "@/services/api/project";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";

interface ProjectDetailModalProps {
    project: ProjectResponse | null;
    isOpen: boolean;
    onClose: () => void;
    onProjectUpdated: () => void;
}

export default function ProjectDetailModal({
    project,
    isOpen,
    onClose,
    onProjectUpdated,
}: ProjectDetailModalProps) {
    const { data: session } = useSession();
    const [isProcessing, setIsProcessing] = useState(false);

    if (!isOpen || !project) return null;

    const handleApprove = async () => {
        const result = await Swal.fire({
            title: "Approve Project?",
            html: `
                <p>Are you sure you want to approve this project?</p>
                <p class="text-sm text-gray-600 mt-2">
                    <strong>"${project.title}"</strong> will be published and visible to all users.
                </p>
            `,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#10b981",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, Approve",
            cancelButtonText: "Cancel",
        });

        if (!result.isConfirmed) return;

        try {
            setIsProcessing(true);

            await approveProject(project.id, session?.user?.access_token || "");

            await Swal.fire({
                icon: "success",
                title: "Project Approved!",
                text: "The project has been published successfully.",
                confirmButtonColor: "#2563eb",
            });

            onProjectUpdated();
            onClose();
        } catch (error: any) {
            console.error("Error approving project:", error);
            await Swal.fire({
                icon: "error",
                title: "Approval Failed",
                text: error.response?.data?.message || "Failed to approve project. Please try again.",
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReject = async () => {
        const result = await Swal.fire({
            title: "Reject Project",
            html: `
                <p class="mb-4">Please provide a reason for rejecting this project:</p>
                <textarea
                    id="rejection-reason"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    rows="4"
                    placeholder="Enter rejection reason..."
                ></textarea>
            `,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Reject Project",
            cancelButtonText: "Cancel",
            preConfirm: () => {
                const reason = (document.getElementById("rejection-reason") as HTMLTextAreaElement)?.value;
                if (!reason || reason.trim() === "") {
                    Swal.showValidationMessage("Please provide a rejection reason");
                    return false;
                }
                return reason;
            },
        });

        if (!result.isConfirmed || !result.value) return;

        try {
            setIsProcessing(true);

            await rejectProject(project.id, result.value, session?.user?.access_token || "");

            await Swal.fire({
                icon: "success",
                title: "Project Rejected",
                text: "The project has been rejected and the user will be notified.",
                confirmButtonColor: "#2563eb",
            });

            onProjectUpdated();
            onClose();
        } catch (error: any) {
            console.error("Error rejecting project:", error);
            await Swal.fire({
                icon: "error",
                title: "Rejection Failed",
                text: error.response?.data?.message || "Failed to reject project. Please try again.",
            });
        } finally {
            setIsProcessing(false);
        }
    };

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
                            disabled={isProcessing}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Project Image */}
                        <div className="w-full h-96 rounded-lg overflow-hidden bg-gray-100">
                            <img
                                src={project.image_url}
                                alt={project.title}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Project Info */}
                        <div className="space-y-4">
                            <div>
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
                                        <p className="text-sm text-gray-500">Submitted by</p>
                                        <p className="font-medium">{project.user?.name || "Unknown"}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-gray-600">
                                    <Calendar className="w-5 h-5" />
                                    <div>
                                        <p className="text-sm text-gray-500">Submitted on</p>
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

                    {/* Footer - Action Buttons */}
                    <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
                        <button
                            onClick={onClose}
                            disabled={isProcessing}
                            className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
                        >
                            Close
                        </button>
                        <button
                            onClick={handleReject}
                            disabled={isProcessing}
                            className="px-6 py-2.5 text-white bg-red-600 rounded-lg hover:bg-red-700 font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            <XCircle className="w-5 h-5" />
                            Reject
                        </button>
                        <button
                            onClick={handleApprove}
                            disabled={isProcessing}
                            className="px-6 py-2.5 text-white bg-green-600 rounded-lg hover:bg-green-700 font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            <Check className="w-5 h-5" />
                            Approve
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
