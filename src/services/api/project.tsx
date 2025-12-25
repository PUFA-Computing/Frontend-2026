import apiClient from "./apiClient";
import Project, { ProjectResponse, CreateProjectRequest } from "@/models/project";
import { API_PROJECTS } from "@/config/config";
import { cacheManager, CACHE_TTL } from "@/lib/cacheManager";

/**
 * Fetches a list of published projects from the API endpoint.
 * 
 * @param category Optional category filter
 * @param page Optional page number for pagination
 * @returns {Promise<ProjectResponse[]>} A promise that resolves to an array of ProjectResponse objects.
 * @throws {Error} If an error occurs during the API request.
 */
export const fetchProjects = async (
    category?: string,
    page?: number
): Promise<ProjectResponse[]> => {
    const cacheKey = `projects:all:${category || 'all'}:${page || 1}`;

    // Try to get from cache first
    const cached = cacheManager.get<ProjectResponse[]>(cacheKey);
    if (cached) {
        console.log('[Projects] Returning cached projects');
        return cached;
    }

    try {
        // Build query parameters
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (page) params.append('page', page.toString());

        const queryString = params.toString();
        const url = queryString ? `${API_PROJECTS}?${queryString}` : API_PROJECTS;

        // Make a GET request to the API endpoint
        const response = await apiClient.get(url);

        // Extract project data from the response
        const projectData = response.data?.data || [];

        // Cache the projects
        cacheManager.set(cacheKey, projectData, CACHE_TTL.EVENTS);

        // Return the array of ProjectResponse objects
        return projectData as ProjectResponse[];
    } catch (error) {
        // Log an error message but return empty array instead of throwing
        console.error("Error fetching projects", error);
        // Return empty array to prevent page from crashing
        return [];
    }
};

/**
 * Fetches a single project by its ID from the API endpoint.
 * 
 * @param projectId The ID of the project to fetch
 * @returns {Promise<ProjectResponse>} A promise that resolves to the ProjectResponse object.
 * @throws {Error} If an error occurs during the API request.
 */
export const fetchProjectById = async (
    projectId: number
): Promise<ProjectResponse> => {
    const cacheKey = `projects:id:${projectId}`;

    // Try to get from cache first
    const cached = cacheManager.get<ProjectResponse>(cacheKey);
    if (cached) {
        console.log(`[Projects] Returning cached project: ${projectId}`);
        return cached;
    }

    try {
        // Make a GET request to the API endpoint
        const response = await apiClient.get(`${API_PROJECTS}/${projectId}`);

        // Extract the project data from the response
        const projectData = response.data?.data;

        // Cache the project data
        cacheManager.set(cacheKey, projectData, CACHE_TTL.EVENTS);

        // Return the ProjectResponse object
        return projectData as ProjectResponse;
    } catch (error) {
        // Log an error message and rethrow the error
        console.error(`Error fetching project with ID ${projectId}`, error);
        throw error;
    }
};

/**
 * Creates a new project using the specified data and sends it to the API endpoint.
 * 
 * @param projectData The data for the new project
 * @param file The image file for the project
 * @param accessToken The access token for the user
 * @returns {Promise<Project>} A promise that resolves to the newly created Project object.
 * @throws {Error} If an error occurs during the API request.
 */
export const createProject = async (
    projectData: CreateProjectRequest,
    file: File,
    accessToken: string
): Promise<Project> => {
    try {
        const formData = new FormData();

        // Append the image file
        formData.append("file", file, file.name);

        // Convert projectData to JSON string and append it
        formData.append("data", JSON.stringify(projectData));

        console.log('=== DEBUG: Creating Project ===');
        console.log('Project data:', projectData);
        console.log('File:', file.name, file.size, file.type);
        console.log('Access token exists:', !!accessToken);
        console.log('Access token length:', accessToken?.length);
        console.log('API URL:', `${API_PROJECTS}/create`);
        console.log('Full URL will be:', API_PROJECTS);

        // Make a POST request to the API endpoint
        // Note: Don't set Content-Type manually for FormData - axios will set it with boundary
        const response = await apiClient.post(`${API_PROJECTS}/create`, formData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        console.log('=== SUCCESS: Project created ===');
        console.log('Response:', response.data);

        // Extract the newly created project data from the response
        const newProjectData = response.data?.data;

        // Invalidate projects cache since we created a new project
        cacheManager.invalidate('projects:*');

        // Return the newly created Project object
        return newProjectData as Project;
    } catch (error: any) {
        // Log an error message and rethrow the error
        console.error("=== ERROR: Creating project ===");
        console.error("Error object:", error);
        console.error("Error response:", error.response);
        console.error("Error response data:", error.response?.data);
        console.error("Error response status:", error.response?.status);
        console.error("Error response headers:", error.response?.headers);
        console.error("Error config:", error.config);
        console.error("Error config URL:", error.config?.url);
        console.error("Error config headers:", error.config?.headers);
        throw error;
    }
};

/**
 * Fetches all projects created by the current authenticated user.
 * 
 * @param accessToken The access token for the user
 * @returns {Promise<ProjectResponse[]>} A promise that resolves to an array of user's projects.
 * @throws {Error} If an error occurs during the API request.
 */
export const fetchMyProjects = async (
    accessToken: string
): Promise<ProjectResponse[]> => {
    try {
        // Make a GET request to the API endpoint
        const response = await apiClient.get(`${API_PROJECTS}/my-projects`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        // Extract the project data from the response
        const projectData = response.data?.data || [];

        // Return the array of ProjectResponse objects
        return projectData as ProjectResponse[];
    } catch (error) {
        // Log an error message and rethrow the error
        console.error("Error fetching user's projects", error);
        throw error;
    }
};

/**
 * Fetches all pending projects (admin only).
 * 
 * @param accessToken The access token for the admin user
 * @returns {Promise<ProjectResponse[]>} A promise that resolves to an array of pending projects.
 * @throws {Error} If an error occurs during the API request.
 */
export const fetchPendingProjects = async (
    accessToken: string
): Promise<ProjectResponse[]> => {
    try {
        // Make a GET request to the API endpoint
        const response = await apiClient.get(`${API_PROJECTS}/pending`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        // Extract the project data from the response
        const projectData = response.data?.data || [];

        // Return the array of ProjectResponse objects
        return projectData as ProjectResponse[];
    } catch (error) {
        // Log an error message and rethrow the error
        console.error("Error fetching pending projects", error);
        throw error;
    }
};

/**
 * Fetches all projects regardless of status (admin only).
 * 
 * @param accessToken The access token for the admin user
 * @returns {Promise<ProjectResponse[]>} A promise that resolves to an array of all projects.
 * @throws {Error} If an error occurs during the API request.
 */
export const fetchAllProjectsAdmin = async (
    accessToken: string
): Promise<ProjectResponse[]> => {
    try {
        // Make a GET request to the API endpoint
        const response = await apiClient.get(`${API_PROJECTS}/all`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        // Extract the project data from the response
        const projectData = response.data?.data || [];

        // Return the array of ProjectResponse objects
        return projectData as ProjectResponse[];
    } catch (error) {
        // Log an error message and rethrow the error
        console.error("Error fetching all projects (admin)", error);
        throw error;
    }
};


/**
 * Approves a project (admin only).
 * 
 * @param projectId The ID of the project to approve
 * @param accessToken The access token for the admin user
 * @returns {Promise<Project>} A promise that resolves to the approved project.
 * @throws {Error} If an error occurs during the API request.
 */
export const approveProject = async (
    projectId: number,
    accessToken: string
): Promise<Project> => {
    try {
        // Make a PUT request to the API endpoint
        const response = await apiClient.put(
            `${API_PROJECTS}/${projectId}/approve`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        // Extract the approved project data from the response
        const approvedProject = response.data?.data;

        // Invalidate projects cache since we approved a project
        cacheManager.invalidate('projects:*');

        // Return the approved Project object
        return approvedProject as Project;
    } catch (error) {
        // Log an error message and rethrow the error
        console.error(`Error approving project ${projectId}`, error);
        throw error;
    }
};

/**
 * Rejects a project with a reason (admin only).
 * 
 * @param projectId The ID of the project to reject
 * @param reason The reason for rejection
 * @param accessToken The access token for the admin user
 * @returns {Promise<Project>} A promise that resolves to the rejected project.
 * @throws {Error} If an error occurs during the API request.
 */
export const rejectProject = async (
    projectId: number,
    reason: string,
    accessToken: string
): Promise<Project> => {
    try {
        // Make a PUT request to the API endpoint
        const response = await apiClient.put(
            `${API_PROJECTS}/${projectId}/reject`,
            { reason },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        // Extract the rejected project data from the response
        const rejectedProject = response.data?.data;

        // Invalidate projects cache
        cacheManager.invalidate('projects:*');

        // Return the rejected Project object
        return rejectedProject as Project;
    } catch (error) {
        // Log an error message and rethrow the error
        console.error(`Error rejecting project ${projectId}`, error);
        throw error;
    }
};


/**
 * Votes for a project (authenticated users only).
 * 
 * @param projectId The ID of the project to vote for
 * @param accessToken The access token for the authenticated user
 * @returns {Promise<any>} A promise that resolves to the vote data.
 * @throws {Error} If an error occurs during the API request.
 */
export const voteProject = async (
    projectId: number,
    accessToken: string
): Promise<any> => {
    try {
        const response = await apiClient.post(
            `${API_PROJECTS}/${projectId}/vote`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        // Invalidate projects cache since vote count changed
        cacheManager.invalidate('projects:*');

        return response.data?.data;
    } catch (error) {
        console.error(`Error voting for project ${projectId}`, error);
        throw error;
    }
};

/**
 * Removes vote from a project (authenticated users only).
 * 
 * @param projectId The ID of the project to unvote
 * @param accessToken The access token for the authenticated user
 * @returns {Promise<void>}
 * @throws {Error} If an error occurs during the API request.
 */
export const unvoteProject = async (
    projectId: number,
    accessToken: string
): Promise<void> => {
    try {
        await apiClient.delete(
            `${API_PROJECTS}/${projectId}/unvote`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        // Invalidate projects cache since vote count changed
        cacheManager.invalidate('projects:*');
    } catch (error) {
        console.error(`Error unvoting project ${projectId}`, error);
        throw error;
    }
};

/**
 * Checks if the current user has voted for a project.
 * 
 * @param projectId The ID of the project to check
 * @param accessToken The access token for the authenticated user
 * @returns {Promise<boolean>} A promise that resolves to true if user has voted, false otherwise.
 * @throws {Error} If an error occurs during the API request.
 */
export const checkHasVoted = async (
    projectId: number,
    accessToken: string
): Promise<boolean> => {
    try {
        const response = await apiClient.get(
            `${API_PROJECTS}/${projectId}/votes/check`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        return response.data?.data || false;
    } catch (error) {
        console.error(`Error checking vote status for project ${projectId}`, error);
        return false;
    }
};

/**
 * Gets the vote count for a project (public endpoint).
 * 
 * @param projectId The ID of the project
 * @returns {Promise<number>} A promise that resolves to the vote count.
 * @throws {Error} If an error occurs during the API request.
 */
export const getProjectVoteCount = async (
    projectId: number
): Promise<number> => {
    try {
        const response = await apiClient.get(
            `${API_PROJECTS}/${projectId}/votes/count`
        );

        return response.data?.vote_count || 0;
    } catch (error) {
        console.error(`Error getting vote count for project ${projectId}`, error);
        return 0;
    }
};

