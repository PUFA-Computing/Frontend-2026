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

    return (
        <div className="min-h-screen">
            {/* Header Section */}
            <section className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-800 to-purple-900 px-4 py-16 sm:px-6 md:px-8 lg:px-16">
                {/* Decorative elements */}
                <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-blue-500 opacity-10"></div>
                <div className="absolute -right-20 bottom-10 h-60 w-60 rounded-full bg-purple-500 opacity-10"></div>
                
                <div className="relative mx-auto max-w-7xl">
                    <div className="mb-6">
                        <Link 
                            href="/events" 
                            className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Events
                        </Link>
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <div className="mb-2 flex items-center">
                                <Link href="/events" className="text-indigo-200 hover:text-white hover:underline">
                                    CS Events
                                </Link>
                                <IoIosArrowForward className="mx-2 text-indigo-200" />
                                <span className="text-white">{event.organization}</span>
                            </div>
                            <h1 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                                {event.title}
                            </h1>
                        </div>
                        
                        <div className="rounded-full bg-amber-500 px-4 py-2 text-sm font-medium text-white">
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
                                        <MapPin className="mr-3 mt-0.5 h-5 w-5 text-indigo-600" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Location</p>
                                            <p className="text-sm text-gray-600">Faculty of Computing</p>
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
