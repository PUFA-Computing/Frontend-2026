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

interface EventsStatisticsProps {
    events: Event[];
}

export default function EventsStatistics({ events }: EventsStatisticsProps) {
    const [monthlyEvents, setMonthlyEvents] = useState<number[]>([]);
    const [eventStatusData, setEventStatusData] = useState<{
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
                label: "Events by Status",
                data: [],
                backgroundColor: [],
                borderColor: [],
                borderWidth: 1,
            },
        ],
    });

    const [registrationData, setRegistrationData] = useState<{
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
                label: "Registrations",
                data: [],
                backgroundColor: "rgba(54, 162, 235, 0.5)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
            },
        ],
    });

    useEffect(() => {
        if (!events || events.length === 0) return;

        // Process events by month
        const currentYear = new Date().getFullYear();
        const monthCounts = Array(12).fill(0);
        
        events.forEach(event => {
            const eventDate = new Date(event.start_date);
            if (eventDate.getFullYear() === currentYear) {
                monthCounts[eventDate.getMonth()]++;
            }
        });
        
        setMonthlyEvents(monthCounts);

        // Process events by status
        const activeEvents = events.filter(event => new Date(event.end_date) > new Date()).length;
        const completedEvents = events.filter(event => new Date(event.end_date) <= new Date()).length;
        
        setEventStatusData({
            labels: ["Active", "Completed"],
            datasets: [
                {
                    label: "Events by Status",
                    data: [activeEvents, completedEvents],
                    backgroundColor: [
                        "rgba(54, 162, 235, 0.5)",
                        "rgba(75, 192, 192, 0.5)",
                    ],
                    borderColor: [
                        "rgba(54, 162, 235, 1)",
                        "rgba(75, 192, 192, 1)",
                    ],
                    borderWidth: 1,
                },
            ],
        });

        // Process top events by registration
        const topEvents = [...events]
            .sort((a, b) => (b.registered_count || 0) - (a.registered_count || 0))
            .slice(0, 5);
            
        setRegistrationData({
            labels: topEvents.map(event => event.title.length > 20 ? event.title.substring(0, 20) + "..." : event.title),
            datasets: [
                {
                    label: "Registrations",
                    data: topEvents.map(event => event.registered_count || 0),
                    backgroundColor: "rgba(54, 162, 235, 0.5)",
                    borderColor: "rgba(54, 162, 235, 1)",
                    borderWidth: 1,
                },
            ],
        });
    }, [events]);

    // Monthly events data
    const monthlyEventsData = {
        labels: [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ],
        datasets: [
            {
                label: "Events",
                data: monthlyEvents,
                backgroundColor: "rgba(54, 162, 235, 0.5)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
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
                text: "Events by Month (Current Year)",
            },
        },
    };

    // Calculate average registrations per event
    const totalRegistered = events.reduce((sum, event) => sum + (event.registered_count || 0), 0);
    const avgRegistrations = events.length > 0
        ? totalRegistered / events.length
        : 0;

    // Calculate registration rate (registered vs max capacity)
    const totalCapacity = events.reduce((sum, event) => sum + (event.max_registration || 0), 0);
    const registrationRate = totalCapacity > 0 ? (totalRegistered / totalCapacity) * 100 : 0;
    
    // Log registration data for debugging
    // console.log('Total registered users:', totalRegistered);
    // console.log('Events with registrations:', events.filter(event => (event.registered_count || 0) > 0).length);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Events Statistics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Avg. Registrations</h3>
                    <p className="text-3xl font-bold">{avgRegistrations.toFixed(1)}</p>
                    <p className="text-sm text-gray-500">per event</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Registration Rate</h3>
                    <p className="text-3xl font-bold">{registrationRate.toFixed(1)}%</p>
                    <p className="text-sm text-gray-500">of total capacity</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-lg font-semibold mb-4">Events by Status</h3>
                    <div className="h-64">
                        {eventStatusData.labels.length > 0 && <Pie data={eventStatusData} />}
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4">Monthly Events</h3>
                    <div className="h-64">
                        {monthlyEvents.length > 0 && (
                            <Bar data={monthlyEventsData} options={monthlyOptions} />
                        )}
                    </div>
                </div>
            </div>
            
            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Top Events by Registration</h3>
                {registrationData.labels.length > 0 ? (
                    <Bar 
                        data={registrationData}
                        options={{
                            indexAxis: 'y' as const,
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'Number of Registrations'
                                },
                            },
                        }}
                    />
                ) : (
                    <p className="text-gray-500">No registration data available</p>
                )}
            </div>
        </div>
    );
}
