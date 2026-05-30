"use client";
import React from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

export default function ForgotPasswordPage() {
    const handleGoogleVerify = () => {
        // Redirect to Google login, and then to the security page with reset=true
        signIn("google", { callbackUrl: "/dashboard/profile?reset=true" });
    };

    return (
        <div className="flex h-screen items-center justify-center relative overflow-hidden" style={{ backgroundImage: `url('/doodle.svg')` }}>
            <div className="z-10 w-full max-w-md p-8 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-100 flex flex-col items-center text-center">
                <div className="mb-6 flex justify-center">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-2">
                        <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z"></path>
                        </svg>
                    </div>
                </div>
                
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Reset Your Password</h1>
                <p className="text-gray-500 mb-8 text-sm">
                    Verify your identity using your Google account to reset your password. Once verified, you will be able to set a new password in your account settings.
                </p>

                <button
                    onClick={handleGoogleVerify}
                    className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-md hover:bg-gray-50 transition-colors duration-200 font-medium shadow-sm mb-6"
                >
                    <FcGoogle className="w-5 h-5" />
                    Verify with Google
                </button>

                <div className="text-sm">
                    <Link href="/auth/signin" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
                        ← Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
