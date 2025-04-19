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
        <div className="group relative overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-500 h-full transform hover:-translate-y-2">
            {/* Decorative gradient border */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#B48322] to-[#F2B233] z-10"></div>
            
            {/* Image container with overlay effect */}
            <div className="relative h-48 sm:h-56 md:h-64 lg:h-80 overflow-hidden">
                <Image
                    src={latestNews.thumbnail || backgroundImg}
                    alt={latestNews.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    width={600}
                    height={400}
                    priority
                />
                {/* Gradient overlay with improved visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
                
                {/* Title and metadata positioned over the image */}
                <div className="absolute bottom-0 left-0 p-4 sm:p-5 md:p-6 text-white w-full">
                    {/* Tags with improved styling */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <span className="text-xs font-medium bg-gradient-to-r from-[#B48322]/90 to-[#F2B233]/90 text-white px-3 py-1 sm:px-4 sm:py-1.5 rounded-full shadow-md backdrop-blur-sm transform transition-transform duration-300 group-hover:scale-105">
                            {new Date(latestNews.publish_date).toLocaleDateString("en-US", {
                                year: "numeric", month: "short", day: "numeric"
                            })}
                        </span>
                        <span className="text-xs font-medium bg-black/50 text-white px-3 py-1 sm:px-4 sm:py-1.5 rounded-full shadow-md backdrop-blur-sm">
                            {latestNews.organization || "PUFA Computing"}
                        </span>
                    </div>
                    
                    {/* Title with animation effect */}
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white drop-shadow-md mb-2 line-clamp-2 transition-all duration-300 group-hover:translate-y-[-3px]">
                        {latestNews.title}
                    </h3>
                </div>
            </div>
            
            {/* Content area */}
            <div className="p-4 sm:p-5 md:p-6 lg:p-7">
                {/* Description with improved readability */}
                <p className="mb-4 sm:mb-5 line-clamp-3 text-sm sm:text-base text-gray-600 leading-relaxed">
                    {createExcerpt(latestNews.content)}
                </p>
                
                {/* Link with animated arrow */}
                <Link
                    href={`/news/${latestNews.slug}`}
                    className="inline-flex items-center text-sm sm:text-base font-medium text-gray-700 transition-all duration-300 hover:text-[#B48322] group-hover:translate-x-1"
                >
                    Read Full Article
                    <svg
                        className="ml-1.5 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:translate-x-1"
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
    );
}
