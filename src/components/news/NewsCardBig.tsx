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
        <div className="group overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 border-l-4 border-[#B48322] border-t border-r border-b h-full transform hover:translate-y-[-5px]">
            <div className="relative h-64 md:h-80 overflow-hidden">
                <Image
                    src={latestNews.thumbnail || backgroundImg}
                    alt={latestNews.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    width={600}
                    height={400}
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/80 via-[#000000]/40 to-transparent opacity-90"></div>
                <div className="absolute bottom-0 left-0 p-6 text-white w-full">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs font-medium bg-gradient-to-r from-[#B48322] to-[#F2B233] text-black px-4 py-1.5 rounded-full shadow-md transform transition-transform duration-300 group-hover:scale-105">
                            {new Date(latestNews.publish_date).toLocaleDateString("en-US", {
                                year: "numeric", month: "short", day: "numeric"
                            })}
                        </span>
                        <span className="text-xs font-medium bg-black/60 text-white px-4 py-1.5 rounded-full shadow-md backdrop-blur-sm">
                            {latestNews.organization || "PUFA Computing"}
                        </span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white drop-shadow-md mb-2 line-clamp-2 transition-all duration-300 group-hover:translate-y-[-5px]">
                        {latestNews.title}
                    </h3>
                </div>
            </div>
            <div className="p-7">
                <p className="mb-5 line-clamp-3 text-gray-600 leading-relaxed">
                    {createExcerpt(latestNews.content)}
                </p>
                <Link
                    href={`/news/${latestNews.slug}`}
                    className="inline-flex items-center font-medium text-[#000000] transition-all duration-300 hover:text-[#B48322] group-hover:translate-x-2"
                >
                    Read Full Article
                    <svg
                        className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
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
