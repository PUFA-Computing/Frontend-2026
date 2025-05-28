import { Metadata } from 'next';

// Metadata khusus untuk halaman utama
export const metadata: Metadata = {
  title: 'PUFA Computer Science - President University',
  description: 'Official Computer Science organization at President University. Discover events, news, projects, and resources for CS students. Join our community of future tech leaders.',
  keywords: 'PUFA Computer Science, President University, computer science events, programming, tech community, CS department, faculty of computing, Cikarang',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'PUFA Computer Science - President University',
    description: 'Join the premier Computer Science community at President University. Discover events, projects, and resources for CS students.',
    url: 'https://compsci.president.ac.id',
    siteName: 'PUFA Computer Science',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/images/og/homepage-og.png',
        width: 1200,
        height: 630,
        alt: 'PUFA Computer Science - President University',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PUFA Computer Science - President University',
    description: 'Official Computer Science organization at President University',
    images: ['/images/og/homepage-og.png'],
  },
  // Uncomment dan tambahkan kode verifikasi Google Search Console saat sudah tersedia
  // verification: {
  //   google: 'kode-verifikasi-dari-google-search-console',
  // },
};
