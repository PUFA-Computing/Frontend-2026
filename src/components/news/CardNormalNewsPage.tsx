import type News from "@/models/news"
import Image from "next/image"
import Link from "next/link"
import { Calendar, ArrowRight, Clock } from "lucide-react"

export default function NewsGrid({ news }: { news: News[] }) {
  if (!news || news.length === 0) {
    return (
      <div className="rounded-xl bg-white p-8 text-center shadow-lg">
        <h3 className="text-lg font-medium text-gray-900">No news articles available</h3>
        <p className="mt-2 text-gray-600">Check back later for updates.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {news.map((item) => (
        <Link key={item.id} href={`news/${item.slug}`}>
          <div className="group flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            {/* Image container */}
            <div className="relative h-48 overflow-hidden">
              {/* Image */}
              <Image
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                src={item.thumbnail || "/placeholder.svg"}
                height={300}
                width={500}
                alt={`${item.title}'s image`}
              />
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              
              {/* Reading time badge */}
              <div className="absolute right-3 top-3 z-10">
                <span className="inline-flex items-center rounded-full bg-white/80 px-2 py-0.5 text-xs font-medium text-gray-800 backdrop-blur-sm">
                  <Clock className="mr-1 h-2.5 w-2.5" />
                  {Math.ceil(item.content.length / 1000)} min
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-5">
              {/* Header */}
              <div className="mb-3 flex items-center justify-between">
                <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                  {item.organization}
                </span>

                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="mr-1 h-3 w-3 text-indigo-400" />
                  <span>
                    {new Date(item.publish_date).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h3 className="mb-3 flex-1 text-lg font-semibold leading-tight text-gray-900 transition-colors group-hover:text-indigo-700">
                {item.title}
              </h3>
              
              {/* Author (if available) */}
              {item.author && (
                <p className="mb-3 text-xs text-gray-600">
                  By <span className="font-medium">{item.author}</span>
                </p>
              )}

              {/* Read more button */}
              <div className="mt-auto flex items-center justify-end">
                <span className="flex items-center text-xs font-medium text-indigo-600 opacity-0 transition-all duration-300 group-hover:opacity-100">
                  Read article
                  <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}