import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import React from "react";

interface EventCardProps {
    title: string;
    description: string;
    image: StaticImageData;
    link: string;
}

export default function EventCard({
    title,
    description,
    image,
    link
}: EventCardProps) {
    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
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
                <h3 className="text-xl font-bold mb-2 text-[#1d1c20]">
                    {title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                    {description}
                </p>
                <Link 
                    href={link}
                    className="text-[#1d1c20] hover:text-[#FFD700] transition-colors inline-flex items-center text-sm"
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