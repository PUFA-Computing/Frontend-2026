"use client";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { Spinner } from "@/components/ui/Spinner";
import {
    GetUserProfile,
    UpdateUserProfile,
    uploadProfilePicture,
} from "@/services/api/user";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import User from "@/models/user";
import Select from "react-select";

const formatDate = (date: Date | undefined): string => {
    if (!date) return "";
    const d = new Date(date);
    const month = ("0" + (d.getMonth() + 1)).slice(-2);
    const day = ("0" + d.getDate()).slice(-2);
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
};

const parseDate = (dateString: string): Date => {
    const [year, month, day] = dateString.split("-");
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
};

// ─── Reusable card section ──────────────────────────────────────────────────
function CardSection({ icon, title, subtitle, children }: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="bg-[#FAF5E8] border border-[#B8841E]/20 rounded-sm overflow-hidden shadow-sm">
            {/* Card header */}
            <div className="relative px-5 py-4 border-b border-[#B8841E]/15 bg-[#F5EDD0]/60">
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#B8841E]/60 via-[#D9A84A] to-[#B8841E]/60 rounded-r" />
                <div className="flex items-center gap-2.5">
                    <span className="text-[#B8841E]">{icon}</span>
                    <div>
                        <h2 className="font-display italic text-xl text-[#0D1B3E]">{title}</h2>
                        {subtitle && <p className="font-serif text-xs text-[#1A1A2E]/45 mt-0.5">{subtitle}</p>}
                    </div>
                </div>
            </div>
            <div className="p-5 sm:p-6">{children}</div>
        </div>
    );
}

// ─── Re-styled input label ─────────────────────────────────────────────────
function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
    return (
        <label htmlFor={htmlFor} className="block font-serif text-xs tracking-wide text-[#1A1A2E]/55 mb-1.5 uppercase">
            {children}
        </label>
    );
}

// ─── Shared input class ────────────────────────────────────────────────────
const inputCls = "w-full rounded-sm border border-[#B8841E]/25 bg-[#F5EDD0]/70 px-3 py-2.5 font-serif text-sm text-[#0D1B3E] placeholder:text-[#1A1A2E]/30 focus:border-[#B8841E] focus:ring-1 focus:ring-[#B8841E]/30 outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-h-[42px]";

// ─── Section sub-title ────────────────────────────────────────────────────
function SubTitle({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-3 mb-4">
            <p className="font-serif text-[10px] tracking-[0.2em] uppercase text-[#B8841E]/70 whitespace-nowrap">{children}</p>
            <div className="h-px flex-1 bg-gradient-to-r from-[#B8841E]/20 to-transparent" />
        </div>
    );
}

export default function MyAccount() {
    const session = useSession();

    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<User>();
    const [username, setUsername] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("");
    const [middleName, setMiddleName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(
        userData?.date_of_birth ? new Date(userData.date_of_birth) : undefined
    );
    const [major, setMajor] = useState<string>("");
    const [batch, setBatch] = useState<string>("");
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [gender, setGender] = useState<string>("");
    const [uploadingProfilePicture, setUploadingProfilePicture] = useState<boolean>(false);

    const genderOptions = [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
        { value: "other", label: "Other" },
    ];

    useEffect(() => {
        const fetchData = async () => {
            if (session.status !== "authenticated") {
                if (session.status === "unauthenticated") setLoading(false);
                return;
            }
            if (!session.data?.user) { setLoading(false); return; }
            try {
                const userData = session.data.user;
                setUsername(userData.username || "");
                setFirstName(userData.first_name || "");
                setMiddleName(userData.middle_name || "");
                setLastName(userData.last_name || "");
                setEmail(userData.email || "");
                setMajor(userData.major || "");
                setBatch(userData.year || "");
                setGender(userData.gender || "");
                if (userData.date_of_birth) {
                    const dateObj = new Date(userData.date_of_birth);
                    setDateOfBirth(!isNaN(dateObj.getTime()) ? dateObj : undefined);
                } else {
                    setDateOfBirth(undefined);
                }
                if (userData.id && userData.access_token) {
                    try {
                        const freshUserData = await GetUserProfile(userData.id, userData.access_token);
                        if (freshUserData) {
                            setUserData(freshUserData);
                            setUsername(freshUserData.username || "");
                            setFirstName(freshUserData.first_name || "");
                            setMiddleName(freshUserData.middle_name || "");
                            setLastName(freshUserData.last_name || "");
                            setEmail(freshUserData.email || "");
                            setMajor(freshUserData.major || "");
                            setBatch(freshUserData.year || "");
                            setGender(freshUserData.gender || "");
                            setDateOfBirth(freshUserData.date_of_birth || undefined);
                        }
                    } catch (apiError) {
                        console.error("Error fetching fresh user data:", apiError);
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

    const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setProfilePicture(file);
    };

    const handleProfilePictureUpload = async () => {
        if (!profilePicture) return;
        if (session.status !== "authenticated" || !session.data?.user?.access_token) {
            Swal.fire({ icon: "error", title: "Authentication Error", text: "You need to be logged in to upload a profile picture" });
            return;
        }
        setUploadingProfilePicture(true);
        try {
            const updatedUser = await uploadProfilePicture(profilePicture, session.data.user.access_token);
            setUserData(updatedUser || undefined);
            setProfilePicture(null);
            await Swal.fire({ icon: "success", title: "Profile Picture Updated", showConfirmButton: false, timer: 1500 });
            window.location.reload();
        } catch (error) {
            await Swal.fire({ icon: "error", title: "Error", text: "Error uploading profile picture" });
        } finally {
            setUploadingProfilePicture(false);
        }
    };

    const handleSave = async () => {
        if (session.status !== "authenticated" || !session.data?.user?.access_token) {
            Swal.fire({ icon: "error", title: "Authentication Error", text: "You need to be logged in to update your profile" });
            return;
        }
        if (!username) return Swal.fire({ icon: "error", title: "Validation Error", text: "Username is required" });
        if (!firstName) return Swal.fire({ icon: "error", title: "Validation Error", text: "First name is required" });
        if (!lastName) return Swal.fire({ icon: "error", title: "Validation Error", text: "Last name is required" });
        if (!email) return Swal.fire({ icon: "error", title: "Validation Error", text: "Email is required" });
        if (!dateOfBirth) return Swal.fire({ icon: "error", title: "Validation Error", text: "Date of birth is required" });

        Swal.fire({ title: "Updating profile...", allowOutsideClick: false, didOpen: () => { Swal.showLoading(); } });
        try {
            const updatedUser = await UpdateUserProfile(username, firstName, middleName, lastName, email, major, batch, gender, dateOfBirth, session.data.user.access_token);
            setUserData(updatedUser || undefined);
            if (updatedUser) {
                setUsername(updatedUser.username || "");
                setFirstName(updatedUser.first_name || "");
                setMiddleName(updatedUser.middle_name || "");
                setLastName(updatedUser.last_name || "");
                setEmail(updatedUser.email || "");
                setMajor(updatedUser.major || "");
                setBatch(updatedUser.year || "");
                setGender(updatedUser.gender || "");
                if (updatedUser.date_of_birth) setDateOfBirth(new Date(updatedUser.date_of_birth));
            }
            await Swal.fire({ icon: "success", title: "Profile Updated", text: "Your personal information has been successfully updated" });
        } catch (error) {
            await Swal.fire({ icon: "error", title: "Error", text: typeof error === "string" ? error : "Failed to update profile. Please try again later." });
        }
    };

    const handleGenderChange = (selectedOption: any) => {
        setGender(selectedOption ? selectedOption.value : "");
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-6 w-6 rounded-full border-2 border-[#B8841E]/30 border-t-[#B8841E] animate-spin" />
                    <p className="font-serif text-sm text-[#1A1A2E]/45">Loading…</p>
                </div>
            </div>
        );
    }

    // react-select styles matching AURASCENDIA
    const selectStyles = {
        control: (base: any) => ({
            ...base,
            minHeight: "42px",
            borderColor: "rgba(184,132,30,0.25)",
            backgroundColor: "rgba(245,237,208,0.7)",
            boxShadow: "none",
            borderRadius: "2px",
            fontFamily: "var(--font-serif), Lora, serif",
            fontSize: "0.875rem",
            color: "#0D1B3E",
            "&:hover": { borderColor: "rgba(184,132,30,0.5)" },
            "&:focus-within": { borderColor: "#B8841E", boxShadow: "0 0 0 1px rgba(184,132,30,0.3)" },
        }),
        placeholder: (base: any) => ({ ...base, color: "rgba(26,26,46,0.3)", fontFamily: "var(--font-serif), Lora, serif" }),
        singleValue: (base: any) => ({ ...base, color: "#0D1B3E", fontFamily: "var(--font-serif), Lora, serif" }),
        option: (base: any, state: any) => ({
            ...base,
            backgroundColor: state.isSelected ? "#0D1B3E" : state.isFocused ? "rgba(184,132,30,0.08)" : undefined,
            color: state.isSelected ? "#EDD085" : "#0D1B3E",
            fontFamily: "var(--font-serif), Lora, serif",
            fontSize: "0.875rem",
        }),
        menu: (base: any) => ({ ...base, borderRadius: "2px", border: "1px solid rgba(184,132,30,0.2)", boxShadow: "0 4px 16px rgba(26,26,46,0.1)" }),
        dropdownIndicator: (base: any) => ({ ...base, color: "rgba(184,132,30,0.5)", "&:hover": { color: "#B8841E" } }),
        indicatorSeparator: () => ({ display: "none" }),
    };

    return (
        <section className="space-y-5">

            {/* ── Profile Photo card ── */}
            <CardSection
                icon={
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                }
                title="Profile Photo"
                subtitle="Upload and manage your profile picture"
            >
                <div className="flex flex-col md:flex-row items-center gap-8">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                        <div className="h-36 w-36 sm:h-44 sm:w-44 rounded-full overflow-hidden border-2 border-[#B8841E]/30 ring-4 ring-[#B8841E]/10 shadow-md">
                            <Image
                                src={userData?.profile_picture || "https://sg.pufacomputing.live/Assets/male.jpeg"}
                                alt="Profile picture"
                                width={176}
                                height={176}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <label
                            htmlFor="dropzone-file"
                            className="absolute bottom-1 right-1 flex items-center justify-center w-9 h-9 rounded-full bg-[#0D1B3E] border border-[#B8841E]/40 shadow-md cursor-pointer hover:bg-[#152347] transition-all duration-200"
                            aria-label="Upload profile picture"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-[#D9A84A]">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <input id="dropzone-file" type="file" className="hidden" onChange={handleProfilePictureChange} accept="image/svg+xml,image/png,image/jpeg" />
                        </label>
                    </div>

                    {/* Info + upload area */}
                    <div className="flex flex-col items-center md:items-start gap-4 flex-1 w-full">
                        <div className="text-center md:text-left">
                            <h3 className="font-display italic text-xl text-[#0D1B3E]">{firstName} {lastName}</h3>
                            <div className="mt-2 space-y-1.5">
                                {[
                                    { icon: "M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207", text: username },
                                    { icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", text: email },
                                    { icon: "M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z", text: `${major} · ${batch}` },
                                ].map(({ icon, text }) => (
                                    <div key={icon} className="flex items-center gap-2 font-serif text-sm text-[#1A1A2E]/60">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-[#B8841E] shrink-0">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                                        </svg>
                                        <span>{text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {profilePicture ? (
                            <button
                                onClick={handleProfilePictureUpload}
                                disabled={uploadingProfilePicture}
                                className="flex items-center gap-2 px-5 py-2.5 font-serif text-sm text-[#EDD085] border border-[#B8841E]/40 bg-[#0D1B3E] hover:bg-[#152347] rounded-sm transition-all duration-250 shadow-sm disabled:opacity-60"
                            >
                                {uploadingProfilePicture ? (
                                    <><div className="h-4 w-4 rounded-full border-2 border-[#EDD085]/30 border-t-[#EDD085] animate-spin" />Uploading…</>
                                ) : (
                                    <><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>Upload Photo</>
                                )}
                            </button>
                        ) : (
                            <div
                                className="w-full max-w-sm border border-dashed border-[#B8841E]/30 bg-[#F5EDD0]/50 rounded-sm p-4 text-center cursor-pointer hover:border-[#B8841E]/60 hover:bg-[#F5EDD0]/80 transition-all duration-200"
                                onClick={() => document.getElementById("dropzone-file")?.click()}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-7 w-7 text-[#B8841E]/40 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="font-serif text-xs text-[#1A1A2E]/50">Click camera icon to select a photo</p>
                                <p className="font-serif text-[10px] text-[#1A1A2E]/35 mt-0.5">JPG, PNG or GIF · max 2 MB</p>
                            </div>
                        )}
                    </div>
                </div>
            </CardSection>

            {/* ── Personal Information card ── */}
            <CardSection
                icon={
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                }
                title="Personal Information"
                subtitle="Update your personal details and account information"
            >
                <div className="space-y-5">
                    {/* Account fields */}
                    <div>
                        <SubTitle>Account</SubTitle>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <FieldLabel htmlFor="username">Username</FieldLabel>
                                <input id="username" type="text" value={username} disabled className={inputCls} />
                            </div>
                            <div>
                                <FieldLabel htmlFor="email">Email Address</FieldLabel>
                                <input id="email" type="email" value={email} disabled className={inputCls} />
                            </div>
                        </div>
                    </div>

                    {/* Name fields */}
                    <div>
                        <SubTitle>Name</SubTitle>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <FieldLabel htmlFor="first-name">First Name</FieldLabel>
                                <input id="first-name" type="text" value={firstName} placeholder={userData?.first_name} onChange={(e) => setFirstName(e.target.value)} className={inputCls} />
                            </div>
                            <div>
                                <FieldLabel htmlFor="middle-name">Middle Name</FieldLabel>
                                <input id="middle-name" type="text" value={middleName} placeholder={(userData as any)?.middle_name || "Optional"} onChange={(e) => setMiddleName(e.target.value)} className={inputCls} />
                            </div>
                            <div>
                                <FieldLabel htmlFor="last-name">Last Name</FieldLabel>
                                <input id="last-name" type="text" value={lastName} placeholder={userData?.last_name} onChange={(e) => setLastName(e.target.value)} className={inputCls} />
                            </div>
                        </div>
                    </div>

                    {/* Personal details */}
                    <div>
                        <SubTitle>Personal Details</SubTitle>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <FieldLabel htmlFor="date-of-birth">Date of Birth</FieldLabel>
                                <input
                                    id="date-of-birth"
                                    type="date"
                                    value={formatDate(dateOfBirth)}
                                    onChange={(e) => setDateOfBirth(parseDate(e.target.value))}
                                    className={inputCls}
                                />
                            </div>
                            <div>
                                <FieldLabel htmlFor="gender">Gender</FieldLabel>
                                <Select
                                    id="gender"
                                    value={genderOptions.find((o) => o.value === gender)}
                                    onChange={handleGenderChange}
                                    options={genderOptions}
                                    placeholder="Select gender"
                                    styles={selectStyles}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Save button */}
                    <div className="flex justify-end pt-2">
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 px-6 py-2.5 font-serif text-sm text-[#EDD085] border border-[#B8841E]/40 bg-[#0D1B3E] hover:bg-[#152347] hover:border-[#B8841E]/70 rounded-sm transition-all duration-250 shadow-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Save Changes
                        </button>
                    </div>
                </div>
            </CardSection>
        </section>
    );
}
