import { API_ASPIRATION, API_USER } from "@/config/config";
import apiClient from "./apiClient";
import Aspirations from "@/models/aspiration";

export const fetchAspirations = async (): Promise<Aspirations[]> => {
    try {
        const response = await apiClient.get(API_ASPIRATION);
        let aspirationData = (response.data.data as Aspirations[]) || [];

        aspirationData = aspirationData.map((aspiration: Aspirations) => {
            aspiration.created_at = new Date(aspiration.created_at);
            aspiration.updated_at = new Date(aspiration.updated_at);
            return aspiration;
        });

        return aspirationData as Aspirations[];
    } catch (error) {
        // Log an error message and rethrow the error.
        console.error("Error fetching aspirations", error);
        throw error;
    }
};

export const CreateAspiration = async (
    data: {
        subject: string;
        organization_id: number;
        anonymous: boolean;
        closed: boolean;
        message: string;
    },
    accessToken: string
) => {
    try {
        const response = await apiClient.post(`${API_ASPIRATION}/create`, data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        // Log an error message and rethrow the error.
        console.error("Error creating aspiration", error);
        throw error;
    }
};

export const GetAspirationById = async (id: number): Promise<Aspirations> => {
    try {
        const response = await apiClient.get(`${API_ASPIRATION}/${id}`);
        console.log('Raw API response:', response);
        
        // Ekstrak data aspirasi dari respons API
        // Periksa apakah data ada di dalam property data atau langsung di response.data
        let aspirationData = response.data.data || response.data;
        console.log('Extracted aspiration data:', aspirationData);
        
        // Jika data masih dalam bentuk string (JSON), parse dulu
        if (typeof aspirationData === 'string') {
            try {
                aspirationData = JSON.parse(aspirationData);
            } catch (e) {
                console.error('Failed to parse aspiration data:', e);
            }
        }
        
        // Pastikan data adalah objek
        if (!aspirationData || typeof aspirationData !== 'object') {
            console.error('Invalid aspiration data format:', aspirationData);
            throw new Error('Invalid aspiration data format');
        }
        
        // Pastikan semua properti yang diperlukan ada
        const aspiration: Aspirations = {
            id: aspirationData.id || 0,
            user_id: aspirationData.user_id || '',
            subject: aspirationData.subject || 'No Subject',
            message: aspirationData.message || 'No Message',
            anonymous: aspirationData.anonymous || false,
            organization_id: aspirationData.organization_id || 0,
            closed: aspirationData.closed || false,
            created_at: aspirationData.created_at ? new Date(aspirationData.created_at) : new Date(),
            updated_at: aspirationData.updated_at ? new Date(aspirationData.updated_at) : new Date(),
            upvote: aspirationData.upvote || 0,
            admin_reply: aspirationData.admin_reply || '',
            organization: aspirationData.organization || { name: 'Unknown Organization' },
            author: {
                name: aspirationData.author?.name || 'Anonymous',
                profile_picture: aspirationData.author?.profile_picture || '',
                verified: aspirationData.author?.verified || false
            }
        };
        
        console.log('Processed aspiration object:', aspiration);
        return aspiration;
    } catch (error) {
        // Log an error message and rethrow the error.
        console.error("Error fetching aspiration", error);
        throw error;
    }
};

export const AdminReplyAspiration = async (
    id: number | string,
    admin_reply: string,
    accessToken: string
) => {
    try {
        // Ekstrak angka dari ID, pastikan hanya menggunakan digit
        let numericId;
        if (typeof id === 'string') {
            // Ekstrak hanya digit dari string ID
            const matches = id.match(/\d+/);
            if (matches && matches[0]) {
                numericId = parseInt(matches[0], 10);
            } else {
                numericId = 0; // Default jika tidak ada digit
            }
        } else {
            numericId = id;
        }
        
        console.log(`Sending reply to aspiration ID: ${numericId}`);
        
        // PENTING: Backend mengharapkan string langsung, bukan objek JSON
        // Lihat baris 248 di backend/internal/handlers/aspirations/aspirations_handlers.go:
        // if err := c.BindJSON(&adminReply); err != nil { ... }
        
        // Gunakan URL yang benar dengan ID numerik
        const url = `${API_ASPIRATION}/${numericId}/admin_reply`;
        console.log('Request URL:', url);
        console.log('Request data (string):', admin_reply);
        
        // Kirim permintaan dengan string langsung sebagai data
        const response = await apiClient.post(
            url,
            JSON.stringify(admin_reply), // Kirim string yang sudah di-stringify
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );
        
        console.log('Response:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('Error in AdminReplyAspiration:', error);
        console.error('Error details:', error.response?.data);
        
        // Tampilkan error yang lebih detail untuk debugging
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
            console.error('Headers:', error.response.headers);
        } else if (error.request) {
            console.error('Request was made but no response received');
            console.error(error.request);
        } else {
            console.error('Error setting up request:', error.message);
        }
        
        throw error;
    }
};

export const DeleteAspiration = async (id: number | string, accessToken: string): Promise<{ success: boolean; message: string }> => {
    try {
        let numericId: number;
        
        // Convert string ID to number if needed
        if (typeof id === 'string') {
            // Extract numeric part if it's a string like "aspiration-123"
            const match = id.match(/\d+/);
            if (match) {
                numericId = parseInt(match[0], 10);
            } else {
                numericId = 0;
            }
        } else {
            numericId = id;
        }
        
        console.log(`Deleting aspiration with ID: ${numericId}`);
        
        // The full URL will be: http://localhost:8080/api/v1/aspirations/{id}/delete
        const response = await apiClient.delete(`/aspirations/${numericId}/delete`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        
        return { success: true, message: "Aspiration deleted successfully" };
    } catch (error: any) {
        console.error("Error in DeleteAspiration:", error);
        
        // Log detailed error information for debugging
        console.error("Error response:", error.response);
        console.error("Error status:", error.response?.status);
        console.error("Error data:", error.response?.data);
        
        // Check for foreign key constraint violation in various error formats
        const errorMessage = error.response?.data?.message;
        const errorString = typeof errorMessage === 'string' 
            ? errorMessage 
            : Array.isArray(errorMessage) 
                ? errorMessage[0] 
                : JSON.stringify(error.response?.data);
                
        console.log("Processed error string:", errorString);
        
        // Check for foreign key constraint in the error message
        if (error.response?.status === 500 && 
            errorString && 
            (errorString.includes("foreign key constraint") || 
             errorString.includes("FK") || 
             errorString.includes("reference") || 
             errorString.includes("aspirations_upvote"))) {
            
            console.log("Foreign key constraint violation detected!");
            return { 
                success: false, 
                message: "This aspiration cannot be deleted because it has upvotes. Please contact the administrator to remove the upvotes first."
            };
        }
        
        // Return a generic error message for other errors
        return { 
            success: false, 
            message: error.response?.data?.message?.[0] || "An error occurred while deleting the aspiration"
        };
    }
};