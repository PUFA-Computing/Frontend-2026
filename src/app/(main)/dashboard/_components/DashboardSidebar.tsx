"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDashboardContext } from "./DashboardContext";
import { useEffect, useState } from "react";

export default function DashboardSidebar() {
    const pathname = usePathname();
    const [activeLink, setActiveLink] = useState("");

    useEffect(() => {
        setActiveLink(pathname);
    }, [pathname]);

    const { isMenuOpen, setIsMenuOpen } = useDashboardContext();

    const LINKS = [
        {
            name: "Profile",
            link: "/dashboard/profile",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                    className="shrink-0 transition-all duration-300"
                    stroke="currentColor">
                    <path d="M12 4.35418C12.7329 3.52375 13.8053 3 15 3C17.2091 3 19 4.79086 19 7C19 9.20914 17.2091 11 15 11C13.8053 11 12.7329 10.4762 12 9.64582M15 21H3V20C3 16.6863 5.68629 14 9 14C12.3137 14 15 16.6863 15 20V21ZM15 21H21V20C21 16.6863 18.3137 14 15 14C13.9071 14 12.8825 14.2922 12 14.8027M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z"
                        strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
        },
        {
            name: "Events",
            link: "/dashboard/events",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                    className="shrink-0 transition-all duration-300"
                    stroke="currentColor">
                    <path d="M8 7V3M16 7V3M3 11H21M5 4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4Z"
                        strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
        },
        {
            name: "Projects",
            link: "/dashboard/projects",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                    className="shrink-0 transition-all duration-300"
                    stroke="currentColor">
                    <path d="M20 13V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V13M20 13V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V13M20 13H17.4142C17.149 13 16.8946 13.1054 16.7071 13.2929L14.2929 15.7071C14.1054 15.8946 13.851 16 13.5858 16H10.4142C10.149 16 9.89464 15.8946 9.70711 15.7071L7.29289 13.2929C7.10536 13.1054 6.851 13 6.58579 13H4"
                        strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
        },
        {
            name: "Reports",
            link: "/dashboard/reports",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                    className="shrink-0 transition-all duration-300"
                    stroke="currentColor">
                    <path d="M9 19V13C9 11.8954 8.10457 11 7 11H5C3.89543 11 3 11.8954 3 13V19C3 20.1046 3.89543 21 5 21H7C8.10457 21 9 20.1046 9 19ZM9 19V9C9 7.89543 9.89543 7 11 7H13C14.1046 7 15 7.89543 15 9V19M9 19C9 20.1046 9.89543 21 11 21H13C14.1046 21 15 20.1046 15 19M15 19V5C15 3.89543 15.8954 3 17 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H17C15.8954 21 15 20.1046 15 19Z"
                        strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
        },
    ];

    return (
        <>
            {/* Overlay — closes sidebar on mobile tap */}
            <div
                className={`fixed inset-0 z-40 bg-[#0D1B3E]/60 backdrop-blur-sm transition-opacity duration-500 lg:hidden ${
                    isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
                onClick={() => setIsMenuOpen(false)}
            />

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-50 h-screen w-64 bg-[#0D1B3E] flex flex-col transition-transform duration-500 ease-in-out ${
                    isMenuOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                {/* Top shimmer */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D9A84A]/40 to-transparent pointer-events-none" />

                {/* Sidebar Header */}
                <div className="flex h-16 shrink-0 items-center justify-between px-5 border-b border-[#B8841E]/20">
                    <span className="font-display italic text-xl text-[#EDD085] tracking-wide">Dashboard</span>
                    {/* Close button — visible on all sizes */}
                    <button
                        onClick={() => setIsMenuOpen(false)}
                        className="p-1.5 rounded-md text-[#F5EDD0]/40 hover:text-[#EDD085] hover:bg-[#B8841E]/10 transition-all duration-200 lg:hidden"
                        aria-label="Close sidebar"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Gold ornament rule */}
                <div className="px-5 pt-4 pb-2">
                    <p className="font-serif text-[10px] tracking-[0.2em] uppercase text-[#B8841E]/50 mb-3">Navigation</p>
                </div>

                {/* Nav links */}
                <nav className="flex-1 overflow-y-auto px-3 space-y-0.5">
                    {LINKS.map((link) => {
                        const isActive = activeLink === link.link;
                        return (
                            <Link
                                key={link.link}
                                href={link.link}
                                onClick={() => {
                                    // Close sidebar on mobile after click
                                    if (window.innerWidth < 1024) setIsMenuOpen(false);
                                }}
                                className={`group flex items-center gap-3 px-4 py-3 rounded-sm text-[14px] font-serif transition-all duration-250 ${
                                    isActive
                                        ? "bg-[#B8841E]/12 text-[#EDD085] border-l-2 border-[#B8841E] pl-[14px]"
                                        : "text-[#F5EDD0]/55 hover:bg-[#152347] hover:text-[#F5EDD0]/90 border-l-2 border-transparent pl-[14px]"
                                }`}
                            >
                                <span className={`transition-colors duration-250 ${isActive ? "text-[#D9A84A]" : "text-[#F5EDD0]/40 group-hover:text-[#F5EDD0]/70"}`}>
                                    {link.icon}
                                </span>
                                <span>{link.name}</span>
                                {isActive && (
                                    <span className="ml-auto text-[#B8841E]/60">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M9 18l6-6-6-6" />
                                        </svg>
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Divider */}
                <div className="mx-5 h-px bg-gradient-to-r from-transparent via-[#B8841E]/25 to-transparent" />

                {/* Footer — Logout */}
                <div className="p-3 shrink-0">
                    <button
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-sm font-serif text-[14px] text-[#F5EDD0]/40 hover:text-red-400 hover:bg-red-900/10 transition-all duration-250 border-l-2 border-transparent pl-[14px]"
                        onClick={() => {
                            if (typeof window !== "undefined") {
                                window.location.href = "/auth/signout";
                            }
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="shrink-0">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Sign Out</span>
                    </button>
                </div>

                {/* Bottom shimmer */}
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#D9A84A]/25 to-transparent pointer-events-none" />
            </aside>
        </>
    );
}
