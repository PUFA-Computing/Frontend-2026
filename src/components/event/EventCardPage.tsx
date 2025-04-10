import Image from "next/image"
import type Event from "@/models/event"
import Link from "next/link"
import { Calendar, Users } from "lucide-react"

interface EventCardPageProps {
  event?: Event
}

export default function EventCardPage({ event }: EventCardPageProps) {
  if (!event) {
    return null
  }

  const calculateDaysLeft = (endDate: Date) => {
    const today = new Date()
    const differenceInTime = endDate.getTime() - today.getTime()
    return Math.ceil(differenceInTime / (1000 * 60 * 60 * 24))
  }

  const daysLeft = calculateDaysLeft(event.end_date)

  return (
    <Link href={`/events/${event.slug}`}>
      <div className="group overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-xl">
        <div className="relative">
          <div className="aspect-video overflow-hidden">
            <Image
              src={event.thumbnail || "/placeholder.svg"}
              alt={`${event.title}'s poster`}
              width={600}
              height={400}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          <div className="absolute right-4 top-4">
            <span className="rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
              {daysLeft > 0 ? `${daysLeft} days left` : "Ending today"}
            </span>
          </div>
        </div>

        <div className="p-6">
          <h3 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-indigo-700">{event.title}</h3>

          <div className="mb-4 flex items-center text-sm text-gray-600">
            <Calendar className="mr-1.5 h-4 w-4 text-indigo-500" />
            <span>
              {`${event.start_date.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })} - ${event.end_date.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}`}
            </span>
          </div>

          <p className="mb-4 text-gray-700">{event.description}</p>

          <div className="flex items-center justify-between border-t border-gray-100 pt-4">
            <div className="flex items-center">
              <Users className="mr-1.5 h-4 w-4 text-indigo-500" />
              <span className="text-sm font-medium text-gray-900">{event.organization}</span>
            </div>

            <div className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 transition-colors group-hover:bg-indigo-100">
              {event.status}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

