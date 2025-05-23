import { fetchNews } from "@/services/api/news"
import CardMainNewsPage from "@/components/news/CardMainNewsPage"
import CardSecondaryNewsPage from "@/components/news/CardSecondaryNewsPage"
import CardNormalNewsPage from "@/components/news/CardNormalNewsPage"
import { Suspense } from "react"
import { CircularProgress } from "@/components/ui/CircularProgress"
import { Newspaper, Clock, Archive, Search, TrendingUp, Filter, ChevronRight, Calendar, Tag, BookOpen } from "lucide-react"
import Link from "next/link"
import NewsAllSection from "@/components/news/NewsAllSection"

const revalidate = 60
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-800 to-purple-900 px-4 py-20 sm:px-6 md:px-8 lg:px-16">
        {/* Decorative elements */}
        <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-blue-500 opacity-10"></div>
        <div className="absolute -right-20 bottom-10 h-60 w-60 rounded-full bg-purple-500 opacity-10"></div>
        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-indigo-500 opacity-5"></div>
        
        <div className="relative mx-auto max-w-7xl">
          <div className="relative z-10 max-w-3xl">
            <div className="mb-6 inline-flex items-center rounded-full bg-indigo-500/20 px-4 py-1 backdrop-blur-sm">
              <Newspaper className="mr-2 h-4 w-4 text-indigo-100" />
              <p className="text-sm font-medium text-indigo-100">Faculty of Computer Science</p>
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              CS <span className="text-amber-400">News</span>
            </h1>
            <p className="mb-8 text-xl text-indigo-100">
              The latest news about research, technology, achievements, and campus life.
            </p>
            
            {/* <div className="relative">
              <div className="flex w-full max-w-lg items-center rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                <Search className="mr-2 h-5 w-5 text-indigo-100" />
                <input 
                  type="text" 
                  placeholder="Search news articles..." 
                  className="w-full bg-transparent text-white placeholder-indigo-200 focus:outline-none"
                />
              </div>
            </div> */}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Latest News Section */}
        <div className="mb-16">
          <div className="mb-8 flex items-center">
            <div className="mr-4 rounded-full bg-indigo-100 p-2">
              <TrendingUp className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Latest News</h2>
              <p className="text-gray-600">Stay updated with our most recent stories</p>
            </div>
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
            <span className="rounded-full bg-gradient-to-b from-slate-50 to-slate-100 p-2">
              <Archive className="h-5 w-5 text-gray-400" />
            </span>
          </div>
        </div>

        {/* All News Section */}
        <div>
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center">
              <div className="mr-4 rounded-full bg-indigo-100 p-2">
                <Archive className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">All News</h2>
                <p className="text-gray-600">Browse our complete collection of articles</p>
              </div>
            </div>
          </div>

          <Suspense fallback={<CircularProgress />}>
            <NewsAllSection allNews={sortedNews} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

