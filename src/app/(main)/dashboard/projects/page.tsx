"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchMyProjects } from "@/services/api/project";
import { ProjectResponse } from "@/models/project";
import {
  Loader2,
  AlertCircle,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  ExternalLink,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-medium">
          <XCircle className="w-4 h-4" />
          <span>Rejected</span>
        </div>
      );
    } else if (project.is_published) {
      return (
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
          <CheckCircle className="w-4 h-4" />
          <span>Published</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium">
          <Clock className="w-4 h-4" />
          <span>Pending Approval</span>
        </div>
      );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl p-5 md:p-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              My Projects
            </h1>
            <p className="text-sm text-gray-600">
              Manage and track your submitted projects
            </p>
          </div>

          <Link href="/projects/new">
            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Add Project</span>
            </Button>
          </Link>
        </div>

        {/* Content */}
        {error ? (
          // Error State
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow-sm">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <p className="text-gray-600 mb-4">{error}</p>
            <Button
              onClick={loadMyProjects}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Try Again
            </Button>
          </div>
        ) : projects.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow-sm">
            <div className="text-center space-y-4">
              <h2 className="text-xl font-bold text-gray-900">
                No Projects Yet
              </h2>
              <p className="text-gray-600 max-w-md">
                You haven't submitted any projects yet. Share your amazing work
                with the community!
              </p>
              <Link href="/projects/new">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white mt-4">
                  <Plus className="w-5 h-5 mr-2" />
                  Submit Your First Project
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          // Projects List
          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Project Image */}
                  <div className="w-full md:w-48 h-32 flex-shrink-0">
                    <img
                      src={project.image_url || "/PUComputing.png"}
                      alt={project.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>

                  {/* Project Details */}
                  <div className="flex-grow space-y-3">
                    {/* Title and Status */}
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-xl font-bold text-gray-900">
                        {project.title}
                      </h3>
                      {getStatusBadge(project)}
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                      {project.category && (
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded">
                          {project.category}
                        </span>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(project.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Votes:</span>
                        <span>{project.vote_count}</span>
                      </div>
                    </div>

                    {/* Rejection Reason */}
                    {project.rejection_reason && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm font-medium text-red-800 mb-1">
                          Rejection Reason:
                        </p>
                        <p className="text-sm text-red-700">
                          {project.rejection_reason}
                        </p>
                      </div>
                    )}

                    {/* Approval Info */}
                    {project.is_published && project.approved_by_name && (
                      <div className="mt-2 text-xs text-gray-500">
                        Approved by {project.approved_by_name} on{" "}
                        {project.approved_at && formatDate(project.approved_at)}
                      </div>
                    )}

                    {/* Project Link */}
                    {project.project_url && (
                      <Link
                        href={project.project_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        <span>View Project</span>
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
