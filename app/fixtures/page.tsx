// app/fixtures/page.tsx
import type { Metadata, Viewport } from "next";
import FixturesTimelineClient from "@/components/sections/fixtures/FixturesTimelineClient";

export const metadata: Metadata = {
  title: "Fixtures & Results | Darts Association of Malawi",
  description:
    "Upcoming fixtures and completed results in one timeline, with dates, venues, and quick links.",
  openGraph: {
    title: "Fixtures & Results | Darts Association of Malawi",
    description: "Browse upcoming fixtures and recent results together.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function FixturesPage() {
  return (
    <main className="min-h-screen">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-dam-red text-white px-4 py-2 rounded-md z-50 font-medium"
      >
        Skip to main content
      </a>

      <div id="main-content">
        <FixturesTimelineClient />
      </div>
    </main>
  );
}
