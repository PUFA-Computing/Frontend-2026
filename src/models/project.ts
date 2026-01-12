export interface Project {
    id: number;
    user_id: string;
    title: string;
    description: string;
    category?: string | null;
    project_url?: string | null;
    image_url: string;
    project_members?: string[];
    linkedin_profiles?: string[];
    major?: string;
    batch?: number;
    is_published: boolean;
    vote_count: number;
    approved_by?: string | null;
    approved_at?: string | null;
    rejection_reason?: string | null;
    created_at: string;
    updated_at: string;
}

export interface ProjectResponse extends Project {
    user_name: string;
    approved_by_name?: string | null;
}

export interface CreateProjectRequest {
    title: string;
    description: string;
    category?: string;
    project_url?: string;
    project_members?: string[];
    linkedin_profiles?: string[];
    major?: string;
    batch?: number;
}

export default Project;
