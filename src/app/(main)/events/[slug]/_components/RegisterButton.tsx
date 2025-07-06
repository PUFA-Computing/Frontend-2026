"use client";
import { API_EVENT } from "@/config/config";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import Swal from "sweetalert2";
import { totalRegisteredUsers } from "@/services/api/event";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { fetchUserEvents } from "@/services/api/user";
import { LogIn, CheckCircle, AlertCircle, Loader2, Upload, FileText } from "lucide-react";

interface RegisterButtonProps {
    eventId: number;
    eventTitle: string;
    eventSlug: string;
    eventStatus: string;
}

export default function RegisterButton({
    eventId,
    eventTitle,
    eventSlug,
    eventStatus,
}: RegisterButtonProps) {
    const [registerDisabled, setRegisterDisabled] = useState(false);
    const [buttonRegisterText, setButtonRegisterText] = useState("Loading...");
    const [additionalNotes, setAdditionalNotes] = useState("");
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [fileError, setFileError] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        const userEvents = async () => {
            if (status === "loading") {
                setButtonRegisterText("Loading...");
                return;
            }

            if (!session) {
                setButtonRegisterText("Login to Register");
                setRegisterDisabled(true);
                return;
            }

            try {
                const userEvents = await fetchUserEvents(
                    session.user.access_token
                );

                if (
                    userEvents.some(
                        (event: { slug: string }) => event.slug === eventSlug
                    )
                ) {
                    setRegisterDisabled(true);
                    setButtonRegisterText("Registered");
                    return;
                }

                const totalParticipants = await totalRegisteredUsers(eventId);

                if (eventStatus !== "Open") {
                    setButtonRegisterText("Registration Closed");
                    setRegisterDisabled(true);
                } else {
                    setButtonRegisterText("Register");
                    setRegisterDisabled(false);
                }
            } catch (error) {
                console.log("Error fetching user events:", error);
                // Set default state instead of showing error to user
                if (eventStatus !== "Open") {
                    setButtonRegisterText("Registration Closed");
                    setRegisterDisabled(true);
                } else {
                    setButtonRegisterText("Register");
                    setRegisterDisabled(false);
                }
            }
        };

        userEvents();
    }, [status, session]);

    // Handle file selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFileError("");
        const files = e.target.files;
        
        if (!files || files.length === 0) {
            return;
        }
        
        // Convert FileList to array for easier processing
        const newFiles = Array.from(files);
        
        // Calculate total size including existing files
        const totalSize = [...selectedFiles, ...newFiles].reduce((sum, file) => sum + file.size, 0);
        if (totalSize > 20 * 1024 * 1024) {
            setFileError("Total file size must be less than 20MB");
            return;
        }
        
        // Validate each file
        let hasError = false;
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'application/zip', 'application/x-zip-compressed'];
        
        // Validate each new file type and individual size
        for (const file of newFiles) {
            if (!allowedTypes.includes(file.type)) {
                setFileError("All files must be PDF, ZIP, or image files (JPEG, PNG)");
                hasError = true;
                break;
            }
            
            // Individual file size limit (10MB)
            if (file.size > 10 * 1024 * 1024) {
                setFileError("Each file must be less than 10MB");
                hasError = true;
                break;
            }
        }
        
        if (hasError) {
            return;
        }
        
        // Add new files to existing files
        setSelectedFiles(prev => [...prev, ...newFiles]);
        
        // Reset file input so the same file can be selected again if needed
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Remove a file from the selected files
    const handleRemoveFile = (indexToRemove: number) => {
        setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleRegister = async () => {
        if (eventStatus !== "Open") {
            await Swal.fire({
                icon: "error",
                title: "Registration failed",
                text: "Event registration is closed.",
            });
            setButtonRegisterText("Registration Closed");
            setRegisterDisabled(true);
            return;
        }

        if (buttonRegisterText.toLowerCase().includes("login")) {
            router.push("/auth/signin");
            return;
        }

        if (!additionalNotes) {
            await Swal.fire({
                icon: "warning",
                title: "Additional Notes Required",
                text: "Please provide additional notes to register for the event.",
            });
            return;
        }

        try {
            Swal.fire({
                title: "Register for Event",
                text: "Are you sure you want to register for " + eventTitle + "?",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Yes",
                cancelButtonText: "No",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        setIsSubmitting(true);
                        const accessToken = session?.user.access_token;
                        
                        // Create FormData instead of JSON
                        const formData = new FormData();
                        formData.append("additional_notes", additionalNotes);
                        
                        // Add multiple files if selected
                        selectedFiles.forEach((file, index) => {
                            formData.append(`files`, file);
                        });
                        
                        const response = await axios.post(
                            `${API_EVENT}/${eventId}/register`,
                            formData,
                            {
                                headers: {
                                    // Don't set Content-Type, axios will set it with boundary for FormData
                                    Authorization: `Bearer ${accessToken}`,
                                },
                            }
                        );

                        if (response.status === 200) {
                            Swal.fire({
                                icon: "success",
                                title: "Registered successfully!",
                                text: "Redirecting to dashboard...",
                                showConfirmButton: false,
                                timer: 2000,
                            }).then(() => {
                                router.push("/dashboard/events");
                            });
                        } else {
                            await Swal.fire({
                                icon: "error",
                                title: "Registration failed",
                                text: "There was an error while registering for the event.",
                            });
                        }
                    } catch (error: any) {
                        console.error("Error registering for event:", error);
                        if (
                            error.response?.status === 500 &&
                            error.response.data?.message?.includes(
                                "Request failed with status code 500"
                            )
                        ) {
                            Swal.fire({
                                icon: "error",
                                title: "Registration failed",
                                text: "Maximum registration limit reached for this event.",
                            });
                        } else {
                            await Swal.fire({
                                icon: "error",
                                title: "Registration failed",
                                text: "There was an error while registering for the event " + eventTitle + ".",
                            });
                        }
                    } finally {
                        setIsSubmitting(false);
                    }
                }
            });
        } catch (error: any) {
            console.log(error);
            setIsSubmitting(false);
        }
    };

    // Determine button appearance based on state
    const getButtonAppearance = () => {
        if (isSubmitting) {
            return {
                icon: <Loader2 className="mr-2 h-4 w-4 animate-spin" />,
                bgColor: "bg-indigo-500",
                hoverBgColor: "hover:bg-indigo-500",
                text: "Registering..."
            };
        } else if (buttonRegisterText === "Loading...") {
            return {
                icon: <Loader2 className="mr-2 h-4 w-4 animate-spin" />,
                bgColor: "bg-indigo-500",
                hoverBgColor: "hover:bg-indigo-600",
                text: "Loading..."
            };
        } else if (buttonRegisterText === "Registered") {
            return {
                icon: <CheckCircle className="mr-2 h-4 w-4" />,
                bgColor: "bg-green-500",
                hoverBgColor: "hover:bg-green-600",
                text: "Registered"
            };
        } else if (buttonRegisterText === "Registration Closed") {
            return {
                icon: <AlertCircle className="mr-2 h-4 w-4" />,
                bgColor: "bg-gray-500",
                hoverBgColor: "hover:bg-gray-600",
                text: "Registration Closed"
            };
        } else if (buttonRegisterText.toLowerCase().includes("login")) {
            return {
                icon: <LogIn className="mr-2 h-4 w-4" />,
                bgColor: "bg-blue-500",
                hoverBgColor: "hover:bg-blue-600",
                text: "Login to Register"
            };
        } else {
            return {
                icon: null,
                bgColor: "bg-indigo-600",
                hoverBgColor: "hover:bg-indigo-700",
                text: "Register Now"
            };
        }
    };

    const buttonAppearance = getButtonAppearance();

    return (
        <div className="w-full space-y-6">
            {!registerDisabled && (
                <>
                    <div className="space-y-2">
                        <label htmlFor="additional-notes" className="block text-sm font-medium text-gray-700">
                            Additional Notes
                        </label>
                        <textarea
                            id="additional-notes"
                            placeholder="Please provide any additional information that might be relevant for your registration"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            rows={4}
                            onChange={(e) => setAdditionalNotes(e.target.value)}
                            value={additionalNotes}
                            disabled={isSubmitting}
                        />
                        <p className="text-xs text-gray-500">
                            This information will be visible to the event organizers.
                        </p>
                    </div>
                    
                    <div className="space-y-2">
                        <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">
                            Upload Documents (Optional)
                        </label>
                        
                        {/* Display selected files */}
                        {selectedFiles.length > 0 && (
                            <div className="mb-3">
                                <p className="text-sm font-medium text-gray-700 mb-2">
                                    {selectedFiles.length} {selectedFiles.length === 1 ? 'file' : 'files'} selected:
                                </p>
                                <ul className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-2">
                                    {selectedFiles.map((file, index) => (
                                        <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                            <div className="flex items-center">
                                                {file.type.includes('image') ? (
                                                    <img 
                                                        src={URL.createObjectURL(file)} 
                                                        alt={file.name} 
                                                        className="w-8 h-8 object-cover rounded mr-2"
                                                        onLoad={() => URL.revokeObjectURL(URL.createObjectURL(file))}
                                                    />
                                                ) : file.type.includes('pdf') ? (
                                                    <FileText className="w-6 h-6 mr-2 text-red-500" />
                                                ) : file.type.includes('zip') ? (
                                                    <FileText className="w-6 h-6 mr-2 text-yellow-500" />
                                                ) : (
                                                    <FileText className="w-6 h-6 mr-2 text-indigo-500" />
                                                )}
                                                <div>
                                                    <p className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                                                        {file.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {(file.size / 1024).toFixed(1)} KB
                                                    </p>
                                                </div>
                                            </div>
                                            <button 
                                                type="button"
                                                onClick={() => handleRemoveFile(index)}
                                                className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                                                disabled={isSubmitting}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        
                        {/* Upload area */}
                        <div className="flex items-center justify-center w-full">
                            <label 
                                htmlFor="file-upload" 
                                className={`flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg ${isSubmitting ? 'cursor-not-allowed bg-gray-100' : 'cursor-pointer bg-gray-50 hover:bg-gray-100'}`}
                            >
                                <div className="flex flex-col items-center justify-center pt-4 pb-4">
                                    <Upload className={`w-6 h-6 mb-1 ${isSubmitting ? 'text-gray-400' : 'text-gray-500'}`} />
                                    <p className={`text-sm ${isSubmitting ? 'text-gray-400' : 'text-gray-500'}`}>
                                        <span className="font-semibold">Click to add more files</span> or drag and drop
                                    </p>
                                    <p className={`text-xs ${isSubmitting ? 'text-gray-400' : 'text-gray-500'}`}>
                                        PDF, ZIP or Image (max 10MB per file, 20MB total)
                                    </p>
                                </div>
                                <input 
                                    id="file-upload" 
                                    type="file" 
                                    className="hidden" 
                                    accept=".pdf,.jpg,.jpeg,.png,.zip"
                                    onChange={handleFileChange}
                                    ref={fileInputRef}
                                    disabled={isSubmitting}
                                    multiple
                                />
                            </label>
                        </div>
                        {fileError && (
                            <p className="text-xs text-red-500">{fileError}</p>
                        )}
                        <p className="text-xs text-gray-500">
                            Upload any supporting documents required for this event (e.g., ID, certification, etc.)
                        </p>
                    </div>
                </>
            )}
            
            <button
                className={`flex w-full items-center justify-center rounded-lg ${buttonAppearance.bgColor} px-6 py-3 font-medium text-white shadow-md transition-all ${buttonAppearance.hoverBgColor} focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70`}
                onClick={handleRegister}
                disabled={registerDisabled || isSubmitting}
            >
                {buttonAppearance.icon}
                {buttonAppearance.text}
            </button>
            
            {registerDisabled && buttonRegisterText === "Registered" && (
                <div className="mt-4 rounded-lg bg-green-50 p-4 text-sm text-green-800">
                    <div className="flex">
                        <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-500" />
                        <div>
                            <p className="font-medium">Registration successful!</p>
                            <p className="mt-1">You are registered for this event. Check your dashboard for more details.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}