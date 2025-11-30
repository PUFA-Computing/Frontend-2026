import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vote for Major Leader | PUFA Computer Science",
  description:
    "Cast your vote for the next Major Leader of your program. Choose the candidate who will lead and inspire the Faculty of Computing.",
  keywords: [
    "PUFA",
    "President University",
    "Computer Science",
    "Vote",
    "Major Leader",
    "Election",
    "Informatics",
    "Information System",
  ],
  openGraph: {
    title: "Vote for Major Leader | PUFA Computer Science",
    description:
      "Cast your vote for the next Major Leader. Your voice matters!",
    type: "website",
    images: [
      {
        url: "/images/vote-og.jpg",
        width: 1200,
        height: 630,
        alt: "PUFA Voting",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vote for Major Leader | PUFA Computer Science",
    description: "Cast your vote for the next Major Leader",
  },
};