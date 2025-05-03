"use client";

import { useState } from "react";
import { CalendarDays, Users, FileText, MessageSquare, HomeIcon } from "lucide-react";
import Link from "next/link";
import EventsOverview from "./EventsOverview";
import UsersOverview from "./UsersOverview";
import NewsOverview from "./NewsOverview";
import AspirationsOverview from "./AspirationsOverview";

export default function AdminDashboardClient({ 
    events = [], 
    news = [], 
    aspirations = [], 
    users = [] 
}: { 
    events?: any[]; 
    news?: any[]; 
    aspirations?: any[]; 
    users?: any[]; 
}) {
    // State for section visibility
    const [visibleSections, setVisibleSections] = useState({
        users: true,
        events: true,
        news: true,
        aspirations: true
    });

    // Toggle section visibility
    const toggleSection = (section: keyof typeof visibleSections) => {
        setVisibleSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // Calculate summary statistics
    const totalEvents = events.length;
    const totalNews = news.length;
    const totalAspirations = aspirations.length;
    const totalUsers = users.length;
    
    // Calculate active events (events that haven't ended yet)
    const activeEvents = events.filter(event => new Date(event.end_date) > new Date()).length;
    
    // Calculate pending aspirations
    const pendingAspirations = aspirations.filter(a => a.status === 'pending').length;

    // Calculate verified users
    const verifiedUsers = users.filter(user => user.student_id_verified).length;
    const verifiedPercentage = users.length > 0 ? (verifiedUsers / users.length) * 100 : 0;
    
    return (
        <div className="space-y-6">
            {/* Header with title and icon */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <HomeIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Admin Dashboard</h1>
                        <p className="mt-1.5 text-sm text-gray-600 max-w-2xl">Monitor and manage your organization's statistics</p>
                    </div>
                </div>
            </div>
            
            {/* Summary Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Total Users</p>
                            <h3 className="text-2xl font-semibold text-gray-800">{totalUsers}</h3>
                            <p className="text-xs text-gray-500 mt-1">{verifiedPercentage.toFixed(1)}% verified</p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-full">
                            <Users size={20} className="text-blue-600" />
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Active Events</p>
                            <h3 className="text-2xl font-semibold text-gray-800">{activeEvents}</h3>
                            <p className="text-xs text-gray-500 mt-1">of {totalEvents} total events</p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-full">
                            <CalendarDays size={20} className="text-blue-600" />
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Published News</p>
                            <h3 className="text-2xl font-semibold text-gray-800">{totalNews}</h3>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-full">
                            <FileText size={20} className="text-blue-600" />
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Pending Feedback</p>
                            <h3 className="text-2xl font-semibold text-gray-800">{pendingAspirations}</h3>
                            <p className="text-xs text-gray-500 mt-1">of {totalAspirations} total</p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-full">
                            <MessageSquare size={20} className="text-blue-600" />
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Users Section */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div 
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => toggleSection('users')}
                    >
                        <div className="flex items-center space-x-3">
                            <div className="bg-blue-50 p-2 rounded-lg">
                                <Users className="h-5 w-5 text-blue-600" />
                            </div>
                            <h3 className="font-medium text-gray-800">Users Overview</h3>
                        </div>
                        <div className="text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${visibleSections.users ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                    
                    {visibleSections.users && (
                        <div className="p-4 border-t border-gray-100">
                            <UsersOverview users={users} events={events} />
                        </div>
                    )}
                </div>
                
                {/* Events Section */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div 
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => toggleSection('events')}
                    >
                        <div className="flex items-center space-x-3">
                            <div className="bg-blue-50 p-2 rounded-lg">
                                <CalendarDays className="h-5 w-5 text-blue-600" />
                            </div>
                            <h3 className="font-medium text-gray-800">Events Overview</h3>
                        </div>
                        <div className="text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${visibleSections.events ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                    
                    {visibleSections.events && (
                        <div className="p-4 border-t border-gray-100">
                            <EventsOverview events={events} />
                        </div>
                    )}
                </div>
                
                {/* News Section */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div 
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => toggleSection('news')}
                    >
                        <div className="flex items-center space-x-3">
                            <div className="bg-blue-50 p-2 rounded-lg">
                                <FileText className="h-5 w-5 text-blue-600" />
                            </div>
                            <h3 className="font-medium text-gray-800">News Overview</h3>
                        </div>
                        <div className="text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${visibleSections.news ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                    
                    {visibleSections.news && (
                        <div className="p-4 border-t border-gray-100">
                            <NewsOverview news={news} />
                        </div>
                    )}
                </div>
                
                {/* Aspirations Section */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div 
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => toggleSection('aspirations')}
                    >
                        <div className="flex items-center space-x-3">
                            <div className="bg-blue-50 p-2 rounded-lg">
                                <MessageSquare className="h-5 w-5 text-blue-600" />
                            </div>
                            <h3 className="font-medium text-gray-800">Feedback Overview</h3>
                        </div>
                        <div className="text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${visibleSections.aspirations ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                    
                    {visibleSections.aspirations && (
                        <div className="p-4 border-t border-gray-100">
                            <AspirationsOverview aspirations={aspirations} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
