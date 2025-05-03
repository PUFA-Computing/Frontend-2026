import { redirect } from "next/navigation";
import React from "react";
import { getSessionServer } from "@/lib/auth";
import ToggleButton from "./_components/ToggleButton";
import DashboardSidebar from "./_components/DashboardSidebar";
import { DashboardContextProvider } from "./_components/DashboardContext";
import DashboardContent from "./_components/DashboardContent";
import Link from "next/link";
import Image from "next/image";
import ComputingLogo from "@/assets/PUComSci.png";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSessionServer();
    // Memastikan pengguna sudah login untuk mengakses halaman dashboard
    if (!session) return redirect("/auth/signin");

    return (
        <DashboardContextProvider>
            <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-white transition-all duration-300">

                {/* Sidebar */}
                {session?.user && <DashboardSidebar />}

                {/* Main content */}
                <div className="flex-1 transition-all duration-500 ease-in-out animate-fade-in">
                    <div className="flex h-14 sm:h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 shadow-sm transition-all duration-300">
                        {/* Logo */}
                        <Link href="/" className="transition-all duration-300 hover:opacity-80">
                            <div className="relative bg-white rounded-md shadow-sm transition-all duration-300 hover:shadow-md">
                                <Image
                                    src={ComputingLogo}
                                    alt="Computing Logo"
                                    width={40}
                                    height={40}
                                    className="h-8 w-8 sm:h-10 sm:w-10 object-contain"
                                />
                            </div>
                        </Link>
                        {session?.user && (
                            <div className="flex items-center gap-2 sm:gap-3 animate-fade-in">
                                <span className="hidden sm:inline-block text-sm font-medium text-gray-700">
                                    {session.user.first_name} {session.user.last_name}
                                </span>
                                <div className="h-8 w-8 overflow-hidden rounded-full bg-gray-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer">
                                    {session.user.profile_picture ? (
                                        <Image
                                            src={session.user.profile_picture}
                                            alt="Profile"
                                            width={32}
                                            height={32}
                                            className="h-full w-full object-cover transition-all duration-300 hover:scale-110"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-[#02ABF3] to-blue-600 text-white transition-all duration-300 hover:from-blue-600 hover:to-[#02ABF3]">
                                            {session.user.first_name?.[0]?.toUpperCase() || "U"}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    <DashboardContent>{children}</DashboardContent>
                </div>

                {/* Toggle button */}
                <ToggleButton />
            </div>
        </DashboardContextProvider>
    );
}
