// src/app/about/page.tsx
import type { Metadata } from "next";
import { AboutHero } from "@/components/sections/about/AboutHero";
import { MissionVision } from "@/components/sections/about/MissionVision";
import { CoreValues } from "@/components/sections/about/CoreValues";
import { StrategicGoals } from "@/components/sections/about/StrategicGoals";
import {
  aboutHero as aboutHeroFallback,
  missionVision as mvFallback,
  values as valuesFallback,
} from "@/data/about";
import { getAboutContent } from "@/lib/public-api/api-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
    description:
      "Learn about our mission to develop darts excellence across Malawi. One Board, One People!",
    images: ["/images/ABOUT_hero.jpg"],
  },
};

async function loadAboutHero() {
  try {
    const api = await getAboutContent();
    return {
      overline: aboutHeroFallback.overline,
      title: aboutHeroFallback.title,
      sub:
        api?.missionVision?.motto?.trim()
          ? api.missionVision.motto
          : aboutHeroFallback.sub,
      bgImage:
        api?.heroBg && api.heroBg.trim().length > 0
          ? api.heroBg
          : aboutHeroFallback.bgImage,
    };
  } catch {
    return aboutHeroFallback;
  }
}

async function loadMissionVisionVm() {
  try {
    const api = await getAboutContent();
    const mvApi = api?.missionVision;

    return {
      images: {
        mission:
          mvApi?.missionBg && mvApi.missionBg.trim().length > 0
            ? mvApi.missionBg
            : mvFallback.images.mission,
        vision:
          mvApi?.visionBg && mvApi.visionBg.trim().length > 0
            ? mvApi.visionBg
            : mvFallback.images.vision,
      },
      mission: mvApi?.mission?.trim() ? mvApi.mission : mvFallback.mission,
      vision: mvApi?.vision?.trim() ? mvApi.vision : mvFallback.vision,
      motto: mvApi?.motto?.trim() ? mvApi.motto : mvFallback.motto,
    };
  } catch {
    return {
      images: {
        mission: mvFallback.images.mission,
        vision: mvFallback.images.vision,
      },
      mission: mvFallback.mission,
      vision: mvFallback.vision,
      motto: mvFallback.motto,
    };
  }
}

async function loadCoreValuesVm() {
  try {
    const api = await getAboutContent();
    const items = api?.coreValues?.items ?? [];

    if (!Array.isArray(items) || items.length === 0) {
      return { items: valuesFallback };
    }

    // Normalize each item with fallback if a field is missing
    return {
      items: items.map((it, idx) => {
        const fb = valuesFallback[idx] ?? valuesFallback[0];
        return {
          title: it.title?.trim() ? it.title : fb.title,
          desc: it.desc?.trim() ? it.desc : fb.desc,
          bgImage:
            it.bgImage?.trim()?.length > 0 ? it.bgImage : fb.bgImage,
        };
      }),
    };
  } catch {
    return { items: valuesFallback };
  }
}

export default async function AboutPage() {
  const [heroVm, missionVisionVm, coreValuesVm] = await Promise.all([
    loadAboutHero(),
    loadMissionVisionVm(),
    loadCoreValuesVm(),
  ]);

  return (
    <main className="min-h-screen">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-dam-red text-white px-4 py-2 rounded-md z-50 font-medium"
      >
        Skip to main content
      </a>
      <div id="main-content">
        <AboutHero data={heroVm} />
        <MissionVision data={missionVisionVm} />
        <CoreValues data={coreValuesVm} />
        <StrategicGoals />
      </div>
    </main>
  );
}
