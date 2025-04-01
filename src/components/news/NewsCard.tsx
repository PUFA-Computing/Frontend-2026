import Image from "next/image";
import Link from "next/link";

// export default function NewsCard({ news }: { news: News[] }) {
//     const sortedNews = news.sort((a, b) => {
//         return (
//             new Date(b.publish_date).getTime() -
//             new Date(a.publish_date).getTime()
//         );
//     });

//     const createMarkup = (htmlString: string) => {
//         return { __html: htmlString.replace(/<[^>]*>?/gm, "") };
//     };

//     const limitedNews = sortedNews.slice(1, 5);

import { News } from "@/lib/common.type";
import backgroundImg from "@/assets/backgroundimg.svg";

interface NewsCardProps {
    news: News[];
}

export default function NewsCard({ news }: NewsCardProps) {
    // Get all news except the first one (which is shown in NewsCardBig)
    const otherNews = news.slice(1, 4);

    return (
        // <section className="grid grid-cols-2 gap-8">
        // {limitedNews.map((item, index) => (
        //     <Link href={`/news/${item.slug}`} key={index}>
        //         <article className="relative h-full overflow-hidden rounded-lg shadow transition hover:shadow-lg">

        <div className="space-y-6">
            {otherNews.map((item) => (
                <div
                    key={item.id}
                    className="flex overflow-hidden rounded-xl bg-white shadow-lg"
                >
                    <div className="relative h-32 w-32">
                        <Image
                            //     alt={`${item.title}'s Photo`}
                            //     height={1080}
                            //     width={1920}
                            //     src={item.thumbnail}
                            //     className="absolute inset-0 h-full w-full object-cover"
                            // />
                            // <div className="relative h-full bg-gradient-to-t from-gray-900/50 to-gray-900/25 pt-32 sm:pt-48 lg:pt-64">
                            //     <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                            //         <time className="block text-xs text-white/90">
                            //             {new Date(item.publish_date).toDateString()}
                            //         </time>
                            //         <h3 className="mt-0.5 text-lg text-white">

                            src={item.image || backgroundImg}
                            alt={item.title}
                            className="h-full w-full object-cover"
                            width={128}
                            height={128}
                        />
                    </div>
                    <div className="flex-1 p-4">
                        <div className="mb-2 flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                                {new Date(item.publish_date).toLocaleDateString(
                                    "en-US",
                                    {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    }
                                )}
                            </span>
                            <span className="h-1 w-1 rounded-full bg-gray-500"></span>
                            <span className="text-xs text-gray-500"></span>
                        </div>
                        <h3 className="mb-2 text-lg font-bold text-[#1d1c20]">
                            {item.title}
                        </h3>
                        {/* <p
                                    className="mt-2 line-clamp-3 text-sm/relaxed text-white/95"
                                    dangerouslySetInnerHTML={createMarkup(
                                        item.content
                                    )}
                                /> */}

                        <Link
                            href={`/news/${item.slug}`}
                            className="inline-flex items-center text-sm text-[#1d1c20] transition-colors hover:text-[#FFD700]"
                        >
                            Read More
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
                </div>
                // </article>
                // </Link>
            ))}
            {/* </section> */}
        </div>
    );
}
