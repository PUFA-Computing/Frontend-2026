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
            <div className="relative min-h-[100svh] w-full overflow-hidden">
                {/* Background Image with Modern Overlay */}
                <div className="absolute inset-0">
                    <Image
                        src={bghomepage}
                        alt="PUFA Background"
                        fill
                        sizes="100vw"
                        className="object-cover brightness-[0.4] filter"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
                </div>
                
                {/* Content Overlay with Modern Design - Improved for all devices */}
                <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center text-white px-4 sm:px-6 md:px-8">
                    <div className="relative w-full max-w-[90vw] sm:max-w-[85vw] md:max-w-[80vw] lg:max-w-[70vw]">
                        {/* Decorative elements */}
                        <div className="absolute -top-4 sm:-top-6 md:-top-8 left-1/2 transform -translate-x-1/2 w-16 sm:w-20 md:w-24 h-1 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-70"></div>
                        
                        <h1 className="mb-2 sm:mb-3 font-hero text-center text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#FFD700] via-white to-[#FFD700] drop-shadow-[0_2px_10px_rgba(255,215,0,0.3)]">
                            <span className="block">PUFA</span>
                            <span className="block">CompSci 25.</span>
                        </h1>
                        
                        <p className="text-center text-sm sm:text-base md:text-lg lg:text-xl font-medium tracking-wide text-[#FFD700]/90 drop-shadow-[0_2px_6px_rgba(255,215,0,0.2)]">
                            Be Strong, One Determination.
                        </p>
                        
                        {/* Decorative elements */}
                        <div className="absolute -bottom-4 sm:-bottom-6 md:-bottom-8 left-1/2 transform -translate-x-1/2 w-16 sm:w-20 md:w-24 h-1 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-70"></div>
                    </div>

                    <div className="mt-8 sm:mt-10 md:mt-12 w-full max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl">
                        <p className="text-center text-xs sm:text-sm md:text-base leading-relaxed text-white/90 backdrop-blur-sm bg-white/5 border border-white/10 p-3 sm:p-4 md:p-5 rounded-xl shadow-xl">
                            PUFA Computer Science is a dynamic organization within President University, serving as a platform for students pursuing various computing-related fields like Information Technology and Information Systems.
                        </p>
                    </div>
                    
                    {/* Scroll indicator - Hidden on very small screens */}
                    <a href="#programs" className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-auto transform -translate-x-1/2 flex-col items-center animate-bounce hidden sm:flex">
                        <span className="text-xs text-white/70 mb-1 sm:mb-2">Scroll Down</span>
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </a>
                </div>
            </div>
            
            {/* Study Programs Section */}
            <section id="programs" className="py-16 sm:py-20 md:py-24 container mx-auto px-4 bg-gradient-to-b from-white to-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12 sm:mb-16 md:mb-20">
                        <h2 className="font-hero text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#000000] via-[#B48322] to-[#F2B233]">
                            Study Programs
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-[#B48322] to-[#F2B233] mx-auto mb-6"></div>
                        <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-xl mx-auto">
                            The Faculty of Computer Science offers 2 distinct study programs, each designed to produce qualified graduates ready to excel in their respective fields.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:gap-10 place-items-center md:grid-cols-2 lg:grid-cols-2 w-full max-w-6xl mx-auto">
                        <Suspense fallback={
                            <div className="flex justify-center items-center h-64 w-full">
                                <CircularProgress />
                            </div>
                        }>
                            {StudyProgramData.map((StudyProgram, index) => (
                                <div 
                                    key={index}
                                    className="w-full max-w-[400px] transform transition-all duration-500 hover:scale-[1.02] hover:shadow-xl"
                                >
                                    <StudyProgCard {...StudyProgram} />
                                </div>
                            ))}
                        </Suspense>
                    </div>
                </div>
            </section>

            {/* Cabinet Section */}
            <section className="py-20 sm:py-24 md:py-28 container mx-auto px-4 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
                <div className="container mx-auto px-4 relative">
                    {/* Background decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#F2B233]/5 rounded-full blur-3xl -z-10"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#B48322]/5 rounded-full blur-3xl -z-10"></div>
                    
                    <div className="text-center mb-16">
                        <h2 className="font-hero text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#000000] via-[#B48322] to-[#F2B233]">
                            Cabinet 2024/2025
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-[#B48322] to-[#F2B233] mx-auto mb-6"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center max-w-6xl mx-auto">
                        <div className="md:col-span-5 w-full flex justify-center">
                            <div className="relative group">
                                {/* Decorative ring */}
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#000000] via-[#B48322] to-[#F2B233] blur-md opacity-70 scale-110 group-hover:scale-125 transition-all duration-700"></div>
                                
                                <div className="relative overflow-hidden rounded-full p-1.5 bg-gradient-to-r from-[#000000] via-[#B48322] to-[#F2B233] shadow-xl transform transition-all duration-500 group-hover:scale-105 z-10">
                                    <div className="bg-white rounded-full p-4 overflow-hidden">
                                        <Image
                                            src={Logo}
                                            alt="FORCASION"
                                            className="w-full max-w-[350px] object-contain rounded-full"
                                        />
                                    </div>
                                </div>
                                
                                {/* Animated particles */}
                                <div className="absolute top-0 left-1/4 w-2 h-2 rounded-full bg-[#F2B233] animate-ping delay-300 opacity-75"></div>
                                <div className="absolute bottom-1/4 right-0 w-3 h-3 rounded-full bg-[#B48322] animate-ping delay-700 opacity-75"></div>
                            </div>
                        </div>
                        
                        <div className="md:col-span-7 flex flex-col space-y-8">
                            <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl border-l-4 border-[#B48322] transform transition-all duration-500 hover:shadow-2xl hover:translate-y-[-5px]">
                                <h3 className="text-2xl sm:text-3xl font-bold text-[#000000] mb-4">FORCASION CABINET</h3>
                                <p className="text-xl sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-[#000000] via-[#B48322] to-[#F2B233] font-semibold mb-6">
                                    <span>"One Team, One Vision, One for Computer Science"</span>
                                </p>
                                <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-8">
                                    We are committed to being a positive bridge for the Computer Science Faculty, fostering growth and collaboration within our community. Our cabinet works tirelessly to create opportunities for students to develop their skills and build meaningful connections.
                                </p>
                                <Link href="/cabinet/anagata">
                                    <Button className="w-full sm:w-auto text-decoration-none inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#000000] to-[#B48322] text-white rounded-xl hover:from-[#B48322] hover:to-[#F2B233] hover:text-[#000000] transition-all duration-300 shadow-lg hover:shadow-xl text-base sm:text-lg font-medium">
                                        Meet Our Cabinet
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7-7 7" />
                                        </svg>
                                    </Button>
                                </Link>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </section>

            {/* Computing Events Section - Improved responsiveness */}
            <section className="py-12 sm:py-16 md:py-20 lg:py-24 container mx-auto px-4 relative overflow-hidden">
                {/* Background decorative elements - Adjusted for better mobile appearance */}
                <div className="absolute top-0 right-0 w-48 sm:w-56 md:w-64 lg:w-72 h-48 sm:h-56 md:h-64 lg:h-72 bg-[#F2B233]/5 rounded-full blur-3xl -z-10"></div>
                <div className="absolute bottom-0 left-0 w-56 sm:w-64 md:w-80 lg:w-96 h-56 sm:h-64 md:h-80 lg:h-96 bg-[#B48322]/5 rounded-full blur-3xl -z-10"></div>
                
                <div className="container mx-auto px-2 sm:px-4 relative">
                    <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16">
                        <span className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 bg-[#B48322]/10 text-[#B48322] text-xs sm:text-sm font-medium rounded-full mb-3 sm:mb-4">What's Happening</span>
                        <h2 className="font-hero text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#000000] via-[#B48322] to-[#F2B233]">
                            CS Events
                        </h2>
                        <div className="w-16 sm:w-20 md:w-24 h-1 bg-gradient-to-r from-[#B48322] to-[#F2B233] mx-auto mb-4 sm:mb-6"></div>
                        <p className="text-gray-600 max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-xl mx-auto text-xs sm:text-sm md:text-base lg:text-lg">
                            Join us for exciting events, workshops, and activities organized by the our Faculty.
                        </p>
                    </div>
                    
                    <div className="relative">
                        {/* Decorative elements - Hidden on small screens */}
                        <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 bg-[#F2B233]/20 rounded-full blur-md hidden sm:block"></div>
                        <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 bg-[#B48322]/20 rounded-full blur-md hidden sm:block"></div>
                        
                        <div className="bg-white/50 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 shadow-lg sm:shadow-xl border border-gray-100">
                            <EventCards />
                        </div>
                    </div>
                    
                    <div className="text-center mt-8 sm:mt-10 md:mt-12">
                        <Link 
                            href="/events"
                            className="group inline-flex items-center justify-center gap-1 sm:gap-2 px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-gradient-to-r from-[#000000] to-[#B48322] text-white text-sm sm:text-base font-medium rounded-lg sm:rounded-xl hover:from-[#B48322] hover:to-[#000000] transition-all duration-300 shadow-md sm:shadow-lg hover:shadow-xl"
                        >
                            Explore All Events
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Compreciation Section - Improved for all devices */}
            <section className="py-12 sm:py-16 md:py-20 lg:py-24 container mx-auto px-4 my-8 sm:my-10 md:my-12 lg:my-16 relative overflow-hidden">
                {/* Background with modern gradient - Adjusted for better mobile appearance */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-[#F2B233]/5 rounded-xl sm:rounded-2xl md:rounded-3xl -z-10"></div>
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay rounded-xl sm:rounded-2xl md:rounded-3xl -z-10"></div>
                
                {/* Decorative elements - Responsive positioning and sizing */}
                <div className="absolute top-10 sm:top-16 md:top-20 right-5 sm:right-10 md:right-20 w-32 sm:w-48 md:w-56 lg:w-64 h-32 sm:h-48 md:h-56 lg:h-64 bg-[#B48322]/5 rounded-full blur-3xl -z-5"></div>
                <div className="absolute bottom-10 sm:bottom-16 md:bottom-20 left-5 sm:left-10 md:left-20 w-40 sm:w-56 md:w-64 lg:w-72 h-40 sm:h-56 md:h-64 lg:h-72 bg-[#F2B233]/5 rounded-full blur-3xl -z-5"></div>
                
                <div className="container mx-auto px-2 sm:px-4 relative">
                    <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16">
                        <span className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 bg-[#B48322]/10 text-[#B48322] text-xs sm:text-sm font-medium rounded-full mb-3 sm:mb-4">Student Showcase</span>
                        <h2 className="font-hero text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#000000] via-[#B48322] to-[#F2B233]">
                            Compreciation
                        </h2>
                        <div className="w-16 sm:w-20 md:w-24 h-1 bg-gradient-to-r from-[#B48322] to-[#F2B233] mx-auto mb-4 sm:mb-6"></div>
                        <p className="text-gray-600 max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-xl mx-auto text-xs sm:text-sm md:text-base lg:text-lg">
                            Celebrating the innovative projects and remarkable achievements from our talented CS students.
                        </p>
                    </div>
                    
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 shadow-lg sm:shadow-xl border border-gray-100/50">
                        <CompreciationCards />
                    </div>

                    
                </div>
            </section>

            {/* News Section - Improved for all devices */}
            <section className="py-12 sm:py-16 md:py-20 lg:py-24 container mx-auto px-4 relative overflow-hidden">
                {/* Background decorative elements - Responsive sizing */}
                <div className="absolute top-0 left-0 w-40 sm:w-56 md:w-64 lg:w-80 h-40 sm:h-56 md:h-64 lg:h-80 bg-[#F2B233]/5 rounded-full blur-3xl -z-10"></div>
                <div className="absolute bottom-0 right-0 w-48 sm:w-64 md:w-80 lg:w-96 h-48 sm:h-64 md:h-80 lg:h-96 bg-[#B48322]/5 rounded-full blur-3xl -z-10"></div>
                
                <div className="container mx-auto px-2 sm:px-4 relative">
                    <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16">
                        <span className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 bg-[#B48322]/10 text-[#B48322] text-xs sm:text-sm font-medium rounded-full mb-3 sm:mb-4">Stay Informed</span>
                        <h2 className="font-hero text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#000000] via-[#B48322] to-[#F2B233]">
                            Latest Updates
                        </h2>
                        <div className="w-16 sm:w-20 md:w-24 h-1 bg-gradient-to-r from-[#B48322] to-[#F2B233] mx-auto mb-4 sm:mb-6"></div>
                        <p className="text-gray-600 max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-xl mx-auto text-xs sm:text-sm md:text-base lg:text-lg">
                            Stay informed with the latest news, announcements, and developments in the Computer Science Faculty.
                        </p>
                    </div>
                    
                    {news && news.length > 0 ? (
                        <div className="max-w-7xl mx-auto">
                            {/* Featured News - Top Row - Improved responsive grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12 md:mb-16">
                                {/* Main Featured News */}
                                <div className="md:col-span-1 lg:col-span-7 transform transition-all duration-500 hover:scale-[1.01] sm:hover:scale-[1.02] hover:shadow-lg sm:hover:shadow-xl md:hover:shadow-2xl rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden">
                                    <div className="bg-white shadow-md sm:shadow-lg md:shadow-xl rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden">
                                        <NewsCardBig news={news.slice(0, 1)} />
                                    </div>
                                </div>
                                
                                {/* Secondary Featured News */}
                                <div className="md:col-span-1 lg:col-span-5 grid grid-cols-1 gap-4 sm:gap-6 md:gap-8">
                                    <div className="transform transition-all duration-500 hover:scale-[1.01] sm:hover:scale-[1.02] hover:shadow-lg sm:hover:shadow-xl md:hover:shadow-2xl rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden">
                                        <div className="bg-white shadow-md sm:shadow-lg md:shadow-xl rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden">
                                            <NewsCardBig news={news.slice(1, 2)} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Regular News - Grid layout with consistent heights */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                                <div>
                                    <NewsCard news={news.slice(2, 3)} />
                                </div>
                                <div>
                                    <NewsCard news={news.slice(3, 4)} />
                                </div>
                                <div className="sm:col-span-2 lg:col-span-1">
                                    <NewsCard news={news.slice(4, 5)} />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center items-center h-40 sm:h-48 md:h-56 lg:h-64 bg-white/50 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg sm:shadow-xl">
                            <CircularProgress />
                        </div>
                    )}
                    
                    <div className="text-center mt-8 sm:mt-12 md:mt-16">
                        <Link 
                            href="/news"
                            className="group inline-flex items-center justify-center gap-1 sm:gap-2 px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-gradient-to-r from-[#000000] to-[#B48322] text-white text-sm sm:text-base font-medium rounded-lg sm:rounded-xl hover:from-[#B48322] hover:to-[#000000] transition-all duration-300 shadow-md sm:shadow-lg hover:shadow-xl"
                        >
                            View All News
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Store Section */}
            <section className="py-20 sm:py-24 md:py-28 container mx-auto px-4 my-8 sm:my-12 md:my-16 relative overflow-hidden">
                {/* Background with modern gradient and glass effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#000000] via-[#1A1A1A] to-[#2C1D0A] rounded-3xl -z-10"></div>
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay rounded-3xl -z-10"></div>
                
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#F2B233]/10 rounded-full blur-3xl -z-5"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#B48322]/10 rounded-full blur-3xl -z-5"></div>
                
                <div className="container mx-auto px-4 relative">
                    <div className="text-center mb-12 sm:mb-16">
                        <span className="inline-block px-4 py-1.5 bg-[#F2B233]/20 text-[#F2B233] text-xs sm:text-sm font-medium rounded-full mb-4">Merchandise</span>
                        <h2 className="font-hero text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#B48322] to-[#F2B233]">
                            CS Store
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-[#B48322] to-[#F2B233] mx-auto mb-6"></div>
                        <p className="text-gray-600 max-w-xl mx-auto text-center text-sm sm:text-base md:text-lg">
                            Get your hands on exclusive Computer Science merchandise, designed with pride for our community.
                        </p>
                    </div>
                    
                    {/* Coming Soon Message */}
                    <div className="flex flex-col items-center justify-center py-16 px-4 max-w-4xl mx-auto mb-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden shadow-xl">
                        <div className="w-24 h-24 bg-gradient-to-br from-[#B48322] to-[#F2B233] rounded-full flex items-center justify-center mb-8 animate-pulse">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        
                        <h3 className="text-2xl md:text-3xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#B48322] to-[#F2B233]">
                            Merchandise Coming Soon!
                        </h3>
                        
                        <p className="text-gray-600 text-center max-w-md mb-8">
                            We're designing awesome PUFA Comp Sci merchandise for our community. Stay tuned for exclusive t-shirts, hoodies, and more!
                        </p>
                        
                        <div className="flex space-x-2 justify-center">
                            <div className="w-3 h-3 rounded-full bg-[#B48322] animate-bounce"></div>
                            <div className="w-3 h-3 rounded-full bg-[#D49C28] animate-bounce delay-75"></div>
                            <div className="w-3 h-3 rounded-full bg-[#F2B233] animate-bounce delay-150"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 sm:py-24 md:py-28 container mx-auto px-4 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute top-20 right-10 w-64 h-64 bg-[#F2B233]/5 rounded-full blur-3xl -z-10"></div>
                <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#B48322]/5 rounded-full blur-3xl -z-10"></div>
                
                <div className="container mx-auto px-4 relative">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1.5 bg-[#B48322]/10 text-[#B48322] text-xs sm:text-sm font-medium rounded-full mb-4">Got Questions?</span>
                        <h2 className="font-hero text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#000000] via-[#B48322] to-[#F2B233]">
                            Frequently Asked Questions
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-[#B48322] to-[#F2B233] mx-auto mb-6"></div>
                        <p className="text-gray-600 max-w-xl mx-auto text-sm sm:text-base md:text-lg">
                            Find answers to common questions about CS Faculty programs, requirements, and opportunities.
                        </p>
                    </div>
                    
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 space-y-6 sm:space-y-8">
                            {FaqData.map((faq, index) => (
                                <div key={index} className="border-b border-gray-100 pb-6 sm:pb-8 last:border-0 last:pb-0">
                                    <Faq {...faq} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            {/* end */}
        </div>
    );
}