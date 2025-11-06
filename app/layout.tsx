// src/app/layout.tsx
import type React from "react";
import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import "../styles/theme.css";
import { Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { QueryProvider } from "@/lib/query";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const oswald = Oswald({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-oswald",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Darts Association of Malawi | DAM",
  description:
    "Official website of the Darts Association of Malawi - Promoting excellence in darts across the nation. One Board, One People!",
  generator: "v0.app",
  keywords: "darts, malawi, sports, association, tournament, national team, AUSC",
  authors: [{ name: "Darts Association of Malawi" }],
  creator: "Darts Association of Malawi",
  publisher: "Darts Association of Malawi",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_MW",
    url: "https://dartsmalawi.org",
    title: "Darts Association of Malawi | DAM",
    description:
      "Official website of the Darts Association of Malawi - Promoting excellence in darts across the nation. One Board, One People!",
    siteName: "Darts Association of Malawi",
  },
  twitter: {
    card: "summary_large_image",
    title: "Darts Association of Malawi | DAM",
    description:
      "Official website of the Darts Association of Malawi - Promoting excellence in darts across the nation. One Board, One People!",
  },
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
  themeColor: "#0a7a44",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="color-scheme" content="light" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className={`font-sans ${inter.variable} ${oswald.variable} antialiased`}>
        <a href="#main-content" className="dam-skip-link">
          Skip to main content
        </a>

        <QueryProvider>
          <Navbar />
          <Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center">
                <div className="dam-loading text-dam-green">Loading...</div>
              </div>
            }
          >
            {children}
            <Analytics />
          </Suspense>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
