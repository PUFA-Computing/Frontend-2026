"use client"

import { useState, useEffect } from "react"
import type News from "@/models/news"
import Image from "next/image"
import Link from "next/link"
import { Calendar, ArrowRight, Clock, Tag, ChevronLeft, ChevronRight, Filter, Search } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Number of news items per page
const ITEMS_PER_PAGE = 9

export default function NewsAllSection({ allNews }: { allNews: News[] }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [filteredNews, setFilteredNews] = useState<News[]>(allNews || [])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedOrganization, setSelectedOrganization] = useState<string | null>(null)
  const [sortOption, setSortOption] = useState<"newest" | "oldest" | "popular">("newest")
  
  // Get unique organizations from news (handle case when allNews is undefined or empty)
  const organizations = Array.from(new Set((allNews || []).map(item => item?.organization).filter(Boolean)))
  
  // Filter and sort news based on search, organization, and sort option
  useEffect(() => {
    // Handle case when allNews is undefined or empty
    let result = allNews ? [...allNews] : []
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.content.toLowerCase().includes(query) ||
        (item.author && item.author.toLowerCase().includes(query))
      )
    }
    
    // Apply organization filter
    if (selectedOrganization) {
      result = result.filter(item => item.organization === selectedOrganization)
    }
    
    // Apply sorting
    switch (sortOption) {
      case "newest":
        result.sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime())
        break
      case "oldest":
        result.sort((a, b) => new Date(a.publish_date).getTime() - new Date(b.publish_date).getTime())
        break
      case "popular":
        result.sort((a, b) => (b.likes || 0) - (a.likes || 0))
        break
    }
    
    setFilteredNews(result)
    setCurrentPage(1) // Reset to first page when filters change
  }, [allNews, searchQuery, selectedOrganization, sortOption])
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedNews = filteredNews.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  
  // Handle page change
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      // Scroll to top of section
      window.scrollTo({ top: document.getElementById("all-news-section")?.offsetTop || 0, behavior: "smooth" })
    }
  }
  
  // Reset filters
  const resetFilters = () => {
    setSearchQuery("")
    setSelectedOrganization(null)
    setSortOption("newest")
  }

  if (!allNews || allNews.length === 0) {
    return (
      <div className="rounded-xl bg-white p-8 text-center shadow-lg">
        <h3 className="text-lg font-medium text-gray-900">No news articles available</h3>
        <p className="mt-2 text-gray-600">We're having trouble loading the news. Please check back later.</p>
        <div className="mt-6 flex justify-center">
          <button 
            onClick={() => window.location.reload()}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Refresh Page
          </button>
        </div>
      </div>
    )
  }

  return (
    <div id="all-news-section" className="space-y-8">
      {/* Filters section */}
      <div className="mb-6 rounded-xl bg-white p-6 shadow-md">
        <div className="mb-4 flex items-center">
          <Filter className="mr-2 h-5 w-5 text-indigo-600" />
          <h3 className="text-lg font-medium text-gray-900">Filter Articles</h3>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          {/* Search */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          
          {/* Organization filter */}
          <div>
            <select
              value={selectedOrganization || ""}
              onChange={(e) => setSelectedOrganization(e.target.value || null)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">All Organizations</option>
              {organizations.map((org) => (
                <option key={org} value={org}>
                  {org}
                </option>
              ))}
            </select>
          </div>
          
          {/* Sort options */}
          <div>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as "newest" | "oldest" | "popular")}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>
        
        {/* Filter stats and reset */}
        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-sm">
          <p className="text-gray-600">
            Showing <span className="font-medium text-indigo-600">{filteredNews.length}</span> of{" "}
            <span className="font-medium text-indigo-600">{allNews.length}</span> articles
          </p>
          
          {(searchQuery || selectedOrganization || sortOption !== "newest") && (
            <button
              onClick={resetFilters}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* News grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`page-${currentPage}-${filteredNews.length}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {paginatedNews.length > 0 ? (
            paginatedNews.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5 }}
                className="h-full"
              >
                <Link href={`news/${item.slug}`}>
                  <div className="group flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
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
                          <Tag className="mr-1 h-3 w-3" />
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
              </motion.div>
            ))
          ) : (
            <div className="col-span-3 rounded-xl bg-white p-8 text-center shadow-lg">
              <h3 className="text-lg font-medium text-gray-900">No matching articles found</h3>
              <p className="mt-2 text-gray-600">Try adjusting your filters or search query.</p>
              <button
                onClick={resetFilters}
                className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Reset Filters
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center space-x-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Previous
          </button>
          
          <div className="hidden items-center space-x-1 md:flex">
            {Array.from({ length: totalPages }).map((_, index) => {
              const pageNumber = index + 1
              
              // Show first page, last page, current page, and pages around current page
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNumber}
                    onClick={() => goToPage(pageNumber)}
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium ${
                      currentPage === pageNumber
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {pageNumber}
                  </button>
                )
              }
              
              // Show ellipsis for skipped pages
              if (
                (pageNumber === 2 && currentPage > 3) ||
                (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
              ) {
                return <span key={pageNumber} className="text-gray-500">...</span>
              }
              
              return null
            })}
          </div>
          
          <div className="flex items-center md:hidden">
            <span className="text-sm font-medium text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
          </div>
          
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}
