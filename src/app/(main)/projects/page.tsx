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
            {/* Hero Section */}
            <section className="relative w-full flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden bg-[#F5EDD0]">
                <div className="absolute inset-0 bg-gradient-to-b from-[#EDE0BB]/80 to-[#F5EDD0]" />
                
                {/* Top corner ornaments */}
                <div className="absolute top-28 left-8 w-12 h-12 border-l border-t border-[#B8841E]/40 hidden md:block" />
                <div className="absolute top-28 right-8 w-12 h-12 border-r border-t border-[#B8841E]/40 hidden md:block" />

                <div className="relative container mx-auto px-6 flex flex-col items-center text-center max-w-4xl z-10">
                    <div className="mb-6 inline-flex items-center justify-center border border-[#B8841E]/30 bg-[#FAF5E8]/60 px-4 py-1.5 shadow-parch-sm">
                        <Code2 className="mr-2 h-4 w-4 text-[#B8841E]" />
                        <p className="font-serif text-xs tracking-[0.2em] font-medium text-[#B8841E] uppercase">Faculty of Computing</p>
                    </div>
                    <h1 className="font-display italic text-6xl sm:text-7xl md:text-8xl text-[#0D1B3E] mb-6 leading-[0.9]">
                        CS <span className="text-[#B8841E]">Projects</span>
                    </h1>
                    
                    {/* Ornamental rule */}
                    <div className="flex items-center justify-center gap-3 w-full mb-6">
                        <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#B8841E]/40" />
                        <span className="text-[#B8841E]/50 text-xs">✦</span>
                        <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#B8841E]/40" />
                    </div>
                    
                    <p className="font-serif text-lg text-[#1A1A2E]/65 max-w-2xl text-balance mb-8">
                        Discover amazing projects created by our talented computizens. Get inspired and share your own work!
                    </p>

                    {/* Add Project Button - Only visible when logged in */}
                    {status === "authenticated" && session && (
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/projects/new">
                                <button className="font-serif px-8 py-3 text-sm tracking-wide border border-[#0D1B3E] text-[#F5EDD0] bg-[#0D1B3E] transition-all duration-300 hover:bg-[#0D1B3E]/90 hover:shadow-parch-lg flex items-center gap-2">
                                    <Plus className="w-5 h-5" />
                                    Submit Your Project
                                </button>
                            </Link>
                        </div>
                    )}
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
