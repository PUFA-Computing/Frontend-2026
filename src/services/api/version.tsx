import { API_VERSION } from "@/config/config";

// Cache error states to prevent spam
let versionErrorLogged = false;
let changelogErrorLogged = false;

// Validate URL before making requests
function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

export default async function GetVersion() {
    try {
        // Validate the URL first
        if (!isValidUrl(API_VERSION)) {
            if (!versionErrorLogged) {
                console.error("Invalid API_VERSION URL:", API_VERSION);
                versionErrorLogged = true;
            }
            return null;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch(API_VERSION, {
            signal: controller.signal,
            headers: {
                'Accept': 'application/json',
            },
        });

        clearTimeout(timeoutId);

        // Check if response is OK
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        // Check content type
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error(`Expected JSON but received ${contentType}`);
        }

        const data = await response.json();
        versionErrorLogged = false; // Reset error flag on success
        return data;
    } catch (error) {
        if (!versionErrorLogged) {
            if (error instanceof Error) {
                if (error.name === 'AbortError') {
                    console.error("Version fetch timeout - API took too long to respond");
                } else {
                    console.error("Failed to fetch version:", error.message);
                }
            } else {
                console.error("Failed to fetch version:", error);
            }
            versionErrorLogged = true;
        }
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
        const changelogUrl = `${API_VERSION}/changelog`;

        // Validate the URL first
        if (!isValidUrl(changelogUrl)) {
            if (!changelogErrorLogged) {
                console.error("Invalid changelog URL:", changelogUrl);
                changelogErrorLogged = true;
            }
            return null;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch(changelogUrl, {
            signal: controller.signal,
            headers: {
                'Accept': 'application/json',
            },
        });

        clearTimeout(timeoutId);

        // Check if response is OK
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        // Check content type
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error(`Expected JSON but received ${contentType}`);
        }

        const data = await response.json();
        changelogErrorLogged = false; // Reset error flag on success
        return data;
    } catch (error) {
        if (!changelogErrorLogged) {
            if (error instanceof Error) {
                if (error.name === 'AbortError') {
                    console.error("Changelog fetch timeout - API took too long to respond");
                } else {
                    console.error("Failed to fetch changelog:", error.message);
                }
            } else {
                console.error("Failed to fetch changelog:", error);
            }
            changelogErrorLogged = true;
        }
        return null;
    }
}
