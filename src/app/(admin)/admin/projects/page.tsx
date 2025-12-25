"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ProjectResponse } from "@/models/project";
import { fetchPendingProjects } from "@/services/api/project";
import PendingProjectCard from "./_components/PendingProjectCard";
import ProjectDetailModal from "./_components/ProjectDetailModal";
import Title from "@/components/admin/Title";
import {
    FolderIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    CheckCircleIcon,
    ClockIcon,
    XCircleIcon
} from "@heroicons/react/24/outline";
import { Loader2 } from "lucide-react";

export default function AdminProjectsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [projects, setProjects] = useState<ProjectResponse[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<ProjectResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedProject, setSelectedProject] = useState<ProjectResponse | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Filter states
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all");

    // Get unique categories from projects
    const categories = ["all", ...Array.from(new Set(projects.map(p => p.category).filter(Boolean)))];

    // Count projects by status
    const pendingCount = projects.filter(p => p.status === "pending").length;
    const approvedCount = projects.filter(p => p.status === "approved").length;
    const rejectedCount = projects.filter(p => p.status === "rejected").length;

    // Fetch all pending projects
    const loadProjects = async () => {
        if (!session?.user?.access_token) return;

        try {
            setLoading(true);
            setError(null);
            const data = await fetchPendingProjects(session.user.access_token);
            setProjects(data);
            setFilteredProjects(data);
        } catch (err: any) {
            console.error("Error loading projects:", err);
            setError(err.response?.data?.message || "Failed to load projects");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin");
            return;
        }

        if (status === "authenticated") {
            loadProjects();
        }
    }, [status, session]);

    // Apply filters
    useEffect(() => {
        let filtered = projects;

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(project =>
                project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Category filter
        if (selectedCategory !== "all") {
            filtered = filtered.filter(project => project.category === selectedCategory);
        }

        // Status filter
        if (selectedStatus !== "all") {
            filtered = filtered.filter(project => project.status === selectedStatus);
        }

        setFilteredProjects(filtered);
    }, [searchQuery, selectedCategory, selectedStatus, projects]);

    const handleProjectClick = (project: ProjectResponse) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProject(null);
    };

    const handleProjectUpdated = () => {
        loadProjects();
    };

    if (status === "loading" || loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading projects...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="text-red-500 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Failed to load projects</h3>
                <p className="text-sm text-gray-500 mt-1">{error}</p>
                <button
                    onClick={loadProjects}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <FolderIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <Title
                            title="Project Approval Management"
                            subtitle="Review and approve/reject all project submissions from students"
                        />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by title, description, or author..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div className="md:w-48">
                        <div className="relative">
                            <FunnelIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                            >
                                <option value="all">All Categories</option>
                                {categories.filter(c => c !== "all").map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Results count */}
                <div className="mt-3 text-sm text-gray-600">
                    Showing <span className="font-semibold text-gray-900">{filteredProjects.length}</span> of <span className="font-semibold text-gray-900">{projects.length}</span> projects
                </div>
            </div>

            {/* Projects Grid */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                {filteredProjects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="p-4 bg-gray-100 rounded-full mb-4">
                            <FolderIcon className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {searchQuery || selectedCategory !== "all" || selectedStatus !== "all"
                                ? "No projects match your filters"
                                : "No Projects"}
                        </h3>
                        <p className="text-gray-600 max-w-md">
                            {searchQuery || selectedCategory !== "all" || selectedStatus !== "all"
                                ? "Try adjusting your search or filter criteria"
                                : "There are no projects in the system yet."}
                        </p>
                        {(searchQuery || selectedCategory !== "all" || selectedStatus !== "all") && (
                            <button
                                onClick={() => {
                                    setSearchQuery("");
                                    setSelectedCategory("all");
                                    setSelectedStatus("all");
                                }}
                                className="mt-4 px-4 py-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProjects.map((project) => (
                            <PendingProjectCard
                                key={project.id}
                                project={project}
                                onClick={() => handleProjectClick(project)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Project Detail Modal */}
            <ProjectDetailModal
                project={selectedProject}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onProjectUpdated={handleProjectUpdated}
            />
        </div>
    );
}
