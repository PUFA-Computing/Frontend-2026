"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchProjects } from "@/services/api/project";
import { ProjectResponse } from "@/models/project";
import ProjectCard from "./_components/ProjectCard";
import ProjectDetailModal from "./_components/ProjectDetailModal";
import { Plus, Loader2, AlertCircle, Lightbulb, Code2, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProjectsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [projects, setProjects] = useState<ProjectResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedProject, setSelectedProject] = useState<ProjectResponse | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const loadProjects = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchProjects();
                setProjects(data);
            } catch (err: any) {
                console.error("Error loading projects:", err);
                setError("Failed to load projects. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        loadProjects();
    }, []);

    const handleProjectClick = (project: ProjectResponse) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProject(null);
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-800 to-purple-900 px-4 py-20 sm:px-6 md:px-8 lg:px-16">
                {/* Decorative elements */}
                <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-blue-500 opacity-10"></div>
                <div className="absolute -right-20 bottom-10 h-60 w-60 rounded-full bg-purple-500 opacity-10"></div>
                <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-indigo-500 opacity-5"></div>

                <div className="relative mx-auto max-w-7xl">
                    <div className="relative z-10 max-w-3xl">
                        <div className="mb-6 inline-flex items-center rounded-full bg-indigo-500/20 px-4 py-1 backdrop-blur-sm">
                            <Code2 className="mr-2 h-4 w-4 text-indigo-100" />
                            <p className="text-sm font-medium text-indigo-100">Faculty of Computer Science</p>
                        </div>
                        <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                            CS <span className="text-amber-400">Projects</span>
                        </h1>
                        <p className="mb-8 text-xl text-indigo-100">
                            Discover amazing projects created by our talented computizens. Get inspired and share your own work!
                        </p>

                        {/* Add Project Button - Only visible when logged in */}
                        {status === "authenticated" && session && (
                            <div className="flex flex-wrap gap-4">
                                <Link href="/projects/new">
                                    <button className="rounded-full bg-amber-500 px-6 py-3 font-medium text-white transition-all hover:bg-amber-600 hover:shadow-lg flex items-center gap-2">
                                        <Plus className="w-5 h-5" />
                                        Submit Your Project
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Projects Section */}
            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:px-8 lg:px-10">
                <div className="mb-8 flex items-center">
                    <div className="mr-4 rounded-full bg-indigo-100 p-2">
                        <Rocket className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Featured Projects</h2>
                        <p className="text-gray-600">Explore innovative work from our community</p>
                    </div>
                </div>

                {loading ? (
                    // Loading State
                    <div className="flex flex-col items-center justify-center py-16">
                        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
                        <p className="text-gray-600">Loading projects...</p>
                    </div>
                ) : error ? (
                    // Error State
                    <div className="flex flex-col items-center justify-center py-16">
                        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                        <p className="text-gray-600 mb-4">{error}</p>
                        <Button
                            onClick={() => window.location.reload()}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            Try Again
                        </Button>
                    </div>
                ) : projects.length === 0 ? (
                    // Empty State
                    <div className="flex flex-col items-center justify-center py-16 space-y-6">
                        <div className="text-center animate-fade-in">
                            <h2 className="text-3xl md:text-4xl font-black mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                No Projects Yet
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
                                Be the first to showcase your amazing work! Share your projects
                                with the computizen community.
                            </p>
                        </div>

                        <div className="relative w-full max-w-2xl h-64 md:h-80 mt-8">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-lg overflow-hidden">
                                <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-blue-100 rounded-full opacity-70"></div>
                                <div className="absolute -top-16 -left-16 w-64 h-64 bg-purple-100 rounded-full opacity-70"></div>

                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-6 w-full max-w-lg">
                                        {[1, 2, 3, 4, 5, 6].map((item) => (
                                            <div
                                                key={item}
                                                className="aspect-square bg-white rounded-lg shadow-md flex items-center justify-center hover:scale-105 transition-transform duration-300"
                                            >
                                                <div className="w-full h-full bg-gray-200 rounded-lg animate-pulse"></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Projects Grid
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {projects.map((project) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                onClick={() => handleProjectClick(project)}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* Project Detail Modal */}
            <ProjectDetailModal
                project={selectedProject}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </div>
    );
}
