import apiClient from "./apiClient";
import { API_PERMISSION, API_ROLE } from "@/config/config";

export async function getPermission(accessToken: string) {
    try {
        const response = await apiClient.get(`${API_PERMISSION}/list`, {
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

export async function assignPermissionToRole(
    data: {
        permission_id: number;
        role_id: number;
    },
    accessToken: string,
    roleID: number
) {
    try {
        const response = await apiClient.post(
            `${API_PERMISSION}/assign/${roleID}`,
            data,
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
