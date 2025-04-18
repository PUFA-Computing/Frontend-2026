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
        <article className="transform overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border-l-4 border-[#B48322]">
            <div className="relative h-48 bg-white p-4">
                <Image
                    src={imageUrl}
                    alt={title}
                    className="object-contain"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                />
            </div>
            <div className="p-6">
                <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-full bg-gradient-to-r from-[#B48322] to-[#F2B233] px-3 py-1 text-xs font-semibold text-[#000000]">
                        {major}
                    </span>
                    <span className="text-xs text-gray-500">{date}</span>
                </div>

                <h3 className="mb-2 line-clamp-2 text-xl font-bold text-[#000000]">
                    {title}
                </h3>
                {/* <h3 className="mt-0.5 text-justify text-[16px] sm:text-[14px] font-semibold text-[#AF95FF]">
            {name}
          </h3>
          <div className="text-justify py-2 text-[14px] sm:text-[12px]"> */}

                <p className="mb-4 line-clamp-3 text-sm text-gray-600">
                    {description}
                    {/* </div>
          <div className="mt-2 flex flex-wrap gap-1">
            <span className="whitespace-nowrap rounded-full border border-[#AF95FF] px-2.5 py-0.5 text-xs sm:text-sm text-[#AF95FF]">
              {major} */}
                </p>

                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#B48322]">
                        By {name}
                    </span>
                    <Link
                        href={`/projects/${title.toLowerCase().replace(/\s+/g, "-")}`}
                        className="inline-flex items-center text-sm text-[#000000] transition-colors hover:text-[#B48322]"
                    >
                        View Project
                        <svg
                            className="ml-1 h-4 w-4"
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
                {/* <time className="mt-2 block text-left text-xs sm:text-sm text-[#A5B0BB]">
            {" "}
            {date}{" "}
          </time> */}
            </div>
        </article>
    );
}
