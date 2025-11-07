// app/standings/page.tsx
import type { Metadata, Viewport } from "next";
import StandingsTable from "@/components/sections/standings/StandingsTable";

export const revalidate = 60; // or use: export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Standings | Darts Association of Malawi",
  description: "Live league table with points, goal difference, and form indicators.",
  openGraph: {
    title: "Standings | Darts Association of Malawi",
    description: "Live league table with points, goal difference, and form indicators.",
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

export default async function StandingsPage({
  searchParams,
}: {
  searchParams?: { seasonYear?: string; league?: string };
}) {
  const seasonYear = Number(searchParams?.seasonYear ?? "2025");
  const league = (searchParams?.league === "CRDL" ? "CRDL" : "SRDL") as "SRDL" | "CRDL";

  return (
    <main className="min-h-screen">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-dam-red text-white px-4 py-2 rounded-md z-50 font-medium"
      >
        Skip to main content
      </a>
      <div id="main-content">
        <StandingsTable seasonYear={seasonYear} league={league} />
      </div>
    </main>
  );
}
