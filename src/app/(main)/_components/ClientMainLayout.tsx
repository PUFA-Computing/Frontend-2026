'use client';

import { usePathname } from 'next/navigation';
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
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

    return (
        <div className="flex min-h-screen flex-col scroll-smooth">
            {!isDashboard && <Navbar />}
            <div className={`flex-1 bg-[#FBFBFB] ${isDashboard ? 'pt-0' : ''}`}>{children}</div>
            <Footer version={version} />
        </div>
    );
}
