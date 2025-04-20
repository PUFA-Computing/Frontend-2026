"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import BGImage from "@/assets/backgroundimg.svg";

interface EventCardProps {
    title: string;
    description: string;
    image: string | any; // Can be a URL string or a StaticImageData
    link: string;
}

export default function EventCard({
    title,
    description,
    image,
    link
}: EventCardProps) {
    return (
        <div className="group relative h-full flex flex-col bg-white rounded-lg sm:rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2">
            {/* Decorative gradient border */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#B48322] to-[#F2B233]"></div>
            
            {/* Event image with overlay and badge */}
            <div className="relative h-48 sm:h-52 md:h-56 overflow-hidden">
                <Image
                    src={image || "/placeholder.svg"}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    width={500}
                    height={300}
                    style={{ objectFit: 'cover' }}
                    onError={(e) => {
                        // Fallback to a local image if the thumbnail fails to load
                        const imgElement = e.currentTarget as HTMLImageElement;
                        imgElement.src = "/placeholder.svg";
                        console.log("Image failed to load, using fallback", image);
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Event badge */}
                <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#B48322]/90 text-white shadow-md">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
                        </svg>
                        Event
                    </span>
                </div>
            </div>
            
            {/* Content area */}
            <div className="flex-1 p-5 sm:p-6 flex flex-col">
                {/* Title with hover effect */}
                <h3 className="text-lg sm:text-xl font-bold mb-3 text-gray-800 group-hover:text-[#B48322] transition-colors duration-300 line-clamp-2">
                    {title}
                </h3>
                
                {/* Description with improved readability */}
                <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3 flex-grow">
                    {description}
                </p>
                
                {/* Link with animated arrow */}
                <div className="mt-auto pt-3 border-t border-gray-100">
                    <Link 
                        href={link}
                        className="inline-flex items-center text-sm font-medium text-gray-700 transition-all duration-300 hover:text-[#B48322] group-hover:translate-x-1"
                    >
                        Read More
                        <svg 
                            className="w-4 h-4 ml-1.5 transition-transform duration-300 group-hover:translate-x-1" 
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
        </div>
    );
}