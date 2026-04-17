import type { Metadata, Viewport } from "next";
import AnnouncementsList from "@/components/sections/announcements/AnnouncementsList";
import { getAnnouncementsContent } from "@/lib/public-api/api-client";

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

  // Fetch the background image from the API
  let bgImage: string | null = null;
  try {
    const content = await getAnnouncementsContent();
    bgImage = content?.backgroundImage ?? null;
  } catch (error) {
    console.error("Failed to fetch announcements background:", error);
    // fallback to default
  }

  return (
    <main className="min-h-screen">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-dam-red text-white px-4 py-2 rounded-md z-50 font-medium"
      >
        Skip to main content
      </a>
      <div id="main-content">
        <AnnouncementsList page={page} pageSize={pageSize} bgImage={bgImage} />
      </div>
    </main>
  );
}