"use client";

import { useEffect, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
} from "chart.js";
import User from "@/models/user";
import Event from "@/models/event";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
);

interface UsersStatisticsProps {
    users: User[];
    events: Event[];
}

export default function UsersStatistics({ users, events }: UsersStatisticsProps) {
    const [verificationData, setVerificationData] = useState<{
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
                label: "User Verification Status",
                data: [],
                backgroundColor: [],
                borderColor: [],
                borderWidth: 1,
            },
        ],
    });

    const [majorData, setMajorData] = useState<{
        labels: string[];
        datasets: {
            label: string;
            data: number[];
            backgroundColor: string;
            borderColor: string;
            borderWidth: number;
        }[];
    }>({
        labels: [],
        datasets: [
            {
                label: "Users by Major",
                data: [],
                backgroundColor: "rgba(153, 102, 255, 0.5)",
                borderColor: "rgba(153, 102, 255, 1)",
                borderWidth: 1,
            },
        ],
    });

    useEffect(() => {
        if (!users || users.length === 0) return;

        // Process users by verification status
        const verifiedUsers = users.filter(user => user.student_id_verified).length;
        const unverifiedUsers = users.length - verifiedUsers;
        
        setVerificationData({
            labels: ["Verified", "Unverified"],
            datasets: [
                {
                    label: "User Verification Status",
                    data: [verifiedUsers, unverifiedUsers],
                    backgroundColor: [
                        "rgba(75, 192, 192, 0.5)",
                        "rgba(255, 99, 132, 0.5)",
                    ],
                    borderColor: [
                        "rgba(75, 192, 192, 1)",
                        "rgba(255, 99, 132, 1)",
                    ],
                    borderWidth: 1,
                },
            ],
        });

        // Process users by major
        const majorCounts: { [key: string]: number } = {};
        users.forEach(user => {
            const major = user.major || "Undeclared";
            majorCounts[major] = (majorCounts[major] || 0) + 1;
        });

        // Sort majors by count and take top 5
        const sortedMajors = Object.entries(majorCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
            
        setMajorData({
            labels: sortedMajors.map(([major]) => major),
            datasets: [
                {
                    label: "Users by Major",
                    data: sortedMajors.map(([, count]) => count),
                    backgroundColor: "rgba(153, 102, 255, 0.5)",
                    borderColor: "rgba(153, 102, 255, 1)",
                    borderWidth: 1,
                },
            ],
        });
    }, [users]);

    // Calculate statistics
    const verifiedPercentage = users.length > 0
        ? (users.filter(user => user.student_id_verified).length / users.length) * 100
        : 0;
        
    const emailVerifiedPercentage = users.length > 0
        ? (users.filter(user => user.email_verified).length / users.length) * 100
        : 0;
        
    const twoFaEnabledPercentage = users.length > 0
        ? (users.filter(user => user.twofa_enabled).length / users.length) * 100
        : 0;

    // Calculate average events registered per user (if we had this data)
    // This is a placeholder calculation - in a real system, you'd need to track which users registered for which events
    const avgEventsPerUser = events.length > 0 && users.length > 0
        ? events.reduce((sum, event) => sum + (event.registered_count || 0), 0) / users.length
        : 0;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Users Statistics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">ID Verification</h3>
                    <p className="text-3xl font-bold">{verifiedPercentage.toFixed(1)}%</p>
                    <p className="text-sm text-gray-500">of users verified</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Email Verification</h3>
                    <p className="text-3xl font-bold">{emailVerifiedPercentage.toFixed(1)}%</p>
                    <p className="text-sm text-gray-500">of emails verified</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">2FA Adoption</h3>
                    <p className="text-3xl font-bold">{twoFaEnabledPercentage.toFixed(1)}%</p>
                    <p className="text-sm text-gray-500">of users enabled 2FA</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-lg font-semibold mb-4">Verification Status</h3>
                    <div className="h-64">
                        {verificationData.labels.length > 0 && <Pie data={verificationData} />}
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4">Top Majors</h3>
                    <div className="h-64">
                        {majorData.labels.length > 0 && (
                            <Bar 
                                data={majorData}
                                options={{
                                    indexAxis: 'y' as const,
                                    plugins: {
                                        legend: {
                                            display: false,
                                        },
                                    },
                                    scales: {
                                        x: {
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
            </div>
            
            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">User Engagement</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-medium text-gray-700">Avg. Events per User</h4>
                            <p className="text-2xl font-bold mt-2">{avgEventsPerUser.toFixed(2)}</p>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-700">Total Registered Users</h4>
                            <p className="text-2xl font-bold mt-2">{users.length}</p>
                        </div>
                    </div>
                    
                    <div className="mt-4">
                        <h4 className="font-medium text-gray-700 mb-2">User Registration Timeline</h4>
                        <div className="h-12 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-purple-500 to-indigo-600"
                                style={{ width: `${Math.min(100, (users.length / 500) * 100)}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-gray-500">
                            <span>0</span>
                            <span>Target: 500 users</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
