"use client";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Seperator from "@/components/Seperator";
import { Spinner } from "@/components/ui/Spinner";
import {
    GetUserProfile,
    UpdateUserProfile,
    VerifyStudentID,
} from "@/services/api/user";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import User from "@/models/user";
import Swal from "sweetalert2";
import { FaCheckCircle, FaGraduationCap, FaIdCard, FaCalendarAlt } from "react-icons/fa";

export default function AcademicInformation() {
    const session = useSession();

    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<User>();
    const [major, setMajor] = useState<string>("");
    const [batch, setBatch] = useState<string>("");
    const [studentId, setStudentId] = useState<string>("");
    const [isVerified, setIsVerified] = useState<boolean>(false);
    const [studentIdVerify, setStudentIdVerify] = useState<File | null>(null);

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
                
                // Set state with data from session
                setMajor(userData.major || "");
                setBatch(userData.year || "");
                setStudentId(userData.student_id || "");
                setIsVerified(userData.student_id_verified || false);
                
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
                            setMajor(freshUserData.major || "");
                            setBatch(freshUserData.year || "");
                            setStudentId(freshUserData.student_id || "");
                            setIsVerified(freshUserData.student_id_verified || false);
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

    const handleVerifyStudentID = async () => {
        if (studentIdVerify) {
            if (!session.data) {
                return;
            }
            try {
                const updatedUser = await VerifyStudentID(
                    studentIdVerify,
                    session.data.user.access_token
                );
                setUserData(updatedUser);
                setStudentIdVerify(null);
                setIsVerified(true);

                await Swal.fire({
                    icon: "success",
                    title: "Student ID Uploaded, Please Wait Until Admin Verify It",
                    showConfirmButton: false,
                    timer: 1500,
                });

                window.location.reload();
            } catch (error) {
                await Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Error Uploading Student ID",
                });
                console.error("Error Uploading Student ID:", error);
            }
        } else {
            console.error("No file selected for verification.");
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setStudentIdVerify(e.target.files[0]);
            console.log("File selected:", e.target.files[0]);
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
                <div className="mb-8 overflow-hidden rounded-xl bg-gradient-to-r from-blue-50 to-white p-6 shadow-sm">
                    <h2 className="mb-4 flex items-center text-xl text-gray-700">
                        <FaGraduationCap className="mr-3 text-[#02ABF3]" />
                        Academic Journey
                    </h2>
                    <p className="text-sm text-gray-500">Manage your academic information and verify your student credentials</p>
                </div>
                
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {/* Academic Information Card */}
                    <div className="overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:shadow-md">
                        <div className="border-b border-gray-100 bg-white p-5">
                            <div className="flex items-center">
                                <div className="group relative transition-all duration-300 hover:translate-y-[-2px]">
                                    <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-[#02ABF3]">
                                        <FaGraduationCap />
                                    </div>
                                </div>
                                <h3 className="text-gray-700">Academic Details</h3>
                            </div>
                        </div>
                        
                        <div className="p-6">
                            <form className="space-y-5 text-gray-600">
                                <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-3">
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-500">
                                            <span className="flex items-center">
                                                <FaGraduationCap className="mr-2 text-xs text-gray-400" />
                                                Major
                                            </span>
                                        </label>
                                        <Input
                                            htmlFor="major"
                                            label="Major"
                                            type="text"
                                            name="major"
                                            placeholder="Your major"
                                            value={major}
                                            onChange={(e) => setMajor(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-500">
                                            <span className="flex items-center">
                                                <FaCalendarAlt className="mr-2 text-xs text-gray-400" />
                                                Batch
                                            </span>
                                        </label>
                                        <Input
                                            htmlFor="batch"
                                            label="Batch"
                                            type="text"
                                            name="batch"
                                            placeholder="Your batch year"
                                            value={batch}
                                            onChange={(e) => setBatch(e.target.value)}
                                        />
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-500">
                                        <span className="flex items-center">
                                            <FaIdCard className="mr-2 text-xs text-gray-400" />
                                            Student ID
                                            {isVerified && (
                                                <h2 className="flex items-center text-lg sm:text-xl font-semibold text-gray-800" tabIndex={0}>
                                                    <FaCheckCircle className="mr-1" />
                                                    Verified
                                                </h2>
                                            )}
                                        </span>
                                    </label>
                                    <Input
                                        htmlFor="studentId"
                                        label="Student ID"
                                        type="text"
                                        name="studentId"
                                        placeholder="Your student ID"
                                        value={studentId}
                                        onChange={(e) => setStudentId(e.target.value)}
                                        disabled={isVerified}
                                    />
                                </div>
                                
                                <div className="pt-4 sm:pt-2 text-right">
                                    <Button
                                        onClick={async () => {
                                            if (!session.data) return;

                                            try {
                                                await UpdateUserProfile(
                                                    session.data.user.username || "",
                                                    session.data.user.first_name || "",
                                                    session.data.user.middle_name || "",
                                                    session.data.user.last_name || "",
                                                    session.data.user.email || "",
                                                    major,
                                                    batch,
                                                    session.data.user.gender || "",
                                                    new Date(session.data.user.date_of_birth || Date.now()),
                                                    session.data.user.access_token
                                                );

                                                Swal.fire({
                                                    title: "Success",
                                                    text: "Academic information updated successfully",
                                                    icon: "success",
                                                    confirmButtonText: "OK",
                                                });
                                            } catch (error) {
                                                console.error("Error updating academic information", error);
                                                Swal.fire({
                                                    title: "Error",
                                                    text: "Failed to update academic information",
                                                    icon: "error",
                                                    confirmButtonText: "OK",
                                                });
                                            }
                                        }}
                                        className="rounded-lg bg-[#02ABF3] px-6 py-2 text-sm text-white transition-all hover:bg-white hover:text-[#02ABF3] hover:shadow-md min-h-[44px] min-w-[120px]"
                                        aria-label="Save academic information changes"
                                    >
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                    
                    {/* Verification Card */}
                    <div className="overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:shadow-md">
                        <div className="border-b border-gray-100 bg-white p-5">
                            <div className="flex items-center">
                                <div className="group relative transition-all duration-300 hover:translate-y-[-2px]">
                                    <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-[#02ABF3]">
                                        <FaIdCard />
                                    </div>
                                </div>
                                <h3 className="text-gray-700">ID Verification</h3>
                            </div>
                        </div>
                        
                        <div className="p-6">
                            <div className="text-gray-600">
                                {isVerified ? (
                                    <div className="flex flex-col items-center justify-center space-y-4 animate-scale-in">
                                        <FaCheckCircle className="mb-3 text-4xl text-green-500" />
                                        <p className="text-green-700">Your student ID has been verified</p>
                                        <p className="mt-2 text-sm text-green-600">Thank you for completing the verification process</p>
                                    </div>
                                ) : (
                                    <>
                                        <p className="mb-4 text-sm text-gray-500">Upload a clear image of your student ID card to verify your academic status</p>
                                        
                                        <label
                                            htmlFor="dropzone-file"
                                            className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-all duration-300 hover:border-[#02ABF3]/30 focus:outline-none focus:ring-2 focus:ring-[#02ABF3]/30"
                                            tabIndex={0}
                                            role="button"
                                            aria-label="Upload student ID verification"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    e.preventDefault();
                                                    document.getElementById('dropzone-file')?.click();
                                                }
                                            }}
                                        >
                                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 transition-all duration-300 hover:scale-110 hover:shadow-md">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.5"
                                                    stroke="currentColor"
                                                    className="h-6 w-6"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                                                    />
                                                </svg>
                                            </div>

                                            <p className="mb-1 text-sm text-gray-700">Click to upload or drag and drop</p>
                                            <p className="text-xs text-gray-500">PNG or JPG (Max 5MB)</p>

                                            <input
                                                id="dropzone-file"
                                                type="file"
                                                className="hidden"
                                                onChange={handleFileChange}
                                                accept="image/png, image/jpeg"
                                            />
                                        </label>
                                        
                                        {studentIdVerify && (
                                            <div className="mt-4 rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
                                                <p className="flex items-center">
                                                    <svg className="mr-2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    {studentIdVerify.name}
                                                </p>
                                            </div>
                                        )}
                                        
                                        <div className="mt-6 text-right">
                                            <Button
                                                onClick={handleVerifyStudentID}
                                                disabled={!studentIdVerify}
                                                className="w-full rounded-lg border-gray-200 bg-white px-4 py-3 text-gray-700 shadow-sm transition-all focus:border-[#02ABF3] focus:ring-[#02ABF3]/30 group-hover:border-gray-300 min-h-[44px]"
                                                aria-label="Submit student ID for verification"
                                            >
                                                Submit for Verification
                                            </Button>
                                        </div>
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
