import React from "react";
import AspirationsList from "@/app/(admin)/admin/aspirations/_components/AspirationsList";
import { fetchAspirations } from "@/services/api/aspiration";
import Title from "@/components/admin/Title";
import { ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/outline";

const AspirationsPage = async () => {
    const aspirations = await fetchAspirations();
    
    if (!aspirations) return (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="text-red-500 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Failed to fetch aspirations</h3>
            <p className="text-sm text-gray-500 mt-1">Please try again later or contact support</p>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                    <ChatBubbleBottomCenterTextIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                    <Title 
                        title="Aspirations Management" 
                        subtitle="View and respond to user aspirations and feedback"
                    />
                </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <AspirationsList aspirations={aspirations} />
            </div>
        </div>
    );
};

export default AspirationsPage;
