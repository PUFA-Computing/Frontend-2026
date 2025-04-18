import { GetUserProfile } from "@/services/api/user";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { 
    FaCheckCircle, 
    FaHourglassHalf, 
    FaTimesCircle, 
    FaEnvelope, 
    FaIdCard, 
    FaShieldAlt, 
    FaLock
} from "react-icons/fa";
import User from "@/models/user";
import { Spinner } from "@/components/ui/Spinner";

export default function VerificationStatus() {
    const session = useSession();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<User | undefined>();
    const [emailIsVerified, setEmailIsVerified] = useState(false);
    const [twoFactorVerified, setTwoFactorVerified] = useState(false);
    const [studentIdVerified, setStudentIdVerified] = useState(false);
    const [studentIdImage, setStudentIdImage] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            // Only proceed if session is authenticated
            if (session.status !== "authenticated") {
                console.log("Session not authenticated yet", session.status);
                // If session is unauthenticated, set loading to false to avoid infinite loading
                if (session.status === "unauthenticated") {
                    setLoading(false);
                }
                return;
            }
            
            // If session.data.user is not available, exit
            if (!session.data?.user) {
                console.log("No session.data.user available");
                setLoading(false);
                return;
            }
            
            try {
                console.log("Session data available:", session.data.user);
                
                // Use data from session directly if available
                const userData = session.data.user;
                
                // Set state with data from session - use optional chaining to safely access properties
                setEmailIsVerified(Boolean(userData?.email_verified));
                // For twofa_enabled, check if it exists in userData with a type assertion
                setTwoFactorVerified(Boolean((userData as any)?.twofa_enabled));
                setStudentIdVerified(Boolean(userData?.student_id_verified));
                setStudentIdImage((userData as any)?.student_id_verification || null);
                
                // If access_token is available, try to fetch fresh data from API
                if (userData.id && userData.access_token) {
                    console.log("Fetching fresh user data from API");
                    try {
                        const freshUserData = await GetUserProfile(
                            userData.id,
                            userData.access_token
                        );
                        
                        if (freshUserData) {
                            console.log("Fresh user data fetched successfully", freshUserData);
                            setUserData(freshUserData);
                            setEmailIsVerified(Boolean(freshUserData?.email_verified));
                            // For twofa_enabled, check if it exists in freshUserData with a type assertion
                            setTwoFactorVerified(Boolean((freshUserData as any)?.twofa_enabled));
                            setStudentIdVerified(Boolean(freshUserData?.student_id_verified));
                            setStudentIdImage((freshUserData as any)?.student_id_verification || null);
                        }
                    } catch (apiError) {
                        console.error("Error fetching fresh user data from API:", apiError);
                        // Continue using data from session if API fails
                    }
                }
                
                setLoading(false);
            } catch (error) {
                console.error("Error processing user data:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, [session.status, session.data]);

    const renderStudentIdStatus = () => {
        if (studentIdVerified) {
            return (
                <div className="flex flex-col items-center">
                    <FaCheckCircle className="mb-4 text-6xl text-green-500" />
                    <p className="text-lg text-gray-600">
                        Your student ID is already verified.
                    </p>
                </div>
            );
        } else if (!studentIdVerified && studentIdImage) {
            return (
                <div className="flex flex-col items-center">
                    <FaHourglassHalf className="mb-4 text-6xl text-yellow-500" />
                    <p className="text-lg text-gray-600">
                        Your student ID verification is pending.
                    </p>
                </div>
            );
        } else {
            return (
                <div className="flex flex-col items-center">
                    <FaTimesCircle className="mb-4 text-6xl text-red-500" />
                    <p className="text-lg text-gray-600">
                        Your student ID is still not verified, please verify it.
                    </p>
                </div>
            );
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Spinner className="text-sky-500">
                    <span className="text-sky-500">Loading...</span>
                </Spinner>
            </div>
        );
    }

    return (
        <section className="py-6 md:py-8 lg:py-10 bg-gradient-to-b from-gray-50 to-white transition-all duration-300">
            <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-50 to-white p-6 shadow-sm">
                    <h2 className="mb-4 flex items-center text-xl text-gray-700">
                        <FaShieldAlt className="mr-3 text-[#02ABF3]" />
                        Account Security & Verification
                    </h2>
                    <p className="text-sm text-gray-500">Review and manage your account verification status and security settings</p>
                </div>
                
                <div className="grid grid-cols-1 gap-6 sm:gap-8 md:gap-10 animate-fade-in">
                    {/* Email Verification Card */}
                    <div className="overflow-hidden rounded-lg md:rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-xl transform hover:translate-y-[-4px] focus-within:ring-2 focus-within:ring-[#02ABF3]/50">
                        <div className="relative border-b border-gray-100 bg-gradient-to-r from-[#02ABF3]/20 via-blue-50 to-white p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2 sm:space-x-3">
                                    <div className="space-y-4 sm:space-y-6 px-4 py-4 sm:px-6 sm:py-6 md:px-7 md:py-7">
                                        <FaEnvelope />
                                    </div>
                                    <h3 className="text-gray-700">Email Verification</h3>
                                </div>
                                <div className={`rounded-full px-3 py-1 text-xs ${emailIsVerified ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                    {emailIsVerified ? 'Verified' : 'Not Verified'}
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-4 sm:p-6">
                            <div className="flex flex-col items-center animate-scale-in">
                                {emailIsVerified ? (
                                    <>
                                        <div className="mb-4 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-green-50 transition-all duration-300 hover:scale-110 hover:shadow-md">
                                            <FaCheckCircle className="text-3xl text-green-500" />
                                        </div>
                                        <p className="mb-2 text-center text-sm text-gray-700 font-medium">
                                            Your email address has been successfully verified.
                                        </p>
                                        <h2 className="flex items-center text-lg sm:text-xl font-semibold text-gray-800" tabIndex={0}>
                                            You can receive important notifications and reset your password if needed.
                                        </h2>
                                    </>
                                ) : (
                                    <>
                                        <div className="mb-4 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-red-50 transition-all duration-300 hover:scale-110 hover:shadow-md">
                                            <FaTimesCircle className="text-3xl text-red-500" />
                                        </div>
                                        <p className="mb-2 text-center text-sm text-gray-700 font-medium">
                                            Your email address is not verified yet.
                                        </p>
                                        <h2 className="flex items-center text-lg sm:text-xl font-semibold text-gray-800" tabIndex={0}>
                                            Verify your email to receive important notifications and reset your password if needed.
                                        </h2>
                                        <button 
                                        className="rounded-lg border border-[#02ABF3] bg-[#02ABF3] px-4 py-2 text-sm text-white transition-all hover:bg-white hover:text-[#02ABF3] min-h-[44px] min-w-[120px] shadow-sm hover:shadow-md"
                                        aria-label="Verify email address"
                                        tabIndex={0}>
                                            Resend Verification Email
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Student ID Verification Card */}
                    <div className="overflow-hidden rounded-lg md:rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-xl transform hover:translate-y-[-4px] focus-within:ring-2 focus-within:ring-[#02ABF3]/50">
                        <div className="relative border-b border-gray-100 bg-gradient-to-r from-[#02ABF3]/20 via-blue-50 to-white p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2 sm:space-x-3">
                                    <div className="space-y-4 sm:space-y-6 px-4 py-4 sm:px-6 sm:py-6 md:px-7 md:py-7">
                                        <FaIdCard />
                                    </div>
                                    <h3 className="text-gray-700">Student ID Verification</h3>
                                </div>
                                <div className={`rounded-full px-3 py-1 text-xs ${studentIdVerified ? 'bg-green-100 text-green-600' : studentIdImage ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'}`}>
                                    {studentIdVerified ? 'Verified' : studentIdImage ? 'Pending' : 'Not Verified'}
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-4 sm:p-6">
                            <div className="flex flex-col items-center animate-scale-in">
                                {studentIdVerified ? (
                                    <>
                                        <div className="mb-4 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-green-50 transition-all duration-300 hover:scale-110 hover:shadow-md">
                                            <FaCheckCircle className="text-3xl text-green-500" />
                                        </div>
                                        <p className="mb-2 text-center text-sm text-gray-700 font-medium">
                                            Your student ID has been successfully verified.
                                        </p>
                                        <h2 className="flex items-center text-lg sm:text-xl font-semibold text-gray-800" tabIndex={0}>
                                            You now have access to all student features and benefits.
                                        </h2>
                                    </>
                                ) : studentIdImage ? (
                                    <>
                                        <div className="mb-4 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-yellow-50 transition-all duration-300 hover:scale-110 hover:shadow-md">
                                            <FaHourglassHalf className="text-3xl text-yellow-500" />
                                        </div>
                                        <p className="mb-2 text-center text-sm text-gray-700 font-medium">
                                            Your student ID verification is pending review.
                                        </p>
                                        <h2 className="flex items-center text-lg sm:text-xl font-semibold text-gray-800" tabIndex={0}>
                                            We'll notify you once your verification is complete. This usually takes 1-2 business days.
                                        </h2>
                                    </>
                                ) : (
                                    <>
                                        <div className="mb-4 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-red-50 transition-all duration-300 hover:scale-110 hover:shadow-md">
                                            <FaTimesCircle className="text-3xl text-red-500" />
                                        </div>
                                        <p className="mb-2 text-center text-sm text-gray-700 font-medium">
                                            Your student ID is not verified yet.
                                        </p>
                                        <h2 className="flex items-center text-lg sm:text-xl font-semibold text-gray-800" tabIndex={0}>
                                            Verify your student ID to access all student features and benefits.
                                        </h2>
                                        <button 
                                        className="rounded-lg border border-[#02ABF3] bg-[#02ABF3] px-4 py-2 text-sm text-white transition-all hover:bg-white hover:text-[#02ABF3] min-h-[44px] min-w-[120px] shadow-sm hover:shadow-md"
                                        aria-label="Verify email address"
                                        tabIndex={0}>
                                            Upload Student ID
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Two-Factor Authentication Card */}
                    <div className="overflow-hidden rounded-lg md:rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-xl transform hover:translate-y-[-4px] focus-within:ring-2 focus-within:ring-[#02ABF3]/50">
                        <div className="relative border-b border-gray-100 bg-gradient-to-r from-[#02ABF3]/20 via-blue-50 to-white p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2 sm:space-x-3">
                                    <div className="space-y-4 sm:space-y-6 px-4 py-4 sm:px-6 sm:py-6 md:px-7 md:py-7">
                                        <FaLock />
                                    </div>
                                    <h3 className="text-gray-700">Two-Factor Authentication</h3>
                                </div>
                                <div className={`rounded-full px-3 py-1 text-xs ${twoFactorVerified ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                    {twoFactorVerified ? 'Enabled' : 'Disabled'}
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-4 sm:p-6">
                            <div className="flex flex-col items-center animate-scale-in">
                                {twoFactorVerified ? (
                                    <>
                                        <div className="mb-4 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-green-50 transition-all duration-300 hover:scale-110 hover:shadow-md">
                                            <FaCheckCircle className="text-3xl text-green-500" />
                                        </div>
                                        <p className="mb-2 text-center text-sm text-gray-700 font-medium">
                                            Two-factor authentication is enabled on your account.
                                        </p>
                                        <p className="mb-4 text-center text-xs text-gray-500">
                                            Your account has an extra layer of security. You'll need to enter a code when signing in.
                                        </p>
                                        <button 
                                        className="rounded-lg border border-red-500 bg-white px-4 py-2 text-sm text-red-500 transition-all hover:bg-red-500 hover:text-white min-h-[44px] min-w-[120px] shadow-sm hover:shadow-md"
                                        aria-label="Disable two-factor authentication"
                                        tabIndex={0}>
                                            Disable 2FA
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="mb-4 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-red-50 transition-all duration-300 hover:scale-110 hover:shadow-md">
                                            <FaTimesCircle className="text-3xl text-red-500" />
                                        </div>
                                        <p className="mb-2 text-center text-sm text-gray-700 font-medium">
                                            Two-factor authentication is not enabled.
                                        </p>
                                        <p className="mb-4 text-center text-xs text-gray-500">
                                            Add an extra layer of security to your account by requiring both your password and a verification code.
                                        </p>
                                        <button 
                                        className="rounded-lg border border-[#02ABF3] bg-[#02ABF3] px-4 py-2 text-sm text-white transition-all hover:bg-white hover:text-[#02ABF3] min-h-[44px] min-w-[120px] shadow-sm hover:shadow-md"
                                        aria-label="Verify email address"
                                        tabIndex={0}>
                                            Enable 2FA
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
