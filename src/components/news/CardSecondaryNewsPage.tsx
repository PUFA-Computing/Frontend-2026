import type News from "@/models/news"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, User } from "lucide-react"

export default function CardSecondaryNewsPage({ news }: { news: News }) {
  const truncateDescription = (description: string, maxLength: number) => {
    if (description.length <= maxLength) {
      return description
    }
    return description.substring(0, maxLength) + "..."
  }

  const createMarkup = (htmlString: string) => {
    return { __html: htmlString.replace(/<[^>]*>?/gm, "") }
  }

  return (
    <Link href={`news/${news.slug}`}>
      <div className="group flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        {/* Image container */}
        <div className="relative h-52 overflow-hidden">
          {/* Image */}
          <Image
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            src={news.thumbnail || "/placeholder.svg"}
            height={400}
            width={600}
            alt={`${news.title}'s image`}
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/25 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-90"></div>
          
          {/* Category badge */}
          <div className="absolute bottom-4 left-4 z-10">
            <span className="inline-flex items-center rounded-full bg-amber-500/90 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {news.organization}
            </span>
          </div>
          
          {/* Reading time badge */}
          <div className="absolute right-4 top-4 z-10">
            <span className="inline-flex items-center rounded-full bg-white/80 px-2 py-1 text-xs font-medium text-gray-800 backdrop-blur-sm">
              <Clock className="mr-1 h-3 w-3" />
              {Math.ceil(news.content.length / 1000)} min
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between p-6">
          {/* Title */}
          <div>
            <h3 className="mb-3 text-xl font-bold leading-tight text-gray-900 transition-colors group-hover:text-indigo-700">
              {news.title}
            </h3>

            {/* Author */}
            <div className="mb-3 flex items-center">
              <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100">
                <User className="h-3 w-3 text-indigo-600" />
              </div>
              <span className="text-xs font-medium text-gray-700">{news.author}</span>
            </div>

            {/* Description */}
            <div
              className="mb-4 text-sm text-gray-600"
              dangerouslySetInnerHTML={createMarkup(truncateDescription(news.content, 120))}
            />
          </div>

          {/* Date */}
          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="mr-1.5 h-3.5 w-3.5 text-indigo-500" />
              <span>
                {new Date(news.publish_date).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            
            <div className="text-xs font-medium text-indigo-600 opacity-0 transition-opacity group-hover:opacity-100">
              Read article →
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}