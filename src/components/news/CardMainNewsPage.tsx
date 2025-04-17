import type News from "@/models/news"
import Image from "next/image"
import Link from "next/link"
import { Calendar, ArrowRight, Clock, User } from "lucide-react"

export default function FeaturedNewsCard({ news }: { news: News }) {
  const truncateDescription = (description: string, maxLength: number) => {
    if (description.length <= maxLength) {
      return description
    }
    return description.substring(0, maxLength) + "..."
  }

  // Remove html tags
  const createMarkup = (htmlString: string) => {
    return { __html: htmlString.replace(/<[^>]*>?/gm, "") }
  }

  if (!news) return null

  return (
    <Link href={`news/${news.slug}`}>
      <div className="group relative overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left side - Image */}
          <div className="relative overflow-hidden">
            {/* Gradient overlay for mobile */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:hidden"></div>
            
            {/* Featured tag */}
            <div className="absolute left-4 top-4 z-10">
              <div className="rounded-full bg-amber-500/90 px-3 py-1 text-xs font-bold uppercase text-white backdrop-blur-sm">
                Featured
              </div>
            </div>
            
            {/* Image */}
            <div className="relative h-full min-h-[280px] w-full">
              <Image
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                src={news.thumbnail || "/placeholder.svg"}
                height={600}
                width={800}
                alt={`${news.title}'s image`}
              />
            </div>
            
            {/* Gradient overlay for desktop */}
            <div className="absolute inset-0 hidden bg-gradient-to-r from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:block"></div>
          </div>

          {/* Right side - Content */}
          <div className="flex flex-col justify-between bg-white p-6 md:p-8">
            <div>
              {/* Category tag */}
              <div className="mb-4 inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
                {news.organization}
              </div>
              
              {/* Title */}
              <h2 className="mb-4 text-2xl font-bold leading-tight text-gray-900 transition-colors group-hover:text-indigo-700 md:text-3xl">
                {news.title}
              </h2>
              
              {/* Author info */}
              <div className="mb-4 flex items-center">
                <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
                  <User className="h-4 w-4 text-indigo-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">{news.author}</span>
              </div>
              
              {/* Content preview */}
              <div
                className="mb-6 text-gray-700"
                dangerouslySetInnerHTML={createMarkup(truncateDescription(news.content, 180))}
              />
            </div>

            {/* Footer */}
            <div className="flex flex-wrap items-center justify-between gap-y-3">
              <div className="flex items-center space-x-4">
                {/* Date */}
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="mr-1.5 h-4 w-4 text-indigo-500" />
                  <span>
                    {new Date(news.publish_date).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                
                {/* Reading time */}
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="mr-1.5 h-4 w-4 text-indigo-500" />
                  <span>{Math.ceil(news.content.length / 1000)} min read</span>
                </div>
              </div>

              {/* Read more button */}
              <div className="flex items-center rounded-full bg-indigo-50 px-4 py-2 text-indigo-700 transition-all group-hover:bg-indigo-100">
                <span className="mr-1 text-sm font-medium">Read article</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}