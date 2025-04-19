import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import React from "react";

interface CompreciationCardProps {
    title: string;
    name: string;
    description: string;
    date: string;
    major: string;
    imageUrl: StaticImageData;
}

export default function CompreciationCard({
    title,
    name,
    description,
    date,
    major,
    imageUrl,
}: CompreciationCardProps) {
    return (
        <article className="group relative overflow-hidden rounded-lg sm:rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2 h-full flex flex-col">
            {/* Decorative gradient border */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#B48322] to-[#F2B233]"></div>
            
            {/* Image container with overlay effect */}
            <div className="relative h-48 sm:h-52 md:h-56 overflow-hidden">
                <Image
                    src={imageUrl}
                    alt={title}
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            {/* Content area */}
            <div className="flex-1 p-5 sm:p-6 flex flex-col">
                {/* Tags and date */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="rounded-full bg-gradient-to-r from-[#B48322]/90 to-[#F2B233]/90 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                        {major}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{date}</span>
                </div>

                {/* Title with hover effect */}
                <h3 className="mb-3 line-clamp-2 text-lg sm:text-xl font-bold text-gray-800 group-hover:text-[#B48322] transition-colors duration-300">
                    {title}
                </h3>

                {/* Description with improved readability */}
                <p className="mb-4 line-clamp-3 text-sm text-gray-600 leading-relaxed flex-grow">
                    {description}
                </p>

                {/* Footer with author and link */}
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                    <span className="text-sm font-medium text-[#B48322] flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path>
                        </svg>
                        {name}
                    </span>
                    <Link
                        href={`/projects/${title.toLowerCase().replace(/\s+/g, "-")}`}
                        className="inline-flex items-center text-sm font-medium text-gray-700 transition-all duration-300 hover:text-[#B48322] group-hover:translate-x-1"
                    >
                        View Project
                        <svg
                            className="ml-1.5 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </Link>
                </div>
            </div>
        </article>
    );
}
