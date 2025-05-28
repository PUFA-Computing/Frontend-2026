import { MetadataRoute } from 'next'
import { fetchEvents } from '@/services/api/event'
import { fetchNews } from '@/services/api/news'

// Define types for our data
interface Event {
  slug: string;
  updatedAt?: string;
  createdAt?: string;
}

interface News {
  slug: string;
  updatedAt?: string;
  createdAt?: string;
}

interface Project {
  id: string;
  updatedAt?: string;
  createdAt?: string;
}

// This generates a dynamic sitemap for better SEO
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get base URL for the site
  const baseUrl = 'https://compsci.president.ac.id'
  
  // Current date for lastModified
  const now = new Date()
  
  // Basic static routes
  const routes = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/puma`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ] as MetadataRoute.Sitemap

  try {
    // Get events and news (projects API not available yet)
    const [events, news] = await Promise.all([
      fetchEvents(),
      fetchNews(),
    ])

    // Add event pages to sitemap
    const eventUrls = events?.map((event: Event) => ({
      url: `${baseUrl}/events/${event.slug}`,
      lastModified: new Date(event.updatedAt || event.createdAt || now),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })) || []

    // Add news pages to sitemap
    const newsUrls = news?.map((item: News) => ({
      url: `${baseUrl}/news/${item.slug}`,
      lastModified: new Date(item.updatedAt || item.createdAt || now),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })) || []
    
    // Project API not implemented yet, will add when available
    const projectUrls: MetadataRoute.Sitemap = []

    // Combine all URLs
    return [...routes, ...eventUrls, ...newsUrls, ...projectUrls]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return just static routes if there's an error
    return routes
  }
}
