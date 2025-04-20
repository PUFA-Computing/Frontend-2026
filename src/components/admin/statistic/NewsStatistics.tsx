"use client";

import { useEffect, useState } from "react";
import { Line, Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
} from "chart.js";
import News from "@/models/news";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title
);

interface NewsStatisticsProps {
    news: News[];
}

export default function NewsStatistics({ news }: NewsStatisticsProps) {
    const [monthlyNews, setMonthlyNews] = useState<number[]>([]);
    const [organizationData, setOrganizationData] = useState<{
        labels: string[];
        datasets: {
            label: string;
            data: number[];
            backgroundColor: string[];
            borderColor: string[];
            borderWidth: number;
        }[];
    }>({
        labels: [],
        datasets: [
            {
                label: "News by Organization",
                data: [],
                backgroundColor: [],
                borderColor: [],
                borderWidth: 1,
            },
        ],
    });

    useEffect(() => {
        if (!news || news.length === 0) return;

        // Process news by month
        const currentYear = new Date().getFullYear();
        const monthCounts = Array(12).fill(0);
        
        news.forEach(item => {
            const newsDate = new Date(item.publish_date);
            if (newsDate.getFullYear() === currentYear) {
                monthCounts[newsDate.getMonth()]++;
            }
        });
        
        setMonthlyNews(monthCounts);

        // Process news by organization
        const orgCounts: { [key: string]: number } = {};
        news.forEach(item => {
            const org = item.organization || "Unknown";
            orgCounts[org] = (orgCounts[org] || 0) + 1;
        });

        const orgLabels = Object.keys(orgCounts).slice(0, 6); // Limit to top 6 organizations
        const orgData = orgLabels.map(org => orgCounts[org]);
        
        // Generate colors for each organization
        const backgroundColors = [
            "rgba(255, 99, 132, 0.5)",
            "rgba(54, 162, 235, 0.5)",
            "rgba(255, 206, 86, 0.5)",
            "rgba(75, 192, 192, 0.5)",
            "rgba(153, 102, 255, 0.5)",
            "rgba(255, 159, 64, 0.5)",
        ];
        
        const borderColors = [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
        ];
        
        setOrganizationData({
            labels: orgLabels,
            datasets: [
                {
                    label: "News by Organization",
                    data: orgData,
                    backgroundColor: backgroundColors.slice(0, orgLabels.length),
                    borderColor: borderColors.slice(0, orgLabels.length),
                    borderWidth: 1,
                },
            ],
        });
    }, [news]);

    // Monthly news data
    const monthlyNewsData = {
        labels: [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ],
        datasets: [
            {
                label: "News Articles",
                data: monthlyNews,
                fill: true,
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                tension: 0.4,
            },
        ],
    };

    const monthlyOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "top" as const,
            },
            title: {
                display: true,
                text: "News Publications by Month (Current Year)",
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0
                }
            }
        }
    };

    // Calculate average likes per news article
    const avgLikes = news.length > 0
        ? news.reduce((sum, item) => sum + (item.likes || 0), 0) / news.length
        : 0;

    // Find most recent news
    const mostRecentNews = news.length > 0
        ? [...news].sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime())[0]
        : null;

    // Calculate news growth (comparing current month with previous month)
    const currentMonth = new Date().getMonth();
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const currentMonthCount = monthlyNews[currentMonth] || 0;
    const previousMonthCount = monthlyNews[previousMonth] || 0;
    const newsGrowth = previousMonthCount === 0 
        ? currentMonthCount > 0 ? 100 : 0
        : ((currentMonthCount - previousMonthCount) / previousMonthCount) * 100;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">News Statistics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Avg. Likes</h3>
                    <p className="text-3xl font-bold">{avgLikes.toFixed(1)}</p>
                    <p className="text-sm text-gray-500">per article</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Latest News</h3>
                    <p className="text-xl font-bold truncate">{mostRecentNews?.title || "N/A"}</p>
                    <p className="text-sm text-gray-500">
                        {mostRecentNews 
                            ? new Date(mostRecentNews.publish_date).toISOString().split('T')[0].replace(/-/g, '/') 
                            : "No data"}
                    </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Monthly Growth</h3>
                    <p className="text-3xl font-bold">
                        {newsGrowth > 0 ? "+" : ""}{newsGrowth.toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-500">from last month</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-lg font-semibold mb-4">News by Organization</h3>
                    <div className="h-64">
                        {organizationData.labels.length > 0 && <Doughnut data={organizationData} />}
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4">Monthly Publications</h3>
                    <div className="h-64">
                        {monthlyNews.length > 0 && (
                            <Line data={monthlyNewsData} options={monthlyOptions} />
                        )}
                    </div>
                </div>
            </div>
            
            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Top News by Likes</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 px-4 text-left">Title</th>
                                <th className="py-2 px-4 text-left">Organization</th>
                                <th className="py-2 px-4 text-left">Date</th>
                                <th className="py-2 px-4 text-right">Likes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {news.length > 0 ? (
                                [...news]
                                    .sort((a, b) => (b.likes || 0) - (a.likes || 0))
                                    .slice(0, 5)
                                    .map((item, index) => (
                                        <tr key={index} className="border-t">
                                            <td className="py-2 px-4 truncate max-w-[200px]">{item.title}</td>
                                            <td className="py-2 px-4">{item.organization}</td>
                                            <td className="py-2 px-4">
                                                {new Date(item.publish_date).toISOString().split('T')[0].replace(/-/g, '/')}
                                            </td>
                                            <td className="py-2 px-4 text-right">{item.likes || 0}</td>
                                        </tr>
                                    ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="py-4 text-center text-gray-500">
                                        No news data available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
