// app/leadership/page.tsx
import type { Metadata, Viewport } from "next";
import LeadershipGrid from "@/components/sections/leadership/LeadershipGrid";

// Pick one cache policy:
// export const dynamic = "force-dynamic"; // always fresh
export const revalidate = 60; // time based revalidation

export const metadata: Metadata = {
  title: "Leadership | Darts Association of Malawi",
  description:
    "Meet the leadership team guiding the Darts Association of Malawi. Vision, stewardship, and service for the sport across the nation.",
  openGraph: {
    title: "Leadership | Darts Association of Malawi",
    description: "Profiles of the DAM leadership team.",
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

export default async function LeadershipPage({
  searchParams,
}: {
  searchParams?: { offset?: string; limit?: string };
}) {
  const offset = Math.max(0, Number(searchParams?.offset ?? "0"));
  const limit = Math.min(48, Math.max(1, Number(searchParams?.limit ?? "24"))); // safety caps

  return (
    <main className="min-h-screen">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-dam-red text-white px-4 py-2 rounded-md font-medium"
      >
        Skip to main content
      </a>

      <div id="main-content">
        <LeadershipGrid
          heading={{
            overline: "Leadership",
            title: "Meet the team",
            subtitle:
              "Vision, stewardship, and service for the sport across Malawi",
          }}
          offset={offset}
          limit={limit}
        />
      </div>
    </main>
  );
}
