"use client";

import { CreateAspiration } from "@/services/api/aspiration";
import Swal from "sweetalert2";
import Select from "react-select";
import Aspirations from "@/models/aspiration";
import { GetUserProfile } from "@/services/api/user";
import z from "zod";
import React, { useEffect, useRef, useState } from "react";
import { Spinner } from "@nextui-org/spinner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { wordBlacklist } from "@/lib/wordBlaclist";

// zod
const AspirationSchema = z.object({
    subject: z
        .string({ required_error: "Subject is required" })
        .min(3, { message: "Subject must be at least 3 characters long" }),
    organization_id: z
        .number({ required_error: "Organization is required" })
        .min(1, { message: "Choose an organization" }),
    anonymous: z.boolean().optional(),
    closed: z.boolean(),
    message: z
        .string({ required_error: "Message is required" })
        .min(10, { message: "Message must be at least 10 characters long" }),
});


export default function AspirationForm() {
    const formHtml = useRef<HTMLFormElement>(null);
    const [selectedOrganization, setSelectedOrganization] = useState<{
        value: string;
    } | null>(null);
    const [subject, setSubject] = useState<string>("");
    const [anonymous, setAnonymous] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
    const [userName, setUserName] = useState<string>("");
    const [userRole, setUserRole] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();
    const session = useSession();

    useEffect(() => {
        if (!session.data) {
            setIsLoggedIn(false);
        } else {
            setIsLoggedIn(true);
        }

        if (session.data) {
            fetchUserProfile(
                session.data.user.id as string,
                session.data.user.access_token as string
            ).then((r) => r);
        }
    }, [session.data]);

    async function fetchUserProfile(userID: string, accessToken: string) {
        try {
            const response = await GetUserProfile(userID, accessToken);
            setUserName(`${response.first_name} ${response.last_name}`);
            setUserRole(response.role_id);
        } catch (error) {
            console.error("Error fetching user profile", error);
        }
    }

    function containsBlacklistedWords(text: string): string[] {
        return wordBlacklist.filter((word) =>
            text.toLowerCase().includes(word.toLowerCase())
        );
    }

    function handleChangeSubject(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        setSubject(value);
    
        const blacklistedWords = containsBlacklistedWords(value);
        if (blacklistedWords.length > 0) {
            const sanitizedValue = removeBlacklistedWords(value, blacklistedWords);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: `Subject contains blacklisted words: ${blacklistedWords.join(", ")}.`,
                showCancelButton: true,
                confirmButtonText: "OK",
                cancelButtonText: "Clear",
            }).then((result) => {
                if (result.isDismissed) {
                    setSubject(sanitizedValue);
                }
            });
        }
    }
    
    function handleChangeMessage(event: React.ChangeEvent<HTMLTextAreaElement>) {
        const value = event.target.value;
        setMessage(value);
    
        const blacklistedWords = containsBlacklistedWords(value);
        if (blacklistedWords.length > 0) {
            const sanitizedValue = removeBlacklistedWords(value, blacklistedWords);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: `Message contains blacklisted words: ${blacklistedWords.join(", ")}.`,
                showCancelButton: true,
                confirmButtonText: "OK",
                cancelButtonText: "Clear",
            }).then((result) => {
                if (result.isDismissed) {
                    setMessage(sanitizedValue);
                }
            });
        }
    }
    
    function removeBlacklistedWords(text: string, blacklistedWords: string[]): string {
        let sanitizedText = text;
        blacklistedWords.forEach((word) => {
            const regex = new RegExp(`\\b${word}\\b`, 'gi'); 
            sanitizedText = sanitizedText.replace(regex, ''); 
        });
        return sanitizedText.trim();
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        if (!selectedOrganization) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Please select an organization.",
            });
            setIsLoading(false);
            return;
        }

        const data = {
            subject,
            organization_id: parseInt(selectedOrganization.value),
            anonymous,
            closed: false,
            message,
        };

        const validationResult = AspirationSchema.safeParse(data);
        if (!validationResult.success) {
            console.error("Validation error:", validationResult.error);
            let errorMessage = "";
            validationResult.error.issues.forEach((issue) => {
                errorMessage += issue.message + ".\n";
            });
            await Swal.fire({
                icon: "error",
                title: "Error",
                text: errorMessage,
            });
            setIsLoading(false);
            return;
        }

        const aspirationData = validationResult.data as Aspirations;
        if (!session.data) {
            setIsLoading(true);
            return;
        }
        try {
            await CreateAspiration(
                aspirationData,
                session.data.user.access_token
            );
            await Swal.fire({
                title: "Aspiration Sent!",
                text: "Your aspiration has been sent to the organization.",
                icon: "success",
                confirmButtonText: "OK",
            });
            formHtml.current?.reset();
            setSelectedOrganization(null);
            setSubject("");
            setAnonymous(false);
            setMessage("");
            router.refresh();
        } catch (error) {
            console.error("Error creating aspiration", error);
            await Swal.fire({
                title: "Error",
                text: "An error occurred while sending your aspiration.",
                icon: "error",
                confirmButtonText: "OK",
            });
        } finally {
            setIsLoading(false);
        }
    }

    const organizations = [
        { value: "1", label: "PUFA Computing" },
        { value: "2", label: "PUMA Informatics" },
        { value: "3", label: "PUMA Information System" },
    ];

    // More forgiving validation logic
    const isFormValid = selectedOrganization && subject.length > 0 && message.length > 0;
    
    // Debug information to help users understand validation status
    const validationStatus = {
        organization: selectedOrganization ? true : false,
        subject: subject.length > 0,
        message: message.length > 0
    };

    if (!isLoggedIn) {
        return (
            <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white md:p-8">
                    <h2 className="mb-2 text-2xl font-bold md:text-3xl">
                        Share Your Aspirations
                    </h2>
                    <p className="text-blue-100">
                        Help us make Computing better with your valuable feedback
                    </p>
                </div>
                
                {/* Content */}
                <div className="flex flex-col items-center justify-center p-8 text-center md:p-12">
                    <div className="mb-8">
                        <h3 className="mb-2 text-xl font-semibold text-gray-800">Hello, Guest!</h3>
                        <p className="text-gray-600">
                            Please sign in to share your aspirations with us.
                        </p>
                    </div>
                    
                    <button
                        className="rounded-lg bg-blue-600 px-8 py-3 font-medium text-white shadow-md transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        onClick={() => {
                            window.location.href = "auth/signin";
                        }}
                    >
                        Sign In
                    </button>
                </div>
            </div>
        );
    }

    if (userRole === 8) {
        return (
            <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white md:p-8">
                    <h2 className="mb-2 text-2xl font-bold md:text-3xl">
                        Share Your Aspirations
                    </h2>
                    <p className="text-blue-100">
                        Help us make Computing better with your valuable feedback
                    </p>
                </div>
                
                {/* Content */}
                <div className="flex flex-col items-center justify-center p-8 text-center md:p-12">
                    <div className="rounded-full bg-amber-100 p-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div className="mt-4">
                        <h3 className="mb-2 text-xl font-semibold text-gray-800">Hello, {userName}</h3>
                        <p className="text-gray-600">
                            You are not a Faculty of Computing Student and are not authorized to use this feature.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white md:p-8">
                <h2 className="mb-2 text-2xl font-bold md:text-3xl">
                    Share Your Aspirations
                </h2>
                <p className="text-blue-100">
                    Help us make Computing better with your valuable feedback
                </p>
            </div>
            
            {/* User Greeting */}
            <div className="border-b border-gray-100 bg-gray-50 p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-lg text-gray-600">Hello, <span className="font-medium text-gray-900">{userName}</span></p>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Let's share your thoughts!
                        </h3>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} ref={formHtml} className="p-6 md:p-8">
                {/* Organization Selection */}
                <div className="mb-6">
                    <label className="mb-2 block text-sm font-medium text-gray-700">To Organization</label>
                    <p className="mb-2 text-sm text-gray-500">
                        Select the organization you want to share your aspiration with
                    </p>
                    <Select
                        value={selectedOrganization}
                        onChange={(selectedOption) =>
                            setSelectedOrganization(selectedOption as any)
                        }
                        options={organizations}
                        className="w-full rounded-lg"
                        classNames={{
                            control: () => "p-2 border-2 border-gray-300 hover:border-blue-400 focus:border-blue-500"
                        }}
                        placeholder="Select an organization..."
                    />
                </div>

                {/* From Section */}
                <div className="mb-6">
                    <div className="mb-2 flex items-center justify-between">
                        <label className="block text-sm font-medium text-gray-700">From</label>
                        <div className="flex items-center gap-2">
                            <label className="relative inline-flex cursor-pointer items-center">
                                <input
                                    type="checkbox"
                                    name="anonymous"
                                    className="peer sr-only"
                                    onChange={(e) => setAnonymous(e.target.checked)}
                                    checked={anonymous}
                                />
                                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300"></div>
                                <span className="ml-3 text-sm font-medium text-gray-700">Share anonymously</span>
                            </label>
                        </div>
                    </div>
                    <input
                        type="text"
                        name="from"
                        className="w-full rounded-lg border-2 border-gray-300 bg-gray-50 p-3 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-75"
                        value={userName}
                        disabled
                    />
                </div>

                {/* Subject Field */}
                <div className="mb-6">
                    <label htmlFor="subject" className="mb-2 block text-sm font-medium text-gray-700">Subject</label>
                    <p className="mb-2 text-sm text-gray-500">
                        Specific topic you want to discuss
                    </p>
                    <input
                        type="text"
                        id="subject"
                        name="subject"
                        className="w-full rounded-lg border-2 border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={subject}
                        onChange={handleChangeSubject}
                        placeholder="Enter the subject of your aspiration"
                    />
                </div>

                {/* Message Field */}
                <div className="mb-8">
                    <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-700">Message</label>
                    <p className="mb-2 text-sm text-gray-500">
                        Share your thoughts, ideas, or suggestions in detail
                    </p>
                    <textarea
                        id="message"
                        name="message"
                        rows={6}
                        className="w-full resize-none rounded-lg border-2 border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={message}
                        onChange={handleChangeMessage}
                        placeholder="Write your message here..."
                    ></textarea>
                </div>

                {/* Submit Button */}
                <div className="flex flex-col items-center">
                    {/* Validation feedback */}
                    {!isFormValid && (
                        <div className="mb-4 w-full max-w-md rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                            <p className="font-medium">Please complete the form:</p>
                            <ul className="mt-1 list-inside list-disc">
                                {!validationStatus.organization && <li>Select an organization</li>}
                                {!validationStatus.subject && <li>Enter a subject</li>}
                                {!validationStatus.message && <li>Write your message</li>}
                            </ul>
                        </div>
                    )}
                    
                    <button
                        type="submit"
                        className="flex items-center justify-center rounded-lg bg-blue-600 px-8 py-3 font-medium text-white shadow-md transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400 md:px-12"
                        disabled={isLoading}
                    >
                        {isLoading ? <Spinner size="sm" className="mr-2" /> : null}
                        {isLoading ? "Submitting..." : "Submit Aspiration"}
                    </button>
                </div>
            </form>
        </div>
    );
}
