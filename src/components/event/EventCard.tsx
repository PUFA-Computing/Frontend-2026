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
        <div className="group w-full relative overflow-hidden border border-[#B8841E]/15 bg-[#FAF5E8]/40 transition-colors duration-500 hover:bg-[#FAF5E8]/80 hover:border-[#B8841E]/40 h-full flex flex-col">
            {/* Top gold rule */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#B8841E]/70 to-transparent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 z-10" />
            
            {/* Event image with overlay and badge */}
            <div className="relative h-48 sm:h-52 md:h-56 overflow-hidden border-b border-[#B8841E]/15">
                <Image
                    src={typeof image === 'string' ? `${image}?t=${new Date().getTime()}` : image || "/placeholder.svg"}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    width={500}
                    height={300}
                    style={{ objectFit: 'cover' }}
                    unoptimized={true}
                    onError={(e) => {
                        const imgElement = e.currentTarget as HTMLImageElement;
                        imgElement.src = "/placeholder.svg";
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B3E]/60 to-transparent opacity-80 transition-opacity duration-300"></div>
                
                {/* Event badge */}
                <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center px-3 py-1 font-serif text-[10px] tracking-widest uppercase border border-[#B8841E] bg-[#0D1B3E]/80 text-[#EDD085] backdrop-blur-sm shadow-sm transition-all duration-300 group-hover:bg-[#B8841E] group-hover:text-white">
                        Event
                    </span>
                </div>
            </div>
            
            {/* Content area */}
            <div className="flex-1 p-5 sm:p-6 flex flex-col">
                {/* Title */}
                <h3 className="font-display italic text-xl sm:text-[1.3rem] text-[#0D1B3E] leading-tight mb-3 transition-colors duration-300 group-hover:text-[#B8841E] line-clamp-2">
                    {title}
                </h3>
                
                {/* Ornament */}
                <div className="flex items-center gap-2 mb-4">
                    <div className="h-px w-6 bg-[#B8841E]/40" />
                    <span className="text-[#B8841E]/50 text-[10px]">✦</span>
                </div>
                
                {/* Description */}
                <p className="font-serif text-[#1A1A2E]/60 text-sm mb-5 leading-relaxed line-clamp-3 flex-grow">
                    {description}
                </p>
                
                {/* Link */}
                <div className="mt-auto pt-4 border-t border-[#B8841E]/10">
                    <Link 
                        href={link}
                        className="inline-flex items-center gap-2 font-serif text-sm text-[#B8841E] hover:text-[#0D1B3E] transition-colors duration-250 group/link"
                    >
                        <span>View Details</span>
                        <svg 
                            className="w-4 h-4 transition-transform duration-250 group-hover/link:translate-x-1" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth="1.5" 
                                d="M14 5l7 7-7 7" 
                            />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
}