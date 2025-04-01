import type News from "@/models/news"
import Image from "next/image"
import Link from "next/link"
import { Calendar } from "lucide-react"

export default function NewsGrid({ news }: { news: News[] }) {
  if (!news || news.length === 0) {
    return (
      <div className="rounded-xl bg-white p-8 text-center shadow-md">
        <h3 className="text-lg font-medium text-gray-900">No news articles available</h3>
        <p className="mt-2 text-gray-600">Check back later for updates.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {news.map((item) => (
        <Link key={item.id} href={`news/${item.slug}`}>
          <div className="group flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="relative h-48 overflow-hidden">
              <Image
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                src={item.thumbnail || "/placeholder.svg"}
                height={300}
                width={500}
                alt={`${item.title}'s image`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            </div>

            <div className="flex flex-1 flex-col p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                  {item.organization}
                </span>

                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="mr-1 h-3 w-3" />
                  <span>
                    {new Date(item.publish_date).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <h3 className="mb-2 flex-1 text-lg font-semibold text-gray-900 transition-colors group-hover:text-indigo-700">
                {item.title}
              </h3>

              <div className="mt-auto">
                <span className="text-xs font-medium text-indigo-600 opacity-0 transition-opacity group-hover:opacity-100">
                  Read article →
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}