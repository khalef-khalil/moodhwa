import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Moodhwa - Let Your Mood Set the Plot",
    template: "%s | Moodhwa"
  },
  description: "Discover top-rated manhwas based on your current mood. Find the perfect manhwa that matches how you feel, from action-packed to heartwarming stories.",
  keywords: ["manhwa", "mood", "webtoon", "korean comics", "manga", "recommendations"],
  openGraph: {
    title: "Moodhwa - Let Your Mood Set the Plot",
    description: "Discover top-rated manhwas based on your current mood",
    url: "https://moodhwa.vercel.app",
    siteName: "Moodhwa",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: "Moodhwa",
    card: "summary_large_image",
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
