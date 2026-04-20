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

async function loadHomeViewModels() {
  const [api, announcementsData, aboutApi] = await Promise.allSettled([
    getHomeContent(),
    listAnnouncementsPage({ pageSize: 6 }),
    getAboutContent() 
  ]);

  const apiContent = api.status === 'fulfilled' ? api.value : null;
  const latestAnnouncements = announcementsData.status === 'fulfilled' ? announcementsData.value.items : [];
  const aboutContent = aboutApi.status === 'fulfilled' ? aboutApi.value : null;

  // Hero Hydration
  const mergedHero = {
    ...heroData,
    bgImage: apiContent?.heroBg || heroData.bgImage,
  };

  // CTA Band Hydration (Fixing the missing fetch)
  const mergedCta = {
    ...ctaBandData,
    bgImage: apiContent?.ctaBg && apiContent.ctaBg.trim().length > 0 
      ? apiContent.ctaBg 
      : ctaBandData.bgImage,
  };

  // Mission/Vision Hydration
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

  // Core Values Hydration
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
    mergedCta, // Added back to the return object
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
        <Hero data={mergedHero} />
        
        {/* Strategic Identity Section */}
        <MissionVision data={mergedMV} />
        <CoreValues data={mergedValues} />
        <StrategicGoals />
        
        {/* News & Updates */}
        {latestAnnouncements.length > 0 && (
          <HomeAnnouncements announcements={latestAnnouncements} />
        )}
        
        {/* Now using hydrated data with API photo */}
        <CtaBand data={mergedCta} />
      </div>
    </main>
  );
}