"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchNewsBySlug, editNews } from "@/services/api/news";
import EditNewsTabs from "@/app/(admin)/admin/news/edit/[id]/_components/EditTabComponent";
import { useSession } from 'next-auth/react';
import Swal from 'sweetalert2';
import News from '@/models/news';

export default function EditNewsPage() {
    const { id } = useParams();
    const [news, setNews] = useState<News | null>(null);
    const [loading, setLoading] = useState(true);
    const session = useSession();
    const router = useRouter();

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const newsData = await fetchNewsBySlug(id as string);
                setNews(newsData);
            } catch (error) {
                console.error("Error fetching news:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to fetch news data",
                });
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchNews();
        }
    }, [id]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (!news) {
        return <div className="flex justify-center items-center h-screen">News not found</div>;
    }

    return (
        <div>
            <h1 className="text-2xl font-semibold text-gray-900">Edit News</h1>
            <EditNewsTabs news={news} />
        </div>
    );
}
