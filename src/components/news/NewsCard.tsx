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
        <div className="space-y-6">
            {news.map((item) => (
                <div
                    key={item.id}
                    className="group flex overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-500 transform hover:scale-[1.02] border-l-4 border-[#B48322] border-t border-r border-b"
                >
                    <div className="relative h-32 w-32 md:h-40 md:w-40 overflow-hidden">
                        <Image
                            src={item.thumbnail || backgroundImg}
                            alt={item.title}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            width={160}
                            height={160}
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/30 to-transparent"></div>
                    </div>
                    <div className="flex-1 p-5 md:p-6">
                        <div className="mb-2 flex items-center gap-3">
                            <span className="text-xs font-medium bg-[#F2B233]/10 text-[#B48322] px-3 py-1 rounded-full">
                                {new Date(item.publish_date).toLocaleDateString(
                                    "en-US",
                                    {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    }
                                )}
                            </span>
                            <span className="h-1 w-1 rounded-full bg-gray-400"></span>
                            <span className="text-xs font-medium text-gray-600">{item.organization || "PUFA Computing"}</span>
                        </div>
                        <h3 className="mb-3 text-lg font-bold text-[#000000] line-clamp-2 transition-colors duration-300 group-hover:text-[#B48322]">
                            {item.title}
                        </h3>
                        <p className="mb-4 text-sm text-gray-600 line-clamp-2 leading-relaxed">
                            {createExcerpt(item.content)}
                        </p>
                        <Link
                            href={`/news/${item.slug}`}
                            className="inline-flex items-center text-sm font-medium text-[#000000] transition-all duration-300 hover:text-[#B48322] group-hover:translate-x-1"
                        >
                            Read More
                            <svg
                                className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
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
            ))}
        </div>
    );
}
