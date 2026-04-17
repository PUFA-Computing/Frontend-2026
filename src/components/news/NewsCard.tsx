import Image from "next/image";
import Link from "next/link";
import backgroundImg from "@/assets/backgroundimg.svg";
import News from "@/models/news";

interface NewsCardProps {
    news: News[];
}

export default function NewsCard({ news }: NewsCardProps) {
    // Function to create a clean excerpt from HTML content
    const createExcerpt = (content: string) => {
        // Remove HTML tags and get plain text
        const plainText = content.replace(/<[^>]*>?/gm, '');
        // Limit to 100 characters and add ellipsis if needed
        return plainText.length > 100 ? `${plainText.substring(0, 100)}...` : plainText;
    };

    if (!news || news.length === 0) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 gap-6">
            {news.map((item) => (
                <Link
                    key={item.id}
                    href={`/news/${item.slug}`}
                    className="group block h-full"
                >
                    <div className="relative h-full overflow-hidden border border-[#B8841E]/15 bg-[#FAF5E8]/40 transition-colors duration-500 hover:bg-[#FAF5E8]/80 hover:border-[#B8841E]/40">
                        {/* Top gold rule */}
                        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#B8841E]/70 to-transparent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 z-10" />
                        
                        <div className="flex flex-col h-full">
                            {/* Image container - Fixed height for all cards */}
                            <div className="relative w-full h-[200px] overflow-hidden border-b border-[#B8841E]/15">
                                <Image
                                    src={item.thumbnail || backgroundImg}
                                    alt={item.title}
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    width={400}
                                    height={200}
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B3E]/60 to-transparent opacity-80 transition-opacity duration-300"></div>
                                
                                {/* Organization badge - Consistent positioning */}
                                <div className="absolute top-4 left-4">
                                    <span className="inline-flex items-center px-3 py-1 font-serif text-[10px] tracking-widest uppercase border border-[#B8841E] bg-[#0D1B3E]/80 text-[#EDD085] backdrop-blur-sm shadow-sm transition-all duration-300 group-hover:bg-[#B8841E] group-hover:text-white">
                                        {item.organization || "PUFA Computing"}
                                    </span>
                                </div>
                                
                                {/* Date badge - Consistent positioning */}
                                <div className="absolute top-4 right-4">
                                    <span className="inline-flex items-center px-3 py-1 font-serif text-[10px] tracking-widest uppercase border border-[#B8841E]/30 bg-[#FAF5E8]/90 text-[#0D1B3E] backdrop-blur-sm shadow-sm">
                                        {new Date(item.publish_date).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric"
                                        })}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Content area - Fixed height for all cards */}
                            <div className="flex-1 p-5 flex flex-col h-[180px]">
                                {/* Title with fixed height */}
                                <h3 className="mb-3 font-display italic text-xl sm:text-[1.3rem] text-[#0D1B3E] leading-tight line-clamp-2 h-[56px] transition-colors duration-300 group-hover:text-[#B8841E]">
                                    {item.title}
                                </h3>
                                
                                {/* Ornament */}
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="h-px w-6 bg-[#B8841E]/40" />
                                    <span className="text-[#B8841E]/50 text-[10px]">✦</span>
                                </div>
                                
                                {/* Description with fixed height */}
                                <p className="mb-4 font-serif text-[#1A1A2E]/60 text-sm line-clamp-2 h-[40px] leading-relaxed">
                                    {createExcerpt(item.content)}
                                </p>
                                
                                {/* Read more link - Fixed position at bottom */}
                                <div className="mt-auto pt-4 border-t border-[#B8841E]/10">
                                    <span className="inline-flex items-center gap-2 font-serif text-sm text-[#B8841E] transition-colors duration-250 group-hover:text-[#0D1B3E]">
                                        <span>Read More</span>
                                        <svg
                                            className="h-4 w-4 transition-transform duration-250 group-hover:translate-x-1"
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
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
