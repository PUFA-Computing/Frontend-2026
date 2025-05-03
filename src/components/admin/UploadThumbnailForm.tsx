import React, { useState } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import Swal from "sweetalert2";
import Image from "next/image";

export default function UploadThumbnailForm({
    onNext,
    onPrevious,
    onThumbnailChange,
    currentThumbnail,
    isEdit = false,
}: {
    onNext: () => void;
    onPrevious: () => void;
    onThumbnailChange: (file: File) => void;
    currentThumbnail?: string;
    isEdit?: boolean;
}) {
    const [thumbnail, setThumbnail] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        
        if (file) {
            // Check file size - 10MB limit
            const maxSize = 10 * 1024 * 1024; // 10MB in bytes
            
            if (file.size > maxSize) {
                Swal.fire({
                    icon: "error",
                    title: "File Too Large",
                    text: "The image file is too large. Maximum size allowed is 10MB.",
                });
                e.target.value = ""; // Reset the input
                return;
            }
            
            setThumbnail(file);
            onThumbnailChange(file as File);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!thumbnail && !isEdit) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Please upload a thumbnail image.",
            }).then((r) => r.isConfirmed && window.scrollTo(0, 0));
            return;
        }
        onNext();
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="col-span-full">
                <label
                    htmlFor="cover-photo"
                    className="block text-sm font-medium leading-6 text-gray-900"
                >
                    Cover photo
                </label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="text-center">
                        {isEdit && currentThumbnail && !thumbnail ? (
                            <div className="relative h-48 w-full mb-4">
                                <Image
                                    src={currentThumbnail}
                                    alt="Current thumbnail"
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-lg"
                                />
                                <p className="mt-2 text-sm text-gray-600">Current thumbnail</p>
                            </div>
                        ) : thumbnail ? (
                            <div className="relative h-48 w-full mb-4">
                                <Image
                                    src={URL.createObjectURL(thumbnail)}
                                    alt="New thumbnail"
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-lg"
                                />
                                <p className="mt-2 text-sm text-gray-600">New thumbnail</p>
                            </div>
                        ) : (
                            <PhotoIcon
                                className="mx-auto h-12 w-12 text-gray-300"
                                aria-hidden="true"
                            />
                        )}
                        <div className="mt-4 flex text-sm leading-6 text-gray-600">
                            <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                            >
                                <span>Upload a file</span>
                                <input
                                    id="file-upload"
                                    name="file-upload"
                                    type="file"
                                    className="sr-only"
                                    onChange={handleFileChange}
                                />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs leading-5 text-gray-600">
                            PNG, JPG, GIF up to 10MB
                        </p>
                    </div>
                </div>
            </div>
            <div className="mt-4 flex justify-between">
                <button
                    type="button"
                    onClick={onPrevious}
                    className="inline-flex justify-center rounded-md border border-transparent bg-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-400"
                >
                    Previous
                </button>
                <button
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                >
                    Next
                </button>
            </div>
        </form>
    );
}
