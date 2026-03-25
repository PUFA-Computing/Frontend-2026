import { GetUserProfile } from "@/services/api/user";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import User from "@/models/user";

// ── Status badge pill ────────────────────────────────────────────────────
function StatusBadge({ state }: { state: "verified" | "pending" | "unverified" }) {
    const map = {
        verified:   { label: "Verified",     cls: "bg-[#B8841E]/10 border border-[#B8841E]/25 text-[#B8841E]" },
        pending:    { label: "Pending",      cls: "bg-[#0D1B3E]/8 border border-[#0D1B3E]/20 text-[#0D1B3E]/60" },
        unverified: { label: "Unverified",   cls: "bg-red-50 border border-red-200/60 text-red-500" },
    };
    const { label, cls } = map[state];
    return <span className={`px-2.5 py-0.5 rounded-sm font-serif text-[10px] tracking-wide uppercase ${cls}`}>{label}</span>;
}

// ── Status icon + content block ──────────────────────────────────────────
function StatusCard({ icon, title, state, description }: { icon: React.ReactNode; title: string; state: "verified" | "pending" | "unverified"; description: string }) {
    const iconBg = state === "verified" ? "bg-[#B8841E]/10 border-[#B8841E]/25 text-[#B8841E]" :
                   state === "pending"  ? "bg-[#0D1B3E]/6 border-[#0D1B3E]/15 text-[#0D1B3E]/40" :
                                          "bg-red-50 border-red-200/60 text-red-400";
    return (
        <div className="bg-[#FAF5E8] border border-[#B8841E]/20 rounded-sm shadow-sm overflow-hidden">
            <div className="relative px-5 py-4 border-b border-[#B8841E]/15 bg-[#F5EDD0]/60 flex items-center justify-between">
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#B8841E]/60 via-[#D9A84A] to-[#B8841E]/60 rounded-r" />
                <div className="flex items-center gap-2.5">
                    <span className="text-[#B8841E]">{icon}</span>
                    <h2 className="font-display italic text-xl text-[#0D1B3E]">{title}</h2>
                </div>
                <StatusBadge state={state} />
            </div>
            <div className="p-5 flex flex-col items-center text-center gap-3 py-8">
                <div className={`w-14 h-14 rounded-full border flex items-center justify-center ${iconBg}`}>
                    {state === "verified" ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    ) : state === "pending" ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    )}
                </div>
                <p className="font-serif text-sm text-[#1A1A2E]/60 max-w-xs leading-relaxed">{description}</p>
            </div>
        </div>
    );
}

export default function VerificationStatus() {
    const session = useSession();
    const [loading, setLoading] = useState(true);
    const [emailIsVerified, setEmailIsVerified] = useState(false);
    const [twoFactorVerified, setTwoFactorVerified] = useState(false);
    const [studentIdVerified, setStudentIdVerified] = useState(false);
    const [studentIdImage, setStudentIdImage] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (session.status !== "authenticated") {
                if (session.status === "unauthenticated") setLoading(false);
                return;
            }
            if (!session.data?.user) { setLoading(false); return; }
            try {
                const userData = session.data.user;
                setEmailIsVerified(Boolean(userData?.email_verified));
                setTwoFactorVerified(Boolean((userData as any)?.twofa_enabled));
                setStudentIdVerified(Boolean(userData?.student_id_verified));
                setStudentIdImage((userData as any)?.student_id_verification || null);
                if (userData.id && userData.access_token) {
                    try {
                        const freshUserData = await GetUserProfile(userData.id, userData.access_token);
                        if (freshUserData) {
                            setEmailIsVerified(Boolean(freshUserData?.email_verified));
                            setTwoFactorVerified(Boolean((freshUserData as any)?.twofa_enabled));
                            setStudentIdVerified(Boolean(freshUserData?.student_id_verified));
                            setStudentIdImage((freshUserData as any)?.student_id_verification || null);
                        }
                    } catch (apiError) { console.error("Error fetching fresh user data:", apiError); }
                }
                setLoading(false);
            } catch (error) { console.error("Error processing user data:", error); setLoading(false); }
        };
        fetchData();
    }, [session.status, session.data]);

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="h-6 w-6 rounded-full border-2 border-[#B8841E]/30 border-t-[#B8841E] animate-spin" />
            </div>
        );
    }

    const studentIdState: "verified" | "pending" | "unverified" =
        studentIdVerified ? "verified" : studentIdImage ? "pending" : "unverified";

    return (
        <section className="space-y-5">

            {/* Intro */}
            <div className="bg-[#FAF5E8] border border-[#B8841E]/20 rounded-sm px-5 py-4 shadow-sm">
                <h2 className="font-display italic text-xl text-[#0D1B3E] flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-[#B8841E]">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Verification Status
                </h2>
                <p className="font-serif text-xs text-[#1A1A2E]/45 mt-1">Review and manage your account verification status and security settings</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                {/* Email */}
                <StatusCard
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                    title="Email"
                    state={emailIsVerified ? "verified" : "unverified"}
                    description={
                        emailIsVerified
                            ? "Your email has been successfully verified. You can receive all notifications."
                            : "Your email is not verified yet. Please verify it to receive important notifications."
                    }
                />

                {/* Student ID */}
                <StatusCard
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>}
                    title="Student ID"
                    state={studentIdState}
                    description={
                        studentIdVerified
                            ? "Your student ID has been verified. You have access to all student features."
                            : studentIdImage
                            ? "Your student ID is pending review. This usually takes 1–2 business days."
                            : "Your student ID is not verified yet. Please upload it in the Academic tab."
                    }
                />

                {/* 2FA */}
                <StatusCard
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
                    title="Two-Factor Auth"
                    state={twoFactorVerified ? "verified" : "unverified"}
                    description={
                        twoFactorVerified
                            ? "2FA is active on your account — you'll need a code when you sign in."
                            : "2FA is not enabled. Enable it in the Security tab for extra protection."
                    }
                />
            </div>
        </section>
    );
}
