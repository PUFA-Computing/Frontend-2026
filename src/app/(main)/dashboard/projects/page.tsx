"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchMyProjects } from "@/services/api/project";
import { ProjectResponse } from "@/models/project";
import { Loader2, AlertCircle, Plus, Clock, CheckCircle, XCircle, ExternalLink, Calendar } from "lucide-react";

export default function DashboardProjectsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [projects, setProjects] = useState<ProjectResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin");
            return;
        }
        if (status === "authenticated" && session?.user?.access_token) {
            loadMyProjects();
        }
    }, [status, session, router]);

    const loadMyProjects = async () => {
        if (!session?.user?.access_token) return;
        try {
            setLoading(true);
            setError(null);
            const data = await fetchMyProjects(session.user.access_token);
            setProjects(data);
        } catch (err: any) {
            console.error("Error loading my projects:", err);
            setError("Failed to load your projects. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (project: ProjectResponse) => {
        if (project.rejection_reason) {
            return (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-red-50 border border-red-200/60 text-red-600 text-xs font-serif">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Rejected</span>
                </div>
            );
        } else if (project.is_published) {
            return (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-[#B8841E]/8 border border-[#B8841E]/20 text-[#B8841E] text-xs font-serif">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Published</span>
                </div>
            );
        } else {
            return (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-[#0D1B3E]/6 border border-[#0D1B3E]/15 text-[#0D1B3E]/60 text-xs font-serif">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Pending</span>
                </div>
            );
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    };

    if (status === "loading" || loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-7 h-7 animate-spin text-[#B8841E]" />
                    <p className="font-serif text-sm text-[#1A1A2E]/50">Loading projects…</p>
                </div>
            </div>
        );
    }

    if (!session) return null;

    return (
        <div className="space-y-6">

            {/* ── Page heading ── */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <p className="font-serif text-[10px] tracking-[0.22em] uppercase text-[#B8841E] mb-1">Dashboard</p>
                    <h1 className="font-display italic text-3xl sm:text-4xl text-[#0D1B3E]">My Projects</h1>
                    <div className="flex items-center gap-3 mt-3">
                        <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-[#B8841E]/40 to-transparent" />
                        <span className="text-[#B8841E]/40 text-[10px]">✦</span>
                        <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-[#B8841E]/40 to-transparent" />
                    </div>
                    <p className="font-serif text-sm text-[#1A1A2E]/50 mt-3">
                        Manage and track your submitted projects.
                    </p>
                </div>
                <Link href="/projects/new">
                    <button className="shrink-0 flex items-center gap-2 px-5 py-2.5 font-serif text-sm text-[#EDD085] border border-[#B8841E]/40 bg-[#0D1B3E] hover:bg-[#152347] hover:border-[#B8841E]/70 rounded-sm transition-all duration-250 shadow-sm">
                        <Plus className="w-4 h-4" />
                        <span>Add Project</span>
                    </button>
                </Link>
            </div>

            {/* ── Content ── */}
            {error ? (
                <div className="bg-[#FAF5E8] border border-[#B8841E]/20 rounded-sm flex flex-col items-center justify-center py-16 text-center">
                    <AlertCircle className="w-10 h-10 text-red-400 mb-3" />
                    <p className="font-serif text-sm text-[#1A1A2E]/60 mb-4">{error}</p>
                    <button
                        onClick={loadMyProjects}
                        className="px-5 py-2 font-serif text-sm text-[#EDD085] border border-[#B8841E]/40 bg-[#0D1B3E] hover:bg-[#152347] rounded-sm transition-all duration-250"
                    >
                        Try Again
                    </button>
                </div>
            ) : projects.length === 0 ? (
                <div className="bg-[#FAF5E8] border border-[#B8841E]/20 rounded-sm flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-14 h-14 rounded-full bg-[#B8841E]/10 border border-[#B8841E]/20 flex items-center justify-center mb-5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-[#B8841E]">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V13M20 13V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V13M20 13H17.4142C17.149 13 16.8946 13.1054 16.7071 13.2929L14.2929 15.7071C14.1054 15.8946 13.851 16 13.5858 16H10.4142C10.149 16 9.89464 15.8946 9.70711 15.7071L7.29289 13.2929C7.10536 13.1054 6.851 13 6.58579 13H4" />
                        </svg>
                    </div>
                    <h2 className="font-display italic text-xl text-[#0D1B3E] mb-2">No Projects Yet</h2>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#B8841E]/30" />
                        <span className="text-[#B8841E]/40 text-[10px]">✦</span>
                        <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#B8841E]/30" />
                    </div>
                    <p className="font-serif text-sm text-[#1A1A2E]/50 max-w-sm mb-6">
                        You haven't submitted any projects yet. Share your amazing work with the community!
                    </p>
                    <Link href="/projects/new">
                        <button className="flex items-center gap-2 px-5 py-2.5 font-serif text-sm text-[#EDD085] border border-[#B8841E]/40 bg-[#0D1B3E] hover:bg-[#152347] rounded-sm transition-all duration-250">
                            <Plus className="w-4 h-4" />
                            Submit Your First Project
                        </button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="bg-[#FAF5E8] border border-[#B8841E]/18 rounded-sm shadow-sm hover:shadow-md hover:border-[#B8841E]/35 transition-all duration-250 p-5"
                        >
                            <div className="flex flex-col sm:flex-row gap-5">
                                {/* Image */}
                                <div className="w-full sm:w-40 h-28 shrink-0 overflow-hidden rounded-sm border border-[#B8841E]/15">
                                    <img
                                        src={project.image_url || "/PUComputing.png"}
                                        alt={project.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Details */}
                                <div className="flex-1 space-y-2.5 min-w-0">
                                    <div className="flex items-start justify-between gap-3">
                                        <h3 className="font-display italic text-lg text-[#0D1B3E] leading-tight">{project.title}</h3>
                                        {getStatusBadge(project)}
                                    </div>

                                    <p className="font-serif text-sm text-[#1A1A2E]/55 line-clamp-2 leading-relaxed">{project.description}</p>

                                    <div className="flex flex-wrap items-center gap-3 text-xs font-serif text-[#1A1A2E]/40">
                                        {project.category && (
                                            <span className="px-2 py-0.5 bg-[#B8841E]/8 border border-[#B8841E]/18 text-[#B8841E] rounded-sm">
                                                {project.category}
                                            </span>
                                        )}
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            <span>{formatDate(project.created_at)}</span>
                                        </div>
                                        <span>{project.vote_count} votes</span>
                                    </div>

                                    {project.rejection_reason && (
                                        <div className="p-3 bg-red-50/70 border border-red-200/50 rounded-sm">
                                            <p className="font-serif text-xs font-medium text-red-700 mb-1">Rejection Reason:</p>
                                            <p className="font-serif text-xs text-red-600">{project.rejection_reason}</p>
                                        </div>
                                    )}

                                    {project.is_published && project.approved_by_name && (
                                        <p className="font-serif text-xs text-[#1A1A2E]/35">
                                            Approved by {project.approved_by_name}
                                            {project.approved_at && ` · ${formatDate(project.approved_at)}`}
                                        </p>
                                    )}

                                    {project.project_url && (
                                        <Link
                                            href={project.project_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 font-serif text-xs text-[#B8841E] hover:text-[#D9A84A] transition-colors duration-200"
                                        >
                                            <span>View Project</span>
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
