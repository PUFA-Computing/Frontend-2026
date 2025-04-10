import type { Metadata } from "next"
import { fetchEvents } from "@/services/api/event"
import EventCard from "@/components/event/EventCardPage"
import EventCardPageMobile from "@/components/event/EventCardMobile"
import PosterCardEventPage from "@/components/event/PosterCardEventPage"
import { Calendar, Clock, Sparkles } from "lucide-react"

export const metadata: Metadata = {
  title: "PUMA IT Events",
}
export const revalidate = 0
export const dynamic = "force-dynamic"

export default async function EventsPage() {
  const events = await fetchEvents()

  if (!events) return <div>Failed to fetch data...</div>

  const today: Date = new Date()

  // Filter events related to PUMA IT
  const pumaItEvents = events.filter((event) => event.organization === "PUMA IT")

  // Upcoming events sorted by end date
  const upcomingEvents = pumaItEvents
   .filter((event) => event.end_date.getTime() >= today.getTime())
   .slice(0, 2)

  // All event sorted by end date exclude the first 2 upcoming events
  const allEvents = pumaItEvents.filter((event) => !upcomingEvents.includes(event))

  const truncateDescription = (description: string) => {
      if (description.length > 100) {
      return `${description.substring(0, 100)}...`
      }
      return description
   }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero section with animated background */}
      <section className="relative overflow-hidden bg-gradient-to-r from-red-600 to-red-800 py-16">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=400')] bg-repeat opacity-20"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-block rounded-lg bg-white/10 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
              <Clock className="mr-1 inline-block h-4 w-4" /> Latest Updates
            </div>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              Informatics Events
            </h1>
            <p className="mt-3 text-lg text-red-100">
              Discover the latest updates on events in our faculty. Stay connected and never miss an opportunity.
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-white [clip-path:polygon(0_0,100%_100%,100%_100%,0%_100%)]"></div>
      </section>

      {/* Event highlights with improved card design */}
      <section className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-center">
          <Sparkles className="mr-3 h-6 w-6 text-red-600" />
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Event Highlights</h2>
        </div>

        {/* Animated card entrance */}
        <div className="hidden md:block">
          <div className="animate-fadeIn">
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
        </div>
        <div className="block md:hidden">
          <div className="animate-fadeIn">
            <EventCardPageMobile events={upcomingEvents} />
          </div>
        </div>
      </section>

      {/* All events section with improved layout */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-center">
            <Calendar className="mr-3 h-6 w-6 text-red-600" />
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">All Events</h2>
          </div>

          <div className="animate-fadeIn">
            <PosterCardEventPage events={allEvents} />
          </div>

          {/* Empty state */}
          {allEvents.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 py-16 text-center">
              <Calendar className="mb-4 h-12 w-12 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900">No upcoming events</h3>
              <p className="mt-1 text-sm text-gray-500">Check back later for new events.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

