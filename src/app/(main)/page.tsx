import { useEffect } from "react";
import Image from "next/image";
import bghomepage from "@/assets/newbghomepage.jpg";
import Link from "next/link";
import Button from "@/components/Button";
import Faq from "@/components/main/Faq";
import NewsCard from "@/components/news/NewsCard";
import NewsCardBig from "@/components/news/NewsCardBig";
import StudyProgCard from "@/components/main/StudyProgCard";
import CardStore from "@/components/store/CardStore";
import EventSection from "@/components/event/EventSection";
import { Suspense } from "react";
import { FaqData, StudyProgramData } from "@/lib/data";
import Logo from "@/assets/forcasionlogo.png";
import CompreciationCards from "./_components/CompreciationCards";
import EventCards from "./_components/EventCards";
import { fetchNews } from "@/services/api/news";
import { CircularProgress } from "@/components/ui/CircularProgress";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const revalidate = 600;
export const dynamic = "force-dynamic";

export default async function Index() {
    const news = await fetchNews();

    return (
        <div className="min-h-screen text-black">
            {/* Hero Section */}
            <div 
                className="relative h-screen"
            >
                {/* Background Image */}
                <div className="absolute inset-0">
                    <Image
                        src={bghomepage}
                        alt="PUFA Background"
                        fill
                        className="object-cover brightness-[0.5] filter"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b "></div>
                </div>
                
                {/* Content Overlay */}
                <div 
                    className="relative z-10 flex h-full flex-col items-center justify-center text-white"
                >
                    <div className="transform transition-all duration-500 hover:translate-y-[-10px]">
                        <h1 
                            className="mb-2 text-center text-[120px] font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-[#FFD700] via-white to-[#FFD700] drop-shadow-[0_5px_15px_rgba(255,215,0,0.3)]"
                        >
                            PUFA 25.
                        </h1>
                        <p 
                            className="text-center text-2xl font-semibold tracking-wide text-[#FFD700] drop-shadow-[0_5px_10px_rgba(255,215,0,0.2)]"
                        >
                            Be Strong, One Determination.
                        </p>
                    </div>

                    <div className="mt-8 max-w-3xl text-center">
                        <p className="text-lg leading-relaxed bg-gradient-to-r p-6 rounded-xl transform transition-all duration-500 hover:translate-y-[-5px]  drop-shadow-[0_3px_8px_rgba(255,215,0,0.1)]">
                            PUFA Computing is a dynamic organization within President University, serving as a platform for students pursuing various computing-related fields like Information Technology, Information Systems, Visual Communication Design, and Interior Design. It fosters a vibrant community where students can connect, collaborate, and explore their passion for technology, creativity, and innovation. PUFA Computing offers opportunities for professional development, networking, and social engagement, making it a valuable resource for students aspiring to excel in the computing industry.
                        </p>
                    </div>
                </div>
            </div>
            
            {/* Study Programs Section */}
            <section className="py-16 min-h-screen container mx-auto px-4">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <div className="flex justify-center items-center space-x-3 mb-2">
                            <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-[#B48322] to-transparent opacity-70"></div>
                            <h2 className="text-4xl md:text-6xl h-[80px] font-[900] bg-clip-text text-transparent bg-gradient-to-r from-[#000000] via-[#B48322] to-[#F2B233]">
                                Study Programs
                            </h2>
                            <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-[#B48322] to-transparent opacity-70"></div>
                        </div>
                        <p className="text-[#1d1c20] text-lg md:text-xl max-w-2xl mx-auto mt-10">
                            The Faculty of Computing has four study programs that produce qualified student graduates in their fields.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:gap-12 place-items-center md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 w-full max-w-7xl mx-auto">
                        <Suspense fallback={<CircularProgress />}>
                            {StudyProgramData.map((StudyProgram, index) => (
                                <div 
                                    key={index}
                                    className="w-full max-w-[400px]"
                                >
                                    <StudyProgCard {...StudyProgram} />
                                </div>
                            ))}
                        </Suspense>
                    </div>
                </div>
            </section>

            {/* cabinet forcasion */}
            <section className="py-16 min-h-screen container mx-auto px-4 bg-gray-100">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <div className="flex justify-center items-center space-x-3 mb-2">
                            <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-[#B48322] to-transparent opacity-70"></div>
                            <h2 className="text-4xl md:text-6xl h-[80px] font-[900] bg-clip-text text-transparent bg-gradient-to-r from-[#000000] via-[#B48322] to-[#F2B233]">
                                Cabinet 2024/2025
                            </h2>
                            <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-[#B48322] to-transparent opacity-70"></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-7xl mx-auto">
                        <div className="w-full h-full flex justify-center">
                            <div className="relative group overflow-hidden rounded-full p-2 bg-gradient-to-r from-[#000000] via-[#B48322] to-[#F2B233] shadow-lg transform transition-all duration-500 hover:scale-105">
                                <Image
                                    src={Logo}
                                    alt="FORCASION"
                                    className="w-[80%] md:w-full max-w-[400px] object-contain rounded-full bg-white p-4"
                                />
                            </div>
                        </div>
                        <div className="text-left space-y-6 bg-white p-8 rounded-2xl shadow-lg border-l-4 border-[#B48322] transform transition-all duration-500 hover:shadow-xl hover:translate-y-[-5px]">
                            <h3 className="text-2xl font-bold text-[#000000]">FORCASION CABINET</h3>
                            <p className="text-lg text-transparent bg-clip-text bg-gradient-to-r from-[#000000] via-[#B48322] to-[#F2B233] font-semibold">
                                <span>"One Team, One Vision, One for Computing"</span>
                            </p>
                            <p className="text-lg text-[#1d1c20]">
                                We are attempting to be a bridge for the Computing Faculty in a more positive way by growing together with us.
                            </p>
                            <Link href="/cabinet/anagata">
                                <Button className="text-decoration-none mt-10 inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#000000] to-[#B48322] text-white rounded-full hover:from-[#B48322] hover:to-[#F2B233] hover:text-[#000000] transition-all duration-300 shadow-md">
                                    See our Cabinet
                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Computing Events Section */}
            <section className="py-16 container mx-auto px-4">
                <div className="text-center mb-12">
                    <div className="flex justify-center items-center space-x-3 mb-2">
                        <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-[#B48322] to-transparent opacity-70"></div>
                        <h2 className="text-4xl md:text-6xl h-[80px] font-[900] bg-clip-text text-transparent bg-gradient-to-r from-[#000000] via-[#B48322] to-[#F2B233]">
                            CS Events
                        </h2>
                        <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-[#B48322] to-transparent opacity-70"></div>
                    </div>
                    <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                        Discover the latest updates on events in our faculty.
                    </p>
                </div>
            
                <EventCards />
            
                <div className="text-center mt-8">
                    <Link 
                        href="/events"
                        className="inline-flex items-center justify-center px-6 py-3 bg-[#000000] text-white rounded-full hover:bg-[#B48322] transition-all duration-300 shadow-md"
                    >
                        See all Events
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </section>

            {/* Compreciation Section */}
            <section className="py-16 container mx-auto px-4 bg-gray-100 rounded-3xl my-8">
                <div className="text-center mb-12">
                    <div className="flex justify-center items-center space-x-3 mb-2">
                        <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-[#B48322] to-transparent opacity-70"></div>
                        <h2 className="text-4xl md:text-6xl h-[80px] font-[900] bg-clip-text text-transparent bg-gradient-to-r from-[#000000] via-[#B48322] to-[#F2B233]">
                            Compreciation
                        </h2>
                        <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-[#B48322] to-transparent opacity-70"></div>
                    </div>
                    <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                        Showcasing innovative projects and achievements from our talented Computing students.
                    </p>
                </div>
                <CompreciationCards />

                <div className="text-center mt-8">
                    <Link 
                        href="/comprecation"
                        className="inline-flex items-center justify-center px-6 py-3 border-2 border-[#B48322] text-[#000000] font-medium rounded-full hover:bg-[#B48322] hover:text-white transition-all duration-300 shadow-md"
                    >
                        See all Compreciations
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </section>

            {/* News Section */}
            <section className="py-16 container mx-auto px-4 bg-gradient-to-b ">
                <div className="text-center mb-12">
                    <div className="flex justify-center items-center space-x-3 mb-2">
                        <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-[#B48322] to-transparent opacity-70"></div>
                        <h2 className="text-4xl md:text-6xl h-[80px] font-[900] bg-clip-text text-transparent bg-gradient-to-r from-[#000000] via-[#B48322] to-[#F2B233]">
                            Latest Updates
                        </h2>
                        <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-[#B48322] to-transparent opacity-70"></div>
                    </div>
                    <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                        Stay informed with the latest news, announcements, and developments in Computing Faculty.
                    </p>
                </div>
                
                {news && news.length > 0 ? (
                    <div className="max-w-7xl mx-auto">
                        {/* Featured News - Top Row */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                            {/* Main Featured News */}
                            <div className="lg:col-span-1 transform transition-all duration-300 hover:scale-[1.02]">
                                <NewsCardBig news={news.slice(0, 1)} />
                            </div>
                            
                            {/* Secondary Featured News */}
                            <div className="lg:col-span-1 grid grid-cols-1 gap-6">
                                <div className="transform transition-all duration-300 hover:scale-[1.02]">
                                    <NewsCardBig news={news.slice(1, 2)} />
                                </div>
                            </div>
                        </div>
                        
                        {/* Regular News - Bottom Rows */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="space-y-6">
                                <NewsCard news={news.slice(2, 4)} />
                            </div>
                            <div className="space-y-6">
                                <NewsCard news={news.slice(4, 6)} />
                            </div>
                            <div className="space-y-6">
                                <NewsCard news={news.slice(6, 8)} />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center items-center h-64">
                        <CircularProgress />
                    </div>
                )}
                
                <div className="text-center mt-12">
                    <Link 
                        href="/news"
                        className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-[#000000] to-[#B48322] text-white rounded-full hover:from-[#B48322] hover:to-[#F2B233] hover:text-[#000000] transition-all duration-300 shadow-md"
                    >
                        See all News
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </section>

            {/* store */}
            <section className="py-16 container mx-auto px-4 bg-[#000000] text-white rounded-3xl my-8">
                <div className="container text-center mx-auto px-4">
                    <div className="text-center mb-12">
                        <div className="flex justify-center space-x-3 mb-2">
                            <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-[#F2B233] to-transparent opacity-70"></div>
                            <h2 className="text-4xl md:text-6xl h-[80px] font-[900] bg-clip-text text-transparent bg-gradient-to-r from-[#B48322] to-[#F2B233]">
                                Store
                            </h2>
                            <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-[#F2B233] to-transparent opacity-70"></div>
                        </div>
                    </div>
                    <p 
                        className="text-gray-300 mt-4 max-w-2xl mx-auto text-center"
                    >
                        Get your hands on exclusive Computer Science merchandise.
                    </p>

                    <Link 
                        href="/merch"
                        className="inline-flex items-center justify-center px-6 py-3 mt-8 bg-[#B48322] text-white rounded-full hover:bg-[#F2B233] hover:text-[#000000] transition-all duration-300 shadow-md"
                    >
                        See all merchandise
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 container mx-auto px-4 ">
                <div className="text-center mb-12">
                    <div className="flex justify-center items-center space-x-3 mb-2">
                        <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-[#B48322] to-transparent opacity-70"></div>
                        <h2 className="text-4xl md:text-6xl h-[80px] font-[900] bg-clip-text text-transparent bg-gradient-to-r from-[#000000] via-[#B48322] to-[#F2B233]">
                            FAQ
                        </h2>
                        <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-[#B48322] to-transparent opacity-70"></div>
                    </div>
                    <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                        Find answers to common questions about Computing Faculty programs, requirements, and opportunities.
                    </p>
                </div>
                <div className="max-w-3xl mx-auto space-y-4">
                    {FaqData.map((faq, index) => (
                        <Faq key={index} {...faq} />
                    ))}
                </div>
            </section>
            {/* end */}
        </div>
    );
}