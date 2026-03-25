import EventCard from "@/components/event/EventCardPage"
import { fetchEvents } from "@/services/api/event"
import OrganizationLogo from "@/components/event/LogoOrganizationEventPage"
import type { Metadata } from "next"
import { CalendarDays, Clock, Sparkles, Calendar, MapPin, Users, ChevronRight, Search } from "lucide-react"
import Link from "next/link"
import EventsFilter from "@/components/event/EventsFilter"

export const metadata: Metadata = {
  title: "Events | Computer Science",
}
export const revalidate = 300; // 5 minutes
// Removed dynamic = "force-dynamic" to enable ISR caching

export default async function EventsPage() {
  let events;
  try {
    events = await fetchEvents()
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="rounded-lg bg-white p-8 text-center shadow-lg">
          <div className="mb-4 text-amber-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="mb-2 text-xl font-bold">Unable to Load Events</h3>
          <p className="text-gray-600">We're having trouble connecting to the server. Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!events || events.length === 0) return (
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

  const today: Date = new Date()

  // Sort all events by start date (newest first for better UX)
  const sortedEvents = [...events].sort((a, b) =>
    b.start_date.getTime() - a.start_date.getTime()
  )

  // Get upcoming events (first 3)
  const upcomingEvents = sortedEvents
    .filter((event) => event.end_date.getTime() >= today.getTime())
    .slice(0, 3)

  // Get all events for timeline, sorted chronologically (newest first)
  const allEvents = [...events].sort((a, b) =>
    b.start_date.getTime() - a.start_date.getTime()
  )

  const truncateDescription = (description: string, length: number = 100) => {
    if (description.length > length) {
      return `${description.substring(0, length)}...`
    }
    return description
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden bg-[#F5EDD0]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#EDE0BB]/80 to-[#F5EDD0]" />
        
        {/* Top corner ornaments */}
        <div className="absolute top-28 left-8 w-12 h-12 border-l border-t border-[#B8841E]/40 hidden md:block" />
        <div className="absolute top-28 right-8 w-12 h-12 border-r border-t border-[#B8841E]/40 hidden md:block" />

        <div className="relative container mx-auto px-6 flex flex-col items-center text-center max-w-4xl z-10">
          <div className="mb-6 inline-block border border-[#B8841E]/30 bg-[#FAF5E8]/60 px-4 py-1.5 shadow-parch-sm">
            <p className="font-serif text-xs tracking-[0.2em] font-medium text-[#B8841E] uppercase">Faculty of Computing</p>
          </div>
          <h1 className="font-display italic text-6xl sm:text-7xl md:text-8xl text-[#0D1B3E] mb-6 leading-[0.9]">
            Our <span className="text-[#B8841E]">Events</span>
          </h1>
          
          {/* Ornamental rule */}
          <div className="flex items-center justify-center gap-3 w-full mb-6">
              <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#B8841E]/40" />
              <span className="text-[#B8841E]/50 text-xs">✦</span>
              <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#B8841E]/40" />
          </div>
          
          <p className="font-serif text-lg text-[#1A1A2E]/65 max-w-2xl text-balance mb-8">
            Join us for exciting workshops, competitions, and gatherings throughout the academic year.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="#upcoming" className="font-serif px-8 py-3 text-sm tracking-wide border border-[#0D1B3E] text-[#F5EDD0] bg-[#0D1B3E] transition-all duration-300 hover:bg-[#0D1B3E]/90 hover:shadow-parch-lg">
              Explore Events
            </Link>
            <Link href="#categories" className="font-serif px-8 py-3 text-sm tracking-wide border border-[#B8841E]/40 text-[#0D1B3E] bg-transparent transition-all duration-300 hover:border-[#B8841E] hover:bg-[#B8841E]/5">
              View Categories
            </Link>
          </div>
        </div>
      </section>

      {/* Event Highlights */}
      <section id="upcoming" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:px-8 lg:px-10">
        <div className="mb-8 flex items-center">
          <div className="mr-4 rounded-full bg-amber-100 p-2">
            <Sparkles className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Upcoming Events</h2>
            <p className="text-gray-600">Don't miss out on these exciting opportunities</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => (
              <EventCard
                key={event.id}
                event={{
                  ...event,
                  description: truncateDescription(event.description),
                }}
              />
            ))
          ) : (
            <div className="col-span-full rounded-xl bg-white p-8 text-center shadow-md">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                <Calendar className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-800">No Upcoming Events</h3>
              <p className="text-gray-600">
                There are currently no upcoming events available. Please check back later.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Event Categories */}
      <section id="categories" className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <div className="mb-10 flex items-center">
            <div className="mr-4 rounded-full bg-indigo-100 p-2">
              <CalendarDays className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Event Categories</h2>
              <p className="text-gray-600">Browse events by organization</p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-xl">
            {/* Decorative elements */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-100 opacity-50"></div>
            <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-amber-100 opacity-50"></div>

            <div className="relative grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              <OrganizationLogo
                image="/logo/PUFA_Computing.png"
                title="PUFA Computer Science"
                link="/events/pufa-computing"
              />
              <OrganizationLogo image="/logo/PUMA_IT.png" title="PUMA Informatics" link="/events/puma-it" />
              <OrganizationLogo image="/logo/PUMA_IS.png" title="PUMA Information System" link="/events/puma-is" />
            </div>
          </div>
        </div>
      </section>

      {/* Events Timeline */}
      <section className="mx-auto w-full py-12 lg:max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 px-3 sm:mb-8 sm:px-4">
          <div className="flex items-center">
            <div className="mr-3 rounded-full bg-indigo-100 p-2">
              <Clock className="h-5 w-5 text-indigo-600 sm:h-6 sm:w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Events Timeline</h2>
              <p className="text-sm text-gray-600 sm:text-base">Browse all our events chronologically</p>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mb-6 px-3 sm:mb-8 sm:px-4">
          <EventsFilter events={allEvents} />
        </div>

        <div className="px-3 sm:px-4">
          {allEvents.length > 0 ? (
            <div>
              <div className="grid grid-cols-2 gap-2 xs:gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
                {allEvents.map((event) => {
                  // Determine if event is upcoming, ongoing, or ended
                  const now = new Date();
                  const isUpcoming = event.start_date > now;
                  const isOngoing = event.start_date <= now && event.end_date >= now;
                  const isEnded = event.end_date < now;

                  // Set status color based on event status
                  const statusColor = isUpcoming
                    ? "bg-blue-100 text-blue-800"
                    : isOngoing
                      ? "bg-green-100 text-green-800"
                      : "bg-amber-100 text-amber-800";

                  // Set card border color based on event status
                  const borderColor = isUpcoming
                    ? "border-blue-200 hover:border-blue-300"
                    : isOngoing
                      ? "border-green-200 hover:border-green-300"
                      : "border-amber-200 hover:border-amber-300";

                  return (
                    <Link key={event.id} href={`/events/${event.slug}`} className="block h-full" data-event-id={event.id}>
                      <div className={`group flex h-full flex-col rounded-xl border ${borderColor} bg-white p-3 shadow-sm transition-all hover:shadow-md sm:p-4 md:p-6`}>
                        <div className="mb-2 flex flex-wrap items-start justify-between gap-1 sm:mb-4 sm:gap-2">
                          <h3 className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 sm:text-base md:text-lg lg:text-xl">{truncateDescription(event.title, 40)}</h3>
                          <span className={`mt-1 rounded-full ${statusColor} px-2 py-0.5 text-[10px] font-medium sm:px-3 sm:py-1 sm:text-xs`}>
                            {isUpcoming ? "Upcoming" : isOngoing ? "Ongoing" : "Ended"}
                          </span>
                        </div>

                        <div className="mb-2 space-y-1 sm:mb-4 sm:space-y-2">
                          <div className="flex items-center text-[10px] text-gray-600 sm:text-xs md:text-sm">
                            <Calendar className="mr-1 h-3 w-3 text-indigo-500 sm:mr-2 sm:h-4 sm:w-4" />
                            <span className="truncate">
                              {`${event.start_date.toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}`}
                            </span>
                          </div>

                          <div className="hidden items-center text-[10px] text-gray-600 sm:flex sm:text-xs md:text-sm">
                            <MapPin className="mr-1 h-3 w-3 text-indigo-500 sm:mr-2 sm:h-4 sm:w-4" />
                            <span className="truncate">{event.location || "Faculty of Computing"}</span>
                          </div>

                          <div className="flex items-center text-[10px] text-gray-600 sm:text-xs md:text-sm">
                            <Users className="mr-1 h-3 w-3 text-indigo-500 sm:mr-2 sm:h-4 sm:w-4" />
                            <span className="truncate">{event.organization}</span>
                          </div>
                        </div>

                        <p className="mt-1 hidden flex-grow text-xs text-gray-600 sm:mt-2 sm:block sm:text-sm">{truncateDescription(event.description, 60)}</p>

                        <div className="mt-2 flex justify-end sm:mt-4">
                          <span className="flex items-center text-[10px] font-medium text-indigo-600 group-hover:text-indigo-700 sm:text-xs md:text-sm">
                            Details <ChevronRight className="ml-0.5 h-3 w-3 sm:ml-1 sm:h-4 sm:w-4" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Load more button instead of pagination */}
              {allEvents.length > 10 && (
                <div className="mt-8 flex justify-center">
                  <button className="rounded-full bg-indigo-100 px-6 py-2 text-sm font-medium text-indigo-700 transition-colors hover:bg-indigo-200">
                    Load more events
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl bg-white p-8 text-center shadow-md">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
                <Calendar className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-800">No Events Available</h3>
              <p className="text-gray-600">
                There are currently no events available. Please check back later.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
