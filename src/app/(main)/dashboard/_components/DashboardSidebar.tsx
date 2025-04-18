"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDashboardContext } from "./DashboardContext";
import { useEffect, useState } from "react";

export default function DashboardSidebar() {
    const pathname = usePathname();
    const [activeLink, setActiveLink] = useState("");
    const [hoveredLink, setHoveredLink] = useState("");
    
    useEffect(() => {
        // Set active link based on current path
        setActiveLink(pathname);
    }, [pathname]);
    // Animation variants for hover effects
    const getItemAnimationClass = (linkPath: string) => {
        if (activeLink === linkPath) {
            return "bg-gradient-to-r from-[#02ABF3]/10 to-transparent border-l-4 border-[#02ABF3] text-[#02ABF3] font-medium";
        }
        if (hoveredLink === linkPath) {
            return "bg-gray-50 text-gray-800";
        }
        return "text-gray-600 hover:text-gray-800";
    };

    const LINKS = [
        {
            name: "Profile",
            link: "/dashboard/profile",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    className={`transition-all duration-300 ${activeLink === "/dashboard/profile" ? "stroke-[#02ABF3]" : "stroke-gray-500"}`}
                >
                    <path
                        d="M12 4.35418C12.7329 3.52375 13.8053 3 15 3C17.2091 3 19 4.79086 19 7C19 9.20914 17.2091 11 15 11C13.8053 11 12.7329 10.4762 12 9.64582M15 21H3V20C3 16.6863 5.68629 14 9 14C12.3137 14 15 16.6863 15 20V21ZM15 21H21V20C21 16.6863 18.3137 14 15 14C13.9071 14 12.8825 14.2922 12 14.8027M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            ),
        },
        {
            name: "Events",
            link: "/dashboard/events",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    className={`transition-all duration-300 ${activeLink === "/dashboard/events" ? "stroke-[#02ABF3]" : "stroke-gray-500"}`}
                >
                    <path
                        d="M3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V9C21 7.89543 20.1046 7 19 7H13L11 5H5C3.89543 5 3 5.89543 3 7Z"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            ),
        },
        {
            name: "Projects",
            link: "/dashboard/projects",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    className={`transition-all duration-300 ${activeLink === "/dashboard/projects" ? "stroke-[#02ABF3]" : "stroke-gray-500"}`}
                >
                    <path
                        d="M20 13V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V13M20 13V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V13M20 13H17.4142C17.149 13 16.8946 13.1054 16.7071 13.2929L14.2929 15.7071C14.1054 15.8946 13.851 16 13.5858 16H10.4142C10.149 16 9.89464 15.8946 9.70711 15.7071L7.29289 13.2929C7.10536 13.1054 6.851 13 6.58579 13H4"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            ),
        },
        {
            name: "Reports",
            link: "/dashboard/reports",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    className={`transition-all duration-300 ${activeLink === "/dashboard/reports" ? "stroke-[#02ABF3]" : "stroke-gray-500"}`}
                >
                    <path
                        d="M9 19V13C9 11.8954 8.10457 11 7 11H5C3.89543 11 3 11.8954 3 13V19C3 20.1046 3.89543 21 5 21H7C8.10457 21 9 20.1046 9 19ZM9 19V9C9 7.89543 9.89543 7 11 7H13C14.1046 7 15 7.89543 15 9V19M9 19C9 20.1046 9.89543 21 11 21H13C14.1046 21 15 20.1046 15 19M15 19V5C15 3.89543 15.8954 3 17 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H17C15.8954 21 15 20.1046 15 19Z"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            ),
        },
    ];

    const dashboardContext = useDashboardContext();

    return (
        <aside
            className={`fixed bottom-0 left-0 top-0 z-50 mt-[72px] md:mt-[80px] h-screen w-64 min-w-[200px] bg-white shadow-lg transition-all duration-500 ease-in-out ${
                dashboardContext.isMenuOpen
                    ? "translate-x-0"
                    : "-translate-x-full"
            }`}
        >
            {/* Glassmorphism overlay when sidebar is open on mobile */}
            <div 
                className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-[-1] transition-opacity duration-500 md:hidden ${
                    dashboardContext.isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
                onClick={() => dashboardContext.setIsMenuOpen(false)}
            />
            
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <p className="text-xl font-bold bg-gradient-to-r from-[#02ABF3] to-blue-600 bg-clip-text text-transparent animate-gradient">Dashboard</p>
            </div>
            
            <div className="mt-6 px-2 space-y-1">
                {LINKS.map((link, index) => {
                    const isActive = activeLink === link.link;
                    return (
                        <Link
                            key={index}
                            className={`flex items-center py-3 px-3 rounded-lg text-[15px] transition-all duration-300 ${getItemAnimationClass(link.link)}`}
                            href={link.link}
                            onMouseEnter={() => setHoveredLink(link.link)}
                            onMouseLeave={() => setHoveredLink("")}
                        >
                            <div className="relative">
                                {link.icon && (
                                    <span className="mr-3 flex items-center justify-center relative">
                                        {isActive && (
                                            <span className="absolute inset-0 bg-[#02ABF3]/10 rounded-full animate-ping-slow opacity-75"></span>
                                        )}
                                        {link.icon}
                                    </span>
                                )}
                            </div>
                            <span className={`transition-all duration-300 ${isActive ? "translate-x-1" : ""}`}>{link.name}</span>
                            {isActive && (
                                <span className="ml-auto">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#02ABF3]" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </span>
                            )}
                        </Link>
                    );
                })}
            </div>
            
            {/* Footer with logout button */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
                <button 
                    className="flex items-center w-full py-2 px-3 text-[15px] text-red-500 hover:bg-red-50 rounded-lg transition-all duration-300"
                    onClick={() => {
                        if (typeof window !== 'undefined') {
                            window.location.href = "/auth/signout";
                        }
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                </button>
            </div>
        </aside>
    );
}
