"use client";
import React, { Fragment, useEffect, useState } from "react";
import { Bars3Icon, BellIcon } from "@heroicons/react/24/outline";
import {
    ChevronDownIcon,
    MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    Transition,
} from "@headlessui/react";
import { useAdminDashboardContext } from "@/context/AdminDashboardContext";
import { useSession } from "next-auth/react";
import { GetUserProfile } from "@/services/api/user";
import { signOut } from "next-auth/react";

interface UserNavigation {
    name: string;
    href: string;
}

interface HeaderProps {
    userNavigation: UserNavigation[];
}

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(" ");
}

const handleLogout = () => {
    signOut()
}

const Header = ({ userNavigation }: HeaderProps) => {
    const dashboardContext = useAdminDashboardContext();
    const session = useSession();
    const [userProfile, setUserProfile] = useState<any>(null);

    useEffect(() => {
        if (session.data?.user) {
            GetUserProfile(session.data.user.id, session.data.user.access_token)
                .then((data) => setUserProfile(data))
                .catch((error) => console.error(error));
        }
    }, [session]);

    return (
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white/80 backdrop-blur-md px-4 shadow-md sm:gap-x-6 sm:px-6 lg:px-8">
            <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-700 hover:text-blue-600 transition-colors duration-150 lg:hidden"
                onClick={() => dashboardContext.toggleSidebar(true)}
            >
                <span className="sr-only">Open sidebar</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Separator */}
            <div
                className="h-6 w-px bg-gray-900/10 lg:hidden"
                aria-hidden="true"
            />

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                <form className="relative flex flex-1" action="#" method="GET">
                    <label htmlFor="search-field" className="sr-only">
                        Search
                    </label>
                    <div className="relative w-full max-w-md">
                        <MagnifyingGlassIcon
                            className="pointer-events-none absolute inset-y-0 left-3 h-full w-5 text-gray-400"
                            aria-hidden="true"
                        />
                        <input
                            id="search-field"
                            className="block h-9 w-full rounded-full border border-gray-200 bg-gray-50/70 py-0 pl-10 pr-4 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed sm:text-sm transition-all duration-200"
                            placeholder="Search in admin panel..."
                            type="search"
                            name="search"
                            disabled
                        />
                    </div>
                </form>
                <div className="flex items-center gap-x-4 lg:gap-x-6">
                    <button
                        type="button"
                        className="-m-2.5 p-2.5 text-gray-500 hover:text-blue-600 transition-colors duration-150 relative"
                    >
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                    </button>

                    {/* Separator */}
                    <div
                        className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
                        aria-hidden="true"
                    />

                    {/* Profile dropdown */}
                    <Menu as="div" className="relative">
                        <MenuButton className="-m-1.5 flex items-center p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-150">
                            <span className="sr-only">Open user menu</span>
                            <img
                                className="h-9 w-9 rounded-full bg-gray-50 object-cover border-2 border-white shadow-sm"
                                src={userProfile?.profile_picture || 'https://sg.pufacomputing.live/Assets/male.jpeg'}
                                alt="User Profile"
                            />
                            <span className="hidden lg:flex lg:items-center">
                                <span
                                    className="ml-3 text-sm font-medium leading-6 text-gray-700"
                                    aria-hidden="true"
                                >
                                    {userProfile?.first_name || 'Admin'}{" "}
                                    {userProfile?.last_name || 'User'}
                                </span>
                                <ChevronDownIcon
                                    className="ml-1 h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                />
                            </span>
                        </MenuButton>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <MenuItems className="absolute right-0 z-10 mt-2.5 w-56 origin-top-right rounded-xl bg-white py-2 shadow-xl ring-1 ring-gray-900/5 focus:outline-none border border-gray-100">
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <p className="text-sm font-medium text-gray-900">
                                        {userProfile?.first_name || 'Admin'} {userProfile?.last_name || 'User'}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate mt-1">
                                        {userProfile?.email || 'admin@example.com'}
                                    </p>
                                </div>
                                {userNavigation.map((item) => (
                                    <MenuItem key={item.name}>
                                        {({ focus }) => (
                                            <a
                                                href={item.href}
                                                className={classNames(
                                                    focus ? "bg-gray-50" : "",
                                                    "block px-4 py-2 text-sm leading-6 text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                                                )}
                                            >
                                                {item.name}
                                            </a>
                                        )}
                                    </MenuItem>
                                ))}
                                <div className="border-t border-gray-100 mt-1 pt-1">
                                    <MenuItem>
                                        {({ focus }) => (
                                            <button
                                                onClick={handleLogout}
                                                className={classNames(
                                                    focus ? "bg-gray-50" : "",
                                                    "px-4 py-2 text-sm leading-6 text-red-600 hover:bg-red-50 transition-colors duration-150"
                                                )}
                                            >
                                                Sign out
                                            </button>
                                        )}
                                    </MenuItem>
                                </div>
                            </MenuItems>
                        </Transition>
                    </Menu>
                </div>
            </div>
        </div>
    );
};

export default Header;
