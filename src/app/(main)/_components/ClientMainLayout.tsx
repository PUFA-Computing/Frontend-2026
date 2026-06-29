'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import HiddenBreadcrumbs from "@/components/ui/HiddenBreadcrumbs";
import Preloader from "@/components/ui/Preloader";
import type GetVersion from "@/services/api/version";

export default function ClientMainLayout({
    children,
    version,
}: {
    children: React.ReactNode;
    version: Awaited<ReturnType<typeof GetVersion>>;
}) {
    const pathname = usePathname();
    const isDashboard = pathname?.startsWith('/dashboard');
    const isCompregen = pathname?.startsWith('/compregen');

    // We don't need to manually add canonical URLs in App Router as they're handled by metadata
    // But we can add structured data for rich results
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'url': 'https://compsci.president.ac.id',
        'name': 'PUFA Computer Science - President University',
        'description': 'Official Computer Science organization at President University with events, news, and resources for CS students',
    };
    
    return (
        <div className="flex min-h-screen flex-col scroll-smooth">
            <Preloader />
            
            {/* Add structured data for SEO */}
            <Script id="website-schema" type="application/ld+json">
                {JSON.stringify(structuredData)}
            </Script>
            
            {!isDashboard && !isCompregen && <Navbar />}
            
            <div className={`flex-1 ${
                isCompregen
                    ? 'bg-[#FBFBFB]'
                    : isDashboard
                    ? 'bg-[#F5EDD0] pt-0'
                    : 'bg-[#F5EDD0]'
            }`}>
                {/* Gunakan breadcrumbs tersembunyi untuk SEO tanpa mengganggu UI */}
                {!isDashboard && !isCompregen && pathname !== '/' && <HiddenBreadcrumbs />}
                
                {children}
            </div>
            
            {!isDashboard && !isCompregen && <Footer version={version} />}
        </div>
    );
}
