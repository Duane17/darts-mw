import type { Metadata } from "next"
import { AboutHero } from "@/components/sections/about/AboutHero"
import { MissionVision } from "@/components/sections/about/MissionVision"
import { CoreValues } from "@/components/sections/about/CoreValues"
import { StrategicGoals } from "@/components/sections/about/StrategicGoals"


export const metadata: Metadata = {
  title: "About Us | Darts Association of Malawi",
  description:
    "Learn about the Darts Association of Malawi - our mission, vision, leadership team, and impact on developing darts excellence across the nation. One Board, One People!",
  keywords: [
    "Darts Association Malawi",
    "DAM leadership",
    "darts development Malawi",
    "sports governance",
    "African darts",
    "Malawi sports federation",
    "darts mission vision",
    "community development",
  ],
  openGraph: {
    title: "About Us | Darts Association of Malawi",
    description:
      "Discover our journey, leadership, and commitment to developing darts excellence across Malawi through inclusive programs and strategic partnerships.",
    type: "website",
    images: [
      {
        url: "/images/ABOUT_hero.jpg",
        width: 1200,
        height: 630,
        alt: "Darts Association of Malawi - About Us",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Darts Association of Malawi",
    description: "Learn about our mission to develop darts excellence across Malawi. One Board, One People!",
    images: ["/images/ABOUT_hero.jpg"],
  },
}

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-dam-red text-white px-4 py-2 rounded-md z-50 font-medium"
      >
        Skip to main content
      </a>

      {/* Page content */}
      <div id="main-content">
        {/* Hero Section */}
        <AboutHero />

        {/* Mission & Vision */}
        <MissionVision />

        {/* Core Values */}
        <CoreValues />

        {/* Strategic Goals */}
        <StrategicGoals />
      </div>
    </main>
  )
}
