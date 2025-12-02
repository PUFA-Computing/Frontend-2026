import { API_VERSION } from "@/config/config";
import axios from "axios";

export default async function GetVersion() {
    try {
        const response = await fetch(API_VERSION, {
            cache: 'no-store',
            next: { revalidate: 0 }
        });

        // Check if response is ok (status 200-299)
        if (!response.ok) {
            if (response.status === 404) {
                console.error(`HTTP ${response.status}: Not Found - Version endpoint does not exist`);
            } else {
                console.error(`Failed to fetch version: HTTP ${response.status}: ${response.statusText}`);
            }
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to fetch version:", error);
        return null;
    }
}

export interface ChangelogEntry {
    [version: string]: string[];
}

export interface ChangelogResponse {
    changelog: ChangelogEntry[];
}

export async function GetChangeLog(): Promise<ChangelogResponse | null> {
    try {
        const response = await fetch(`${API_VERSION}/changelog`);
        if (!response.status) {
            throw new Error('Failed to fetch');
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch log : ", error);
        return null;
    }
}
