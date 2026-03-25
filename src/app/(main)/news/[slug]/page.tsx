import { fetchNews, fetchNewsBySlug } from "@/services/api/news";
import NewsCard from "@/components/news/NewsCard";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import { CircularProgress } from "@/components/ui/CircularProgress";
import { Calendar, Clock, User, ArrowLeft, Share2, Bookmark, ThumbsUp } from "lucide-react";
import ShareButton from "../../events/[slug]/_components/ShareButton";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { Metadata } from "next";

// Generate dynamic metadata for each news article
export async function generateMetadata(
    { params }: { params: { slug: string } }
): Promise<Metadata> {
    // Fetch news data
    const news = await fetchNewsBySlug(params.slug);
    
    if (!news) {
        return {
            title: "News Not Found",
            description: "The requested news article could not be found."
        };
    }
    
    // Format date for description
    const formattedDate = new Date(news.publish_date).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
    
    // Create a clean excerpt for the description
    const plainTextContent = news.content
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .substring(0, 160) // Limit to 160 characters
        .trim();
    
    return {
        title: news.title,
        description: `${plainTextContent}... - Published on ${formattedDate} by ${news.author}`,
        alternates: {
            canonical: `/news/${news.slug}`,
        },
        openGraph: {
            title: news.title,
            description: plainTextContent,
            type: "article",
            url: `https://compsci.president.ac.id/news/${news.slug}`,
            images: [
                {
                    url: news.thumbnail,
                    width: 1200,
                    height: 630,
                    alt: news.title
                }
            ],
            publishedTime: new Date(news.publish_date).toISOString(),
            authors: [news.author],
            section: news.organization,
        }
    };
}

interface NewsDetailsPageProps {
    params: { slug: string };
}

export default async function NewsDetailsPage({
    params,
}: NewsDetailsPageProps) {
    if (!params.slug || params.slug.length < 1) {
        return redirect("/404");
    }
    const news = await fetchNewsBySlug(params.slug);
    const moreNews = await fetchNews();

    if (!news) {
        return redirect("/404");
    }
    
    // Format dates for schema markup
    const formattedPublishDate = new Date(news.publish_date).toISOString();
    
    // Schema.org Article markup for structured data
    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        "headline": news.title,
        "datePublished": formattedPublishDate,
        "dateModified": formattedPublishDate,
        "author": {
            "@type": "Person",
            "name": news.author
        },
        "publisher": {
            "@type": "Organization",
            "name": news.organization || "PUFA Computing",
            "logo": {
                "@type": "ImageObject",
                "url": "https://compsci.president.ac.id/images/logo.png"
            }
        },
        "image": news.thumbnail,
        "description": news.content.replace(/<[^>]*>/g, '').substring(0, 160),
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://compsci.president.ac.id/news/${news.slug}`
        }
    };

    const createMarkup = (htmlString: string) => {
        return { __html: htmlString };
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
            {/* Add Schema.org JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />
            {/* Hero Section */}
            <section className="relative w-full flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden bg-[#F5EDD0]">
                <div className="absolute inset-0 bg-gradient-to-b from-[#EDE0BB]/80 to-[#F5EDD0]" />
                
                {/* Top corner ornaments */}
                <div className="absolute top-28 left-8 w-12 h-12 border-l border-t border-[#B8841E]/40 hidden md:block" />
                <div className="absolute top-28 right-8 w-12 h-12 border-r border-t border-[#B8841E]/40 hidden md:block" />
                
                <div className="relative container mx-auto px-6 max-w-7xl z-10 flex flex-col items-center text-center">
                    <div className="mb-6">
                        <Link 
                            href="/news" 
                            className="inline-flex items-center rounded-none border border-[#B8841E]/30 bg-[#FAF5E8]/60 px-4 py-2 text-sm font-serif font-medium text-[#0D1B3E] transition-all hover:bg-[#B8841E]/10"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to News
                        </Link>
                    </div>
                    
                    <div className="max-w-4xl flex flex-col items-center">
                        <div className="mb-4 inline-flex items-center justify-center border border-[#B8841E]/30 bg-[#FAF5E8]/60 px-4 py-1.5 shadow-parch-sm">
                            <p className="font-serif text-xs tracking-[0.2em] font-medium text-[#B8841E] uppercase">{news.organization}</p>
                        </div>
                        <h1 className="mb-6 text-4xl font-display italic text-[#0D1B3E] md:text-5xl lg:text-6xl text-balance leading-tight">
                            {news.title}
                        </h1>
                        <div className="flex flex-wrap items-center justify-center gap-6 text-[#1A1A2E]/70 font-serif">
                            <div className="flex items-center">
                                <User className="mr-2 h-4 w-4 text-[#B8841E]" />
                                <span className="text-sm">{news.author}</span>
                            </div>
                            <span className="text-[#B8841E]/40 text-xs">✦</span>
                            <div className="flex items-center">
                                <Calendar className="mr-2 h-4 w-4 text-[#B8841E]" />
                                <span className="text-sm">{new Date(news.publish_date).toLocaleDateString("en-US", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                })}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Featured Image - Optimized for SEO and Core Web Vitals */}
                        <div className="mb-8 overflow-hidden rounded-xl">
                            <div className="relative aspect-video w-full overflow-hidden">
                                <OptimizedImage
                                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                                    src={news.thumbnail}
                                    layout="fill"
                                    alt={news.title}
                                    priority={true} // Prioritize LCP image
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 1200px"
                                />
                            </div>
                            {/* Add publication date for SEO */}
                            <div className="mt-2 text-xs text-gray-500">
                                <time dateTime={new Date(news.publish_date).toISOString()}>
                                    Published: {new Date(news.publish_date).toLocaleDateString("en-US", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric"
                                    })}
                                </time>
                            </div>
                        </div>
                        
                        {/* Article Content */}
                        <div className="rounded-xl bg-white p-6 shadow-lg md:p-8">
                            {/* Social Sharing */}
                            <div className="mb-8 flex items-center justify-between border-b border-gray-100 pb-6">
                                {/* <div className="flex items-center space-x-4">
                                    <button className="flex items-center space-x-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100">
                                        <ThumbsUp className="h-3.5 w-3.5" />
                                        <span>Like</span>
                                    </button>
                                    <button className="flex items-center space-x-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-600 hover:bg-amber-100">
                                        <Bookmark className="h-3.5 w-3.5" />
                                        <span>Save</span>
                                    </button>
                                </div> */}
                                
                                <ShareButton title={news.title} />
                            </div>
                            
                            {/* Article Body */}
                            <article className="prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-indigo-600 lg:prose-lg">
                                <div dangerouslySetInnerHTML={createMarkup(news.content)} />
                            </article>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* About Author */}
                        <div className="rounded-xl bg-white p-6 shadow-lg">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">About the Author</h3>
                            <div className="flex items-center">
                                <div className="mr-4 h-12 w-12 overflow-hidden rounded-full bg-indigo-100">
                                    <User className="h-full w-full p-2 text-indigo-500" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900">{news.author}</h4>
                                    <p className="text-sm text-gray-600">{news.organization}</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Reading Time */}
                        <div className="rounded-xl bg-white p-6 shadow-lg">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">Article Info</h3>
                            <div className="space-y-3">
                                <div className="flex items-start">
                                    <Clock className="mr-3 mt-0.5 h-5 w-5 text-indigo-600" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Reading Time</p>
                                        <p className="text-sm text-gray-600">~{Math.ceil(news.content.length / 1000)} min read</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <Calendar className="mr-3 mt-0.5 h-5 w-5 text-indigo-600" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Published</p>
                                        <p className="text-sm text-gray-600">{new Date(news.publish_date).toLocaleDateString("en-US", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* More News */}
                        <div className="rounded-xl bg-white p-6 shadow-lg">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">More News</h3>
                            <div className="space-y-4">
                                <Suspense fallback={<CircularProgress />}>
                                    {moreNews.slice(0, 3).map(item => (
                                        <Link key={item.id} href={`/news/${item.slug}`} className="group block">
                                            <div className="flex items-start space-x-3">
                                                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                                                    <OptimizedImage
                                                        src={item.thumbnail}
                                                        layout="fill"
                                                        objectFit="cover"
                                                        alt={item.title}
                                                        className="transition-transform duration-300 group-hover:scale-110"
                                                    />
                                                </div>
                                                <div>
                                                    <h4 className="line-clamp-2 text-sm font-medium text-gray-900 group-hover:text-indigo-600">{item.title}</h4>
                                                    <p className="mt-1 text-xs text-gray-500">{new Date(item.publish_date).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </Suspense>
                                <Link href="/news" className="mt-2 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800">
                                    View all news
                                    <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
