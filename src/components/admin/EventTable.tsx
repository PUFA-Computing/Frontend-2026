"use client";
import React, { useState } from "react";
import Event from "@/models/event";
import Swal from "sweetalert2";
import axios from "axios";
import { API_EVENT } from "@/config/config";
import { createEvent } from "@/services/api/event";
import { ChevronRightIcon, CalendarIcon, UserGroupIcon, ClockIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { motion } from "framer-motion";

function EventTable({ events }: { events: Event[] }) {
    const [sortBy, setSortBy] = useState<'title' | 'date'>('title');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    
    // Sort events based on current sort preference
    const sortedEvents = [...events].sort((a, b) => {
        if (sortBy === 'title') {
            return a.title.localeCompare(b.title);
        } else {
            return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
        }
    });
    
    // Filter events based on status
    const filteredEvents = filterStatus === 'all' 
        ? sortedEvents 
        : sortedEvents.filter(event => event.status === filterStatus);

    const truncateDescription = (description: string, maxLength: number) => {
        if (description.length <= maxLength) {
            return description;
        }
        return description.substring(0, maxLength) + "...";
    };

    return (
        <div className="space-y-6">
            {/* Filters and sorting controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Filter by:</span>
                    <div className="flex rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                        <button 
                            onClick={() => setFilterStatus('all')}
                            className={`px-3 py-1.5 text-xs font-medium ${filterStatus === 'all' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                        >
                            All
                        </button>
                        <button 
                            onClick={() => setFilterStatus('Open')}
                            className={`px-3 py-1.5 text-xs font-medium ${filterStatus === 'Open' ? 'bg-green-50 text-green-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                        >
                            Open
                        </button>
                        <button 
                            onClick={() => setFilterStatus('Upcoming')}
                            className={`px-3 py-1.5 text-xs font-medium ${filterStatus === 'Upcoming' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                        >
                            Upcoming
                        </button>
                        <button 
                            onClick={() => setFilterStatus('Closed')}
                            className={`px-3 py-1.5 text-xs font-medium ${filterStatus === 'Closed' ? 'bg-red-50 text-red-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                        >
                            Closed
                        </button>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Sort by:</span>
                    <div className="flex rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                        <button 
                            onClick={() => setSortBy('title')}
                            className={`px-3 py-1.5 text-xs font-medium ${sortBy === 'title' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                        >
                            Title
                        </button>
                        <button 
                            onClick={() => setSortBy('date')}
                            className={`px-3 py-1.5 text-xs font-medium ${sortBy === 'date' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                        >
                            Date
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Event count */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                    Showing <span className="font-medium text-gray-900">{filteredEvents.length}</span> events
                </p>
            </div>
            
            {/* Event cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredEvents.map((event) => (
                    <motion.div 
                        key={event.id} 
                        className="group relative overflow-hidden rounded-xl bg-white shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300"
                        whileHover={{ y: -5 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <a href={`./events/${event.slug}`} className="block">
                            <div className="relative h-40 w-full overflow-hidden bg-gray-200">
                                <Image
                                    src={`${event.thumbnail}?t=${new Date().getTime()}`}
                                    alt={`${event.title} thumbnail`}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    width={400}
                                    height={200}
                                    unoptimized={true}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                
                                {/* Status badge */}
                                <div className="absolute top-3 right-3 z-10">
                                    {event.status === "Open" ? (
                                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800 border border-green-200 shadow-sm">
                                            <span className="mr-1 h-1.5 w-1.5 rounded-full bg-green-500"></span>
                                            Open
                                        </span>
                                    ) : event.status === "Upcoming" ? (
                                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-800 border border-blue-200 shadow-sm">
                                            <span className="mr-1 h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                                            Upcoming
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-800 border border-red-200 shadow-sm">
                                            <span className="mr-1 h-1.5 w-1.5 rounded-full bg-red-500"></span>
                                            Closed
                                        </span>
                                    )}
                                </div>
                            </div>
                            
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                    {event.title}
                                </h3>
                                
                                <p className="mt-1 text-sm text-gray-600 flex items-center gap-1">
                                    <UserGroupIcon className="h-4 w-4 text-gray-400" />
                                    <span>{event.organization}</span>
                                </p>
                                
                                {/* Description */}
                                <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                                    {truncateDescription(event.description, 100)}
                                </p>
                                
                                <div className="mt-3 flex items-center text-xs text-gray-500 border-t border-gray-100 pt-3">
                                    <CalendarIcon className="mr-1 h-4 w-4 text-gray-400" />
                                    <span>
                                        {new Date(event.start_date).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                        {" - "}
                                        {new Date(event.end_date).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="absolute bottom-3 right-3 rounded-full bg-blue-50 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm border border-blue-100">
                                <ChevronRightIcon className="h-4 w-4 text-blue-600" aria-hidden="true" />
                            </div>
                        </a>
                    </motion.div>
                ))}
            </div>
            {/* Empty state */}
            {filteredEvents.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <CalendarIcon className="h-12 w-12 text-gray-300 mb-3" />
                    <h3 className="text-lg font-medium text-gray-900">No events found</h3>
                    <p className="text-sm text-gray-500 mt-1">Try changing your filters or create a new event</p>
                </div>
            )}
        </div>
    );
}

export default EventTable;
