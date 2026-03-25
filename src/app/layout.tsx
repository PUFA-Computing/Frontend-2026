import "./globals.css";
import localFont from "next/font/local";
import { Cormorant_Garamond, Lora } from "next/font/google";
import Providers from "@/components/Loading";
import AuthProvider from "@/components/AuthProvider";

// Geist — UI / sans-serif font (keep for admin/UI elements)
const geistFont = localFont({
    src: [
        { path: '../../public/fonts/Geist-Regular.otf', weight: '400', style: 'normal' },
        { path: '../../public/fonts/Geist-Bold.otf',    weight: '700', style: 'normal' },
    ],
    variable: '--font-sans',
});

// Cormorant Garamond — Display / calligraphic heading font
// Matches the elegant italic calligraphy in the Aurascendia branding
const cormorant = Cormorant_Garamond({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
    style: ['normal', 'italic'],
    variable: '--font-display',
    display: 'swap',
});

// Lora — Body serif, refined Times-style
const lora = Lora({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    style: ['normal', 'italic'],
    variable: '--font-serif',
    display: 'swap',
});

export const viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
};

export const metadata = {
    title: {
        template: "%s | PUFA Computer Science",
        default: "PUFA Computer Science - President University",
    },
    description: "PUFA Computer Science is the official Computer Science organization at President University.",
    keywords: "computer science, president university, CS events, PUFA Computing",
    authors: [{ name: "PUFA Computer Science", url: "https://compsci.president.ac.id" }],
    creator: "PUFA Computer Science",
    publisher: "President University",
    formatDetection: { email: false, telephone: false },
    metadataBase: new URL("https://compsci.president.ac.id"),
    alternates: { canonical: "/" },
    openGraph: {
        title: "PUFA Computer Science - President University",
        description: "Official Computer Science organization at President University",
        url: "https://compsci.president.ac.id",
        siteName: "PUFA Computer Science",
        locale: "en_US",
        type: "website",
        images: [{ url: "/images/og-image.jpg", width: 1200, height: 630, alt: "PUFA Computer Science" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "PUFA Computer Science - President University",
        description: "Official Computer Science organization at President University",
        images: ["/images/og-image.jpg"],
    },
    robots: {
        index: true, follow: true,
        googleBot: { index: true, follow: true, "max-image-preview": "large", "max-video-preview": -1, "max-snippet": -1 },
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${geistFont.variable} ${cormorant.variable} ${lora.variable}`}>
            <body className={lora.className}>
                <AuthProvider>
                    <Providers children={children} />
                </AuthProvider>
            </body>
        </html>
    );
}
