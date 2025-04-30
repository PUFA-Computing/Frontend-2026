"use client";

import {
    ChatBubbleLeftIcon,
    CheckCircleIcon,
    ClockIcon,
    UserIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import Aspiration from "@/models/aspiration";
import { useState } from "react";
import { motion } from "framer-motion";

export default function AspirationsList({
    aspirations,
}: {
    aspirations: Aspiration[];
}) {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    // Filter aspirations based on search query and status filter
    const filteredAspirations = aspirations.filter(aspiration => {
        const matchesSearch = searchQuery === "" || 
            aspiration.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            aspiration.author.name.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesStatus = statusFilter === "all" || 
            (statusFilter === "open" && !aspiration.closed) ||
            (statusFilter === "closed" && aspiration.closed);
        
        return matchesSearch && matchesStatus;
    });

    // Format date to be more readable
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <div className="space-y-6">
            {/* Search and filter bar */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                        type="text"
                        className="block w-full rounded-md border-0 py-2.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                        placeholder="Search aspirations by subject or author..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex-shrink-0">
                    <div className="relative inline-block text-left">
                        <select
                            className="block w-full rounded-md border-0 py-2.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="open">Open</option>
                            <option value="closed">Closed</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <FunnelIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Aspirations list */}
            {filteredAspirations.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                    {filteredAspirations.map((aspiration) => (
                        <motion.div
                            key={aspiration.id}
                            className="group relative overflow-hidden rounded-xl bg-white shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
                            whileHover={{ y: -2 }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="p-5">
                                <div className="flex items-start justify-between">
                                    <div className="flex-grow">
                                        {/* Status badge */}
                                        <div className="mb-2">
                                            {aspiration.closed ? (
                                                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 border border-green-200">
                                                    <CheckCircleIcon className="h-3.5 w-3.5 mr-1" />
                                                    Closed
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 border border-blue-200">
                                                    <ChatBubbleLeftIcon className="h-3.5 w-3.5 mr-1" />
                                                    Open
                                                </span>
                                            )}
                                        </div>
                                        
                                        {/* Subject */}
                                        <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                            {aspiration.subject}
                                        </h3>
                                        
                                        {/* Author and date */}
                                        <div className="mt-2 flex flex-wrap items-center text-xs text-gray-500 gap-x-4">
                                            <div className="flex items-center gap-x-1">
                                                <UserIcon className="h-3.5 w-3.5 text-gray-400" />
                                                <span>{aspiration.author.name}</span>
                                            </div>
                                            <div className="flex items-center gap-x-1">
                                                <ClockIcon className="h-3.5 w-3.5 text-gray-400" />
                                                <span>
                                                    {formatDate(aspiration.created_at.toString())}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Avatar group */}
                                    <div className="flex -space-x-2 ml-4">
                                        <img
                                            className="h-8 w-8 rounded-full border-2 border-white object-cover shadow-sm"
                                            src={aspiration.author.profile_picture}
                                            alt={aspiration.author.name}
                                        />
                                        {aspiration.closed && (
                                            <img
                                                className="h-8 w-8 rounded-full border-2 border-white object-cover shadow-sm"
                                                src="https://sg.pufacomputing.live/Logo%20Puma.png"
                                                alt="Admin"
                                            />
                                        )}
                                    </div>
                                </div>
                                
                                {/* View button */}
                                <div className="mt-4 flex justify-end">
                                    <a
                                        href={`./aspirations/${aspiration.id}`}
                                        className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-blue-600 shadow-sm ring-1 ring-inset ring-blue-300 hover:bg-blue-50 transition-colors"
                                    >
                                        View Details
                                        <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1.5" />
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <ChatBubbleLeftIcon className="h-12 w-12 text-gray-300 mb-3" />
                    <h3 className="text-lg font-medium text-gray-900">No aspirations found</h3>
                    <p className="text-sm text-gray-500 mt-1">Try changing your search query or filter</p>
                </div>
            )}
        </div>
    );
}
