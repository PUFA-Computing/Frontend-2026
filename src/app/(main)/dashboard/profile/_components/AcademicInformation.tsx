"use client";
import { GetUserProfile, UpdateUserProfile, VerifyStudentID } from "@/services/api/user";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import User from "@/models/user";
import Swal from "sweetalert2";

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

const inputCls = "w-full rounded-sm border border-[#B8841E]/25 bg-[#F5EDD0]/70 px-3 py-2.5 font-serif text-sm text-[#0D1B3E] placeholder:text-[#1A1A2E]/30 focus:border-[#B8841E] focus:ring-1 focus:ring-[#B8841E]/30 outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-h-[42px]";

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
    return <label htmlFor={htmlFor} className="block font-serif text-xs tracking-wide text-[#1A1A2E]/55 mb-1.5 uppercase">{children}</label>;
}

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
            if (session.status !== "authenticated") {
                if (session.status === "unauthenticated") setLoading(false);
                return;
            }
            if (!session.data?.user) { setLoading(false); return; }
            try {
                const userData = session.data.user;
                setMajor(userData.major || "");
                setBatch(userData.year || "");
                setStudentId(userData.student_id || "");
                setIsVerified(userData.student_id_verified || false);
                if (userData.id && userData.access_token) {
                    try {
                        const freshUserData = await GetUserProfile(userData.id, userData.access_token);
                        if (freshUserData) {
                            setUserData(freshUserData);
                            setMajor(freshUserData.major || "");
                            setBatch(freshUserData.year || "");
                            setStudentId(freshUserData.student_id || "");
                            setIsVerified(freshUserData.student_id_verified || false);
                        }
                    } catch (apiError) { console.error("Error fetching fresh user data:", apiError); }
                }
                setLoading(false);
            } catch (error) { console.error("Error processing user data:", error); setLoading(false); }
        };
        fetchData();
    }, [session.status, session.data]);

    const handleVerifyStudentID = async () => {
        if (!studentIdVerify || !session.data) return;
        try {
            const updatedUser = await VerifyStudentID(studentIdVerify, session.data.user.access_token);
            setUserData(updatedUser);
            setStudentIdVerify(null);
            setIsVerified(true);
            await Swal.fire({ icon: "success", title: "Student ID Uploaded, Please Wait Until Admin Verify It", showConfirmButton: false, timer: 1500 });
            window.location.reload();
        } catch (error) {
            await Swal.fire({ icon: "error", title: "Error", text: "Error Uploading Student ID" });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) setStudentIdVerify(e.target.files[0]);
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                    </svg>
                    Academic Journey
                </h2>
                <p className="font-serif text-xs text-[#1A1A2E]/45 mt-1">Manage your academic information and verify your student credentials</p>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

                {/* Academic Details */}
                <CardSection
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                        </svg>
                    }
                    title="Academic Details"
                >
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <FieldLabel htmlFor="major">Major</FieldLabel>
                                <input id="major" type="text" value={major} placeholder="Your major" onChange={(e) => setMajor(e.target.value)} className={inputCls} />
                            </div>
                            <div>
                                <FieldLabel htmlFor="batch">Batch Year</FieldLabel>
                                <input id="batch" type="text" value={batch} placeholder="e.g. 2023" onChange={(e) => setBatch(e.target.value)} className={inputCls} />
                            </div>
                        </div>
                        <div>
                            <FieldLabel htmlFor="studentId">Student ID {isVerified && <span className="text-[#B8841E] ml-1">✓ Verified</span>}</FieldLabel>
                            <input id="studentId" type="text" value={studentId} placeholder="Your student ID" onChange={(e) => setStudentId(e.target.value)} disabled={isVerified} className={inputCls} />
                        </div>
                        <div className="flex justify-end pt-1">
                            <button
                                onClick={async () => {
                                    if (!session.data) return;
                                    try {
                                        await UpdateUserProfile(
                                            session.data.user.username || "", session.data.user.first_name || "",
                                            session.data.user.middle_name || "", session.data.user.last_name || "",
                                            session.data.user.email || "", major, batch,
                                            session.data.user.gender || "", new Date(session.data.user.date_of_birth || Date.now()),
                                            session.data.user.access_token
                                        );
                                        Swal.fire({ title: "Success", text: "Academic information updated successfully", icon: "success" });
                                    } catch (error) {
                                        Swal.fire({ title: "Error", text: "Failed to update academic information", icon: "error" });
                                    }
                                }}
                                className="flex items-center gap-2 px-5 py-2.5 font-serif text-sm text-[#EDD085] border border-[#B8841E]/40 bg-[#0D1B3E] hover:bg-[#152347] rounded-sm transition-all duration-250 shadow-sm"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                Save Changes
                            </button>
                        </div>
                    </div>
                </CardSection>

                {/* ID Verification */}
                <CardSection
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                        </svg>
                    }
                    title="ID Verification"
                >
                    {isVerified ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
                            <div className="w-14 h-14 rounded-full bg-[#B8841E]/10 border border-[#B8841E]/25 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-[#B8841E]">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="font-display italic text-lg text-[#0D1B3E]">Verified</h3>
                            <p className="font-serif text-xs text-[#1A1A2E]/50">Your student ID has been verified. Thank you for completing the process.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <p className="font-serif text-sm text-[#1A1A2E]/50">Upload a clear image of your student ID card to verify your academic status</p>
                            <label
                                htmlFor="id-dropzone"
                                className="flex flex-col items-center justify-center h-32 w-full rounded-sm border-2 border-dashed border-[#B8841E]/25 bg-[#F5EDD0]/50 cursor-pointer hover:border-[#B8841E]/50 hover:bg-[#F5EDD0]/80 transition-all duration-200"
                                aria-label="Upload student ID"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-[#B8841E]/40 mb-2">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                                </svg>
                                <p className="font-serif text-xs text-[#1A1A2E]/50">Click to upload or drag and drop</p>
                                <p className="font-serif text-[10px] text-[#1A1A2E]/35 mt-0.5">PNG or JPG · max 5 MB</p>
                                <input id="id-dropzone" type="file" className="hidden" onChange={handleFileChange} accept="image/png,image/jpeg" />
                            </label>
                            {studentIdVerify && (
                                <div className="flex items-center gap-2 px-3 py-2 bg-[#F5EDD0] border border-[#B8841E]/20 rounded-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-[#B8841E]">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span className="font-serif text-xs text-[#0D1B3E]/70 truncate">{studentIdVerify.name}</span>
                                </div>
                            )}
                            <button
                                onClick={handleVerifyStudentID}
                                disabled={!studentIdVerify}
                                className="w-full flex items-center justify-center gap-2 px-5 py-2.5 font-serif text-sm text-[#EDD085] border border-[#B8841E]/40 bg-[#0D1B3E] hover:bg-[#152347] rounded-sm transition-all duration-250 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Submit for Verification
                            </button>
                        </div>
                    )}
                </CardSection>
            </div>
        </section>
    );
}
