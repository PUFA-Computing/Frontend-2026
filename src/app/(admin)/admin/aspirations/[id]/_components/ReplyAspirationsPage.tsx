import React, { Fragment, useState } from "react";
import { CheckCircleIcon, TrashIcon } from "@heroicons/react/24/solid";
import {
    FaceFrownIcon,
    FaceSmileIcon,
    FireIcon,
    HandThumbUpIcon,
    HeartIcon,
    PaperClipIcon,
    XMarkIcon,
} from "@heroicons/react/20/solid";
import {
    Label,
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
    Transition,
} from "@headlessui/react";
import Aspirations from "@/models/aspiration";
import { AdminReplyAspiration, DeleteAspiration } from "@/services/api/aspiration";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const moods = [
    {
        name: "Excited",
        value: "excited",
        icon: FireIcon,
        iconColor: "text-white",
        bgColor: "bg-red-500",
    },
    {
        name: "Loved",
        value: "loved",
        icon: HeartIcon,
        iconColor: "text-white",
        bgColor: "bg-pink-400",
    },
    {
        name: "Happy",
        value: "happy",
        icon: FaceSmileIcon,
        iconColor: "text-white",
        bgColor: "bg-green-400",
    },
    {
        name: "Sad",
        value: "sad",
        icon: FaceFrownIcon,
        iconColor: "text-white",
        bgColor: "bg-yellow-400",
    },
    {
        name: "Thumbsy",
        value: "thumbsy",
        icon: HandThumbUpIcon,
        iconColor: "text-white",
        bgColor: "bg-blue-500",
    },
    {
        name: "I feel nothing",
        value: null,
        icon: XMarkIcon,
        iconColor: "text-gray-400",
        bgColor: "bg-transparent",
    },
];

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

export default function ReplyAspirationsPage({
    aspiration,
}: {
    aspiration: Aspirations;
}) {
    const router = useRouter();
    const [selected, setSelected] = useState(moods[5]);

    const date = new Date(aspiration.created_at);
    const updateDate = new Date(aspiration.updated_at);

    const [commentText, setCommentText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const { data: session } = useSession();

    const handleDeleteAspiration = async () => {
        if (!session) {
            toast.error("You must be logged in to delete an aspiration");
            return;
        }
        
        // Show confirmation dialog
        if (!window.confirm("Are you sure you want to delete this aspiration? This action cannot be undone.")) {
            return;
        }
        
        setIsDeleting(true);
        
        try {
            const accessToken = (session as any).user?.access_token || '';
            const result = await DeleteAspiration(aspiration.id, accessToken);
            
            if (result.success) {
                toast.success(result.message);
                // Redirect back to aspirations list
                router.push("/admin/aspirations");
            } else {
                // Show error message from the API
                toast.error(result.message);
            }
        } catch (error: any) {
            console.error("Error deleting aspiration:", error);
            toast.error("Failed to delete aspiration. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!session) {
            setError("You must be logged in to reply to aspirations");
            return;
        }
        
        if (!commentText.trim()) {
            setError("Reply cannot be empty");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            // Pastikan ID aspirasi adalah angka yang valid
            // Model Aspirations mendefinisikan id sebagai number
            const numericId = aspiration.id;
            
            console.log('Submitting reply for aspiration ID:', numericId);
            console.log('Reply text:', commentText);
            
            // Panggil API untuk membalas aspirasi dengan ID numerik
            const accessToken = (session as any).user?.access_token || '';
            await AdminReplyAspiration(
                numericId,
                commentText,
                accessToken
            );

            console.log('Reply submitted successfully');
            setCommentText("");
            setSuccess(true);
            
            // Reload the page after a short delay to show success message
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (error: any) {
            console.error("Error replying to aspiration:", error);
            
            // Tampilkan pesan error yang lebih detail
            let errorMessage = "Failed to submit reply. Please try again.";
            
            if (error.response?.data) {
                if (typeof error.response.data === 'string') {
                    errorMessage = error.response.data;
                } else if (error.response.data.message) {
                    errorMessage = error.response.data.message;
                } else if (error.response.data.error) {
                    errorMessage = error.response.data.error;
                }
            } else if (error.message) {
                errorMessage = error.message;
            }
                
            console.error("Error details:", errorMessage);
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {/*Title and Actions*/}
            <div className="mb-9 flex items-center justify-between pl-11">
                <h1 className="text-2xl font-semibold text-gray-900">
                    {aspiration.subject}
                </h1>
                <div className="flex items-center space-x-3">
                    <span
                        className={classNames(
                            aspiration.closed
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800",
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                        )}
                    >
                        {aspiration.closed ? (
                            <>
                                <CheckCircleIcon
                                    className="mr-1.5 h-4 w-4"
                                    aria-hidden="true"
                                />
                                Closed
                            </>
                        ) : (
                            "Open"
                        )}
                    </span>
                    <button
                        onClick={handleDeleteAspiration}
                        disabled={isDeleting}
                        className="inline-flex items-center rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 shadow-sm hover:bg-red-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <TrashIcon className="h-4 w-4 mr-1.5" aria-hidden="true" />
                        {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
            <div className="relative flex gap-x-4">
                {aspiration.author && aspiration.author.profile_picture ? (
                    <img
                        src={aspiration.author.profile_picture}
                        alt=""
                        className="relative mt-3 h-6 w-6 flex-none rounded-full bg-gray-50"
                    />
                ) : (
                    <div className="relative mt-3 h-6 w-6 flex-none rounded-full bg-gray-200" />
                )}
                <div className="flex-auto rounded-md p-3 ring-1 ring-inset ring-gray-200">
                    <div className="flex justify-between gap-x-4">
                        <div className="py-0.5 text-xs leading-5 text-gray-500">
                            <span className="font-medium text-gray-900">
                                {aspiration.author && aspiration.author.name ? aspiration.author.name : "Anonymous"}
                            </span>{" "}
                            aspirations
                        </div>
                        <time
                            dateTime={date.toDateString()}
                            className="flex-none py-0.5 text-xs leading-5 text-gray-500"
                        >
                            {date.toDateString()}
                        </time>
                    </div>
                    <p className="text-sm leading-6 text-gray-500">
                        {aspiration.message}
                    </p>
                </div>
            </div>

            {/*Admin Reply*/}
            {aspiration.admin_reply && (
                <div className="mt-6 flex gap-x-4">
                    <div className="flex-auto rounded-md p-3 ring-1 ring-inset ring-gray-200">
                        <div className="flex justify-between gap-x-4">
                            <div className="py-0.5 text-right text-xs leading-5 text-gray-500">
                                <span className="font-medium text-gray-900">
                                    Admin
                                </span>{" "}
                                reply
                            </div>
                            <time
                                dateTime={updateDate.toDateString()}
                                className="flex-none py-0.5 text-xs leading-5 text-gray-500"
                            >
                                {updateDate.toDateString()}
                            </time>
                        </div>
                        <p className="text-sm leading-6 text-gray-500">
                            {aspiration.admin_reply}
                        </p>
                    </div>
                    <img
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                        className="relative mt-3 h-6 w-6 flex-none rounded-full bg-gray-50"
                    />
                </div>
            )}

            {/* New comment form */}
            {/*If there is admin reply comment section is closed and give statement aspirations closed*/}
            {!aspiration.admin_reply && (
                <div className="mt-6 flex gap-x-3">
                    <img
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                        className="h-6 w-6 flex-none rounded-full bg-gray-50"
                    />
                    <form
                        onSubmit={handleCommentSubmit}
                        className="relative flex-auto"
                    >
                        <div className="overflow-hidden rounded-lg pb-12 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                            <label htmlFor="comment" className="sr-only">
                                Add your comment
                            </label>
                            <textarea
                                rows={2}
                                name="comment"
                                id="comment"
                                className="block w-full resize-none border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                placeholder="Add your comment..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                            />
                        </div>

                        <div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
                            <div className="flex items-center space-x-5">
                                {error && (
                                    <span className="text-xs text-red-500">{error}</span>
                                )}
                                {success && (
                                    <span className="text-xs text-green-500">Reply submitted successfully!</span>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`rounded-md px-2.5 py-1.5 text-sm font-semibold shadow-sm ${isSubmitting 
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                                    : 'bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'}`}
                            >
                                {isSubmitting ? "Submitting..." : "Comment"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {aspiration.admin_reply && (
                <div className="mt-6 text-center text-gray-500">
                    Aspirations closed
                </div>
            )}
        </>
    );
}
