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
        <div className="min-h-screen bg-gray-100 text-black">
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
                            <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-70"></div>
                            <h2 className="text-4xl md:text-6xl h-[80px] font-[900] text-[#1d1c20]">
                                Study Programs
                            </h2>
                            <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-70"></div>
                        </div>
                        <p className="text-[#1d1c20] dark:text-[#1d1c20] text-lg md:text-xl max-w-2xl mx-auto mt-10">
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
            <section className="py-16 min-h-screen container mx-auto px-4">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <div className="flex justify-center items-center space-x-3 mb-2">
                            <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-70"></div>
                            <h2 className="text-4xl md:text-6xl h-[80px] font-[900] text-[#1d1c20]">
                                Cabinet 2024/2025
                            </h2>
                            <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-70"></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-7xl mx-auto">
                        <div className="w-full h-full flex justify-center">
                            <Image
                                src={Logo}
                                alt="FORCASION"
                                className="w-[80%] md:w-full max-w-[400px] object-contain"
                            />
                        </div>
                        <div className="text-left space-y-6 bg-white dark:bg-neutral-100 p-8 rounded-2xl shadow-lg">
                            <h3 className="text-2xl font-bold text-[#1d1c20]">FORCASION CABINET</h3>
                            <p className="text-lg  text-transparent bg-clip-text bg-gradient-to-r from-[#1d1c20] via-[#FDB931] to-[#FDB931]">
                                <span>"One Team, One Vision, One for Computing"</span>
                            </p>
                            <p className=" text-lg text-[#1d1c20]">
                                We are attempting to be a bridge for the Computing Faculty in a more positive way by growing together with us.
                            </p>
                            <Link href="/cabinet/anagata">
                                <Button className="text-decoration-none mt-10 inline-flex items-center px-6 py-3 bg-black  text-white  rounded-full hover:bg-gray-200 hover:text-black transition-colors">
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
                        <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-70"></div>
                        <h2 className="text-4xl md:text-6xl h-[80px] font-[900] text-[#1d1c20]">
                            CS Events
                        </h2>
                        <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-70"></div>
                    </div>
                    <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                        Discover the latest updates on events in our faculty.
                    </p>
                </div>
            
                <EventCards />
            
                <div className="text-center mt-8">
                    <Link 
                        href="/events"
                        className="inline-flex items-center justify-center px-6 py-3  text-[#1d1c20] rounded-full  hover:text-[#FFD700] transition-all duration-300"
                    >
                        See all Events
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </section>

            {/* Compreciation Section */}
            <section className="py-16 container mx-auto px-4">
                <div className="text-center mb-12">
                    <div className="flex justify-center items-center space-x-3 mb-2">
                        <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-70"></div>
                        <h2 className="text-4xl md:text-6xl h-[80px] font-[900] text-[#1d1c20]">
                            Compreciation
                        </h2>
                        <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-70"></div>
                    </div>
                    <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                        Showcasing innovative projects and achievements from our talented Computing students.
                    </p>
                </div>
                <CompreciationCards />

                <div className="text-center mt-8">
                    <Link 
                        href="/comprecation"
                        className="inline-flex items-center justify-center px-6 py-3  text-[#1d1c20] rounded-full  hover:text-[#FFD700] transition-all duration-300"
                    >
                        See all Compreciations
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </section>

            {/* News Section */}
            <section className="py-16 container mx-auto px-4">
                <div className="text-center mb-12">
                    <div className="flex justify-center items-center space-x-3 mb-2">
                        <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-70"></div>
                        <h2 className="text-4xl md:text-6xl h-[80px] font-[900] text-[#1d1c20]">
                            Latest Updates
                        </h2>
                        <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-70"></div>
                    </div>
                    <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                        Stay informed with the latest news, announcements, and developments in Computing Faculty.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl gap-8 mx-auto px-auto ">
                    <div className="lg:col-span-1">
                        <NewsCardBig news={news} />
                        <NewsCard news={news} />
                    </div>
                    <div className="lg:col-span-1">
                    <NewsCardBig news={news} />
                        <NewsCard news={news} />
                    </div>
                    <div className="lg:col-span-1">
                    <NewsCardBig news={news} />
                        <NewsCard news={news} />
                    </div>

                </div>
                    <div className="text-center mt-8 mx-auto">
                    <Link 
                        href="/news"
                        className="inline-flex items-center justify-center px-6 py-3  text-[#1d1c20] rounded-full  hover:text-[#FFD700] transition-all duration-300"
                    >
                        See all News
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </section>

            {/* store */}
            <section className="py-16  container mx-auto px-4 ">
                <div className="container text-center mx-auto px-4">
                    <div className="text-center mb-12">
                        <div className="flex justify-center space-x-3 mb-2">
                            <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-70"></div>
                            <h2 className="text-4xl md:text-6xl h-[80px] font-[900] text-[#1d1c20]">
                                Store
                            </h2>
                            <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-70"></div>
                        </div>
                    </div>
                    <h1 
                        className="text-gray-600 mt-4 max-w-2xl mx-auto text-center"
                    >
                        Get your hands on exclusive Computer Science merchandise.
                    </h1>

                    <Link 
                        href="/merch"
                        className="inline-flex items-center justify-center px-6 py-3 mt-8 text-[#1d1c20] rounded-full  hover:text-[#FFD700] transition-all duration-300"
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
                        <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-70"></div>
                        <h2 className="text-4xl md:text-6xl h-[80px] font-[900] text-[#1d1c20]">
                            FAQ
                        </h2>
                        <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-70"></div>
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
    );}