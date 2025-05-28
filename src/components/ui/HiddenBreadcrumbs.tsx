'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';

/**
 * Komponen breadcrumbs tersembunyi yang hanya untuk SEO
 * Tidak terlihat di UI tapi memberikan data terstruktur untuk mesin pencari
 */
export default function HiddenBreadcrumbs() {
  const paths = usePathname();
  
  if (!paths || paths === '/') return null;

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
        ? 'Details'
        : name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ');
      
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
    <Script id="breadcrumbs-schema" type="application/ld+json">
      {JSON.stringify(structuredData)}
    </Script>
  );
}
