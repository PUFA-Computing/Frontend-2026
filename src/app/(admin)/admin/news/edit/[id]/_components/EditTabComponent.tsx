"use client";
import React, { useState } from "react";
import { CheckIcon } from "@heroicons/react/24/solid";
import NewsDetailsForm from "@/components/admin/NewsDetailsForm";
import UploadThumbnailForm from "@/components/admin/UploadThumbnailForm";
import ReviewEditForm from "@/components/admin/ReviewEditForm";
import Swal from "sweetalert2";
import { editNews } from "@/services/api/news";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import News from "@/models/news";

const steps = [
    {
        id: "01",
        name: "News Details",
        description: "Edit news title and content",
        status: "current",
    },
    {
        id: "02",
        name: "Upload Thumbnail",
        description: "Update news thumbnail",
        status: "upcoming",
    },
    {
        id: "03",
        name: "Review & Update",
        description: "Review your changes and update",
        status: "upcoming",
    },
];

interface NewsEdit {
    title: string;
    content: string;
    publish_date: Date;
    thumbnail: string;
    organization_id: number;
}

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

export default function EditNewsTabs({ news }: { news: News }) {
    const session = useSession();
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setNewsDetails] = useState<NewsEdit>({
        title: news.title,
        content: news.content,
        publish_date: new Date(news.publish_date),
        thumbnail: news.thumbnail,
        organization_id: news.organization_id,
    });

    const router = useRouter();

    const [thumbnail, setThumbnail] = useState<File | null>(null);

    const organizationOptions = [
        {
            id: 1,
            name: "PUFA Computing",
        },
        {
            id: 2,
            name: "PUMA IT",
        },
        {
            id: 3,
            name: "PUMA IS",
        },
    ];

    const [selectedOrganization, setSelectedOrganization] = useState(
        organizationOptions.find(org => org.id === news.organization_id) || organizationOptions[0]
    );

    const handleNext = () => {
        setCurrentStep(currentStep + 1);
    };

    const handlePrevious = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleNewsDetailsChange = (details: any) => {
        setNewsDetails(details);
    };

    const handleThumbnailChange = (file: File) => {
        setThumbnail(file);
    };

    const handleOrganizationChange = (selectedOption: any) => {
        setSelectedOrganization(selectedOption);
        setNewsDetails({
            ...formData,
            organization_id: selectedOption.id,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (
            !formData.title ||
            !formData.content ||
            !formData.publish_date ||
            !formData.organization_id
        ) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Please fill all the required fields",
            });
            return;
        }

        const newsData = {
            title: formData.title,
            content: formData.content,
            publish_date: formData.publish_date,
            organization_id: formData.organization_id,
            // Ensure we're passing the slug to maintain consistency
            slug: news.slug
        };

        try {
            if (!session.data) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "You are not authorized to edit news",
                });
                return;
            }
            
            console.log("Sending update request for news ID:", news.id);
            console.log("With data:", newsData);
            console.log("Thumbnail changed:", thumbnail ? "Yes" : "No");
            
            await editNews(news.id, newsData, thumbnail, session.data.user.access_token);
            
            Swal.fire({
                icon: "success",
                title: "Success",
                text: "News updated successfully",
            }).then(() => {
                router.push("/admin/news");
            });
        } catch (error) {
            console.error("Error updating news:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "An error occurred while updating the news",
            });
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <NewsDetailsForm
                        onNext={handleNext}
                        formData={formData}
                        onDetailsChange={handleNewsDetailsChange}
                        organizationOptions={organizationOptions}
                        selectedOrganization={selectedOrganization}
                        onOrganizationChange={handleOrganizationChange}
                        isEdit={true}
                    />
                );
            case 1:
                return (
                    <UploadThumbnailForm
                        onNext={handleNext}
                        onPrevious={handlePrevious}
                        onThumbnailChange={handleThumbnailChange}
                        currentThumbnail={news.thumbnail}
                        isEdit={true}
                    />
                );
            case 2:
                return (
                    <ReviewEditForm
                        onPrevious={handlePrevious}
                        onSubmit={handleSubmit}
                        formData={formData}
                        thumbnail={thumbnail}
                        currentThumbnail={news.thumbnail}
                        selectedOrganization={selectedOrganization}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="lg:border-b lg:border-t lg:border-gray-200">
            <nav aria-label="Progress">
                <ol
                    role="list"
                    className="divide-y divide-gray-300 rounded-md border border-gray-300 md:flex md:divide-y-0"
                >
                    {steps.map((step, stepIdx) => (
                        <li key={step.name} className="relative md:flex md:flex-1">
                            {currentStep > stepIdx ? (
                                <div className="group flex w-full items-center">
                                    <span className="flex items-center px-6 py-4 text-sm font-medium">
                                        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 group-hover:bg-indigo-800">
                                            <CheckIcon
                                                className="h-6 w-6 text-white"
                                                aria-hidden="true"
                                            />
                                        </span>
                                        <span className="ml-4 text-sm font-medium text-gray-900">
                                            {step.name}
                                        </span>
                                    </span>
                                </div>
                            ) : currentStep === stepIdx ? (
                                <div
                                    className="flex items-center px-6 py-4 text-sm font-medium"
                                    aria-current="step"
                                >
                                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-indigo-600">
                                        <span className="text-indigo-600">
                                            {step.id}
                                        </span>
                                    </span>
                                    <span className="ml-4 text-sm font-medium text-indigo-600">
                                        {step.name}
                                    </span>
                                </div>
                            ) : (
                                <div className="group flex items-center">
                                    <span className="flex items-center px-6 py-4 text-sm font-medium">
                                        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300 group-hover:border-gray-400">
                                            <span className="text-gray-500 group-hover:text-gray-900">
                                                {step.id}
                                            </span>
                                        </span>
                                        <span className="ml-4 text-sm font-medium text-gray-500 group-hover:text-gray-900">
                                            {step.name}
                                        </span>
                                    </span>
                                </div>
                            )}

                            {stepIdx !== steps.length - 1 ? (
                                <>
                                    {/* Arrow separator for lg screens and up */}
                                    <div
                                        className="absolute right-0 top-0 hidden h-full w-5 md:block"
                                        aria-hidden="true"
                                    >
                                        <svg
                                            className="h-full w-full text-gray-300"
                                            viewBox="0 0 22 80"
                                            fill="none"
                                            preserveAspectRatio="none"
                                        >
                                            <path
                                                d="M0 -2L20 40L0 82"
                                                vectorEffect="non-scaling-stroke"
                                                stroke="currentcolor"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                </>
                            ) : null}
                        </li>
                    ))}
                </ol>
            </nav>

            <div className="mt-8 p-4">{renderStepContent()}</div>
        </div>
    );
}
