// app/announcements/page.tsx
import type { Metadata, Viewport } from "next";
import AnnouncementsList from "@/components/sections/announcements/AnnouncementsList";

// Server side caching policy. Pick one:
// Always fresh:
// export const dynamic = "force-dynamic";
// or time based ISR:
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Announcements | Darts Association of Malawi",
  description: "Official news and updates from the Darts Association of Malawi.",
  openGraph: {
    title: "Announcements | Darts Association of Malawi",
    description: "Official news and updates from the Darts Association of Malawi.",
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

export default async function AnnouncementsPage({
  searchParams,
}: {
  searchParams?: { page?: string };
}) {
  const page = Number(searchParams?.page ?? "1");
  const pageSize = 9;

  return (
    <main className="min-h-screen">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-dam-red text-white px-4 py-2 rounded-md z-50 font-medium"
      >
        Skip to main content
      </a>
      <div id="main-content">
        {/* Server rendered list */}
        <AnnouncementsList page={page} pageSize={pageSize} />
      </div>
    </main>
  );
}
