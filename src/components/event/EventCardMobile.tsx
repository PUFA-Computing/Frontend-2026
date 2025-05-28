import OptimizedImage from "@/components/ui/OptimizedImage"
import type Event from "@/models/event"
import Link from "next/link"
import { Calendar, Clock, Users } from "lucide-react"
import NoData from "@/components/ui/NoData"

export default function EventCardPageMobile({ events }: { events: Event[] }) {
  const truncateDescription = (description: string, maxLength: number) => {
    if (description.length <= maxLength) {
      return description
    }
    return description.substring(0, maxLength) + "..."
  }

  const calculateDaysLeft = (endDate: Date) => {
    const today = new Date()
    const differenceInTime = endDate.getTime() - today.getTime()
    return Math.ceil(differenceInTime / (1000 * 60 * 60 * 24))
  }

  if (events.length === 0) {
    return (
      <NoData
        title={"No Upcoming Events"}
        message={"There are currently no upcoming events available. Please check back later."}
      />
    )
  }

  return (
    <div className="mt-8 space-y-6">
      {events.map((event) => {
        const daysLeft = calculateDaysLeft(event.end_date)

        return (
          <Link key={event.id} href={`/events/${event.slug}`}>
            <div className="overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-xl">
              <div className="relative">
                <OptimizedImage
                  src={event.thumbnail || "/placeholder.svg?height=300&width=600"}
                  className="h-48 w-full object-cover"
                  alt={`${event.title}'s poster`}
                  width={600}
                  height={300}
                  performanceMode={true}
                />

                <div className="absolute right-3 top-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold text-white shadow-md ${
                      daysLeft <= 3
                        ? "bg-gradient-to-r from-red-500 to-red-600"
                        : daysLeft <= 7
                          ? "bg-gradient-to-r from-amber-500 to-amber-600"
                          : "bg-gradient-to-r from-blue-500 to-blue-600"
                    }`}
                  >
                    {daysLeft > 0 ? `${daysLeft} days left` : "Ending today"}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="mb-2 text-lg font-bold text-gray-900">{event.title}</h3>

                <div className="mb-3 flex flex-wrap gap-3 text-xs">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="mr-1 h-3.5 w-3.5 text-blue-500" />
                    <span>
                      {event.start_date.toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                      })}{" "}
                      -{" "}
                      {event.end_date.toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <Users className="mr-1 h-3.5 w-3.5 text-blue-500" />
                    <span>{event.organization}</span>
                  </div>
                </div>

                <p className="mb-4 text-sm text-gray-600">{truncateDescription(event.description, 100)}</p>

                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="mr-1 h-3.5 w-3.5 text-blue-500" />
                    <span>
                      {event.start_date.toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                    {event.status}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

