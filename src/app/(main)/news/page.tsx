import { fetchNews } from "@/services/api/news"
import CardMainNewsPage from "@/components/news/CardMainNewsPage"
import CardSecondaryNewsPage from "@/components/news/CardSecondaryNewsPage"
import { Suspense } from "react"
import { CircularProgress } from "@/components/ui/CircularProgress"
import { Newspaper, Archive, TrendingUp } from "lucide-react"
import NewsAllSection from "@/components/news/NewsAllSection"

const revalidate = 60
export const dynamic = "force-dynamic"

export default async function NewsPage() {
  const news = await fetchNews()

  // Sort news by publish date (newest first)
  const sortedNews = news && news.length > 0
    ? [...news].sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime())
    : []

  const hasNews = sortedNews.length > 0
  const featuredNews = sortedNews[0] ?? null
  const secondaryNews = sortedNews.slice(1, 3)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden bg-[#F5EDD0]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#EDE0BB]/80 to-[#F5EDD0]" />

        {/* Top corner ornaments */}
        <div className="absolute top-28 left-8 w-12 h-12 border-l border-t border-[#B8841E]/40 hidden md:block" />
        <div className="absolute top-28 right-8 w-12 h-12 border-r border-t border-[#B8841E]/40 hidden md:block" />

        <div className="relative container mx-auto px-6 flex flex-col items-center text-center max-w-4xl z-10">
          <div className="mb-6 inline-flex items-center justify-center border border-[#B8841E]/30 bg-[#FAF5E8]/60 px-4 py-1.5 shadow-parch-sm">
            <Newspaper className="mr-2 h-4 w-4 text-[#B8841E]" />
            <p className="font-serif text-xs tracking-[0.2em] font-medium text-[#B8841E] uppercase">Faculty of Computing</p>
          </div>
          <h1 className="font-display italic text-6xl sm:text-7xl md:text-8xl text-[#0D1B3E] mb-6 leading-[0.9]">
            CS <span className="text-[#B8841E]">News</span>
          </h1>

          {/* Ornamental rule */}
          <div className="flex items-center justify-center gap-3 w-full mb-6">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#B8841E]/40" />
            <span className="text-[#B8841E]/50 text-xs">&#10022;</span>
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#B8841E]/40" />
          </div>

          <p className="font-serif text-lg text-[#1A1A2E]/65 max-w-2xl text-balance mb-8">
            The latest news about research, technology, achievements, and campus life.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {!hasNews ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#B8841E]/10 border border-[#B8841E]/20">
              <Archive className="h-12 w-12 text-[#B8841E]/50" />
            </div>
            <h2 className="font-display italic text-3xl text-[#0D1B3E] mb-3">No News Yet</h2>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#B8841E]/30" />
              <span className="text-[#B8841E]/40 text-xs">&#10022;</span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#B8841E]/30" />
            </div>
            <p className="font-serif text-[#1A1A2E]/60 max-w-md leading-relaxed">
              We haven&apos;t published any news articles yet. Please check back later for the latest updates from the Faculty of Computing.
            </p>
          </div>
        ) : (
          <>
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

              {featuredNews && (
                <Suspense fallback={<CircularProgress />}>
                  <CardMainNewsPage news={featuredNews} />
                </Suspense>
              )}

              {secondaryNews.length > 0 && (
                <div className="mt-12">
                  <Suspense fallback={<CircularProgress />}>
                    <div className={`grid grid-cols-1 gap-8 ${secondaryNews.length > 1 ? "md:grid-cols-2" : ""}`}>
                      {secondaryNews.map((item) => (
                        <CardSecondaryNewsPage key={item.id} news={item} />
                      ))}
                    </div>
                  </Suspense>
                </div>
              )}
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
              <div className="mb-8 flex items-center">
                <div className="mr-4 rounded-full bg-indigo-100 p-2">
                  <Archive className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">All News</h2>
                  <p className="text-gray-600">Browse our complete collection of articles</p>
                </div>
              </div>

              <Suspense fallback={<CircularProgress />}>
                <NewsAllSection allNews={sortedNews} />
              </Suspense>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
