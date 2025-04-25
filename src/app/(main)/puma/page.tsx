// import { redirect } from "next/navigation";

// export default async function OrganizationPage() {
// 	return redirect("/puma/puma-informatics")
// }

import type React from "react"
import "../../globals.css"
import { Inter } from "next/font/google"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata = {
  title: "PUMA Informatics",
  description: "PUMA Informatics - FRAGNATIOUS CABINET PERIOD 2023/2024",
}

export default function OrganizationPage({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}

