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
        <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-[#B48322] transform hover:translate-y-[-5px]">
            <div className="relative h-48">
                <Image
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover"
                    width={400}
                    height={300}
                />
            </div>
            <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-[#000000]">
                    {title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                    {description}
                </p>
                <Link 
                    href={link}
                    className="text-[#000000] hover:text-[#B48322] transition-colors inline-flex items-center text-sm font-medium"
                >
                    Read More
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </div>
        </div>
    );
}