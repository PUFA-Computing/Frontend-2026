'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
  homeElement?: React.ReactNode;
  separator?: React.ReactNode;
  containerClasses?: string;
  listClasses?: string;
  activeClasses?: string;
  capitalizeLinks?: boolean;
}

/**
 * SEO-optimized breadcrumbs component with schema.org structured data
 * - Automatically generates breadcrumbs based on current URL
 * - Includes structured data for search engines
 * - Customizable appearance
 */
export default function Breadcrumbs({
  homeElement = <Home className="w-4 h-4" />,
  separator = <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />,
  containerClasses = 'flex py-3 px-4 bg-white rounded-lg shadow-sm',
  listClasses = 'flex items-center space-x-1 text-sm',
  activeClasses = 'font-medium text-indigo-600',
  capitalizeLinks = true,
}: BreadcrumbsProps) {
  const paths = usePathname();
  
  if (!paths) return null;
  
  // Skip rendering breadcrumbs on homepage
  if (paths === '/') return null;

  // Generate breadcrumb data
  const pathNames = paths.split('/').filter((path) => path);
  
  // Create breadcrumb items with structured data
  const breadcrumbItems = [
    {
      path: '/',
      label: 'Home',
    },
    ...pathNames.map((name, index) => {
      // Handle dynamic routes with [param] format
      const label = name.startsWith('[') && name.endsWith(']')
        ? 'Details' // Generic label for dynamic routes
        : capitalizeLinks
          ? name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ')
          : name.replace(/-/g, ' ');
      
      // Build the path up to the current item
      const path = `/${pathNames.slice(0, index + 1).join('/')}`;
      
      return { path, label };
    }),
  ];

  // Generate structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': breadcrumbItems.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'item': {
        '@id': `https://compsci.president.ac.id${item.path}`,
        'name': item.label,
      },
    })),
  };

  return (
    <nav aria-label="Breadcrumbs" className={containerClasses}>
      {/* Structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <ol className={listClasses} itemScope itemType="https://schema.org/BreadcrumbList">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          
          return (
            <li 
              key={item.path} 
              className="flex items-center"
              itemProp="itemListElement" 
              itemScope 
              itemType="https://schema.org/ListItem"
            >
              {/* For visual rendering */}
              {index === 0 ? (
                // Home link
                <Link href="/" className="flex items-center hover:text-indigo-500 transition-colors">
                  {homeElement}
                </Link>
              ) : (
                <>
                  {/* Separator */}
                  {separator}
                  
                  {/* Regular links or active item */}
                  {isLast ? (
                    <span className={activeClasses} aria-current="page">
                      {item.label}
                    </span>
                  ) : (
                    <Link 
                      href={item.path}
                      className="hover:text-indigo-500 transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </>
              )}
              
              {/* Hidden metadata for search engines */}
              <meta itemProp="position" content={`${index + 1}`} />
              <Link href={item.path} itemProp="item" className="hidden">
                <span itemProp="name">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
