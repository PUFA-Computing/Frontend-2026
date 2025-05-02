import { AxiosError } from "axios";
import apiClient from "./apiClient";
import { API_USER, BASE_URL } from "@/config/config";
import Event from "@/models/event";
import User from "@/models/user";

/**
 * Fetches the user profile data from the API.
 * @param {string} userId - The ID of the user to fetch.
 * @param {string} token - The access token to authenticate the request.
 * @returns {Promise<User>} A promise that resolves to a User object.
 * @throws {Error} If an error occurs during the API request.
 * @example
 * const user = await GetUserProfile('userId', 'token');
 */
export async function GetUserProfile(userId: string, token: string) {
    try {
        const response = await apiClient.get(`${API_USER}/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data?.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.log(error.response);
        } else {
            console.log(error);
        }
        throw error;
    }
}

/**
 * Updates the user profile data in the API.
 * @param {string} username - The username of the user.
 * @param {string} first_name - The first name of the user.
 * @param {string} middle_name - The middle name of the user.
 * @param {string} last_name - The last name of the user.
 * @param {string} email - The email of the user.
 * @param {string} major - The major of the user.
 * @param {string} year - The year of the user.
 * @param {string} accessToken - The access token to authenticate the request.
 * @returns {Promise<User>} A promise that resolves to a User object.
 * @throws {Error} If an error occurs during the API request.
 * @example
 * const user = await UpdateUserProfile('username', 'first_name', 'middle_name', 'last_name', 'email', 'major', 'year', 'accessToken');
 */
export async function UpdateUserProfile(
    username: string,
    first_name: string,
    middle_name: string,
    last_name: string,
    email: string,
    major: string,
    year: string,
    gender: string,
    date_of_birth: Date,
    accessToken: string
) {
    try {
        console.log('Updating user profile with data:', {
            username,
            first_name,
            middle_name,
            last_name,
            email,
            major,
            gender,
            year,
            date_of_birth: date_of_birth ? new Date(date_of_birth).toISOString() : null,
        });
        
        const response = await apiClient.put(
            `${API_USER}/edit`,
            {
                username,
                first_name,
                middle_name,
                last_name,
                email,
                major,
                gender,
                year,
                date_of_birth: date_of_birth ? new Date(date_of_birth).toISOString() : null,
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
            }
        );

        console.log('Update profile response:', response.data);
        return response.data.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error('Error updating profile:', error.response?.data || error.message);
        } else {
            console.error('Error updating profile:', error);
        }
        throw error;
    }
}

/**
 * Updates the user password in the API.
 * @param {string} password - The new password for the user.
 * @param {string} accessToken - The access token to authenticate the request.
 * @returns {Promise<User>} A promise that resolves to a User object.
 * @throws {Error} If an error occurs during the API request.
 * @example
 * const user = await UpdatePassword('newPassword', 'accessToken');
 */
export async function UpdatePassword(password: string, accessToken: string) {
    try {
        const response = await apiClient.put(
            `${API_USER}/edit`,
            {
                password,
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return response.data.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

/**
 * Deletes the user profile data in the API.
 * @returns {Promise<User>} A promise that resolves to a User object.
 * @throws {Error} If an error occurs during the API request.
 * @example
 * const user = await DeleteUserProfile();
 */
export async function DeleteUserProfile() {
    try {
        const response = await apiClient.delete(`${API_USER}/delete`);
        return response.data.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

/**
 * Logs the user out of the API.
 * @returns {Promise<User>} A promise that resolves to a User object.
 * @throws {Error} If an error occurs during the API request.
 * @example
 * const user = await Logout();
 */
export async function Logout() {
    try {
        const response = await apiClient.post(`${API_USER}/logout`);
        return response.data.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

/**
 * Fetches all users from the API using the admin endpoint.
 * @param {string} accessToken - The access token to authenticate the request.
 * @returns {Promise<User[]>} A promise that resolves to an array of User objects.
 * @throws {Error} If an error occurs during the API request.
 * @example
 * const users = await GetUser('accessToken');
 */
export async function GetUser(accessToken: string): Promise<User[]> {
    try {
        // Use the admin endpoint to get all users
        // The endpoint is /api/v1/admin/users based on the backend routes
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        const response = await apiClient.get(`${baseUrl}/api/v1/admin/users`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const data = response.data.data;
        console.log('Admin users response:', data);
        
        // Ensure we always return an array
        if (Array.isArray(data)) {
            return data;
        } else if (data && typeof data === 'object') {
            // If it's a single user object, wrap it in an array
            return [data];
        } else {
            // If it's neither an array nor an object, return an empty array
            console.error('Unexpected user data format:', data);
            return [];
        }
    } catch (error) {
        console.error('Error fetching all users from admin endpoint:', error);
        // If there's an error, let's try a fallback approach
        try {
            // Try to get the current user as a fallback
            const response = await apiClient.get(`${API_USER}/me`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            
            const userData = response.data.data;
            if (userData) {
                console.log('Fallback: Using current user data');
                return [userData];
            }
            return [];
        } catch (fallbackError) {
            console.error('Fallback approach also failed:', fallbackError);
            throw error; // Throw the original error
        }
    }
}

/**
 * Fetches all registered users from the API by making multiple requests.
 * This is a workaround until the backend implements a proper endpoint for fetching all users.
 * @param {string} accessToken - The access token to authenticate the request.
 * @returns {Promise<User[]>} A promise that resolves to an array of User objects.
 * @throws {Error} If an error occurs during the API request.
 * @example
 * const allUsers = await GetAllUsers('accessToken');
 */
export async function GetAllUsers(accessToken: string): Promise<User[]> {
    try {
        // First, get the current user to have at least one user in the list
        const currentUserResponse = await apiClient.get(`${API_USER}/me`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        
        const currentUser = currentUserResponse.data.data;
        const users: User[] = [];
        
        if (currentUser) {
            users.push(currentUser);
        }
        
        // Try to fetch users with sequential IDs
        // This is a temporary solution until the backend provides a proper endpoint
        const maxUsersToFetch = 50; // Limit to avoid too many requests
        const startId = 1;
        
        const fetchPromises = [];
        for (let i = startId; i < startId + maxUsersToFetch; i++) {
            fetchPromises.push(
                apiClient.get(`${API_USER}/${i}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }).then(response => {
                    if (response.data && response.data.data) {
                        return response.data.data;
                    }
                    return null;
                }).catch(() => null) // Silently fail for non-existent users
            );
        }
        
        const results = await Promise.all(fetchPromises);
        
        // Add all valid users to the array, avoiding duplicates
        results.forEach(user => {
            if (user && user.id) {
                // Check if this user is already in the array
                const isDuplicate = users.some(existingUser => existingUser.id === user.id);
                if (!isDuplicate) {
                    users.push(user);
                }
            }
        });
        
        return users;
    } catch (error) {
        console.error('Error fetching all users:', error);
        throw error;
    }
}

/**
 * Fetches the events that the user has registered for from the API.
 * @param {string} accessToken - The access token to authenticate the request.
 * @returns {Promise<Event[]>} A promise that resolves to an array of Event objects.
 * @throws {Error} If an error occurs during the API request.
 * @example
 * const events = await fetchUserEvents('accessToken');
 */
export async function fetchUserEvents(accessToken: string): Promise<Event[]> {
    try {
        const response = await apiClient.get(`${API_USER}/registered-events`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (Array.isArray(response.data?.data)) {
            return response.data.data;
        } else {
            console.error("Unexpected response structure:", response.data);
            return [];
        }
    } catch (error) {
        console.error("Error fetching user events", error);
        throw error;
    }
}

/**
 * Updates the user data as an admin in the API.
 * @param {string} userId - The ID of the user to update.
 * @param {number} roleID - The ID of the role to update the user to.
 * @param {boolean} studentIDVerified - Whether the student ID is verified.
 * @param {string} accessToken - The access token to authenticate the request.
 * @returns {Promise<User>} A promise that resolves to a User object.
 * @throws {Error} If an error occurs during the API request.
 * @example
 * const user = await adminUpdateUser('userId', 1, true, 'accessToken');
 */
export async function adminUpdateUser(
    userId: string | undefined,
    roleID: number | undefined,
    studentIDVerified: boolean | undefined,
    accessToken: string | undefined
): Promise<User> {
    try {
        const response = await apiClient.put(
            `${API_USER}/${userId}/update-user`,
            {
                role_id: roleID,
                student_id_verified: studentIDVerified,
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        console.log(response);

        return response.data.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

/**
 * Uploads a profile picture for the current user.
 * @param {File} file - The file to upload.
 * @param {string} accessToken - The access token to authenticate the request.
 * @returns {Promise<User>} A promise that resolves to a User object.
 * @throws {Error} If an error occurs during the API request.
 * @example
 * const user = await uploadProfilePicture(file, 'accessToken');
 * @see https://developer.mozilla.org/en-US/docs/Web/API/FormData
 */
export async function uploadProfilePicture(file: File, accessToken: string) {
    try {
        const formData = new FormData();
        formData.append("profile_picture", file);

        const response = await apiClient.post(
            `${API_USER}/upload-profile-picture`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        return response.data.data;
    } catch (error) {
        console.error("Error uploading profile picture", error);
        throw error;
    }
}

/**
 * Enables 2FA for the user.
 * @param {string} session - The session token to authenticate the request.
 * @returns {Promise<User>} A promise that resolves to a User object.
 * @throws {Error} If an error occurs during the API request.
 * @example
 * const user = await Enable2FA('sessionToken');
 */
export async function Enable2FA(session: string) {
    try {
        const response = await apiClient.post(
            `${API_USER}/2fa/enable`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${session}`,
                },
            }
        );
        return response.data.data;
    } catch (error) {
        console.log("Error enabling 2FA:", error);
        throw error;
    }
}

/**
 * Verifies the 2FA code for the user.
 * @param {Verify2FAProps} props - The properties for verification.
 * @param {string} props.passcode - The 2FA code to verify.
 * @param {string} props.accessToken - The access token to authenticate the request.
 * @returns {Promise<User>} A promise that resolves to a User object.
 * @throws {Error} If an error occurs during the API request.
 * @example
 * const user = await Verify2FA({ passcode: '123456', accessToken: 'token' });
 */

interface Verify2FAProps {
    passcode: string;
    accessToken: string;
}

export async function Verify2FA({ passcode, accessToken }: Verify2FAProps) {
    try {
        const response = await apiClient.post(
            `${API_USER}/2fa/verify`,
            {
                code: passcode,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

/**
 * Toggles the 2FA status for the user.
 * @param {string} accessToken - The access token to authenticate the request.
 * @param {boolean} enable - Whether to enable or disable 2FA.
 * @returns {Promise<User>} A promise that resolves to a User object.
 * @throws {Error} If an error occurs during the API request.
 * @example
 * const user = await Toggle2FA('accessToken', true);
 */

export async function Toggle2FA(accessToken: string, enable: boolean) {
    try {
        const response = await apiClient.post(
            `${API_USER}/2fa/toggle`,
            {
                enable: enable,
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function VerifyStudentID(file: File, accessToken: string) {
    try {
        const formData = new FormData();
        formData.append("student_id", file);

        const response = await apiClient.post(
            `${API_USER}/upload-student-id`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        return response.data.data;
    } catch (error) {
        console.error("Error uploading profile picture", error);
        throw error;
    }
}