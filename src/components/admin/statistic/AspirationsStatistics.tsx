"use client";

import { useEffect, useState } from "react";
import { Pie, Line } from "react-chartjs-2";
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
import Aspirations from "@/models/aspiration";

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

interface AspirationsStatisticsProps {
    aspirations: Aspirations[];
}

export default function AspirationsStatistics({ aspirations }: AspirationsStatisticsProps) {
    const [statusData, setStatusData] = useState<{
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
                label: "Aspiration Status",
                data: [],
                backgroundColor: [],
                borderColor: [],
                borderWidth: 1,
            },
        ],
    });

    const [monthlyData, setMonthlyData] = useState<{
        labels: string[];
        datasets: {
            label: string;
            data: number[];
            backgroundColor: string;
            borderColor: string;
            tension: number;
            fill: boolean;
        }[];
    }>({
        labels: [],
        datasets: [
            {
                label: "Aspirations",
                data: [],
                backgroundColor: "rgba(255, 159, 64, 0.2)",
                borderColor: "rgba(255, 159, 64, 1)",
                tension: 0.4,
                fill: true,
            },
        ],
    });

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
                label: "Aspirations by Organization",
                data: [],
                backgroundColor: [],
                borderColor: [],
                borderWidth: 1,
            },
        ],
    });

    useEffect(() => {
        if (!aspirations || aspirations.length === 0) return;

        // Process aspirations by status (open/closed)
        const openAspirations = aspirations.filter(item => !item.closed).length;
        const closedAspirations = aspirations.filter(item => item.closed).length;
        
        setStatusData({
            labels: ["Open", "Closed"],
            datasets: [
                {
                    label: "Aspiration Status",
                    data: [openAspirations, closedAspirations],
                    backgroundColor: [
                        "rgba(255, 159, 64, 0.5)",
                        "rgba(75, 192, 192, 0.5)",
                    ],
                    borderColor: [
                        "rgba(255, 159, 64, 1)",
                        "rgba(75, 192, 192, 1)",
                    ],
                    borderWidth: 1,
                },
            ],
        });

        // Process aspirations by month
        const currentYear = new Date().getFullYear();
        const monthCounts = Array(12).fill(0);
        
        aspirations.forEach(item => {
            const date = new Date(item.created_at);
            if (date.getFullYear() === currentYear) {
                monthCounts[date.getMonth()]++;
            }
        });
        
        setMonthlyData({
            labels: [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ],
            datasets: [
                {
                    label: "Aspirations",
                    data: monthCounts,
                    backgroundColor: "rgba(255, 159, 64, 0.2)",
                    borderColor: "rgba(255, 159, 64, 1)",
                    tension: 0.4,
                    fill: true,
                },
            ],
        });

        // Process aspirations by organization
        const orgCounts: { [key: string]: number } = {};
        aspirations.forEach(item => {
            const org = item.organization?.name || "Unknown";
            orgCounts[org] = (orgCounts[org] || 0) + 1;
        });

        // Sort organizations by count and take top 5
        const sortedOrgs = Object.entries(orgCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
            
        // Generate colors for each organization
        const backgroundColors = [
            "rgba(255, 99, 132, 0.5)",
            "rgba(54, 162, 235, 0.5)",
            "rgba(255, 206, 86, 0.5)",
            "rgba(75, 192, 192, 0.5)",
            "rgba(153, 102, 255, 0.5)",
        ];
        
        const borderColors = [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
        ];
        
        setOrganizationData({
            labels: sortedOrgs.map(([org]) => org),
            datasets: [
                {
                    label: "Aspirations by Organization",
                    data: sortedOrgs.map(([, count]) => count),
                    backgroundColor: backgroundColors.slice(0, sortedOrgs.length),
                    borderColor: borderColors.slice(0, sortedOrgs.length),
                    borderWidth: 1,
                },
            ],
        });
    }, [aspirations]);

    // Calculate response rate (percentage of aspirations with admin replies)
    const responseRate = aspirations.length > 0
        ? (aspirations.filter(item => item.admin_reply && item.admin_reply.trim() !== "").length / aspirations.length) * 100
        : 0;

    // Calculate average upvotes per aspiration
    const avgUpvotes = aspirations.length > 0
        ? aspirations.reduce((sum, item) => sum + (item.upvote || 0), 0) / aspirations.length
        : 0;

    // Calculate anonymous submission rate
    const anonymousRate = aspirations.length > 0
        ? (aspirations.filter(item => item.anonymous).length / aspirations.length) * 100
        : 0;

    // Calculate average response time (in days) - this is a placeholder calculation
    // In a real system, you'd need to track when each aspiration was responded to
    const avgResponseTime = 2.3; // Placeholder value

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Aspirations Statistics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-amber-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Response Rate</h3>
                    <p className="text-3xl font-bold">{responseRate.toFixed(1)}%</p>
                    <p className="text-sm text-gray-500">of aspirations answered</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Avg. Response Time</h3>
                    <p className="text-3xl font-bold">{avgResponseTime.toFixed(1)} days</p>
                    <p className="text-sm text-gray-500">to respond to aspirations</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Avg. Upvotes</h3>
                    <p className="text-3xl font-bold">{avgUpvotes.toFixed(1)}</p>
                    <p className="text-sm text-gray-500">per aspiration</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Anonymous Rate</h3>
                    <p className="text-3xl font-bold">{anonymousRate.toFixed(1)}%</p>
                    <p className="text-sm text-gray-500">submitted anonymously</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-lg font-semibold mb-4">Aspiration Status</h3>
                    <div className="h-64">
                        {statusData.labels.length > 0 && <Pie data={statusData} />}
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4">Aspirations by Organization</h3>
                    <div className="h-64">
                        {organizationData.labels.length > 0 && <Pie data={organizationData} />}
                    </div>
                </div>
            </div>
            
            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Monthly Aspirations</h3>
                <div className="h-80">
                    {monthlyData.labels.length > 0 && (
                        <Line 
                            data={monthlyData}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        position: "top" as const,
                                    },
                                    title: {
                                        display: true,
                                        text: "Aspirations Submitted by Month (Current Year)",
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
                            }}
                        />
                    )}
                </div>
            </div>
            
            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Top Aspirations by Upvotes</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 px-4 text-left">Subject</th>
                                <th className="py-2 px-4 text-left">Organization</th>
                                <th className="py-2 px-4 text-left">Status</th>
                                <th className="py-2 px-4 text-right">Upvotes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {aspirations.length > 0 ? (
                                [...aspirations]
                                    .sort((a, b) => (b.upvote || 0) - (a.upvote || 0))
                                    .slice(0, 5)
                                    .map((item, index) => (
                                        <tr key={index} className="border-t">
                                            <td className="py-2 px-4 truncate max-w-[200px]">{item.subject}</td>
                                            <td className="py-2 px-4">{item.organization?.name || "Unknown"}</td>
                                            <td className="py-2 px-4">
                                                <span className={`px-2 py-1 rounded-full text-xs ${
                                                    item.closed 
                                                        ? "bg-green-100 text-green-800" 
                                                        : "bg-amber-100 text-amber-800"
                                                }`}>
                                                    {item.closed ? "Closed" : "Open"}
                                                </span>
                                            </td>
                                            <td className="py-2 px-4 text-right">{item.upvote || 0}</td>
                                        </tr>
                                    ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="py-4 text-center text-gray-500">
                                        No aspirations data available
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
