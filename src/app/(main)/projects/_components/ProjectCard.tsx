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
            className="group flex flex-col gap-4 rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:border-blue-300 overflow-hidden cursor-pointer"
        >
            {/* Project Image */}
            <div className="relative w-full h-48 md:h-56 overflow-hidden bg-gray-100">
                <img
                    src={project.image_url || "/PUComputing.png"}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {project.category && (
                    <div className="absolute top-3 right-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-600 text-white shadow-md">
                            {project.category}
                        </span>
                    </div>
                )}
            </div>

            {/* Project Content */}
            <div className="flex flex-col flex-grow p-4 space-y-3">
                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {project.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 line-clamp-3 flex-grow">
                    {project.description}
                </p>

                {/* Metadata */}
                <div className="flex flex-col gap-2 pt-3 border-t border-gray-100">
                    {/* Author */}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <User className="w-3.5 h-3.5" />
                        <span>{project.user_name}</span>
                    </div>

                    {/* Date and Votes */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{formatDate(project.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-blue-600 font-medium">
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
                        className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors mt-2"
                    >
                        <span>View Project</span>
                        <ExternalLink className="w-4 h-4" />
                    </Link>
                )}
            </div>
        </div>
    );
}
