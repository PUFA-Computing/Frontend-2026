import { API_ASPIRATION, API_USER } from "@/config/config";
import axios from "axios";
import Aspirations from "@/models/aspiration";
import { dummyAspirations } from "@/data/dummy/aspirations";

export const fetchAspirations = async (): Promise<Aspirations[]> => {
    // try {
    //     const response = await axios.get(API_ASPIRATION);

    //     // Pastikan response.data ada dan sesuai format
    //     if (!response.data || !response.data.data) {
    //         return [];
    //     }

    //     let aspirationData = response.data.data;

    //     // Pastikan aspirationData adalah array
    //     if (!Array.isArray(aspirationData)) {
    //         return [];
    //     }

    //     return aspirationData.map((aspiration: Aspirations) => ({
    //         ...aspiration,
    //         created_at: new Date(aspiration.created_at),
    //         updated_at: new Date(aspiration.updated_at),
    //     }));
    // } catch (error) {
    //     console.error("Error fetching aspirations:", error);
    //     return []; // Return empty array instead of throwing
    // }
    return dummyAspirations;
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
        const response = await axios.post(`${API_ASPIRATION}/create`, data, {
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

export const GetAspirationById = async (id: number): Promise<Aspirations | null> => {
    // Using dummy data instead of API call
    const aspiration = dummyAspirations.find(asp => asp.id === id);
    if (!aspiration) {
        console.error("Aspiration not found");
        return null;
    }
    return aspiration;
};

export const AdminReplyAspiration = async (
    id: number,
    admin_reply: string,
    accessToken: string
) => {
    try {
        const response = await axios.post(
            `${API_ASPIRATION}/${id}/admin_reply`,
            admin_reply,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        // Log an error message and rethrow the error.
        console.error("Error replying to aspiration", error);
        throw error;
    }
};
