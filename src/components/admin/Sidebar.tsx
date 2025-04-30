"use client";
import {
	CalendarIcon,
	BuildingStorefrontIcon,
	DocumentDuplicateIcon,
	HomeIcon,
	UsersIcon,
	NewspaperIcon,
    EnvelopeIcon
} from "@heroicons/react/24/outline";
import React from "react";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

interface Team {
    name: string;
    href: string;
    initial: string;
}

interface SidebarProps {
    teams: Team[];
}

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(" ");
}

const Sidebar = ({ teams }: SidebarProps) => {
    const currentPath = usePathname();
    const navigation = [
        {
            name: "Dashboard",
            href: "/admin",
            icon: HomeIcon,
        },
        {
            name: "Events",
            href: "/admin/events",
            icon: CalendarIcon,
        },
        {
            name: "News",
            href: "/admin/news",
            icon: NewspaperIcon,
        },
        {
            name: "Users",
            href: "/admin/users",
            icon: UsersIcon,
        },
        {
            name: "Aspirations",
            href: "/admin/aspirations",
            icon: DocumentDuplicateIcon,
        },
        {
            name: "Merch",
            href: "/admin/merch",
            icon: BuildingStorefrontIcon,
        },
        {
            name: "Email",
            href: "/admin/email",
            icon: EnvelopeIcon,
        },
    ];
    return (
        <nav className="flex flex-1 flex-col overflow-hidden">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                    <ul role="list" className="space-y-2 px-1">
                        {navigation.map((item) => {
                            const isActive = currentPath === item.href;
                            return (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className={classNames(
                                            isActive
                                                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                                                : "text-gray-300 hover:bg-gray-800/60 hover:text-white",
                                            "group relative flex items-center gap-x-3 rounded-lg p-2.5 text-sm font-medium leading-6 transition-all duration-150 ease-in-out"
                                        )}
                                    >
                                        {isActive && (
                                            <motion.span
                                                layoutId="sidebar-indicator"
                                                className="absolute left-0 top-0 bottom-0 w-1 bg-blue-400 rounded-full"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.2 }}
                                            />
                                        )}
                                        <item.icon
                                            className={classNames(
                                                isActive ? "text-white" : "text-gray-400 group-hover:text-white",
                                                "h-5 w-5 shrink-0 transition-colors duration-150"
                                            )}
                                            aria-hidden="true"
                                        />
                                        <span className="truncate">{item.name}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </li>
                <li className="mt-2">
                    <div className="text-xs font-semibold leading-6 text-gray-400 px-3 mb-2 uppercase tracking-wider">
                        Your teams
                    </div>
                    <ul role="list" className="mt-1 space-y-1.5 px-1">
                        {teams.map((team) => {
                            const isActive = currentPath === team.href;
                            return (
                                <li key={team.name}>
                                    <a
                                        href={team.href}
                                        className={classNames(
                                            isActive
                                                ? "bg-gray-800 text-white"
                                                : "text-gray-400 hover:bg-gray-700/50 hover:text-white",
                                            "group flex items-center gap-x-3 rounded-md p-2 text-sm font-medium leading-6 transition-all duration-150"
                                        )}
                                    >
                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-gray-700 bg-gray-800/80 text-[0.625rem] font-medium text-gray-400 group-hover:text-white group-hover:border-gray-500 transition-colors">
                                            {team.initial}
                                        </span>
                                        <span className="truncate">
                                            {team.name}
                                        </span>
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </li>
                <li className="mt-auto mb-4">
                    <Link
                        href="/admin/settings"
                        className={classNames(
                            usePathname() === "/admin/settings"
                                ? "bg-gray-800 text-white shadow-md"
                                : "text-gray-400 hover:bg-gray-800/60 hover:text-white",
                            "group flex gap-x-3 rounded-md p-2.5 text-sm font-medium leading-6 transition-all duration-150 border border-gray-800 hover:border-gray-700 mx-1"
                        )}
                    >
                        <Cog6ToothIcon
                            className={classNames(
                                usePathname() === "/admin/settings" ? "text-white" : "text-gray-400 group-hover:text-white",
                                "h-5 w-5 shrink-0 transition-colors duration-150"
                            )}
                            aria-hidden="true"
                        />
                        Settings
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Sidebar;
