import type { Metadata } from "next"
import { fetchEvents } from "@/services/api/event"
import EventCardPage from "@/components/event/EventCardPage"
import EventCardPageMobile from "@/components/event/EventCardMobile"
import PosterCardEventPage from "@/components/event/PosterCardEventPage"
import { Calendar, Database, Clock, ChevronLeft, ChevronRight, MapPin } from "lucide-react"
import OptimizedImage from "@/components/ui/OptimizedImage"
import Link from "next/link"

export const metadata: Metadata = {
  title: "PUFA Computing Events",
}
export const revalidate = 0
export const dynamic = "force-dynamic"

export default async function EventsPage() {
  const events = await fetchEvents()

  if (!events) return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="rounded-lg bg-white p-8 text-center shadow-lg">
        <div className="mb-4 text-amber-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="mb-2 text-xl font-bold">Unable to Load Events</h3>
        <p className="text-gray-600">We're having trouble fetching the events data. Please try again later.</p>
      </div>
    </div>
  )

  // Filter events related to PUFA Computing (using case-insensitive comparison)
  const pufaComputingEvents = events.filter((event) => {
    // Check for both "PUFA Computing" and "PUFA CS" formats and normalize case
    const org = event.organization?.toLowerCase() || "";
    return org === "pufa computing" || org === "pufa-computing" || org === "pufa cs" || org === "pufacs";
  })

  // Upcoming events (events that haven't ended yet)
  const now = new Date();
  const upcomingEvents = pufaComputingEvents
    .filter((event) => event.end_date > now)
    .sort((a, b) => a.start_date.getTime() - b.start_date.getTime())

  // All events sorted by date (most recent first)
  const allEvents = pufaComputingEvents
    .sort((a, b) => b.start_date.getTime() - a.start_date.getTime())

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      {/* Hero section with animated background */}
      <section className="relative overflow-hidden bg-gradient-to-r from-purple-700 to-indigo-900 py-16">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=400')] bg-repeat opacity-20"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-block rounded-lg bg-white/10 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
              <Clock className="mr-1 inline-block h-4 w-4" /> Latest Updates
            </div>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              PUFA CS Events
            </h1>
            <p className="mt-3 text-lg text-purple-100">
              Discover the latest updates on events in our faculty. Stay connected and never miss an opportunity.
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-white [clip-path:polygon(0_0,100%_100%,100%_100%,0%_100%)]"></div>
      </section>

      {/* Event highlights with improved card design */}
      <section className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center">
          <Database className="mr-3 h-6 w-6 text-purple-600" />
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Event Highlights</h2>
        </div>
        
        {/* Featured event card with improved design */}
        {upcomingEvents.length > 0 && upcomingEvents[0] ? (
          <div className="overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-3">
              {/* Image section - larger on desktop */}
              <div className="relative md:col-span-2 lg:col-span-1">
                <div className="aspect-[4/3] h-full w-full md:aspect-auto">
                  <OptimizedImage
                    src={upcomingEvents[0]?.thumbnail || "/placeholder.svg?height=600&width=800"}
                    alt={upcomingEvents[0]?.title || "Event image"}
                    width={800}
                    height={600}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    priority={true}
                    placeholder="blur"
                  />
                </div>
                <div className="absolute right-4 top-4">
                  <span className="rounded-full bg-purple-600 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                    {new Date() < upcomingEvents[0]?.start_date ? "Upcoming" : "Ongoing"}
                  </span>
                </div>
              </div>
              
              {/* Content section */}
              <div className="flex flex-col justify-between p-6 md:col-span-3 lg:col-span-2">
                <div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900 md:text-2xl">{upcomingEvents[0]?.title}</h3>
                  <p className="mb-4 text-sm text-gray-600 md:text-base">
                    {upcomingEvents[0]?.description && upcomingEvents[0].description.length > 180 
                      ? upcomingEvents[0].description.substring(0, 180) + "..." 
                      : upcomingEvents[0]?.description}
                  </p>
                </div>
                
                <div className="mt-4 space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="mr-2 h-4 w-4 text-purple-500" />
                    <span>
                      {upcomingEvents[0]?.start_date?.toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                      })}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="mr-2 h-4 w-4 text-purple-500" />
                    <span>{upcomingEvents[0]?.location || "TBA"}</span>
                  </div>
                  
                  {upcomingEvents[0]?.slug && (
                    <Link href={`/events/${upcomingEvents[0].slug}`} className="mt-4 inline-flex items-center rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700">
                      View Details
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl bg-white p-8 text-center shadow-md">
            <Calendar className="mx-auto mb-4 h-12 w-12 text-purple-200" />
            <h3 className="text-lg font-medium text-gray-700">No upcoming events</h3>
            <p className="mt-2 text-gray-500">Check back later for new PUFA CS events.</p>
          </div>
        )}
        
        {/* Mobile version - simplified card */}
        <div className="mt-6 block md:hidden">
          <EventCardPageMobile events={upcomingEvents.slice(1)} />
        </div>
      </section>

      {/* All events section with improved layout */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center">
            <Calendar className="mr-3 h-6 w-6 text-purple-600" />
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">All Events</h2>
          </div>

          {allEvents.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {allEvents.map((event) => (
                <Link key={event?.id} href={`/events/${event?.slug}`} className="group block h-full">
                  <div className="h-full overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <div className="relative">
                      <div className="aspect-[4/3] overflow-hidden">
                        <OptimizedImage
                          height={300}
                          width={400}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          src={event?.thumbnail || "/placeholder.svg?height=300&width=400"}
                          alt={event?.title || "Event image"}
                          performanceMode={true}
                        />
                      </div>
                      
                      <div className="absolute right-3 top-3">
                        <span className="rounded-full bg-purple-600 px-2 py-1 text-xs font-medium text-white shadow-md">
                          {new Date() < (event?.start_date || new Date()) ? "Upcoming" : 
                           (new Date() >= (event?.start_date || new Date()) && new Date() <= (event?.end_date || new Date())) ? "Ongoing" : "Ended"}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="mb-2 text-lg font-bold text-gray-900 group-hover:text-purple-600">{event?.title}</h3>
                      <div className="mb-2 flex items-center text-sm text-gray-600">
                        <Calendar className="mr-1 h-4 w-4 text-purple-500" />
                        <span>
                          {event?.start_date?.toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          }) || "Date not available"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {event?.description && event.description.length > 80 
                          ? event.description.substring(0, 80) + "..." 
                          : event?.description || "No description available"}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 py-16 text-center">
              <Calendar className="mb-4 h-12 w-12 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900">No Events Available</h3>
              <p className="mt-1 text-sm text-gray-500">There are currently no upcoming events available. Please check back later.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
