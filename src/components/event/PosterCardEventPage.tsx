import Link from "next/link"
import type Event from "@/models/event"
import NoData from "@/components/ui/NoData"
import Image from "next/image"
import { Calendar } from "lucide-react"

export default function PosterCardEventPage({ events }: { events: Event[] }) {
  if (events.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <NoData
          title={"No Events Available"}
          message={"There are currently no upcoming events available. Please check back later."}
        />
      </div>
    )
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {events.map((event) => (
          <Link key={event.id} href={`/events/${event.slug}`} className="group block">
            <div className="relative overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="aspect-[3/4] overflow-hidden">
                <Image
                  height={600}
                  width={450}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src={event.thumbnail || "/placeholder.svg?height=600&width=450"}
                  alt={event.title}
                />
              </div>

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                <h3 className="mb-1 font-bold leading-tight">{event.title}</h3>
                <div className="flex items-center text-xs text-gray-200">
                  <Calendar className="mr-1 h-3 w-3" />
                  <span>
                    {event.start_date.toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
              </div>

              <div className="absolute right-3 top-3">
                <span className="rounded-full bg-blue-600 px-2 py-1 text-xs font-medium text-white shadow-md">
                  {event.status}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

