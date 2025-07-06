import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import User from "@/models/user";
import { fetchUsersRegistered } from "@/services/api/event";
import Image from "next/image";
import { CircularProgress } from "@/components/ui/CircularProgress";

interface ListUserRegisteredProps {
    eventId: number;
}

export default function ListUserRegistered({
    eventId,
}: ListUserRegisteredProps) {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const session = useSession();

    useEffect(() => {
        const getUsers = async () => {
            if (!session.data) {
                return;
            }
            try {
                const fetchedUsers = await fetchUsersRegistered(
                    eventId,
                    session.data.user.access_token
                );
                // Debug: Log fetched users to see file_path values
                console.log("Fetched users with file paths:", fetchedUsers);
                setUsers(fetchedUsers);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching users:", error);
                setLoading(false);
            }
        };
        getUsers().then((r) => r);
    }, [eventId, session.data]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <CircularProgress />
            </div>
        );
    }

    // If there are no users registered for the event, display a message
    if (!users || users.length === 0) {
        return (
            <div className="px-4 py-12 sm:px-4 flex flex-col items-center justify-center text-center bg-white/60 rounded-xl border border-gray-200 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-gray-400 mb-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No users registered</h3>
                <p className="text-gray-500 text-sm max-w-md">There are currently no users registered for this event. Registrations will appear here when users sign up.</p>
            </div>
        );
    }

    return (
        <div className="px-4 py-6 sm:px-4">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                    </svg>
                    Registered Users
                </h2>
                <div className="flex items-center gap-3">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {users.length} {users.length === 1 ? 'user' : 'users'}
                    </span>
                </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {users.map((user) => (
                    <div
                        key={user.id}
                        className="relative flex items-center space-x-3 rounded-xl border border-gray-200 bg-white px-6 py-5 shadow-sm hover:border-blue-200 hover:bg-blue-50/30 transition-colors duration-200"
                    >
                        <div className="flex-shrink-0">
                            <div className="relative">
                                <Image
                                    src={
                                        user.profile_picture ||
                                        "https://sg.pufacomputing.live/Assets/male.jpeg"
                                    }
                                    alt={`${user.first_name} Avatar`}
                                    className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm"
                                    width={48}
                                    height={48}
                                />
                                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-400 border-2 border-white"></span>
                            </div>
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="focus:outline-none">
                                {/* Removed absolute inset-0 span that was blocking clicks */}
                                <p className="text-sm font-medium text-gray-900">
                                    {user.first_name} {user.last_name}
                                    {user.major && (
                                        <span className="text-gray-500 ml-1 font-normal">
                                            •
                                            <span className="ml-1">
                                                {user.major.charAt(0).toUpperCase()}
                                                {user.major.slice(1)} {user.year}
                                            </span>
                                        </span>
                                    )}
                                </p>
                                <p className="truncate text-sm text-gray-500 flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                    </svg>
                                    {user.email}
                                </p>
                            </div>
                            {(user.additional_notes || user.file_path) && (
                                <div className="mt-2 text-sm text-gray-500 bg-gray-50 p-2 rounded-md border border-gray-100">
                                    {user.additional_notes && (
                                        <>
                                            <span className="font-medium text-gray-700 block mb-1">
                                                Notes:
                                            </span>
                                            <p className="mb-2">{user.additional_notes}</p>
                                        </>
                                    )}
                                    {user.file_path && (
                                        <div className="flex items-center gap-2 mt-3">
                                            {/* Menggunakan Link yang lebih direct dan jelas */}
                                            <a 
                                                href={user.file_path}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => {e.stopPropagation(); console.log('File link clicked:', user.file_path);}}
                                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 cursor-pointer z-10 relative"
                                                aria-label="View uploaded file"
                                                title="Click to view the uploaded file"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                                </svg>
                                                View Uploaded File
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                                </svg>
                                            </a>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
