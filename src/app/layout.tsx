import "./globals.css";
import localFont from "next/font/local";
import Providers from "@/components/Loading";
import AuthProvider from "@/components/AuthProvider";

// Define your main custom font
const customFont = localFont({
    src: [
        {
            path: '../../public/fonts/Geist-Regular.otf',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../../public/fonts/Geist-Bold.otf',
            weight: '700',
            style: 'normal',
        }
    ],
    variable: '--font-custom',
});

// Define hero font for specific elements
const heroFonts = localFont({
    src: [
        {
            path: '../../public/fonts/BebasNeue-Regular.ttf',
            weight: '400',
            style: 'normal',
        },
    ],
    variable: '--font-hero',
});

// Viewport configuration - separate from metadata as required in Next.js 14+
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
    description: "PUFA Computer Science is the official Computer Science organization at President University, offering events, news, projects and resources for CS students.",
    keywords: "computer science, president university, CS events, programming, PUFA Computing, PUFA Computer Science, student organization",
    authors: [{ name: "PUFA Computer Science", url: "https://compsci.president.ac.id" }],
    creator: "PUFA Computer Science",
    publisher: "President University",
    formatDetection: {
        email: false,
        telephone: false,
    },
    metadataBase: new URL("https://compsci.president.ac.id"),
    alternates: {
        canonical: "/",
    },
    openGraph: {
        title: "PUFA Computer Science - President University",
        description: "Official Computer Science organization at President University with events, news, and resources for CS students",
        url: "https://compsci.president.ac.id",
        siteName: "PUFA Computer Science",
        locale: "en_US",
        type: "website",
        images: [
            {
                url: "/images/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "PUFA Computer Science",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "PUFA Computer Science - President University",
        description: "Official Computer Science organization at President University",
        images: ["/images/og-image.jpg"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-video-preview": -1,
            "max-snippet": -1,
        },
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${customFont.variable} ${heroFonts.variable}`}>
            <body className={customFont.className}>
                <AuthProvider>
                    <Providers children={children} />
                </AuthProvider>
            </body>
        </html>
    );
}
