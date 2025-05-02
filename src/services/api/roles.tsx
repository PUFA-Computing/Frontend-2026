import { API_ROLE, API_USER } from "@/config/config";
import apiClient from "./apiClient";

export async function GetRoles(accessToken: string) {
    try {
        const response = await apiClient.get(`${API_ROLE}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return response.data.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
