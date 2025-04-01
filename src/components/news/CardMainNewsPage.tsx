import type News from "@/models/news"
import Image from "next/image"
import Link from "next/link"
import { Calendar, ArrowRight } from "lucide-react"

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
      <div className="group overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative overflow-hidden">
            <Image
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              src={news.thumbnail || "/placeholder.svg"}
              height={600}
              width={800}
              alt={`${news.title}'s image`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:hidden"></div>
          </div>

          <div className="flex flex-col justify-between p-6 md:p-8">
            <div>
              <div className="mb-4 inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
                {news.organization}
              </div>

              <h2 className="mb-4 text-2xl font-bold leading-tight text-gray-900 transition-colors group-hover:text-indigo-700 md:text-3xl">
                {news.title}
              </h2>

              <div
                className="mb-6 text-gray-700"
                dangerouslySetInnerHTML={createMarkup(truncateDescription(news.content, 200))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="mr-1.5 h-4 w-4" />
                <span>
                  {new Date(news.publish_date).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>

              <div className="flex items-center text-indigo-600 transition-transform group-hover:translate-x-1">
                <span className="mr-1 text-sm font-medium">Read more</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}