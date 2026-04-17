import Image from "next/image";
import Link from "next/link";
import backgroundImg from "@/assets/backgroundimg.svg";
import News from "@/models/news";

interface NewsCardBigProps {
    news: News[];
}

export default function NewsCardBig({ news }: NewsCardBigProps) {
    const latestNews = news && news.length > 0 ? news[0] : null;

    // Function to create a clean excerpt from HTML content
    const createExcerpt = (content: string) => {
        // Remove HTML tags and get plain text
        const plainText = content.replace(/<[^>]*>?/gm, '');
        // Limit to 150 characters and add ellipsis if needed
        return plainText.length > 150 ? `${plainText.substring(0, 150)}...` : plainText;
    };

    if (!latestNews) {
        return null;
    }

    return (
        <div className="group relative overflow-hidden border border-[#B8841E]/15 bg-[#FAF5E8]/40 transition-colors duration-500 hover:bg-[#FAF5E8]/80 hover:border-[#B8841E]/40 h-full flex flex-col">
            {/* Top gold rule */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#B8841E]/70 to-transparent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 z-10" />
            
            {/* Image container with overlay effect */}
            <div className="relative h-48 sm:h-56 md:h-64 lg:h-80 overflow-hidden border-b border-[#B8841E]/15">
                <Image
                    src={latestNews.thumbnail || backgroundImg}
                    alt={latestNews.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    width={600}
                    height={400}
                    priority
                />
                {/* Gradient overlay with elegant dark navy */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B3E]/90 via-[#0D1B3E]/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
                
                {/* Title and metadata positioned over the image */}
                <div className="absolute bottom-0 left-0 p-5 sm:p-6 md:p-8 text-white w-full">
                    {/* Tags */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="inline-flex items-center px-3 py-1 font-serif text-[10px] tracking-widest uppercase border border-[#B8841E]/30 bg-[#FAF5E8]/90 text-[#0D1B3E] backdrop-blur-sm shadow-sm transition-transform duration-300 group-hover:scale-105">
                            {new Date(latestNews.publish_date).toLocaleDateString("en-US", {
                                year: "numeric", month: "short", day: "numeric"
                            })}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 font-serif text-[10px] tracking-widest uppercase border border-[#B8841E] bg-[#0D1B3E]/80 text-[#EDD085] backdrop-blur-sm shadow-sm transition-all duration-300 group-hover:bg-[#B8841E] group-hover:text-white">
                            {latestNews.organization || "PUFA Computing"}
                        </span>
                    </div>
                    
                    {/* Title */}
                    <h3 className="font-display italic text-2xl sm:text-3xl md:text-4xl text-white drop-shadow-md mb-2 line-clamp-2 transition-transform duration-300 group-hover:-translate-y-1">
                        {latestNews.title}
                    </h3>

                    {/* Ornament inside image */}
                    <div className="flex items-center gap-2 mt-3 opacity-0 translate-y-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                        <div className="h-px w-8 bg-[#EDD085]/60" />
                        <span className="text-[#EDD085]/70 text-[10px]">✦</span>
                    </div>
                </div>
            </div>
            
            {/* Content area */}
            <div className="p-5 sm:p-6 md:p-8 flex-1 flex flex-col">
                {/* Description */}
                <p className="mb-6 line-clamp-3 font-serif text-[#1A1A2E]/60 text-sm sm:text-base leading-relaxed flex-grow">
                    {createExcerpt(latestNews.content)}
                </p>
                
                {/* Link */}
                <div className="mt-auto pt-5 border-t border-[#B8841E]/10">
                    <Link
                        href={`/news/${latestNews.slug}`}
                        className="inline-flex items-center gap-2 font-serif text-sm sm:text-base text-[#B8841E] transition-colors duration-250 group-hover:text-[#0D1B3E]"
                    >
                        <span>Read Full Article</span>
                        <svg
                            className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-250 group-hover:translate-x-1"
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
