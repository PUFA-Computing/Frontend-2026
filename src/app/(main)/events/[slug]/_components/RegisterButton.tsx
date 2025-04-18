"use client";
import { API_EVENT } from "@/config/config";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { totalRegisteredUsers } from "@/services/api/event";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { fetchUserEvents } from "@/services/api/user";
import { LogIn, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

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
                console.log(error);
                await Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Can't fetch user's events, please try again later",
                });
            }
        };

        userEvents();
    }, [status, session]);

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
                text: `Are you sure you want to register for ${eventTitle}?`,
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Yes",
                cancelButtonText: "No",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const accessToken = session?.user.access_token;
                        const response = await axios.post(
                            `${API_EVENT}/${eventId}/register`,
                            {
                                additional_notes: additionalNotes,
                            },
                            {
                                headers: {
                                    "Content-Type": "application/json",
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
                                text: `There was an error while registering for the event ${eventTitle}.`,
                            });
                        }
                    }
                }
            });
        } catch (error: any) {
            console.log(error);
        }
    };

    // Determine button appearance based on state
    const getButtonAppearance = () => {
        if (buttonRegisterText === "Loading...") {
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
                    />
                    <p className="text-xs text-gray-500">
                        This information will be visible to the event organizers.
                    </p>
                </div>
            )}
            
            <button
                className={`flex w-full items-center justify-center rounded-lg ${buttonAppearance.bgColor} px-6 py-3 font-medium text-white shadow-md transition-all ${buttonAppearance.hoverBgColor} focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70`}
                onClick={handleRegister}
                disabled={registerDisabled}
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
