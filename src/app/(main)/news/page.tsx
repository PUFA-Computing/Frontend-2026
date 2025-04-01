import { fetchNews } from "@/services/api/news"
import PageHeading from "@/components/PageHeading"
import CardMainNewsPage from "@/components/news/CardMainNewsPage"
import CardSecondaryNewsPage from "@/components/news/CardSecondaryNewsPage"
import CardNormalNewsPage from "@/components/news/CardNormalNewsPage"
import { Suspense } from "react"
import { CircularProgress } from "@/components/ui/CircularProgress"
import { Newspaper, Clock, Archive } from "lucide-react"

export const revalidate = 60
export const dynamic = "force-dynamic"

export default async function NewsPage() {
  const news = await fetchNews()

  // Sort news by publish date (newest first)
  const sortedNews = news.sort((a, b) => {
    return new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime()
  })

  // Split news into different sections
  const featuredNews = sortedNews[0]
  const secondaryNews = sortedNews.slice(1, 3)
  const regularNews = sortedNews.slice(3)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 pb-16">
      <PageHeading
        title="Computer Science News"
        description="The latest news about research, technology, achievements, and campus life."
        icon={<Newspaper className="h-6 w-6 text-amber-500" />}
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Latest News Section */}
        <div className="mb-12">
          <div className="mb-8 flex items-center">
            <Clock className="mr-2 h-6 w-6 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">Latest News</h2>
          </div>

          {/* Featured News */}
          <Suspense fallback={<CircularProgress />}>
            <CardMainNewsPage news={featuredNews} />
          </Suspense>

          {/* Secondary News */}
          <div className="mt-12">
            <Suspense fallback={<CircularProgress />}>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {secondaryNews.map((item) => (
                  <CardSecondaryNewsPage key={item.id} news={item} />
                ))}
              </div>
            </Suspense>
          </div>
        </div>

        {/* Divider */}
        <div className="relative my-16">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-gradient-to-b from-slate-50 to-slate-100 px-4">
              <Archive className="h-6 w-6 text-gray-400" />
            </span>
          </div>
        </div>

        {/* All News Section */}
        <div>
          <div className="mb-8 flex items-center">
            <Archive className="mr-2 h-6 w-6 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">All News</h2>
          </div>

          <Suspense fallback={<CircularProgress />}>
            <CardNormalNewsPage news={regularNews} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

