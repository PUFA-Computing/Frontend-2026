"use client";
import React, { useState } from "react";
import SecurityPage from "./_components/SecurityPage";
import VerificationStatus from "./_components/VerificationStatus";
import AcademicInformation from "./_components/AcademicInformation";
import MyAccount from "./_components/MyAccount";

const tabs = [
    { name: "My Account" },
    { name: "Academic Information" },
    { name: "Verification Status" },
    { name: "Security" },
];

export default function DashboardProfilePage() {
    const [activeTab, setActiveTab] = useState("My Account");

    return (
        <div className="space-y-6">

            {/* ── Page heading ── */}
            <div>
                <p className="font-serif text-[10px] tracking-[0.22em] uppercase text-[#B8841E] mb-1">Account</p>
                <h1 className="font-display italic text-3xl sm:text-4xl text-[#0D1B3E]">My Profile</h1>
                <div className="flex items-center gap-3 mt-3">
                    <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-[#B8841E]/40 to-transparent" />
                    <span className="text-[#B8841E]/40 text-[10px]">✦</span>
                    <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-[#B8841E]/40 to-transparent" />
                </div>
            </div>

            {/* ── Tab bar ── */}
            {/* Mobile: select dropdown */}
            <div className="sm:hidden">
                <label htmlFor="profile-tabs" className="sr-only">Select a tab</label>
                <select
                    id="profile-tabs"
                    name="profile-tabs"
                    className="block w-full rounded-sm border border-[#B8841E]/30 bg-[#FAF5E8] px-3 py-2.5 font-serif text-sm text-[#0D1B3E] shadow-sm focus:border-[#B8841E] focus:ring-1 focus:ring-[#B8841E]/40 outline-none transition-all"
                    value={activeTab}
                    onChange={(e) => setActiveTab(e.target.value)}
                >
                    {tabs.map((tab) => (
                        <option key={tab.name} value={tab.name}>
                            {tab.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Desktop: tab buttons */}
            <div className="hidden sm:block">
                <div className="bg-[#FAF5E8] border border-[#B8841E]/20 rounded-sm shadow-sm overflow-hidden">
                    <nav className="flex" aria-label="Tabs">
                        {tabs.map((tab, idx) => {
                            const isActive = activeTab === tab.name;
                            return (
                                <button
                                    key={tab.name}
                                    onClick={() => setActiveTab(tab.name)}
                                    className={`relative flex-1 px-4 py-3.5 font-serif text-sm tracking-wide transition-all duration-250 focus:outline-none ${
                                        isActive
                                            ? "text-[#0D1B3E] bg-[#F5EDD0]"
                                            : "text-[#1A1A2E]/45 bg-[#FAF5E8] hover:text-[#0D1B3E]/80 hover:bg-[#F5EDD0]/60"
                                    } ${idx !== 0 ? "border-l border-[#B8841E]/12" : ""}`}
                                    aria-current={isActive ? "page" : undefined}
                                >
                                    {tab.name}
                                    {/* Gold underline for active */}
                                    <span
                                        className={`absolute inset-x-0 bottom-0 h-0.5 transition-all duration-250 ${
                                            isActive
                                                ? "bg-gradient-to-r from-transparent via-[#B8841E] to-transparent opacity-100"
                                                : "opacity-0"
                                        }`}
                                    />
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* ── Tab content ── */}
            <div className="animate-fade-in">
                {activeTab === "My Account" && <MyAccount />}
                {activeTab === "Academic Information" && <AcademicInformation />}
                {activeTab === "Verification Status" && <VerificationStatus />}
                {activeTab === "Security" && <SecurityPage />}
            </div>
        </div>
    );
}
