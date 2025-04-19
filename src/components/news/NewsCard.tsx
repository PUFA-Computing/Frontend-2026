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
                    className="group block"
                >
                    <div className="relative overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 flex flex-col h-[400px]">
                        {/* Top accent border */}
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#B48322] to-[#F2B233] z-10"></div>
                        
                        {/* Image container - Fixed height */}
                        <div className="relative h-[200px] w-full overflow-hidden">
                            <Image
                                src={item.thumbnail || backgroundImg}
                                alt={item.title}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                width={400}
                                height={200}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-70"></div>
                            
                            {/* Organization badge */}
                            <div className="absolute top-3 left-3">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#B48322]/90 text-white shadow-md backdrop-blur-sm">
                                    {item.organization || "PUFA Computing"}
                                </span>
                            </div>
                            
                            {/* Date badge */}
                            <div className="absolute top-3 right-3">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-[#B48322] shadow-md backdrop-blur-sm">
                                    {new Date(item.publish_date).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric"
                                    })}
                                </span>
                            </div>
                        </div>
                        
                        {/* Content area - Fixed padding */}
                        <div className="flex-1 p-5 flex flex-col">
                            {/* Title with fixed height */}
                            <h3 className="mb-3 text-lg font-bold text-gray-800 line-clamp-2 h-[56px] transition-colors duration-300 group-hover:text-[#B48322]">
                                {item.title}
                            </h3>
                            
                            {/* Description with fixed height */}
                            <p className="mb-4 text-sm text-gray-600 line-clamp-3 h-[60px] leading-relaxed">
                                {createExcerpt(item.content)}
                            </p>
                            
                            {/* Read more link */}
                            <div className="mt-auto pt-3 border-t border-gray-100">
                                <span className="inline-flex items-center text-sm font-medium text-[#B48322] transition-all duration-300 group-hover:translate-x-1">
                                    Read More
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
                                </span>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
