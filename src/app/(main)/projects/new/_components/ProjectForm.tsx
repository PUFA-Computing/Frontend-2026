"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { z } from "zod";
import Swal from "sweetalert2";
import { createProject } from "@/services/api/project";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Upload, X, Loader2 } from "lucide-react";
import TeamMembers, { TeamMember } from "./TeamMembers";

// Form validation schema
const ProjectFormSchema = z.object({
    title: z.string().min(5, {
        message: "Title must be at least 5 characters",
    }),
    description: z.string().min(10, {
        message: "Description must be at least 10 characters",
    }),
    category: z.string().optional(),
    project_url: z.string().url({
        message: "Please enter a valid URL",
    }).optional().or(z.literal("")),
    major: z.enum(["information_system", "informatics"], {
        required_error: "Please select a major",
    }),
    batch: z.string().refine((val) => {
        const year = parseInt(val);
        return year >= 2021 && year <= 2025;
    }, {
        message: "Batch must be between 2021 and 2025",
    }),
});

type ProjectFormData = z.infer<typeof ProjectFormSchema>;

const PROJECT_CATEGORIES = [
    "Website",
    "Mobile App",
    "AI/Machine Learning",
    "System/Backend",
    "Game Development",
    "Data Science",
    "IoT",
    "Other",
];

export default function ProjectForm() {
    const router = useRouter();
    const { data: session } = useSession();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [fileError, setFileError] = useState<string>("");

    // Team Members State
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([{ name: "", linkedinUrl: "" }]);
    const [teamErrors, setTeamErrors] = useState<{ [key: number]: { name?: string; linkedinUrl?: string } }>({});

    // Form state
    const [formData, setFormData] = useState<ProjectFormData>({
        title: "",
        description: "",
        category: "",
        project_url: "",
        major: "information_system", // Default value
        batch: "2025", // Default value
    });

    const [errors, setErrors] = useState<Partial<Record<keyof ProjectFormData, string>>>({});

    // Handle file selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFileError("");
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
        if (!allowedTypes.includes(file.type)) {
            setFileError("Please upload a valid image file (JPEG, JPG, or PNG)");
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setFileError("File size must be less than 5MB");
            return;
        }

        setSelectedFile(file);

        // Create preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    // Remove selected file
    const handleRemoveFile = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setFileError("");
    };

    // Validate Team Members
    const validateTeamMembers = () => {
        const errors: { [key: number]: { name?: string; linkedinUrl?: string } } = {};
        let isValid = true;

        if (teamMembers.length === 0) {
            // Should not happen due to UI restrictions, but good to check
            return false;
        }

        teamMembers.forEach((member, index) => {
            const memberErrors: { name?: string; linkedinUrl?: string } = {};

            if (!member.name.trim()) {
                memberErrors.name = "Name is required";
                isValid = false;
            }

            if (!member.linkedinUrl.trim()) {
                memberErrors.linkedinUrl = "LinkedIn URL is required";
                isValid = false;
            } else {
                // Simple URL validation
                try {
                    new URL(member.linkedinUrl);
                    if (!member.linkedinUrl.includes("linkedin.com/")) {
                        memberErrors.linkedinUrl = "Must be a LinkedIn URL";
                        isValid = false;
                    }
                } catch {
                    memberErrors.linkedinUrl = "Invalid URL";
                    isValid = false;
                }
            }

            if (Object.keys(memberErrors).length > 0) {
                errors[index] = memberErrors;
            }
        });

        setTeamErrors(errors);
        return isValid;
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        // Validate required image
        if (!selectedFile) {
            setFileError("Project image is required");
            return;
        }

        // Validate form data
        const result = ProjectFormSchema.safeParse(formData);

        // Validate team members
        const isTeamValid = validateTeamMembers();

        if (!result.success) {
            const fieldErrors: Partial<Record<keyof ProjectFormData, string>> = {};
            result.error.issues.forEach((issue) => {
                const field = issue.path[0] as keyof ProjectFormData;
                fieldErrors[field] = issue.message;
            });
            setErrors(fieldErrors);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        if (!isTeamValid) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        // Check authentication
        if (!session?.user?.access_token) {
            await Swal.fire({
                icon: "error",
                title: "Authentication Required",
                text: "Please login to create a project",
            });
            router.push("/auth/signin");
            return;
        }

        try {
            setIsSubmitting(true);

            // Prepare project data
            const projectData = {
                title: result.data.title,
                description: result.data.description,
                ...(result.data.category && { category: result.data.category }),
                ...(result.data.project_url && { project_url: result.data.project_url }),
                major: result.data.major,
                batch: parseInt(result.data.batch),
                project_members: teamMembers.map(m => m.name),
                linkedin_profiles: teamMembers.map(m => m.linkedinUrl)
            };

            // Create project
            await createProject(
                projectData,
                selectedFile,
                session.user.access_token
            );

            // Show success message
            await Swal.fire({
                icon: "success",
                title: "Project Submitted!",
                html: `
                    <p>Your project has been successfully submitted.</p>
                    <p class="text-sm text-gray-600 mt-2">
                        It will be reviewed by our team and published once approved.
                    </p>
                `,
                confirmButtonText: "OK",
                confirmButtonColor: "#2563eb",
            });

            // Redirect to projects page after user clicks OK
            router.push("/projects");
        } catch (error: any) {
            console.error("Error creating project:", error);

            const errorMessage = error.response?.data?.message ||
                error.message ||
                "There was an error creating your project. Please try again.";

            await Swal.fire({
                icon: "error",
                title: "Submission Failed",
                text: errorMessage,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Project Title <span className="text-red-500">*</span>
                </label>
                <Input
                    id="title"
                    type="text"
                    placeholder="Enter your project title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    disabled={isSubmitting}
                    className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && (
                    <p className="text-xs text-red-500">{errors.title}</p>
                )}
            </div>

            {/* Description */}
            <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description <span className="text-red-500">*</span>
                </label>
                <Textarea
                    id="description"
                    placeholder="Describe your project in detail"
                    rows={5}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    disabled={isSubmitting}
                    className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && (
                    <p className="text-xs text-red-500">{errors.description}</p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category */}
                <div className="space-y-2">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        Category (Optional)
                    </label>
                    <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                        disabled={isSubmitting}
                    >
                        <SelectTrigger id="category" className="w-full">
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup className="bg-white">
                                <SelectLabel>Project Categories</SelectLabel>
                                {PROJECT_CATEGORIES.map((category) => (
                                    <SelectItem key={category} value={category}>
                                        {category}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* Major (New Field) */}
                <div className="space-y-2">
                    <label htmlFor="major" className="block text-sm font-medium text-gray-700">
                        Major <span className="text-red-500">*</span>
                    </label>
                    <Select
                        value={formData.major}
                        onValueChange={(value: "information_system" | "informatics") => setFormData({ ...formData, major: value })}
                        disabled={isSubmitting}
                    >
                        <SelectTrigger id="major" className={errors.major ? "border-red-500 w-full" : "w-full"}>
                            <SelectValue placeholder="Select Major" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup className="bg-white">
                                <SelectItem value="information_system">Information System</SelectItem>
                                <SelectItem value="informatics">Informatics</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {errors.major && (
                        <p className="text-xs text-red-500">{errors.major}</p>
                    )}
                </div>

                {/* Batch (New Field) */}
                <div className="space-y-2">
                    <label htmlFor="batch" className="block text-sm font-medium text-gray-700">
                        Batch <span className="text-red-500">*</span>
                    </label>
                    <Select
                        value={formData.batch}
                        onValueChange={(value) => setFormData({ ...formData, batch: value })}
                        disabled={isSubmitting}
                    >
                        <SelectTrigger id="batch" className={errors.batch ? "border-red-500 w-full" : "w-full"}>
                            <SelectValue placeholder="Select Batch" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup className="bg-white">
                                <SelectItem value="2025">2025</SelectItem>
                                <SelectItem value="2024">2024</SelectItem>
                                <SelectItem value="2023">2023</SelectItem>
                                <SelectItem value="2022">2022</SelectItem>
                                <SelectItem value="2021">2021</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {errors.batch && (
                        <p className="text-xs text-red-500">{errors.batch}</p>
                    )}
                </div>

                {/* Project URL */}
                <div className="space-y-2">
                    <label htmlFor="project_url" className="block text-sm font-medium text-gray-700">
                        Project URL (Optional)
                    </label>
                    <Input
                        id="project_url"
                        type="url"
                        placeholder="https://github.com/username/project"
                        value={formData.project_url}
                        onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
                        disabled={isSubmitting}
                        className={errors.project_url ? "border-red-500" : ""}
                    />
                    {errors.project_url && (
                        <p className="text-xs text-red-500">{errors.project_url}</p>
                    )}
                    <p className="text-xs text-gray-500">
                        Link to your GitHub, GitLab, or project demo
                    </p>
                </div>
            </div>

            {/* Team Members Component (New) */}
            <div className="border-t pt-6 pb-2">
                <TeamMembers
                    members={teamMembers}
                    setMembers={setTeamMembers}
                    errors={teamErrors}
                    disabled={isSubmitting}
                />
            </div>

            {/* Image Upload */}
            <div className="space-y-2 pt-4 border-t">
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                    Project Image <span className="text-red-500">*</span>
                </label>

                {/* Preview */}
                {previewUrl ? (
                    <div className="relative w-full h-64 rounded-lg border-2 border-gray-300 overflow-hidden">
                        <img
                            src={previewUrl}
                            alt="Project preview"
                            className="w-full h-full object-cover"
                        />
                        <button
                            type="button"
                            onClick={handleRemoveFile}
                            disabled={isSubmitting}
                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center justify-center w-full">
                        <label
                            htmlFor="image"
                            className={`flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg ${isSubmitting
                                ? "cursor-not-allowed bg-gray-100"
                                : "cursor-pointer bg-gray-50 hover:bg-gray-100"
                                }`}
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload
                                    className={`w-10 h-10 mb-3 ${isSubmitting ? "text-gray-400" : "text-gray-500"
                                        }`}
                                />
                                <p
                                    className={`mb-2 text-sm ${isSubmitting ? "text-gray-400" : "text-gray-500"
                                        }`}
                                >
                                    <span className="font-semibold">Click to upload</span> or drag
                                    and drop
                                </p>
                                <p
                                    className={`text-xs ${isSubmitting ? "text-gray-400" : "text-gray-500"
                                        }`}
                                >
                                    PNG, JPG or JPEG (MAX. 5MB)
                                </p>
                            </div>
                            <input
                                id="image"
                                type="file"
                                className="hidden"
                                accept="image/jpeg,image/jpg,image/png"
                                onChange={handleFileChange}
                                disabled={isSubmitting}
                            />
                        </label>
                    </div>
                )}

                {fileError && <p className="text-xs text-red-500">{fileError}</p>}
            </div>

            {/* Submit Button */}
            <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                    </>
                ) : (
                    "Submit Project"
                )}
            </Button>

            <p className="text-xs text-center text-gray-500">
                Your project will be reviewed by an admin before being published
            </p>
        </form>
    );
}
