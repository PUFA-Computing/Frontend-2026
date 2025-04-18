"use client";
import React, { useState, useEffect } from "react";
import { GetUserProfile, Toggle2FA } from "@/services/api/user";
import Swal from "sweetalert2";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Button from "@/components/Button";
import Seperator from "@/components/Seperator";
import { UpdatePassword } from "@/services/api/auth";
import { FaLock, FaShieldAlt, FaKey, FaHistory, FaEye, FaEyeSlash } from "react-icons/fa";

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
                if (session.status === "unauthenticated") {
                    setLoading(false);
                }
                return;
            }
            
            if (!session.data?.user) {
                setLoading(false);
                return;
            }
            
            try {
                const userDataResult = await GetUserProfile(
                    session.data.user.id,
                    session.data.user.access_token
                );
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
        if (!session) {
            return;
        }

        const accessToken = session.data?.user.access_token;

        if (!accessToken) {
            Swal.fire(
                "Error!",
                "Access token is missing. Please log in again.",
                "error"
            );
            return;
        }

        Swal.fire({
            title: "Are you sure?",
            text: "Do you really want to disable 2FA?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, disable it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await Toggle2FA(accessToken, false);
                    setIs2FAEnable(false);
                    Swal.fire(
                        "Disabled!",
                        "Your 2FA has been disabled.",
                        "success"
                    );
                } catch (error) {
                    Swal.fire(
                        "Error!",
                        "Failed to disable 2FA. Please try again later.",
                        "error"
                    );
                    console.error("Error disabling 2FA:", error);
                }
            }
        });
    };

    const handleUpdatePassword = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();
        const accessToken = session.data?.user?.access_token;

        if (!accessToken) {
            Swal.fire(
                "Error!",
                "Access token is missing. Please log in again.",
                "error"
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            Swal.fire("Error!", "Passwords do not match.", "error");
            return;
        }

        try {
            await UpdatePassword(newPassword, accessToken);

            Swal.fire(
                "Success!",
                "Password updated successfully.",
                "success"
            ).then(() => {
                signOut({ callbackUrl: '/auth/signin' });
            });
        } catch (error: any) {
            console.error(
                "Update Password Error:",
                error.response?.data || error
            );
            Swal.fire(
                "Error!",
                "Failed to update password. Please try again later.",
                "error"
            );
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#02ABF3] border-t-transparent"></div>
            </div>
        );
    }

    return (
        <section className="py-6 md:py-8 lg:py-10 bg-gradient-to-b from-gray-50 to-white transition-all duration-300">
            <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8 overflow-hidden rounded-xl bg-gradient-to-r from-blue-50 to-white p-6 shadow-sm">
                    <h2 className="mb-4 flex items-center text-xl text-gray-700">
                        <FaShieldAlt className="mr-3 text-[#02ABF3]" />
                        Account Security
                    </h2>
                    <p className="text-sm text-gray-500">Manage your password and security settings to keep your account safe</p>
                </div>
                
                <div className="grid grid-cols-1 gap-6 sm:gap-8 md:gap-10 animate-fade-in">
                    {/* Two Factor Authentication Card */}
                    <div className="overflow-hidden rounded-lg md:rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-xl transform hover:translate-y-[-4px] focus-within:ring-2 focus-within:ring-[#02ABF3]/50">
                        <div className="border-b border-gray-100 bg-white p-5">
                            <div className="flex items-center">
                                <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-[#02ABF3]">
                                    <FaKey />
                                </div>
                                <h3 className="text-gray-700">Two-Factor Authentication</h3>
                            </div>
                        </div>
                        
                        <div className="p-6">
                            {is2FAEnable ? (
                                <div className="flex flex-col items-center">
                                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                                        <FaShieldAlt className="text-3xl text-green-500" />
                                    </div>
                                    <h2 className="flex items-center text-lg sm:text-xl font-semibold text-gray-800" tabIndex={0}>
                                        Two-factor authentication is enabled
                                    </h2>
                                    <p className="mb-6 text-center text-xs text-gray-500">
                                        Your account is protected with an additional layer of security.
                                        When you sign in, you'll need to provide your password and a verification code.
                                    </p>
                                    <button
                                        onClick={handleDisable2FA}
                                        type="button"
                                        className="rounded-lg border border-red-500 bg-white px-4 py-2 text-sm text-red-500 transition-all hover:bg-red-500 hover:text-white min-h-[44px] min-w-[120px]"
                                        aria-label="Disable two-factor authentication"
                                    >
                                        Disable 2FA
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg bg-gray-50 p-4 transition-all duration-300 hover:bg-gray-100">
                                        <FaKey className="text-3xl text-gray-400" />
                                    </div>
                                    <h2 className="flex items-center text-lg sm:text-xl font-semibold text-gray-800" tabIndex={0}>
                                        Two-factor authentication is not enabled
                                    </h2>
                                    <p className="mb-6 text-center text-xs text-gray-500">
                                        Add an extra layer of security to your account by enabling two-factor authentication.
                                        Once enabled, you'll need to provide your password and a verification code when signing in.
                                    </p>
                                    <Link href="/auth/enable-2fa">
                                        <Button className="rounded-lg border border-[#02ABF3] bg-[#02ABF3] px-6 py-2 text-sm text-white transition-all hover:bg-white hover:text-[#02ABF3]">
                                            Enable 2FA
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Password Update Card */}
                    <div className="overflow-hidden rounded-lg md:rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-xl transform hover:translate-y-[-4px] focus-within:ring-2 focus-within:ring-[#02ABF3]/50">
                        <div className="border-b border-gray-100 bg-white p-5">
                            <div className="flex items-center">
                                <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-[#02ABF3]">
                                    <FaLock />
                                </div>
                                <h3 className="text-gray-700">Password Management</h3>
                            </div>
                        </div>
                        
                        <div className="p-6">
                            <form onSubmit={handleUpdatePassword} className="space-y-4 sm:space-y-6 animate-fade-in" style={{animationDelay: '0.1s'}}>
                                <div className="space-y-4 sm:space-y-6 px-4 py-4 sm:px-6 sm:py-6 md:px-7 md:py-7">
                                    <label className="text-sm text-gray-600" htmlFor="new-password">
                                        New Password
                                    </label>
                                    <div className="group relative transition-all duration-300 hover:translate-y-[-2px]">
                                        <input
                                            id="new-password"
                                            name="new-password"
                                            type={showPassword ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full rounded-lg border-gray-200 bg-white px-4 py-3 text-gray-700 shadow-sm transition-all focus:border-[#02ABF3] focus:ring-[#02ABF3]/30 group-hover:border-gray-300 min-h-[44px]"
                                            placeholder="Enter new password"
                                            required
                                            aria-label="New password"
                                        />
                                        <button 
                                            type="button" 
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500">Password must be at least 8 characters long</p>
                                </div>
                                
                                <div className="space-y-4 sm:space-y-6 px-4 py-4 sm:px-6 sm:py-6 md:px-7 md:py-7">
                                    <label className="text-sm text-gray-600" htmlFor="confirm-password">
                                        Confirm Password
                                    </label>
                                    <div className="group relative transition-all duration-300 hover:translate-y-[-2px]">
                                        <input
                                            id="confirm-password"
                                            name="confirm-password"
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full rounded-lg border-gray-200 bg-white px-4 py-3 text-gray-700 shadow-sm transition-all focus:border-[#02ABF3] focus:ring-[#02ABF3]/30 group-hover:border-gray-300 min-h-[44px]"
                                            placeholder="Confirm new password"
                                            required
                                            aria-label="Confirm new password"
                                        />
                                        <button 
                                            type="button" 
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="mt-4 sm:mt-6 text-right">
                                    <button
                                        type="submit"
                                        className="rounded-lg bg-[#02ABF3] px-6 py-2 text-sm text-white transition-all hover:bg-white hover:text-[#02ABF3] hover:shadow-md min-h-[44px] min-w-[120px]"
                                        aria-label="Update password"
                                    >
                                        Update Password
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                    
                    {/* Recent Activity Card */}
                    <div className="overflow-hidden rounded-lg md:rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-xl transform hover:translate-y-[-4px] focus-within:ring-2 focus-within:ring-[#02ABF3]/50 md:col-span-2">
                        <div className="border-b border-gray-100 bg-white p-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-[#02ABF3]">
                                        <FaHistory />
                                    </div>
                                    <h3 className="text-gray-700">Recent Login Activity</h3>
                                </div>
                                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-600">Last 30 days</span>
                            </div>
                        </div>
                        
                        <div className="p-6">
                            <div className="overflow-x-auto rounded-lg border border-gray-200 animate-fade-in" style={{animationDelay: '0.3s'}}>
                                <table className="min-w-full divide-y divide-gray-200" aria-label="Login activity history">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date & Time</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Location</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Device</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        <tr>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">April 18, 2025 15:10</td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">Jakarta, Indonesia</td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">Chrome on Windows</td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">Current</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">April 15, 2025 09:45</td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">Jakarta, Indonesia</td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">Chrome on Windows</td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">Successful</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">April 10, 2025 14:22</td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">Jakarta, Indonesia</td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">Safari on macOS</td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">Successful</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-4 text-right">
                                <button 
                                    className="text-sm font-medium text-[#02ABF3] hover:text-[#0288c5] focus:outline-none focus:ring-2 focus:ring-[#02ABF3]/30 rounded px-2 py-1 transition-all duration-300 hover:bg-[#02ABF3]/10"
                                    aria-label="View all login activity">
                                    View all activity →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}