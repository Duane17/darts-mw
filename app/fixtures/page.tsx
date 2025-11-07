// src/app/fixtures/page.tsx
import type { Metadata, Viewport } from "next";
import FixturesTimeline from "@/components/sections/fixtures/FixturesTimeline";
import type { LeagueFilter } from "@/lib/public-api/api-client";

export const metadata: Metadata = {
  title: "Fixtures & Results | Darts Association of Malawi",
  description: "Upcoming fixtures and completed results in one timeline, with dates, venues, and quick links.",
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

type ViewMode = "all" | "upcoming" | "results";
type RangePreset = "this-month" | "this-week" | "all";

export default async function FixturesPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const now = new Date();
  const defaultSeasonYear = now.getFullYear();
  const sp = new URLSearchParams();

  const seasonYear = Number(
    Array.isArray(searchParams?.seasonYear) ? searchParams?.seasonYear[0] : searchParams?.seasonYear ?? defaultSeasonYear
  );

  // Accept ALL by default
  const league = (
    Array.isArray(searchParams?.league) ? searchParams?.league[0] : searchParams?.league ?? "ALL"
  ).toUpperCase() as LeagueFilter;

  const view = (
    Array.isArray(searchParams?.view) ? searchParams?.view[0] : searchParams?.view ?? "all"
  ).toLowerCase() as ViewMode;

  const range = (
    Array.isArray(searchParams?.range) ? searchParams?.range[0] : searchParams?.range ?? "this-month"
  ).toLowerCase() as RangePreset;

  const page = Number(Array.isArray(searchParams?.page) ? searchParams?.page[0] : searchParams?.page ?? 1);
  const pageSize = Number(Array.isArray(searchParams?.pageSize) ? searchParams?.pageSize[0] : searchParams?.pageSize ?? 20);

  sp.set("seasonYear", String(seasonYear));
  sp.set("league", league);
  sp.set("view", view);
  sp.set("range", range);
  sp.set("pageSize", String(pageSize));
  sp.set("page", String(page));

  return (
    <main className="min-h-screen">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-dam-red text-white px-4 py-2 rounded-md z-50 font-medium"
      >
        Skip to main content
      </a>

      <div id="main-content">
        <FixturesTimeline
          seasonYear={seasonYear}
          league={league}
          view={view}
          range={range}
          page={page}
          pageSize={pageSize}
          baseSearch={sp}
        />
      </div>
    </main>
  );
}
