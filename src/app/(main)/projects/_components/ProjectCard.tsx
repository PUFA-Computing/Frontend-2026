import Link from "next/link";
import { ProjectResponse } from "@/models/project";
import { ExternalLink, Calendar, User, ThumbsUp } from "lucide-react";

interface ProjectCardProps {
    project: ProjectResponse;
    onClick?: () => void;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div
            onClick={onClick}
            className="group flex flex-col gap-4 rounded-lg border border-[#B8841E]/20 bg-[#FAF5E8] shadow-sm transition-all duration-300 hover:shadow-parch-lg hover:border-[#B8841E]/50 overflow-hidden cursor-pointer"
        >
            {/* Project Image */}
            <div className="relative w-full h-48 md:h-56 overflow-hidden bg-[#E5D5A5]/30">
                <img
                    src={project.image_url || "/PUComputing.png"}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {project.category && (
                    <div className="absolute top-3 right-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#0D1B3E] text-[#EDD085] shadow-md border border-[#B8841E]/30">
                            {project.category}
                        </span>
                    </div>
                )}
            </div>

            {/* Project Content */}
            <div className="flex flex-col flex-grow p-4 space-y-3">
                {/* Title */}
                <h3 className="text-lg font-display font-bold text-[#0D1B3E] line-clamp-2 group-hover:text-[#B8841E] transition-colors">
                    {project.title}
                </h3>

                {/* Description */}
                <p className="text-sm font-serif text-[#1A1A2E]/70 line-clamp-3 flex-grow">
                    {project.description}
                </p>

                {/* Metadata */}
                <div className="flex flex-col gap-2 pt-3 border-t border-[#B8841E]/20">
                    {/* Author */}
                    <div className="flex items-center gap-2 text-xs font-serif text-[#1A1A2E]/60">
                        <User className="w-3.5 h-3.5" />
                        <span>{project.user_name}</span>
                    </div>

                    {/* Date and Votes */}
                    <div className="flex items-center justify-between text-xs font-serif text-[#1A1A2E]/60">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{formatDate(project.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[#B8841E] font-medium">
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>{project.vote_count}</span>
                        </div>
                    </div>
                </div>

                {/* Project Link */}
                {project.project_url && (
                    <Link
                        href={project.project_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-serif font-medium text-[#0D1B3E] hover:text-[#B8841E] transition-colors mt-2"
                    >
                        <span>View Project</span>
                        <ExternalLink className="w-4 h-4" />
                    </Link>
                )}
            </div>
        </div>
    );
}
