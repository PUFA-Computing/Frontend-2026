import apiClient from "./apiClient";
import News from "../../models/news";
import { API_NEWS } from "@/config/config";

const newsCache: { [key: string]: News } = {};

// Cache error states to prevent spam
let fetchNewsErrorLogged = false;
let lastNewsError = 0;
const ERROR_THROTTLE_MS = 60000; // Only log errors once per minute

// Simple validation - just check if URL exists and is not empty
function isValidApiUrl(url: string | undefined): boolean {
    if (!url || url.trim() === '') {
        return false;
    }
    // Check if it starts with http:// or https:// OR is a valid path
    return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/');
}

export const fetchNews = async (): Promise<News[]> => {
    try {
        // Make sure we're using the correct URL format with trailing slash
        const url = API_NEWS.endsWith('/') ? API_NEWS : `${API_NEWS}/`;

        // Validate URL
        if (!isValidApiUrl(url)) {
            const now = Date.now();
            if (!fetchNewsErrorLogged || now - lastNewsError > ERROR_THROTTLE_MS) {
                console.error("Invalid or missing API_NEWS URL:", url);
                fetchNewsErrorLogged = true;
                lastNewsError = now;
            }
            return [];
        }

        // Only log in development
        if (process.env.NODE_ENV === 'development') {
            console.log(`Fetching news from: ${url}`);
        }

        const response = await apiClient.get(url, {
            timeout: 10000, // Reduce timeout to 10 seconds
        });

        const newsDataArray = response.data?.data || [];

        // Process each news item in the array
        const processedNews = newsDataArray.map((newsItem: any) => {
            // Only process date fields if they exist
            if (newsItem.publish_date) {
                newsItem.publish_date = new Date(newsItem.publish_date);
            }
            if (newsItem.created_at) {
                newsItem.created_at = new Date(newsItem.created_at);
            }
            if (newsItem.updated_at) {
                newsItem.updated_at = new Date(newsItem.updated_at);
            }

            // Cache the news item if it has a slug
            if (newsItem.slug) {
                newsCache[newsItem.slug] = newsItem;
            }

            return newsItem;
        });

        // Reset error flag on success
        fetchNewsErrorLogged = false;
        return processedNews as News[];
    } catch (error: any) {
        const now = Date.now();
        // Only log errors once per minute to prevent spam
        if (!fetchNewsErrorLogged || now - lastNewsError > ERROR_THROTTLE_MS) {
            if (error.code === 'ECONNABORTED') {
                console.error("News API timeout - Please check if the backend is running");
            } else if (error.response) {
                console.error(`News API HTTP ${error.response.status}:`, error.response.statusText);
            } else if (error.request) {
                console.error("News API - No response received from server");
            } else {
                console.error("News API error:", error.message || error);
            }
            fetchNewsErrorLogged = true;
            lastNewsError = now;
        }
        // Return empty array instead of throwing to prevent page from crashing
        return [];
    }
};

let fetchNewsBySlugErrorLogged = false;
let lastSlugError = 0;

export const fetchNewsBySlug = async (newsSlug: string): Promise<News | null> => {
    try {
        if (newsCache[newsSlug]) {
            return newsCache[newsSlug];
        }

        // Make sure we're using the correct URL format
        const baseUrl = API_NEWS.endsWith('/') ? API_NEWS : `${API_NEWS}/`;
        const url = `${baseUrl}${newsSlug}`;

        // Validate URL
        if (!isValidApiUrl(url)) {
            const now = Date.now();
            if (!fetchNewsBySlugErrorLogged || now - lastSlugError > ERROR_THROTTLE_MS) {
                console.error("Invalid or missing news by slug URL:", url);
                fetchNewsBySlugErrorLogged = true;
                lastSlugError = now;
            }
            return null;
        }

        // Only log in development
        if (process.env.NODE_ENV === 'development') {
            console.log(`Fetching news by slug from: ${url}`);
        }

        const response = await apiClient.get(url, {
            timeout: 10000, // Reduce timeout to 10 seconds
        });

        const newsData = response.data?.data;
        if (!newsData) {
            console.error('No data returned from API');
            return null;
        }

        // Only process date fields if they exist
        if (newsData.publish_date) {
            newsData.publish_date = new Date(newsData.publish_date);
        }
        if (newsData.created_at) {
            newsData.created_at = new Date(newsData.created_at);
        }
        if (newsData.updated_at) {
            newsData.updated_at = new Date(newsData.updated_at);
        }

        newsCache[newsSlug] = newsData;

        // Reset error flag on success
        fetchNewsBySlugErrorLogged = false;
        return newsData as News;
    } catch (error: any) {
        const now = Date.now();
        // Only log errors once per minute to prevent spam
        if (!fetchNewsBySlugErrorLogged || now - lastSlugError > ERROR_THROTTLE_MS) {
            if (error.code === 'ECONNABORTED') {
                console.error(`News by slug timeout for "${newsSlug}"`);
            } else if (error.response) {
                console.error(`News by slug HTTP ${error.response.status} for "${newsSlug}"`);
            } else if (error.request) {
                console.error(`News by slug - No response for "${newsSlug}"`);
            } else {
                console.error(`News by slug error for "${newsSlug}":`, error.message || error);
            }
            fetchNewsBySlugErrorLogged = true;
            lastSlugError = now;
        }
        return null;
    }
};

interface NewsCreation {
    title: string;
    content: string;
    publish_date: Date;
    organization_id: number;
}

export const createNews = async (
    news: NewsCreation,
    file: File | null,
    accessToken: string
): Promise<News> => {
    try {
        const formData = new FormData();

        // Only append file if it exists
        if (file) {
            formData.append("file", file, file.name);
        }

        const formattedNewsData = {
            ...news,
            publish_date: new Date(news.publish_date).toISOString(),
        };

        formData.append("data", JSON.stringify(formattedNewsData));

        console.log(formattedNewsData);
        console.log(file);

        const response = await apiClient.post(`${API_NEWS}/create`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const newsData = response.data?.data;

        return newsData as News;
    } catch (error) {
        console.error("Error creating news", error);
        throw error;
    }
};

export const editNews = async (
    newsID: number,
    news: any,
    file: File | null,
    accessToken: string
): Promise<News> => {
    try {
        const formData = new FormData();

        if (file) {
            formData.append("file", file, file.name);
        }

        const formattedNewsData = {
            ...news,
            publish_date: new Date(news.publish_date).toISOString(),
        };

        formData.append("data", JSON.stringify(formattedNewsData));

        console.log("Editing news with ID:", newsID);
        console.log("Formatted news data:", formattedNewsData);
        if (file) console.log("With new thumbnail:", file.name);

        // Use R2 storage consistently as per backend changes
        const response = await apiClient.put(`${API_NEWS}/${newsID}/edit`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        console.log("Edit news response:", response.data);
        const newsData = response.data?.data;
        return newsData as News;
    } catch (error: any) {
        console.error("Error editing news:", error);
        if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
        }
        throw error;
    }
};

export const deleteNews = async (
    newsID: number,
    accessToken: string
): Promise<void> => {
    try {
        await apiClient.delete(`${API_NEWS}/${newsID}/delete`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    } catch (error) {
        console.error("Error deleting news", error);
        throw error;
    }
};