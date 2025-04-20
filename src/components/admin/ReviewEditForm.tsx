"use client";
import React from "react";
import Image from "next/image";

interface ReviewEditFormProps {
    onPrevious: () => void;
    onSubmit: (e: React.FormEvent) => void;
    formData: any;
    thumbnail: File | null;
    currentThumbnail: string;
    selectedOrganization: any;
}

export default function ReviewEditForm({
    onPrevious,
    onSubmit,
    formData,
    thumbnail,
    currentThumbnail,
    selectedOrganization,
}: ReviewEditFormProps) {
    return (
        <div className="space-y-6">
            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
                <div className="px-4 py-6 sm:p-8">
                    <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-4">
                            <h2 className="text-base font-semibold leading-7 text-gray-900">
                                Review News Details
                            </h2>
                            <p className="mt-1 text-sm leading-6 text-gray-600">
                                Please review your news details before updating.
                            </p>
                        </div>

                        <div className="col-span-full">
                            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                                <div className="text-center">
                                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                        <div className="relative h-64 w-full">
                                            <Image
                                                src={thumbnail ? URL.createObjectURL(thumbnail) : currentThumbnail}
                                                alt="News thumbnail"
                                                layout="fill"
                                                objectFit="cover"
                                                className="rounded-lg"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label
                                htmlFor="title"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Title
                            </label>
                            <div className="mt-2">
                                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                    <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                                        {formData.title}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label
                                htmlFor="organization"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Organization
                            </label>
                            <div className="mt-2">
                                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                    <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                                        {selectedOrganization.name}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-full">
                            <label
                                htmlFor="content"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Content
                            </label>
                            <div className="mt-2">
                                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                                    <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                                        <div
                                            className="prose prose-sm"
                                            dangerouslySetInnerHTML={{
                                                __html: formData.content,
                                            }}
                                        />
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label
                                htmlFor="publish_date"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Publish Date
                            </label>
                            <div className="mt-2">
                                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                    <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                                        {new Date(
                                            formData.publish_date
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                    <button
                        type="button"
                        className="text-sm font-semibold leading-6 text-gray-900"
                        onClick={onPrevious}
                    >
                        Previous
                    </button>
                    <button
                        type="submit"
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={onSubmit}
                    >
                        Update News
                    </button>
                </div>
            </div>
        </div>
    );
}
