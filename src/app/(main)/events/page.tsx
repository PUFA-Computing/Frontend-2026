import EventCard from "@/components/event/EventCardPage"
import { fetchEvents } from "@/services/api/event"
import OrganizationLogo from "@/components/event/LogoOrganizationEventPage"
import type { Metadata } from "next"
import { CalendarDays, Clock, Sparkles } from "lucide-react"

export const metadata: Metadata = {
  title: "Events | Computer Science",
}
export const revalidate = 0
export const dynamic = "force-dynamic"

export default async function EventsPage() {
  const events = await fetchEvents()

  if (!events) return <div>Failed to fetch data...</div>

  const today: Date = new Date()

  // Upcoming events sorted by end date and equal or greater than today
  const upcomingEvents = events
    .filter((event) => event.end_date.getTime() >= today.getTime())
    .sort((a, b) => a.end_date.getTime() - b.end_date.getTime())
    .slice(0, 2)

  // All event sorted by end date exclude the first 2 upcoming events
  const allEvents = events.sort((a, b) => a.end_date.getTime() - b.end_date.getTime()).slice(2)

  const truncateDescription = (description: string) => {
    if (description.length > 100) {
      return `${description.substring(0, 100)}...`
    }
    return description
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-900 to-purple-800 px-4 py-16 sm:px-6 md:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="relative border-l-4 border-amber-400 pl-6">
            <div className="absolute -left-2 top-0 h-4 w-4 rounded-full bg-amber-400"></div>
            <div className="absolute -left-2 bottom-0 h-4 w-4 rounded-full bg-amber-400"></div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              Computer Science Events
            </h1>
            <p className="mt-3 text-lg text-indigo-100">Discover the latest updates on events in our faculty.</p>
          </div>
        </div>
      </section>

      {/* Event Highlights */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:px-8 lg:px-10">
        <div className="mb-8 flex items-center">
          <Sparkles className="mr-2 h-6 w-6 text-amber-500" />
          <h2 className="text-2xl font-bold text-gray-900">Event Highlights</h2>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
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
            <div className="col-span-2 rounded-xl bg-white p-8 text-center shadow-md">
              <h3 className="mb-2 text-xl font-semibold text-gray-800">No Upcoming Events</h3>
              <p className="text-gray-600">
                There are currently no upcoming events available. Please check back later.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Event Categories */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 md:px-8">
        <div className="mb-6 flex items-center">
          <CalendarDays className="mr-2 h-6 w-6 text-indigo-600" />
          <h2 className="text-2xl font-bold text-gray-900">Event Categories</h2>
        </div>

        <div className="relative mb-8 mt-4 overflow-hidden rounded-xl bg-white p-6 shadow-md">
          <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-indigo-100 opacity-50"></div>
          <div className="absolute -left-20 -bottom-20 h-40 w-40 rounded-full bg-amber-100 opacity-50"></div>

          <div className="relative grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5">
            <OrganizationLogo
              image="/logo/PUFA_Computing.png"
              title="PUFA Computer Science"
              link="/events/pufa-computing"
            />
            <OrganizationLogo image="/logo/PUMA_IT.png" title="PUMA Informatics" link="/events/puma-it" />
            <OrganizationLogo image="/logo/PUMA_IS.png" title="PUMA Information System" link="/events/puma-is" />
          </div>
        </div>

        {/* Upcoming Events Timeline */}
        <div className="mb-6 mt-16 flex items-center">
          <Clock className="mr-2 h-6 w-6 text-indigo-600" />
          <h2 className="text-2xl font-bold text-gray-900">Upcoming Events Timeline</h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-md">
          {allEvents.length > 0 ? (
            <div className="space-y-6">
              {allEvents.map((event, index) => (
                <div key={event.id} className="relative pl-8">
                  <div className="absolute left-0 top-0 h-6 w-6 rounded-full bg-indigo-600"></div>
                  {index < allEvents.length - 1 && (
                    <div className="absolute bottom-0 left-3 top-6 w-0.5 -translate-x-1/2 bg-indigo-200"></div>
                  )}
                  <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md">
                    <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                    <p className="mt-1 text-sm text-gray-600">
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
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-indigo-600">{event.organization}</span>
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                        {event.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-600">No additional events scheduled.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

