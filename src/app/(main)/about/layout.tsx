import { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
   title: 'About PUFA Computer Science',
   description: 'Learn about PUFA Computer Science organization, our mission, vision, and the team behind our initiatives at President University.',
   keywords: 'about PUFA Computer Science, computer science organization, President University, CS department, faculty of computing',
   alternates: {
      canonical: '/about',
   },
   openGraph: {
      title: 'About PUFA Computer Science',
      description: 'Learn about PUFA Computer Science organization, our mission, vision, and the team behind our initiatives.',
      url: 'https://compsci.president.ac.id/about',
      type: 'website',
      images: [
         {
            url: '/images/about-og.jpg', // Pastikan gambar ini ada atau ganti dengan yang tersedia
            width: 1200,
            height: 630,
            alt: 'PUFA Computer Science Team',
         },
      ],
   },
};

export default async function AboutLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   // Data terstruktur untuk halaman About
   const aboutSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': 'PUFA Computer Science',
      'url': 'https://compsci.president.ac.id',
      'logo': 'https://compsci.president.ac.id/images/logo.png',
      'description': 'Official Computer Science organization at President University',
      'address': {
         '@type': 'PostalAddress',
         'addressLocality': 'Cikarang',
         'addressRegion': 'West Java',
         'addressCountry': 'Indonesia'
      },
      'contactPoint': {
         '@type': 'ContactPoint',
         'contactType': 'Customer Support',
         'email': 'compsci@president.ac.id'
      }
   };

   return (
      <section className="about-section bg-white">
         {/* Tambahkan data terstruktur untuk SEO */}
         <Script id="about-schema" type="application/ld+json">
            {JSON.stringify(aboutSchema)}
         </Script>
         
         {children}
      </section>
   );
}
