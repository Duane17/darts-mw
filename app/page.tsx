// src/app/page.tsx
import { Hero } from "@/components/sections/home/Hero";
import { Programmes } from "@/components/sections/home/Programmes";
import { CtaBand } from "@/components/sections/home/CtaBand";
import { FacebookSection } from "@/components/sections/home/FacebookSection";
import { HomeAnnouncements } from "@/components/sections/home/HomeAnnouncements"; // New Component
import { heroData, programmesData, ctaBandData } from "@/data/home";
import { getHomeContent, listAnnouncementsPage } from "@/lib/public-api/api-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function loadHomeViewModels() {
  // Fetch Home Content and Announcements in parallel
  const [api, announcementsData] = await Promise.allSettled([
    getHomeContent(),
    listAnnouncementsPage({ pageSize: 6 })
  ]);

  const apiContent = api.status === 'fulfilled' ? api.value : null;
  const latestAnnouncements = announcementsData.status === 'fulfilled' ? announcementsData.value.items : [];

  // Hero Hydration
  const mergedHero = {
    ...heroData,
    bgImage: apiContent?.heroBg && apiContent.heroBg.trim().length > 0 ? apiContent.heroBg : heroData.bgImage,
  };

  // Programmes Hydration
  const fallback = programmesData;
  const apiItems = Array.isArray(apiContent?.programmes) ? apiContent!.programmes : [];
  const fbById = new Map(fallback.programmes.map(p => [p.id, p]));
  
  const mergedProgrammes = apiItems.length
    ? {
        heading: fallback.heading,
        programmes: apiItems.map((p, idx) => {
          const fb = fbById.get(p.id) ?? fallback.programmes[idx] ?? fallback.programmes[0];
          return {
            id: p.id ?? fb.id,
            title: p.title || fb.title,
            description: p.description || fb.description,
            cta: (p as any).cta || fb.cta || "Learn more",
            bgImage: p.bgImage && p.bgImage.trim().length > 0 ? p.bgImage : fb.bgImage,
          };
        }),
      }
    : fallback;

  // CTA Hydration
  const mergedCta = {
    ...ctaBandData,
    bgImage: apiContent?.ctaBg && apiContent.ctaBg.trim().length > 0 ? apiContent.ctaBg : ctaBandData.bgImage,
  };

  return { mergedHero, mergedProgrammes, mergedCta, latestAnnouncements };
}

export default async function HomePage() {
  const { mergedHero, mergedProgrammes, mergedCta, latestAnnouncements } = await loadHomeViewModels();

  return (
    <main className="min-h-screen">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-white text-black px-4 py-2 rounded-md font-medium"
      >
        Skip to main content
      </a>

      <div id="main-content">
        <Hero data={mergedHero} />
        <Programmes data={mergedProgrammes} />
        {latestAnnouncements.length > 0 && (
          <HomeAnnouncements announcements={latestAnnouncements} />
        )}
        <CtaBand data={mergedCta} />
      </div>
    </main>
  );
}