import Script from "next/script";
import Image from "next/image";
import bghomepage from "@/assets/PUFA-2026.webp";
import Link from "next/link";
import Button from "@/components/Button";
import Faq from "@/components/main/Faq";
import StudyProgCard from "@/components/main/StudyProgCard";
import EventCards from "./_components/EventCards";
import { Suspense } from "react";
import { FaqData, StudyProgramData } from "@/lib/data";
import Logo from "@/assets/aurascendialogo.png";
import CompreciationCards from "./_components/CompreciationCards";
import { fetchNews } from "@/services/api/news";
import { CircularProgress } from "@/components/ui/CircularProgress";
import NewsCard from "@/components/news/NewsCard";
import NewsCardBig from "@/components/news/NewsCardBig";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/FadeIn";

export { metadata } from "./page.metadata";
export const revalidate = 300;

// Reusable section heading
function SectionHeading({ eyebrow, title, body }: { eyebrow: string; title: string; body?: string }) {
    return (
        <FadeIn direction="up">
            <div className="text-center mb-14">
                <p className="section-label mb-4">{eyebrow}</p>
                <h2 className="font-display italic text-4xl sm:text-5xl md:text-6xl text-[#0D1B3E] mb-4">{title}</h2>
                {/* Ornamental rule */}
                <div className="flex items-center justify-center gap-3 mb-5">
                    <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#B8841E]/40" />
                    <span className="text-[#B8841E]/50 text-xs">✦</span>
                    <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#B8841E]/40" />
                </div>
                {body && <p className="font-serif text-[#1A1A2E]/55 text-sm sm:text-base max-w-md mx-auto leading-relaxed">{body}</p>}
            </div>
        </FadeIn>
    );
}

export default async function Index() {
    const news = await fetchNews();

    return (
        <div className="min-h-screen bg-[#F5EDD0] text-[#1A1A2E]">

            {/* ══════════════════════════════════════════
                HERO — Dark navy overlay on image
            ══════════════════════════════════════════ */}
            <div className="relative min-h-[100svh] w-full overflow-hidden">
                <div className="absolute inset-0">
                    <Image src={bghomepage} alt="PUFA Background" fill sizes="100vw"
                        className="object-cover brightness-[0.20]" priority />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#080F22]/70 via-[#0D1B3E]/55 to-[#080F22]/85" />
                </div>

                {/* Corner ornaments */}
                <div className="absolute top-24 left-8 w-10 h-10 border-l border-t border-[#D9A84A]/30 hidden sm:block" />
                <div className="absolute top-24 right-8 w-10 h-10 border-r border-t border-[#D9A84A]/30 hidden sm:block" />

                <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center text-center px-4 sm:px-8">
                    {/* Eyebrow */}
                    <p className="font-serif text-xs tracking-[0.3em] uppercase text-[#D9A84A]/70 mb-8">
                        Aurascendia Cabinet — 2026
                    </p>

                    {/* Hero heading — Cormorant Garamond italic */}
                    <h1 className="font-display italic leading-none mb-3">
                        <span className="block text-6xl sm:text-8xl md:text-9xl text-[#EDD085] drop-shadow-[0_2px_20px_rgba(184,132,30,0.4)]">
                            PUFA
                        </span>
                        <span className="block text-4xl sm:text-6xl md:text-7xl text-[#F5EDD0]/80 mt-1">
                            Computer Science
                        </span>
                        <span className="block text-5xl sm:text-7xl md:text-8xl text-[#EDD085] drop-shadow-[0_2px_20px_rgba(184,132,30,0.4)]">
                            2026
                        </span>
                    </h1>

                    {/* Ruled ornament */}
                    <div className="flex items-center gap-4 w-full max-w-xs mx-auto my-7">
                        <div className="flex-1 h-px bg-[#D9A84A]/40" />
                        <span className="text-[#D9A84A]/50 text-xs">✦</span>
                        <div className="flex-1 h-px bg-[#D9A84A]/40" />
                    </div>

                    <p className="font-serif italic text-[#F5EDD0]/55 text-base sm:text-lg mb-10 max-w-lg mx-auto">
                        Be Strong, One Determination.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <Link href="/events">
                            <button className="font-serif px-8 py-3 text-sm tracking-wide border border-[#D9A84A] text-[#EDD085] bg-transparent transition-all duration-300 hover:bg-[#D9A84A]/15 hover:shadow-[0_4px_16px_rgba(184,132,30,0.25)]">
                                Explore Events
                            </button>
                        </Link>
                        <Link href="/cabinet/forcasion">
                            <button className="font-serif px-8 py-3 text-sm tracking-wide border border-[#F5EDD0]/25 text-[#F5EDD0]/70 bg-transparent transition-all duration-300 hover:border-[#F5EDD0]/50 hover:text-[#F5EDD0]/90">
                                Meet Our Cabinet
                            </button>
                        </Link>
                    </div>
                </div>

                <a href="#programs" className="absolute bottom-8 left-1/2 -translate-x-1/2 font-serif text-xs tracking-widest uppercase text-[#F5EDD0]/25 hidden sm:block hover:text-[#D9A84A]/60 transition-colors duration-250">
                    ↓ Scroll
                </a>
            </div>

            {/* ══════════════════════════════════════════
                STUDY PROGRAMS — cream light section
            ══════════════════════════════════════════ */}
            <section id="programs" className="py-24 sm:py-32 bg-[#FAF5E8]">
                <div className="container mx-auto px-6 max-w-5xl">
                    <SectionHeading
                        eyebrow="Academic Excellence"
                        title="Study Programs"
                        body="Two distinct programs designed to produce qualified graduates with deep computing expertise."
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 max-w-3xl mx-auto">
                        {StudyProgramData.map((prog, i) => (
                            <StudyProgCard key={i} {...prog} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                CABINET — parchment with navy accent
            ══════════════════════════════════════════ */}
            <section className="py-24 sm:py-32 bg-[#F5EDD0]">
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <SectionHeading eyebrow="Leadership" title="Cabinet 2026" />

                    <div className="flex flex-col items-center">
                        {/* Logo */}
                        <div className="relative animate-float mb-8 group">
                            <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-br from-[#B8841E] via-[#D9A84A] to-[#B8841E] blur-md opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-glow-pulse" />
                            <Image
                                src={Logo}
                                alt="Aurascendia"
                                className="relative w-36 sm:w-48 h-auto rounded-3xl border border-[#B8841E]/40 bg-[#0D1B3E] p-3 shadow-parch-lg"
                            />
                        </div>

                        {/* Info Center Aligned */}
                        <div className="flex flex-col items-center">
                            <h3 className="font-display text-4xl sm:text-5xl text-[#0D1B3E] mb-3">Aurascendia</h3>
                            <p className="font-display italic text-2xl text-[#B8841E] mb-6">&ldquo;Grow Together, Impact Further&rdquo;</p>

                            <div className="flex items-center justify-center gap-3 w-full mb-8">
                                <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#B8841E]/40" />
                                <span className="text-[#B8841E]/50 text-xs">✦</span>
                                <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#B8841E]/40" />
                            </div>

                            <p className="font-serif text-base sm:text-lg text-[#1A1A2E]/65 leading-relaxed mb-10 max-w-2xl text-balance">
                                Aurascendia — meaning <em>&ldquo;To rise with golden values.&rdquo;</em> — is a cabinet built on warmth, integrity, and purpose. We believe leadership driven by values will always rise and uplift those around it.
                            </p>

                            <Link href="/cabinet/forcasion">
                                <Button variant="primary" size="lg">Discover Our Teams</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                CS EVENTS — light parchment
            ══════════════════════════════════════════ */}
            <section className="py-24 sm:py-32 bg-[#FAF5E8]">
                <div className="container mx-auto px-6 max-w-6xl">
                    <SectionHeading
                        eyebrow="What's Happening"
                        title="CS Events"
                        body="Join workshops, competitions, and activities organized by our Faculty."
                    />
                    <div className="border border-[#B8841E]/15 rounded-sm bg-[#F5EDD0]/60 p-4 sm:p-6 shadow-parch-sm">
                        <EventCards />
                    </div>
                    <div className="text-center mt-10">
                        <Link href="/events">
                            <Button variant="outline">View All Events</Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                COMPRECIATION
            ══════════════════════════════════════════ */}
            <section className="py-24 sm:py-32 bg-[#F5EDD0]">
                <div className="container mx-auto px-6 max-w-6xl">
                    <SectionHeading
                        eyebrow="Student Showcase"
                        title="Compreciation"
                        body="Celebrating innovative projects and remarkable achievements from our talented students."
                    />
                    <div className="border border-[#B8841E]/15 rounded-sm bg-[#FAF5E8]/70 p-4 sm:p-6 shadow-parch-sm">
                        <CompreciationCards />
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                NEWS — cream card section
            ══════════════════════════════════════════ */}
            <section className="py-24 sm:py-32 bg-[#FAF5E8]">
                <div className="container mx-auto px-6 max-w-7xl">
                    <SectionHeading
                        eyebrow="Stay Informed"
                        title="Latest Updates"
                        body="News, announcements, and developments from the Computer Science Faculty."
                    />

                    {news && news.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 mb-5">
                                <div className="md:col-span-1 lg:col-span-7 border border-[#B8841E]/12 rounded-sm overflow-hidden shadow-parch-sm transition-shadow hover:shadow-parch-md">
                                    <NewsCardBig news={news.slice(0, 1)} />
                                </div>
                                <div className="md:col-span-1 lg:col-span-5 border border-[#B8841E]/12 rounded-sm overflow-hidden shadow-parch-sm transition-shadow hover:shadow-parch-md">
                                    <NewsCardBig news={news.slice(1, 2)} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {[news.slice(2, 3), news.slice(3, 4), news.slice(4, 5)].map((slice, i) => (
                                    <div key={i} className="border border-[#B8841E]/12 rounded-sm overflow-hidden shadow-parch-sm transition-all duration-300 hover:shadow-parch-md hover:-translate-y-0.5">
                                        <NewsCard news={slice} />
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="flex justify-center items-center h-56 border border-[#B8841E]/15 rounded-sm">
                            <CircularProgress />
                        </div>
                    )}

                    <div className="text-center mt-10">
                        <Link href="/news"><Button variant="outline">All News</Button></Link>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                CS STORE — navy band
            ══════════════════════════════════════════ */}
            <section className="py-24 sm:py-32 bg-[#0D1B3E] relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D9A84A]/40 to-transparent" />
                <div className="absolute bottom-0 right-0 w-72 h-48 bg-[#B8841E]/6 rounded-full blur-3xl" />

                <div className="relative container mx-auto px-6 max-w-4xl text-center">
                    <p className="section-label text-[#D9A84A]/60 mb-4">Merchandise</p>
                    <h2 className="font-display italic text-4xl sm:text-5xl md:text-6xl text-[#EDD085] mb-4">CS Store</h2>
                    <div className="flex items-center justify-center gap-3 mb-10">
                        <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#D9A84A]/40" />
                        <span className="text-[#D9A84A]/40 text-xs">✦</span>
                        <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#D9A84A]/40" />
                    </div>
                    <p className="font-serif text-[#F5EDD0]/45 max-w-md mx-auto text-sm sm:text-base leading-relaxed mb-10">
                        We&apos;re crafting exclusive PUFA Computing merchandise. Stay tuned for curated apparel and more.
                    </p>
                    <div className="inline-flex items-center gap-2 border border-[#D9A84A]/30 px-6 py-2.5 font-serif text-sm tracking-widest text-[#D9A84A]/60 uppercase">
                        Coming Soon
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                FAQ — cream, editorial accordion
            ══════════════════════════════════════════ */}
            <section className="py-24 sm:py-32 bg-[#F5EDD0]">
                <div className="container mx-auto px-6 max-w-2xl">
                    <SectionHeading
                        eyebrow="Questions"
                        title="F.A.Q."
                        body="Common questions about CS Faculty programs, requirements, and opportunities."
                    />
                    {/* Top rule */}
                    <div className="h-px bg-gradient-to-r from-[#B8841E]/30 to-transparent mb-1" />
                    <div className="divide-y-0">
                        {FaqData.map((faq, i) => <Faq key={i} {...faq} />)}
                    </div>
                    <div className="h-px bg-gradient-to-r from-[#B8841E]/30 to-transparent mt-1" />
                </div>
            </section>
        </div>
    );
}