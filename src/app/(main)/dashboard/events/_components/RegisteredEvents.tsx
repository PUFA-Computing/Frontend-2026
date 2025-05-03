"use client";
import EventStatusDashboard from "@/components/event/EventStatusDashboard";
import React, { useEffect, useState } from "react";
import { fetchUserEvents } from "@/services/api/user";
import Event from "@/models/event";
import { Spinner } from "@nextui-org/spinner";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function RegisteredEvents() {
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("all");
    const { data: session, status } = useSession();

    useEffect(() => {
        async function fetchEvents() {
            if (status === "loading") {
                return;
            }

            if (!session) {
                setIsLoading(false);
                return;
            }

            try {
                const events = await fetchUserEvents(session.user.access_token);
                if (Array.isArray(events)) {
                    setEvents(events);
                } else {
                    console.error("Invalid events data");
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchEvents();
    }, [session, status]);

    // Filter events based on search term and selected filter
    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            event.organization.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (selectedFilter === "all") return matchesSearch;
        return matchesSearch && event.status.toLowerCase() === selectedFilter.toLowerCase();
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="flex flex-col items-center">
                    <Spinner className="h-12 w-12 text-indigo-600" />
                    <p className="mt-4 text-sm text-gray-500">Loading your events...</p>
                </div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="p-8 text-center">
                <div className="mx-auto max-w-md rounded-lg bg-blue-50 p-6 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-3 text-lg font-medium text-blue-800">Authentication Required</h3>
                    <p className="mt-2 text-sm text-blue-600">Please sign in to view your registered events.</p>
                    <div className="mt-4">
                        <Link href="/auth/signin" className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="border-b border-gray-100 px-6 py-4">
                <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        className="block w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder="Search events..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="border-b border-gray-100 px-6 py-2">
                <div className="flex flex-wrap gap-2">
                    <button 
                        onClick={() => setSelectedFilter("all")}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${selectedFilter === "all" ? "bg-indigo-100 text-indigo-800" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                    >
                        All
                    </button>
                    <button 
                        onClick={() => setSelectedFilter("open")}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${selectedFilter === "open" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                    >
                        Open
                    </button>
                    <button 
                        onClick={() => setSelectedFilter("closed")}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${selectedFilter === "closed" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                    >
                        Closed
                    </button>
                    <button 
                        onClick={() => setSelectedFilter("upcoming")}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${selectedFilter === "upcoming" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                    >
                        Upcoming
                    </button>
                </div>
            </div>

            {filteredEvents.length > 0 ? (
                <div>
                    {/* Desktop view - Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Event
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Organization
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredEvents.map((event, index) => (
                                    <motion.tr 
                                        key={`desktop-${event.id || index}`}
                                        className="group hover:bg-gray-50 transition-colors duration-150"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    {event.thumbnail ? (
                                                        <img className="h-10 w-10 rounded-full object-cover" src={event.thumbnail} alt={event.title} />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{event.title}</div>
                                                    <div className="text-sm text-gray-500">{new Date(event.date || event.start_date || Date.now()).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="text-sm text-gray-900">{event.organization}</div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <EventStatusDashboard status={event.status} />
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                            <Link href={`/events/${event.slug}`} className="text-indigo-600 hover:text-indigo-900 mr-4">View</Link>
                                            <button className="text-gray-600 hover:text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                                </svg>
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Mobile view - Cards */}
                    <div className="md:hidden space-y-4 px-4">
                        {filteredEvents.map((event, index) => (
                            <motion.div 
                                key={`mobile-${event.id || index}`}
                                className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <div className="p-4">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-12 w-12">
                                            {event.thumbnail ? (
                                                <img className="h-12 w-12 rounded-full object-cover" src={event.thumbnail} alt={event.title} />
                                            ) : (
                                                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <h3 className="text-base font-medium text-gray-900">{event.title}</h3>
                                            <div className="text-sm text-gray-500">{new Date(event.date || event.start_date || Date.now()).toLocaleDateString()}</div>
                                        </div>
                                        <EventStatusDashboard status={event.status} />
                                    </div>
                                    
                                    <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                                        <div className="text-sm text-gray-600">{event.organization}</div>
                                        <Link 
                                            href={`/events/${event.slug}`} 
                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No events found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        {searchTerm ? "Try adjusting your search or filter criteria." : "You haven't registered for any events yet."}
                    </p>
                    <Link href="/events" className="mt-6 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        Browse Events
                    </Link>
                </div>
            )}
        </div>
    );
}
