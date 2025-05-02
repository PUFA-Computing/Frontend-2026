import apiClient from "./apiClient";
import News from "../../models/news";
import { API_NEWS } from "@/config/config";

const newsCache: { [key: string]: News } = {};

export const fetchNews = async (): Promise<News[]> => {
    try {
        const response = await apiClient.get(API_NEWS);
        const newsData = response.data?.data || [];
        newsData.publish_date = new Date(newsData.publish_date);
        newsData.created_at = new Date(newsData.created_at);
        newsData.updated_at = new Date(newsData.updated_at);

        newsCache[newsData.slug] = newsData;

        return newsData as News[];
    } catch (error) {
        console.error("Error fetching news", error);
        throw error;
    }
};

export const fetchNewsBySlug = async (newsSlug: string): Promise<News> => {
    try {
        if (newsCache[newsSlug]) {
            return newsCache[newsSlug];
        }

        const response = await apiClient.get(`${API_NEWS}/${newsSlug}`);

        const newsData = response.data?.data;
        newsData.publish_date = new Date(newsData.publish_date);
        newsData.created_at = new Date(newsData.created_at);
        newsData.updated_at = new Date(newsData.updated_at);

        newsCache[newsSlug] = newsData;

        return newsData as News;
    } catch (error) {
        console.error("Error fetching news", error);
        throw error;
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
    file: File,
    accessToken: string
): Promise<News> => {
    try {
        const formData = new FormData();

        formData.append("file", file, file.name);

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