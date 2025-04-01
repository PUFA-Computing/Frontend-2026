import type News from "@/models/news"
import Image from "next/image"
import Link from "next/link"
import { Calendar } from "lucide-react"

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
      <div className="group flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-xl">
        <div className="relative h-48 overflow-hidden">
          <Image
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            src={news.thumbnail || "/placeholder.svg"}
            height={400}
            width={600}
            alt={`${news.title}'s image`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          <div className="absolute bottom-4 left-4">
            <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
              {news.organization}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-between p-6">
          <div>
            <h3 className="mb-3 text-xl font-bold text-gray-900 transition-colors group-hover:text-indigo-700">
              {news.title}
            </h3>

            <div
              className="mb-4 text-sm text-gray-600"
              dangerouslySetInnerHTML={createMarkup(truncateDescription(news.content, 120))}
            />
          </div>

          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="mr-1.5 h-3.5 w-3.5" />
            <span>
              {new Date(news.publish_date).toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}