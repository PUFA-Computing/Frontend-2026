"use client";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Seperator from "@/components/Seperator";
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

interface Props {
    userData?: {
        date_of_birth?: Date;
    };
}

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
        userData?.date_of_birth
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

    // Fetch user data
    useEffect(() => {
        const fetchData = async () => {
            // Hanya lanjutkan jika session sudah authenticated
            if (session.status !== "authenticated") {
                console.log("Session not authenticated yet", session.status);
                // Jika session belum siap, set loading ke false agar tidak infinite loading
                if (session.status === "unauthenticated") {
                    setLoading(false);
                }
                return;
            }
            
            // Jika session.data tidak ada atau tidak lengkap, gunakan data dari session.data.user langsung
            if (!session.data?.user) {
                console.log("No session.data.user available");
                setLoading(false);
                return;
            }
            
            try {
                console.log("Session data available:", session.data.user);
                
                // Gunakan data dari session langsung jika tersedia
                const userData = session.data.user;
                
                // Set state dengan data dari session
                setUsername(userData.username || "");
                setFirstName(userData.first_name || "");
                setMiddleName(userData.middle_name || "");
                setLastName(userData.last_name || "");
                setEmail(userData.email || "");
                setMajor(userData.major || "");
                setBatch(userData.year || "");
                setGender(userData.gender || "");
                // Konversi date_of_birth dari string ke Date jika diperlukan
                if (userData.date_of_birth) {
                    try {
                        // Coba konversi ke Date apapun tipe datanya
                        const dateObj = new Date(userData.date_of_birth);
                        // Periksa apakah tanggal valid
                        if (!isNaN(dateObj.getTime())) {
                            setDateOfBirth(dateObj);
                        } else {
                            console.warn("Invalid date format:", userData.date_of_birth);
                            setDateOfBirth(undefined);
                        }
                    } catch (error) {
                        console.error("Error converting date:", error);
                        setDateOfBirth(undefined);
                    }
                } else {
                    setDateOfBirth(undefined);
                }
                
                // Jika ada access_token, coba ambil data terbaru dari API
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
                        console.error("Error fetching fresh user data from API:", apiError);
                        // Tetap gunakan data dari session jika API gagal
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

    const handleProfilePictureChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfilePicture(file);
        }
    };

    const handleProfilePictureUpload = async () => {
        if (profilePicture) {
            // Periksa apakah session sudah authenticated dan memiliki data user yang lengkap
            if (session.status !== "authenticated" || !session.data?.user?.access_token) {
                Swal.fire({
                    icon: "error",
                    title: "Authentication Error",
                    text: "You need to be logged in to upload a profile picture",
                    showConfirmButton: true,
                });
                return;
            }
            
            setUploadingProfilePicture(true);
            try {
                const updatedUser = await uploadProfilePicture(
                    profilePicture,
                    session.data.user.access_token
                );
                
                // Konversi null menjadi undefined jika diperlukan untuk menghindari error tipe data
                const safeUpdatedUser = updatedUser || undefined;
                setUserData(safeUpdatedUser);
                setProfilePicture(null);

                await Swal.fire({
                    icon: "success",
                    title: "Profile Picture Updated",
                    showConfirmButton: false,
                    timer: 1500,
                });

                window.location.reload();
            } catch (error) {
                await Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Error uploading profile picture",
                });
                console.error("Error uploading profile picture:", error);
            } finally {
                setUploadingProfilePicture(false);
            }
        }
    };

    const handleSave = async () => {
        // Periksa apakah session sudah authenticated dan memiliki data user yang lengkap
        if (session.status !== "authenticated" || !session.data?.user?.access_token) {
            Swal.fire({
                icon: "error",
                title: "Authentication Error",
                text: "You need to be logged in to update your profile",
                showConfirmButton: true,
            });
            return;
        }
        
        if (!dateOfBirth) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "Date of birth is required",
                showConfirmButton: true,
            });
            return;
        }
        
        try {
            // UpdateUserProfile membutuhkan 10 parameter sesuai dengan definisi di user.tsx
            const updatedUser = await UpdateUserProfile(
                username,       // username
                firstName,      // first_name
                middleName,     // middle_name
                lastName,       // last_name
                email,          // email
                major,          // major
                batch,          // year
                gender,         // gender
                dateOfBirth,    // date_of_birth
                session.data.user.access_token // accessToken
            );
            
            // Konversi null menjadi undefined jika diperlukan untuk menghindari error tipe data
            const safeUpdatedUser = updatedUser || undefined;
            setUserData(safeUpdatedUser);

            await Swal.fire({
                icon: "success",
                title: "Profile Updated",
                showConfirmButton: false,
                timer: 1500,
            });
        } catch (error) {
            console.error("Error updating profile:", error);
            await Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to update profile",
                showConfirmButton: false,
                timer: 1500,
            });
        }
    };

    const handleGenderChange = (selectedOption: any) => {
        setGender(selectedOption ? selectedOption.value : "");
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
                <h1 className="mb-6 md:mb-8 text-center text-2xl font-bold text-gray-800 md:text-3xl" tabIndex={0} aria-label="My Profile Page">My Profile</h1>
                
                {/* Profile Photo Card - Moved to top and made wider */}
                <div className="mb-8 md:mb-10 w-full transform transition-all duration-300 hover:translate-y-[-4px]">
                    <div className="overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-xl">
                        <div className="relative border-b border-gray-100 bg-gradient-to-r from-[#02ABF3]/20 via-blue-50 to-white p-6">
                            <div className="absolute -left-1 top-0 h-full w-1 bg-[#02ABF3]"></div>
                            <h2 className="flex items-center text-xl font-semibold text-gray-800">
                                <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-6 w-6 text-[#02ABF3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Profile Photo
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">Upload and manage your profile picture</p>
                        </div>
                        <div className="p-4 sm:p-6 md:p-8">
                            <div className="flex flex-col md:flex-row items-center justify-center gap-6 lg:gap-12">
                                <div className="group relative">
                                    <div className="relative h-44 w-44 sm:h-52 sm:w-52 md:h-56 md:w-56 lg:h-60 lg:w-60 overflow-hidden rounded-full border-4 border-[#02ABF3]/20 bg-gray-100 shadow-md transition-all duration-300 group-hover:border-[#02ABF3]/40 group-hover:shadow-lg">

                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10"></div>
                                        <Image
                                            src={
                                                userData?.profile_picture ||
                                                "https://sg.pufacomputing.live/Assets/male.jpeg"
                                            }
                                            alt={`${userData?.first_name || 'User'}'s profile picture`}
                                            className="h-full w-full object-cover"
                                            width={160}
                                            height={160}
                                        />
                                    </div>
                                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 transform">
                                        <label
                                            htmlFor="dropzone-file"
                                            className="flex cursor-pointer items-center justify-center rounded-full bg-white p-3 shadow-lg transition-all duration-200 hover:bg-gray-50 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#02ABF3] focus:ring-offset-2 animate-pulse-slow"
                                            aria-label="Upload profile picture"
                                            role="button"
                                            tabIndex={0}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    e.preventDefault();
                                                    document.getElementById('dropzone-file')?.click();
                                                }
                                            }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#02ABF3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <input
                                                id="dropzone-file"
                                                type="file"
                                                className="hidden"
                                                onChange={handleProfilePictureChange}
                                                accept="image/svg+xml,image/png,image/jpeg"
                                            />
                                        </label>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <p className="mb-1 text-base font-medium text-gray-700">
                                        {profilePicture ? profilePicture.name : "Upload a new photo"}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        JPG, PNG or GIF (max. 2MB)
                                    </p>
                                </div>

                                <div className="mt-2 w-full max-w-xs">
                                    {profilePicture ? (
                                        <button
                                            type="button"
                                            onClick={handleProfilePictureUpload}
                                            className="flex w-full md:w-auto items-center justify-center rounded-lg bg-gradient-to-r from-[#02ABF3] to-blue-600 px-5 py-3 text-sm font-medium text-white shadow-md transition-all duration-200 hover:from-[#0299d9] hover:to-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#02ABF3] focus:ring-offset-2 min-h-[44px] min-w-[120px]"
                                            aria-label="Upload profile picture"
                                            tabIndex={0}
                                        >
                                            {uploadingProfilePicture ? (
                                                <>
                                                    <svg
                                                        className="-ml-1 mr-2 h-5 w-5 animate-spin text-white"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        ></circle>
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                        ></path>
                                                    </svg>
                                                    Uploading...
                                                </>
                                            ) : (
                                                <>
                                                    <svg
                                                        className="-ml-1 mr-2 h-5 w-5"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                        ></path>
                                                    </svg>
                                                    Upload Photo
                                                </>
                                            )}
                                        </button>
                                    ) : (
                                        <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center transition-all duration-200 hover:border-[#02ABF3]/30 hover:bg-[#02ABF3]/5">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <p className="mt-2 text-sm font-medium text-gray-700">Click the camera icon above to select a file</p>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex flex-col space-y-4 sm:space-y-6 w-full md:w-1/2 mt-6 md:mt-0">
                                    <div className="text-center md:text-left transition-all duration-300 hover:translate-x-1">
                                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2" tabIndex={0}>{firstName} {lastName}</h3>
                                        <div className="flex flex-col space-y-3">
                                            <div className="flex items-center text-gray-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-[#02ABF3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                                </svg>
                                                <span className="text-sm font-medium">{username}</span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-[#02ABF3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                <span className="text-sm font-medium">{email}</span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-[#02ABF3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                                                </svg>
                                                <span className="text-sm font-medium">{major} - {batch}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {profilePicture ? (
                                        <button
                                            type="button"
                                            onClick={handleProfilePictureUpload}
                                            className="flex w-full md:w-auto items-center justify-center rounded-lg bg-gradient-to-r from-[#02ABF3] to-blue-600 px-5 py-3 text-sm font-medium text-white shadow-md transition-all duration-300 hover:from-[#0299d9] hover:to-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#02ABF3]/50 focus:ring-offset-2 min-h-[44px] min-w-[120px]"
                                            aria-label="Upload profile picture"
                                            tabIndex={0}
                                        >
                                            {uploadingProfilePicture ? (
                                                <>
                                                    <svg
                                                        className="-ml-1 mr-2 h-5 w-5 animate-spin text-white"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        ></circle>
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                        ></path>
                                                    </svg>
                                                    Uploading...
                                                </>
                                            ) : (
                                                <>
                                                    <svg
                                                        className="-ml-1 mr-2 h-5 w-5"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                        ></path>
                                                    </svg>
                                                    Upload Photo
                                                </>
                                            )}
                                        </button>
                                    ) : null}
                                </div>
                            </div>
                            
                            {!profilePicture ? (
                                <div className="mt-4 sm:mt-6 text-center transition-all duration-300 ease-in-out">
                                    <p className="mb-1 text-base font-medium text-gray-700">
                                        Upload a new photo
                                    </p>
                                    <p className="text-sm text-gray-500 mb-4">
                                        JPG, PNG or GIF (max. 2MB)
                                    </p>
                                    <div 
                                        className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-4 sm:p-6 transition-all duration-300 hover:border-[#02ABF3]/30 hover:bg-[#02ABF3]/5 max-w-md mx-auto cursor-pointer"
                                        onClick={() => document.getElementById('dropzone-file')?.click()}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                document.getElementById('dropzone-file')?.click();
                                            }
                                        }}
                                        tabIndex={0}
                                        role="button"
                                        aria-label="Click to select a profile picture file"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <p className="mt-2 text-sm font-medium text-gray-700">Click the camera icon above to select a file</p>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 gap-6 sm:gap-8 md:gap-10 transition-all duration-300">
                    {/* Personal Information Card */}
                    <div>
                        <div className="overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-xl">
                            <div className="relative border-b border-gray-100 bg-gradient-to-r from-[#02ABF3]/20 via-blue-50 to-white p-6">
                                <div className="absolute -left-1 top-0 h-full w-1 bg-[#02ABF3]"></div>
                                <h2 className="flex items-center text-xl font-semibold text-gray-800">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-6 w-6 text-[#02ABF3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                    </svg>
                                    Personal Information
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">Update your personal details and account information</p>
                            </div>
                        </div>
                        <div className="space-y-4 sm:space-y-6 px-4 py-4 sm:px-6 sm:py-6 md:px-7 md:py-7">
                            {/* Form Grid Layout */}
                            <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2">
                                <div className="group relative">
                                    <Input
                                        htmlFor="username"
                                        label="Username"
                                        type="text"
                                        value={username}
                                        placeholder={userData?.username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        disabled
                                        className="w-full rounded-lg border-gray-200 bg-gray-50 px-4 py-3 text-gray-700 shadow-sm focus:border-[#02ABF3] focus:ring-[#02ABF3]/30 disabled:bg-gray-50/80 disabled:text-gray-500 min-h-[44px]"
                                    />
                                    <div className="pointer-events-none absolute right-3 top-9 text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="group relative">
                                    <Input
                                        htmlFor="email-address"
                                        label="Email Address"
                                        type="email"
                                        value={email}
                                        placeholder={userData?.email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled
                                        className="w-full rounded-lg border-gray-200 bg-gray-50 px-4 py-3 text-gray-700 shadow-sm focus:border-[#02ABF3] focus:ring-[#02ABF3]/30 disabled:bg-gray-50/80 disabled:text-gray-500 min-h-[44px]"
                                    />
                                    <div className="pointer-events-none absolute right-3 top-9 text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-2">
                                <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-gray-500">Name Information</h3>
                                <div className="grid grid-cols-1 gap-4 sm:gap-6 rounded-lg bg-gray-50/50 p-3 sm:p-4 sm:grid-cols-3">
                                    <div className="group relative">
                                        <Input
                                            htmlFor="first-name"
                                            label="First Name"
                                            type="text"
                                            value={firstName}
                                            placeholder={userData?.first_name}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            className="w-full rounded-lg border-gray-200 bg-white px-4 py-3 text-gray-700 shadow-sm transition-all focus:border-[#02ABF3] focus:ring-[#02ABF3]/30 group-hover:border-gray-300 min-h-[44px]"
                                        />
                                    </div>
                                    <div className="group relative">
                                        <Input
                                            htmlFor="middle-name"
                                            label="Middle Name (optional)"
                                            type="text"
                                            value={middleName}
                                            placeholder={userData?.middle_name}
                                            onChange={(e) => setMiddleName(e.target.value)}
                                            className="w-full rounded-lg border-gray-200 bg-white px-4 py-3 text-gray-700 shadow-sm transition-all focus:border-[#02ABF3] focus:ring-[#02ABF3]/30 group-hover:border-gray-300 min-h-[44px]"
                                        />
                                    </div>
                                    <div className="group relative">
                                        <Input
                                            htmlFor="last-name"
                                            label="Last Name"
                                            type="text"
                                            value={lastName}
                                            placeholder={userData?.last_name}
                                            onChange={(e) => setLastName(e.target.value)}
                                            className="w-full rounded-lg border-gray-200 bg-white px-4 py-3 text-gray-700 shadow-sm transition-all focus:border-[#02ABF3] focus:ring-[#02ABF3]/30 group-hover:border-gray-300 min-h-[44px]"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-gray-500">Personal Details</h3>
                                <div className="grid grid-cols-1 gap-4 sm:gap-6 rounded-lg bg-gray-50/50 p-3 sm:p-4 sm:grid-cols-2">
                                    <div className="group relative">
                                        <label
                                            htmlFor="date-of-birth"
                                            className="mb-2 block text-sm font-medium text-gray-700"
                                        >
                                            <span className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4 text-[#02ABF3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                Date of Birth
                                            </span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="date-of-birth"
                                                aria-labelledby="date-of-birth-label"
                                                type="date"
                                                value={formatDate(dateOfBirth)}
                                                placeholder={
                                                    userData?.date_of_birth
                                                        ? formatDate(userData.date_of_birth)
                                                        : ""
                                                }
                                                onChange={(e) =>
                                                    setDateOfBirth(
                                                        parseDate(e.target.value)
                                                    )
                                                }
                                                className="w-full appearance-none rounded-lg border-gray-200 bg-white px-4 py-3 text-gray-700 shadow-sm transition-all focus:border-[#02ABF3] focus:outline-none focus:ring-1 focus:ring-[#02ABF3]/30 group-hover:border-gray-300 sm:text-sm min-h-[44px]"
                                            />
                                        </div>
                                    </div>
                                    <div className="group relative">
                                        <label
                                            htmlFor="gender"
                                            className="mb-2 block text-sm font-medium text-gray-700"
                                        >
                                            <span className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4 text-[#02ABF3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                Gender
                                            </span>
                                        </label>
                                        <Select
                                            id="gender"
                                        aria-labelledby="gender-label"
                                            value={genderOptions.find(
                                                (option) => option.value === gender
                                            )}
                                            onChange={handleGenderChange}
                                            options={genderOptions}
                                            placeholder="Select gender"
                                            className="w-full rounded-lg"
                                            classNamePrefix="select"
                                            styles={{
                                                control: (base) => ({
                                                    ...base,
                                                    minHeight: '44px', // Ensuring touch-friendly size
                                                    ...base,
                                                    minHeight: '46px',
                                                    borderColor: '#e5e7eb',
                                                    backgroundColor: 'white',
                                                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                                                    '&:hover': {
                                                        borderColor: '#d1d5db',
                                                    },
                                                    '&:focus-within': {
                                                        borderColor: '#02ABF3',
                                                        boxShadow: '0 0 0 1px rgba(2, 171, 243, 0.3)',
                                                    }
                                                }),
                                                placeholder: (base) => ({
                                                    ...base,
                                                    color: '#9CA3AF',
                                                }),
                                                option: (base, state) => ({
                                                    ...base,
                                                    backgroundColor: state.isSelected ? '#02ABF3' : state.isFocused ? 'rgba(2, 171, 243, 0.1)' : undefined,
                                                    color: state.isSelected ? 'white' : '#374151',
                                                    '&:hover': {
                                                        backgroundColor: state.isSelected ? '#02ABF3' : 'rgba(2, 171, 243, 0.1)',
                                                    }
                                                }),
                                                singleValue: (base) => ({
                                                    ...base,
                                                    color: '#374151',
                                                }),
                                                dropdownIndicator: (base) => ({
                                                    ...base,
                                                    color: '#9CA3AF',
                                                    '&:hover': {
                                                        color: '#6B7280',
                                                    }
                                                }),
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-6 sm:mt-8 flex justify-end">
                                <Button
                                    onClick={handleSave}
                                    className="flex items-center rounded-lg bg-gradient-to-r from-[#02ABF3] to-blue-600 px-6 py-3 text-sm font-medium text-white shadow-md transition-all duration-300 hover:from-[#0299d9] hover:to-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#02ABF3]/50 focus:ring-offset-2 min-h-[44px] min-w-[120px]"
                                    aria-label="Save profile changes"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Save Changes
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
