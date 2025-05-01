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

export const metadata = {
    title: {
        template: "%s | PUFA Computer Science",
        default: "PUFA Computer Science",
    },
    description: "PUFA Computer Science is a organization in President University",
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
