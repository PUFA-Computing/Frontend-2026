import EventCard from "@/components/event/EventCardPage"
import { fetchEvents } from "@/services/api/event"
import OrganizationLogo from "@/components/event/LogoOrganizationEventPage"
import type { Metadata } from "next"
import { CalendarDays, Clock, Sparkles, Calendar, MapPin, Users, ChevronRight } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Events | Computer Science",
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

  const today: Date = new Date()

  // Sort all events by end date first
  const sortedEvents = events.sort((a, b) => 
    a.end_date.getTime() - b.end_date.getTime()
  )

  // Get upcoming events (first 3)
  const upcomingEvents = sortedEvents
    .filter((event) => event.end_date.getTime() >= today.getTime())
    .slice(0, 3)

  // Get remaining events without excluding any
  const allEvents = sortedEvents
    .filter((event) => !upcomingEvents.includes(event))

  const truncateDescription = (description: string, length: number = 100) => {
    if (description.length > length) {
      return `${description.substring(0, length)}...`
    }
    return description
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-800 to-purple-900 px-4 py-24 sm:px-6 md:px-8 lg:px-16">
        {/* Decorative elements */}
        <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-blue-500 opacity-10"></div>
        <div className="absolute -right-20 bottom-10 h-60 w-60 rounded-full bg-purple-500 opacity-10"></div>
        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-indigo-500 opacity-5"></div>
        
        <div className="relative mx-auto max-w-7xl">
          <div className="relative z-10 max-w-3xl">
            <div className="mb-6 inline-block rounded-full bg-indigo-500/20 px-4 py-1 backdrop-blur-sm">
              <p className="text-sm font-medium text-indigo-100">Faculty of Computing</p>
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              Discover Our <span className="text-amber-400">Events</span>
            </h1>
            <p className="mb-8 text-xl text-indigo-100">Join us for exciting workshops, competitions, and gatherings throughout the academic year.</p>
            
            <div className="flex flex-wrap gap-4">
              <Link href="#upcoming" className="rounded-full bg-amber-500 px-6 py-3 font-medium text-white transition-all hover:bg-amber-600 hover:shadow-lg">
                Explore Events
              </Link>
              <Link href="#categories" className="rounded-full border border-white/30 bg-white/10 px-6 py-3 font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20">
                View Categories
              </Link>
            </div>
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
      <section id="categories" className="bg-gradient-to-b from-white to-indigo-50 py-16">
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
              <OrganizationLogo image="/logo/PUMA_VCD.png" title="PUMA VCD" link="/events/puma-vcd" />
              <OrganizationLogo image="/logo/PUMA_ID.png" title="PUMA Interior Design" link="/events/puma-id" />
            </div>
          </div>
        </div>
      </section>

        {/* Events Timeline */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:px-8">
          <div className="mb-10 flex items-center">
            <div className="mr-4 rounded-full bg-indigo-100 p-2">
              <Clock className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Events Timeline</h2>
              <p className="text-gray-600">Browse all our events chronologically</p>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-xl">
            {allEvents.length > 0 ? (
              <div className="space-y-8">
                {allEvents.map((event, index) => (
                  <div key={event.id} className="relative pl-10">
                    <div className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white">
                      {index + 1}
                    </div>
                    {index < allEvents.length - 1 && (
                      <div className="absolute bottom-0 left-4 top-8 w-0.5 -translate-x-1/2 bg-indigo-200"></div>
                    )}
                    <Link href={`/events/${event.slug}`} className="block">
                      <div className="group rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md">
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600">{event.title}</h3>
                          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                            {event.status}
                          </span>
                        </div>
                        
                        <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="mr-2 h-4 w-4 text-indigo-500" />
                            <span>
                              {`${event.start_date.toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}`}
                            </span>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="mr-2 h-4 w-4 text-indigo-500" />
                            <span>Faculty of Computing</span>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="mr-2 h-4 w-4 text-indigo-500" />
                            <span>{event.organization}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600">{truncateDescription(event.description, 80)}</p>
                          <div className="ml-4 flex items-center text-sm font-medium text-indigo-600 group-hover:text-indigo-700">
                            View details
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 rounded-full bg-gray-100 p-4">
                  <Calendar className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-800">No Events Available</h3>
                <p className="text-gray-600">There are currently no additional events scheduled.</p>
              </div>
            )}
          </div>
        </section>
    </div>
  )
}

