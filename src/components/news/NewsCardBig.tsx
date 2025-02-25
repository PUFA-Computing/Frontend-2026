// import News from "@/models/news";
import Image from "next/image";
import Link from "next/link";
// import React from "react";

// export default function NewsCardBig({ news }: { news: News[] }) {
//     const sortedNews = news.sort((a, b) => {
//         return (
//             new Date(b.publish_date).getTime() -
//             new Date(a.publish_date).getTime()
//         );
//     });

//     const createMarkup = (htmlString: string) => {
//         return { __html: htmlString.replace(/<[^>]*>?/gm, "") };
//     };

//     const limitedNews = sortedNews.slice(0, 1);

import backgroundImg from "@/assets/backgroundimg.svg";
import { News } from "@/lib/common.type";

interface NewsCardBigProps {
    news: News[];
}

export default function NewsCardBig({ news }: NewsCardBigProps) {
    const latestNews = news[0];

    return (
        // <section>
        // {limitedNews.map((item, index) => (
        //     <Link href={`news/${item.slug}`} key={index}>
        //         <article className="relative h-full overflow-hidden rounded-lg shadow transition hover:shadow-lg ">

        <div className="overflow-hidden rounded-xl bg-white shadow-lg">
            <div className="relative h-64">
                <Image
                    //         alt={`${item.title}'s Image`}
                    //         src={item.thumbnail}
                    //         width={1920}
                    //         height={1080}
                    //         className="absolute inset-0 h-full w-full object-cover"
                    //     />
                    //     <div className="relative h-full bg-gradient-to-t from-gray-900/50 to-gray-900/25 pt-32 sm:pt-48 lg:pt-64">
                    //         <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                    //             <time className="block text-xs text-white/90">
                    //                 {new Date(item.publish_date).toDateString()}
                    //             </time>
                    //             <h3 className="mt-0.5 text-lg text-white">
                    //                 {item.title}
                    //             </h3>
                    //             <p
                    //                 className="mt-2 line-clamp-3 text-sm/relaxed text-white/95"
                    //                 dangerouslySetInnerHTML={createMarkup(
                    //                     item.content
                    //                 )}
                    //             />
                    //         </div>
                    //     </div>
                    // </article>

                    src={latestNews?.image || backgroundImg}
                    alt={latestNews?.title || "News Image"}
                    className="h-full w-full object-cover"
                    width={600}
                    height={400}
                />
            </div>
            <div className="p-6">
                <div className="mb-4 flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                        {new Date(latestNews?.date).toLocaleDateString(
                            "en-US",
                            {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            }
                        )}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-gray-500"></span>
                    <span className="text-sm text-gray-500">
                        {latestNews?.category}
                    </span>
                </div>
                <h3 className="mb-3 text-2xl font-bold text-[#1d1c20]">
                    {latestNews?.title}
                </h3>
                <p className="mb-4 line-clamp-3 text-gray-600">
                    {latestNews?.description}
                </p>
                <Link
                    href={`/news/${latestNews?.id}`}
                    className="inline-flex items-center text-[#1d1c20] transition-colors hover:text-[#FFD700]"
                >
                    Read More
                    <svg
                        className="ml-2 h-4 w-4"
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
                {/* ))}
        </section> */}
            </div>
        </div>
    );
}
