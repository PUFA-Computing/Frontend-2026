import { redirect } from "next/navigation";
import React from "react";
import { fetchEventBySlug } from "@/services/api/event";
import Image from "next/image";
import Link from "next/link";
import { IoIosArrowForward } from "react-icons/io";
import Seperator from "@/components/Seperator";
import RegisterButton from "./_components/RegisterButton";
import ShareButton from "./_components/ShareButton";
import { Calendar, MapPin, Users, Clock, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

// Generate dynamic metadata for each event page
export async function generateMetadata(
    { params }: { params: { slug: string } }
): Promise<Metadata> {
    // Fetch event data
    const event = await fetchEventBySlug(params.slug);
    
    if (!event) {
        return {
            title: "Event Not Found",
            description: "The requested event could not be found."
        };
    }
    
    // Format date for description
    const formattedStartDate = event.start_date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
    
    return {
        title: event.title,
        description: `${event.title} - ${event.organization} event on ${formattedStartDate}. ${event.description.substring(0, 155)}...`,
        alternates: {
            canonical: `/events/${event.slug}`,
        },
        openGraph: {
            title: event.title,
            description: `${event.organization} presents ${event.title} on ${formattedStartDate}`,
            type: "website", // Changed from "event" to "website" as per OpenGraph specs
            url: `https://compsci.president.ac.id/events/${event.slug}`,
            images: [
                {
                    url: event.thumbnail,
                    width: 800,
                    height: 600,
                    alt: event.title
                }
            ],
        }
    };
}

const description = (description: string) => {
    const lines = description.split("\n");
    return lines.map((line, index) => (
        <React.Fragment key={index}>
            {line}
            {index !== lines.length - 1 && <br />}
        </React.Fragment>
    ));
};

interface EventPageProps {
    params: { slug: string };
}

export default async function EventDetailsPage({ params }: EventPageProps) {
    if (!params.slug || params.slug.length < 1) {
        return redirect("/404");
    }
    const event = await fetchEventBySlug(params.slug);

    if (!event) {
        return redirect("/404");
    }

    const registrationPercentage =
        (event.total_registered / event.max_registration) * 100;

    let registrationColor = "text-green-500";
    if (registrationPercentage >= 80) {
        registrationColor = "text-red-500";
    } else if (registrationPercentage >= 50) {
        registrationColor = "text-yellow-500";
    }

    // Format dates for schema markup
    const formattedStartDate = event.start_date.toISOString();
    const formattedEndDate = event.end_date.toISOString();
    
    // Schema.org Event markup for structured data
    const eventSchema = {
        "@context": "https://schema.org",
        "@type": "Event",
        "name": event.title,
        "startDate": formattedStartDate,
        "endDate": formattedEndDate,
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "eventStatus": "https://schema.org/EventScheduled",
        "location": {
            "@type": "Place",
            "name": "Faculty of Computing, President University",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "Cikarang",
                "addressRegion": "West Java",
                "addressCountry": "Indonesia"
            }
        },
        "image": event.thumbnail,
        "description": event.description,
        "organizer": {
            "@type": "Organization",
            "name": event.organization,
            "url": "https://compsci.president.ac.id"
        },
        "offers": {
            "@type": "Offer",
            "availability": event.total_registered < event.max_registration ? 
                "https://schema.org/InStock" : 
                "https://schema.org/SoldOut",
            "priceCurrency": "IDR",
            "price": 0,
            "validFrom": formattedStartDate
        }
    };
    
    return (
        <div className="min-h-screen">
            {/* Add Schema.org JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
            />
            {/* Header Section */}
            <section className="relative w-full flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden bg-[#F5EDD0]">
                <div className="absolute inset-0 bg-gradient-to-b from-[#EDE0BB]/80 to-[#F5EDD0]" />
                
                {/* Top corner ornaments */}
                <div className="absolute top-28 left-8 w-12 h-12 border-l border-t border-[#B8841E]/40 hidden md:block" />
                <div className="absolute top-28 right-8 w-12 h-12 border-r border-t border-[#B8841E]/40 hidden md:block" />
                
                <div className="relative container mx-auto px-6 max-w-7xl z-10 flex flex-col items-center text-center">
                    <div className="mb-6">
                        <Link 
                            href="/events" 
                            className="inline-flex items-center rounded-none border border-[#B8841E]/30 bg-[#FAF5E8]/60 px-4 py-2 text-sm font-serif font-medium text-[#0D1B3E] transition-all hover:bg-[#B8841E]/10"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Events
                        </Link>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center gap-4">
                        <div className="mb-2 flex items-center font-serif text-[#B8841E]/80 text-sm">
                            <Link href="/events" className="hover:text-[#B8841E] hover:underline">
                                CS Events
                            </Link>
                            <span className="mx-2">✦</span>
                            <span className="text-[#0D1B3E] font-medium">{event.organization}</span>
                        </div>
                        <h1 className="text-4xl font-display italic text-[#0D1B3E] md:text-5xl lg:text-6xl text-balance max-w-4xl leading-tight">
                            {event.title}
                        </h1>
                        
                        <div className="mt-4 border border-[#0D1B3E] bg-[#0D1B3E] px-6 py-1.5 text-xs font-serif font-medium text-[#F5EDD0] tracking-[0.2em] uppercase shadow-parch-sm">
                            {event.status}
                        </div>
                    </div>
                </div>
            </section>

            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:px-8">
                <div className="grid gap-8 md:grid-cols-3 lg:gap-12">
                    {/* Left Column - Event Image */}
                    <div className="md:col-span-1">
                        <div className="sticky top-8 space-y-6">
                            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                                <div className="relative aspect-[3/4] w-full overflow-hidden">
                                    <Image
                                        alt={`${event.title}'s poster`}
                                        layout="fill"
                                        objectFit="cover"
                                        className="transition-transform duration-500 hover:scale-105"
                                        src={`${event.thumbnail}?t=${new Date().getTime()}`}
                                        unoptimized={true} // Disable Next.js image optimization to prevent caching
                                    />
                                </div>
                            </div>
                            
                            {/* Event Meta Information */}
                            <div className="rounded-xl bg-white p-6 shadow-lg">
                                <h3 className="mb-4 text-lg font-semibold text-gray-900">Event Details</h3>
                                
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <Calendar className="mr-3 mt-0.5 h-5 w-5 text-indigo-600" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Date</p>
                                            <p className="text-sm text-gray-600">
                                                {`${event.start_date.toLocaleDateString("id-ID", {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                })} - ${event.end_date.toLocaleDateString("id-ID", {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                })}`}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start">
                                        <Users className="mr-3 mt-0.5 h-5 w-5 text-indigo-600" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Organizer</p>
                                            <p className="text-sm text-gray-600">{event.organization}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start">
                                        <Clock className="mr-3 mt-0.5 h-5 w-5 text-indigo-600" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Registration</p>
                                            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                                                <div 
                                                    className={`h-full ${registrationPercentage >= 80 ? 'bg-red-500' : registrationPercentage >= 50 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                                    style={{ width: `${Math.min(registrationPercentage, 100)}%` }}
                                                ></div>
                                            </div>
                                            <p className="mt-1 text-sm text-gray-600">
                                                <span className={registrationColor}>{event.total_registered}</span>
                                                <span> / {event.max_registration} participants</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-6">
                                    <ShareButton title={event.title} />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Right Column - Event Details */}
                    <div className="md:col-span-2">
                        <div className="space-y-8">
                            {/* Event Description */}
                            <div className="rounded-xl bg-white p-6 shadow-lg md:p-8">
                                <h2 className="mb-6 text-2xl font-bold text-gray-900">About This Event</h2>
                                <div className="prose max-w-none text-gray-700">
                                    <div className="whitespace-pre-line">
                                        {description(event.description)}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Registration Section */}
                            <div className="rounded-xl bg-white p-6 shadow-lg md:p-8">
                                <h2 className="mb-6 text-2xl font-bold text-gray-900">Registration</h2>
                                <RegisterButton
                                    eventSlug={event.slug}
                                    eventId={event.id}
                                    eventTitle={event.title}
                                    eventStatus={event.status}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
