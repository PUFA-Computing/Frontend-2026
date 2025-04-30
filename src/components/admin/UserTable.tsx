"use client";

import React, { useState } from "react";
import User from "@/models/user";
import { MagnifyingGlassIcon, PencilIcon, UserCircleIcon, AcademicCapIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

function UserTable({
    users,
    onEditClick,
    onViewVerification,
}: {
    users: User[];
    onEditClick: (user: User) => void;
    onViewVerification: (verificationInfo: any) => void;
}) {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [roleFilter, setRoleFilter] = useState<string>("all");
    
    // Filter users based on search query and role filter
    const filteredUsers = users.filter(user => {
        const userName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
        const matchesSearch = searchQuery === "" || 
            userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (user.student_id && user.student_id.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const matchesRole = roleFilter === "all" || 
            (roleFilter === "admin" && user.role_id === 1) ||
            (roleFilter === "user" && user.role_id === 2) ||
            (roleFilter === "pufa" && user.role_id === 3) ||
            (roleFilter === "puma-it" && user.role_id === 4) ||
            (roleFilter === "puma-is" && user.role_id === 5) ||
            (roleFilter === "puma-id" && user.role_id === 6) ||
            (roleFilter === "puma-vcd" && user.role_id === 7);
        
        return matchesSearch && matchesRole;
    });
    
    if (!users || users.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <UserCircleIcon className="h-12 w-12 text-gray-300 mb-3" />
                <h3 className="text-lg font-medium text-gray-900">No users found</h3>
                <p className="text-sm text-gray-500 mt-1">There are no users in the system yet</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Search and filter bar */}
            <div className="flex flex-col gap-4 sm:gap-3">
                <div className="relative w-full">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                        type="text"
                        className="block w-full rounded-md border-0 py-2.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-sm leading-6"
                        placeholder="Search users by name, email or student ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <div className="w-full sm:w-auto sm:flex-1">
                        <select
                            className="block w-full rounded-md border-0 py-2.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 text-sm leading-6"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="all">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                            <option value="pufa">PUFA Computing</option>
                            <option value="puma-it">PUMA IT</option>
                            <option value="puma-is">PUMA IS</option>
                            <option value="puma-id">PUMA ID</option>
                            <option value="puma-vcd">PUMA VCD</option>
                        </select>
                    </div>
                    <div className="w-full sm:w-auto">
                        <button
                            type="button"
                            className="w-full sm:w-auto inline-flex items-center justify-center rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
                        >
                            <UserPlusIcon className="h-5 w-5 mr-1.5" />
                            Add User
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-base font-semibold text-gray-900">User Directory</h2>
                    <p className="text-sm text-gray-500 mt-1">Showing {filteredUsers.length} of {users.length} users</p>
                </div>
            </div>
            {filteredUsers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {filteredUsers.map((user) => (
                        <motion.div
                            key={user.id}
                            className="bg-white overflow-hidden rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
                            whileHover={{ y: -2 }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="p-4 sm:p-5">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-gray-100">
                                            {user.profile_picture ? (
                                                <img 
                                                    src={user.profile_picture} 
                                                    alt={`${user.first_name || ''} ${user.last_name || ''}`.trim()} 
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center bg-blue-100 text-blue-600">
                                                    <UserCircleIcon className="h-6 w-6" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-base font-semibold text-gray-900 line-clamp-1">{`${user.first_name || ''} ${user.last_name || ''}`.trim()}</h3>
                                            <p className="text-sm text-gray-500 truncate">{user.email}</p>
                                        </div>
                                    </div>
                                    
                                    <button
                                        onClick={() => onEditClick(user)}
                                        className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition-colors flex-shrink-0 ml-2"
                                    >
                                        <PencilIcon className="h-5 w-5" />
                                    </button>
                                </div>
                                
                                <div className="mt-3 sm:mt-4 space-y-2">
                                    {/* Role badge */}
                                    <div className="flex flex-wrap gap-1">
                                        {user.role_id === 1 ? (
                                            <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800 border border-purple-200">
                                                Admin
                                            </span>
                                        ) : user.role_id === 2 ? (
                                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 border border-gray-200">
                                                User
                                            </span>
                                        ) : user.role_id === 3 ? (
                                            <span className="inline-flex items-center rounded-full bg-black px-2.5 py-0.5 text-xs font-medium text-white border border-gray-800">
                                                PUFA Computing
                                            </span>
                                        ) : user.role_id === 4 ? (
                                            <span className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-2.5 py-0.5 text-xs font-medium text-white">
                                                PUMA IT
                                            </span>
                                        ) : user.role_id === 5 ? (
                                            <span className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-600 to-sky-600 px-2.5 py-0.5 text-xs font-medium text-white">
                                                PUMA IS
                                            </span>
                                        ) : user.role_id === 6 ? (
                                            <span className="inline-flex items-center rounded-full bg-gradient-to-r from-black to-red-600 px-2.5 py-0.5 text-xs font-medium text-white">
                                                PUMA ID
                                            </span>
                                        ) : user.role_id === 7 ? (
                                            <span className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-600 to-yellow-500 px-2.5 py-0.5 text-xs font-medium text-white">
                                                PUMA VCD
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-full bg-gradient-to-r from-black to-pink-500 px-2.5 py-0.5 text-xs font-medium text-white">
                                                Guest
                                            </span>
                                        )}
                                    </div>
                                    
                                    {/* Student ID verification */}
                                    {user.student_id && (
                                        <div className="flex flex-wrap items-center gap-2 mt-2">
                                            <div className="inline-flex items-center gap-1 min-w-0">
                                                <AcademicCapIcon className="h-4 w-4 flex-shrink-0 text-gray-400" />
                                                <span className="text-sm text-gray-600 truncate">{user.student_id}</span>
                                            </div>
                                            
                                            {user.student_id_verified ? (
                                                <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                                                    Verified
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        if (user.student_id_verification) {
                                                            onViewVerification({
                                                                student_id_verification: user.student_id_verification
                                                            });
                                                        }
                                                    }}
                                                    className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800 hover:bg-yellow-200 transition-colors"
                                                    disabled={!user.student_id_verification}
                                                >
                                                    Verify
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm mt-4">
                    <UserCircleIcon className="h-12 w-12 text-gray-300 mb-3" />
                    <h3 className="text-lg font-medium text-gray-900">No users found</h3>
                    <p className="text-sm text-gray-500 mt-1">Try changing your search query or filter</p>
                </div>
            )}
        </div>
    );
}

export default UserTable;
