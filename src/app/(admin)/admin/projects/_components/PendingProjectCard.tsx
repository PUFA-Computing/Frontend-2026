import { ProjectResponse } from "@/models/project";
import { Calendar, User, Tag, CheckCircle, Clock, XCircle } from "lucide-react";

interface PendingProjectCardProps {
    project: ProjectResponse;
    onClick: () => void;
}

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
    const statusConfig = {
        pending: {
            bg: "bg-amber-100",
            text: "text-amber-700",
            border: "border-amber-300",
            icon: Clock,
            label: "Pending Review"
        },
        approved: {
            bg: "bg-green-100",
            text: "text-green-700",
            border: "border-green-300",
            icon: CheckCircle,
            label: "Approved"
        },
        rejected: {
            bg: "bg-red-100",
            text: "text-red-700",
            border: "border-red-300",
            icon: XCircle,
            label: "Rejected"
        }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${config.bg} ${config.text} border ${config.border} rounded-full text-xs font-semibold`}>
            <Icon className="w-3.5 h-3.5" />
            {config.label}
        </div>
    );
};

export default function PendingProjectCard({ project, onClick }: PendingProjectCardProps) {
    return (
        <div
            onClick={onClick}
            className="group cursor-pointer bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-blue-500"
        >
            {/* Project Image */}
            <div className="relative h-48 overflow-hidden bg-gray-100">
                <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {/* Status Badge on Image */}
                <div className="absolute top-3 right-3">
                    <StatusBadge status={project.status} />
                </div>
                {project.category && (
                    <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full shadow-lg">
                            {project.category}
                        </span>
                    </div>
                )}
            </div>

            {/* Project Info */}
            <div className="p-5 space-y-3">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {project.title}
                </h3>

                <p className="text-gray-600 text-sm line-clamp-2">
                    {project.description}
                </p>

                {/* Metadata */}
                <div className="flex flex-col gap-2 pt-3 border-t border-gray-200 text-sm">
                    {/* Submitted by */}
                    <div className="flex items-center gap-2 text-gray-700">
                        <User className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">
                            {project.user?.name || "Unknown User"}
                        </span>
                    </div>

                    {/* Submission date */}
                    <div className="flex items-center gap-2 text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>
                            {new Date(project.created_at).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                            })}
                        </span>
                    </div>
                </div>

                {/* Click to view indicator */}
                <div className="pt-3 border-t border-gray-200">
                    <p className="text-blue-600 text-sm font-medium group-hover:underline">
                        Click to review →
                    </p>
                </div>
            </div>
        </div>
    );
}
