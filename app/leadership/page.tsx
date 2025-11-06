import type { Metadata } from "next";
import LeadershipGridClient from "@/components/sections/leadership/LeadershipGridClient";

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

export default function LeadershipPage() {
  return (
    <main className="min-h-screen">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-dam-red text-white px-4 py-2 rounded-md font-medium"
      >
        Skip to main content
      </a>

      <div id="main-content">
        <LeadershipGridClient
          heading={{
            overline: "Leadership",
            title: "Meet the team",
            subtitle:
              "Vision, stewardship, and service for the sport across Malawi",
          }}
          pageSize={24}
        />
      </div>
    </main>
  );
}
