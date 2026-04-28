// src/app/page.tsx
import { Hero } from "@/components/sections/home/Hero";
import { HomeAnnouncements } from "@/components/sections/home/HomeAnnouncements";
import { MissionVision } from "@/components/sections/about/MissionVision";
import { CoreValues } from "@/components/sections/about/CoreValues";
import { StrategicGoals } from "@/components/sections/about/StrategicGoals";
import { CtaBand } from "@/components/sections/home/CtaBand";

import { heroData, ctaBandData } from "@/data/home";
import { missionVision as mvFallback, values as valuesFallback } from "@/data/about";
import { getHomeContent, listAnnouncementsPage, getAboutContent } from "@/lib/public-api/api-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Merges backend API data with local static fallbacks to ensure 
 * the page is always renderable even if the DB is empty.
 */
async function loadHomeViewModels() {
  const [api, announcementsData, aboutApi] = await Promise.allSettled([
    getHomeContent(),
    listAnnouncementsPage({ pageSize: 6 }),
    getAboutContent() 
  ]);

  const apiContent = api.status === 'fulfilled' ? api.value : null;
  const latestAnnouncements = announcementsData.status === 'fulfilled' ? announcementsData.value.items : [];
  const aboutContent = aboutApi.status === 'fulfilled' ? aboutApi.value : null;

  // 1. Hero Hydration: Supports the new multi-image slideshow array
  const mergedHero = {
    ...heroData,
    heroBgs: apiContent?.heroBgs && apiContent.heroBgs.length > 0
      ? apiContent.heroBgs
      : [heroData.bgImage], // Fallback wrapped in array for component compatibility
  };

  // 2. CTA Band Hydration
  const mergedCta = {
    ...ctaBandData,
    bgImage: apiContent?.ctaBg || ctaBandData.bgImage,
  };

  // 3. Strategic Identity (Mission/Vision) Hydration
  const mvApi = aboutContent?.missionVision;
  const mergedMV = {
    images: {
      mission: mvApi?.missionBg || mvFallback.images.mission,
      vision: mvApi?.visionBg || mvFallback.images.vision,
    },
    mission: mvApi?.mission || mvFallback.mission,
    vision: mvApi?.vision || mvFallback.vision,
    motto: mvApi?.motto || mvFallback.motto,
  };

  // 4. Core Values Hydration
  const valueItems = aboutContent?.coreValues?.items ?? [];
  const mergedValues = {
    items: valueItems.length > 0 
      ? valueItems.map((it, idx) => ({
          title: it.title || valuesFallback[idx]?.title || "Value",
          desc: it.desc || valuesFallback[idx]?.desc || "",
          bgImage: it.bgImage || valuesFallback[idx]?.bgImage || "",
        }))
      : valuesFallback
  };

  return { 
    mergedHero, 
    mergedCta, 
    latestAnnouncements, 
    mergedMV, 
    mergedValues 
  };
}

export default async function HomePage() {
  const { 
    mergedHero, 
    mergedCta, 
    latestAnnouncements, 
    mergedMV, 
    mergedValues 
  } = await loadHomeViewModels();

  return (
    <main className="min-h-screen">
      <div id="main-content">
        {/* Dynamic Hero with Slideshow Support */}
        <Hero data={mergedHero} />
        
        {/* Strategic Identity Sections */}
        <MissionVision data={mergedMV} />
        <CoreValues data={mergedValues} />
        <StrategicGoals />
        
        {/* News & Updates - Only shows if data exists */}
        {latestAnnouncements.length > 0 && (
          <HomeAnnouncements announcements={latestAnnouncements} />
        )}

        {/* Closing Call to Action */}
        <CtaBand data={mergedCta} />
      </div>
    </main>
  );
}