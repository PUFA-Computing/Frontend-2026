import { redirect } from "next/navigation";
import React from "react";
import { getSessionServer } from "@/lib/auth";
import DashboardSidebar from "./_components/DashboardSidebar";
import { DashboardContextProvider } from "./_components/DashboardContext";
import DashboardContent from "./_components/DashboardContent";
import ToggleButton from "./_components/ToggleButton";
import Link from "next/link";
import Image from "next/image";
import ComputingLogo from "@/assets/PUComSci.png";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSessionServer();
    if (!session) return redirect("/auth/signin");

    return (
        <DashboardContextProvider>
            <div className="flex min-h-screen bg-[#F5EDD0]">

                {/* ── Sidebar ── */}
                {session?.user && <DashboardSidebar />}

                {/* ── Main column ── */}
                <div className="flex flex-1 flex-col min-w-0">

                    {/* ── Top bar ── */}
                    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between bg-[#0D1B3E] px-4 sm:px-6 shadow-[0_2px_16px_rgba(8,15,34,0.35)]">
                        {/* Top shimmer */}
                        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#D9A84A]/35 to-transparent pointer-events-none" />

                        {/* Left: Toggle + Logo */}
                        <div className="flex items-center gap-3">
                            {session?.user && <ToggleButton />}
                            <Link href="/" className="flex items-center gap-2.5 group">
                                <div className="relative bg-[#FAF5E8]/10 border border-[#B8841E]/25 rounded-full p-1 transition-all duration-300 group-hover:border-[#B8841E]/50 group-hover:bg-[#FAF5E8]/15">
                                    <Image
                                        src={ComputingLogo}
                                        alt="Computing Logo"
                                        width={28}
                                        height={28}
                                        className="h-7 w-7 object-contain"
                                    />
                                </div>
                                <span className="font-display italic text-[#EDD085] text-base hidden sm:inline tracking-wide">
                                    PUFA Computing
                                </span>
                            </Link>
                        </div>

                        {/* Right: User info + Avatar */}
                        {session?.user && (
                            <div className="flex items-center gap-3 animate-fade-in">
                                <div className="hidden sm:flex flex-col items-end">
                                    <span className="font-serif text-sm text-[#F5EDD0]/80 leading-none">
                                        {session.user.first_name} {session.user.last_name}
                                    </span>
                                    <span className="font-serif text-[10px] tracking-widest text-[#B8841E]/70 uppercase mt-0.5">
                                        {session.user.role_id === 1 ? "Administrator" : "Member"}
                                    </span>
                                </div>
                                <Link href="/dashboard/profile">
                                    <div className="h-8 w-8 overflow-hidden rounded-full ring-1 ring-[#B8841E]/40 hover:ring-[#B8841E]/80 transition-all duration-300 cursor-pointer">
                                        {session.user.profile_picture ? (
                                            <Image
                                                src={session.user.profile_picture}
                                                alt="Profile"
                                                width={32}
                                                height={32}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#B8841E] to-[#D9A84A] text-[#0D1B3E] font-display font-bold text-sm">
                                                {session.user.first_name?.[0]?.toUpperCase() || "U"}
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            </div>
                        )}
                    </header>

                    {/* ── Page content ── */}
                    <DashboardContent>{children}</DashboardContent>
                </div>
            </div>
        </DashboardContextProvider>
    );
}
