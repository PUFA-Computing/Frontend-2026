"use client";
import React, { useState, useEffect } from "react";
import { GetUserProfile, Toggle2FA } from "@/services/api/user";
import Swal from "sweetalert2";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { UpdatePassword } from "@/services/api/auth";

function CardSection({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
    return (
        <div className="bg-[#FAF5E8] border border-[#B8841E]/20 rounded-sm overflow-hidden shadow-sm">
            <div className="relative px-5 py-4 border-b border-[#B8841E]/15 bg-[#F5EDD0]/60">
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#B8841E]/60 via-[#D9A84A] to-[#B8841E]/60 rounded-r" />
                <div className="flex items-center gap-2.5">
                    <span className="text-[#B8841E]">{icon}</span>
                    <h2 className="font-display italic text-xl text-[#0D1B3E]">{title}</h2>
                </div>
            </div>
            <div className="p-5 sm:p-6">{children}</div>
        </div>
    );
}

const inputCls = "w-full rounded-sm border border-[#B8841E]/25 bg-[#F5EDD0]/70 px-3 py-2.5 font-serif text-sm text-[#0D1B3E] placeholder:text-[#1A1A2E]/30 focus:border-[#B8841E] focus:ring-1 focus:ring-[#B8841E]/30 outline-none transition-all duration-200 min-h-[42px]";

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
    return <label htmlFor={htmlFor} className="block font-serif text-xs tracking-wide text-[#1A1A2E]/55 mb-1.5 uppercase">{children}</label>;
}

export default function SecurityPage() {
    const session = useSession();
    const [userData, setUserData] = useState<any>({});
    const [is2FAEnable, setIs2FAEnable] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (session.status !== "authenticated") {
                if (session.status === "unauthenticated") setLoading(false);
                return;
            }
            if (!session.data?.user) { setLoading(false); return; }
            try {
                const userDataResult = await GetUserProfile(session.data.user.id, session.data.user.access_token);
                setUserData(userDataResult);
                setIs2FAEnable(userDataResult.twofa_enabled || false);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user data:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, [session.status, session.data]);

    const handleDisable2FA = async () => {
        const accessToken = session.data?.user.access_token;
        if (!accessToken) { Swal.fire("Error!", "Access token is missing. Please log in again.", "error"); return; }
        Swal.fire({ title: "Are you sure?", text: "Do you really want to disable 2FA?", icon: "warning", showCancelButton: true, confirmButtonColor: "#d33", cancelButtonColor: "#3085d6", confirmButtonText: "Yes, disable it!" }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await Toggle2FA(accessToken, false);
                    setIs2FAEnable(false);
                    Swal.fire("Disabled!", "Your 2FA has been disabled.", "success");
                } catch (error) {
                    Swal.fire("Error!", "Failed to disable 2FA. Please try again later.", "error");
                }
            }
        });
    };

    const handleUpdatePassword = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const accessToken = session.data?.user?.access_token;
        if (!accessToken) { Swal.fire("Error!", "Access token is missing. Please log in again.", "error"); return; }
        if (newPassword !== confirmPassword) { Swal.fire("Error!", "Passwords do not match.", "error"); return; }
        try {
            await UpdatePassword(newPassword, accessToken);
            Swal.fire("Success!", "Password updated successfully.", "success").then(() => signOut({ callbackUrl: "/auth/signin" }));
        } catch (error: any) {
            Swal.fire("Error!", "Failed to update password. Please try again later.", "error");
        }
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="h-6 w-6 rounded-full border-2 border-[#B8841E]/30 border-t-[#B8841E] animate-spin" />
            </div>
        );
    }

    return (
        <section className="space-y-5">

            {/* Intro banner */}
            <div className="bg-[#FAF5E8] border border-[#B8841E]/20 rounded-sm px-5 py-4 shadow-sm">
                <h2 className="font-display italic text-xl text-[#0D1B3E] flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-[#B8841E]">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Account Security
                </h2>
                <p className="font-serif text-xs text-[#1A1A2E]/45 mt-1">Manage your password and security settings to keep your account safe</p>
            </div>

            <div className="space-y-5">

                {/* 2FA Card */}
                <CardSection
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                    }
                    title="Two-Factor Authentication"
                >
                    {is2FAEnable ? (
                        <div className="flex flex-col items-center py-4 text-center gap-3">
                            <div className="w-14 h-14 rounded-full bg-[#B8841E]/10 border border-[#B8841E]/25 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-[#B8841E]">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="font-display italic text-lg text-[#0D1B3E]">2FA is enabled</h3>
                            <p className="font-serif text-xs text-[#1A1A2E]/50 max-w-xs">Your account is protected with an additional layer of security. You'll need a verification code when you sign in.</p>
                            <button onClick={handleDisable2FA} className="mt-2 flex items-center gap-2 px-5 py-2 font-serif text-sm text-red-500 border border-red-300 hover:bg-red-50 rounded-sm transition-all duration-200">
                                Disable 2FA
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center py-4 text-center gap-3">
                            <div className="w-14 h-14 rounded-full bg-[#0D1B3E]/6 border border-[#0D1B3E]/15 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-[#0D1B3E]/40">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                </svg>
                            </div>
                            <h3 className="font-display italic text-lg text-[#0D1B3E]">2FA is not enabled</h3>
                            <p className="font-serif text-xs text-[#1A1A2E]/50 max-w-xs">Add an extra layer of security to your account. Once enabled, you'll need a verification code alongside your password.</p>
                            <Link href="/auth/enable-2fa">
                                <button className="mt-2 flex items-center gap-2 px-5 py-2.5 font-serif text-sm text-[#EDD085] border border-[#B8841E]/40 bg-[#0D1B3E] hover:bg-[#152347] rounded-sm transition-all duration-250">
                                    Enable 2FA
                                </button>
                            </Link>
                        </div>
                    )}
                </CardSection>

                {/* Password Card */}
                <CardSection
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    }
                    title="Password Management"
                >
                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                        <div>
                            <FieldLabel htmlFor="new-password">New Password</FieldLabel>
                            <div className="relative">
                                <input
                                    id="new-password"
                                    type={showPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    required
                                    className={inputCls + " pr-10"}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1A1A2E]/35 hover:text-[#B8841E] transition-colors duration-200">
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    )}
                                </button>
                            </div>
                            <p className="font-serif text-[10px] text-[#1A1A2E]/40 mt-1">Password must be at least 8 characters long</p>
                        </div>
                        <div>
                            <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
                            <div className="relative">
                                <input
                                    id="confirm-password"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    required
                                    className={inputCls + " pr-10"}
                                />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1A1A2E]/35 hover:text-[#B8841E] transition-colors duration-200">
                                    {showConfirmPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-end pt-2">
                            <button type="submit" className="flex items-center gap-2 px-6 py-2.5 font-serif text-sm text-[#EDD085] border border-[#B8841E]/40 bg-[#0D1B3E] hover:bg-[#152347] rounded-sm transition-all duration-250 shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                Update Password
                            </button>
                        </div>
                    </form>
                </CardSection>
            </div>
        </section>
    );
}