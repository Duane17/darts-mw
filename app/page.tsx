// src/app/page.tsx  (adjust if your public home lives elsewhere)

import { Hero } from "@/components/sections/home/Hero";
import { Programmes } from "@/components/sections/home/Programmes";
import { CtaBand } from "@/components/sections/home/CtaBand";
import { FacebookSection } from "@/components/sections/home/FacebookSection";
import { heroData, programmesData, ctaBandData } from "@/data/home";
import { getHomeContent } from "@/lib/public-api/api-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Build merged view models from a single API call with safe fallbacks
async function loadHomeViewModels() {
  try {
    const api = await getHomeContent(); // { heroBg, ctaBg, programmes: [...] }

    // Hero: only bgImage comes from backend for now
    const mergedHero = {
      ...heroData,
      bgImage:
        api?.heroBg && api.heroBg.trim().length > 0 ? api.heroBg : heroData.bgImage,
    };

    // Programmes: keep your heading copy, merge items per index or id
    const fallback = programmesData;
    const apiItems = Array.isArray(api?.programmes) ? api!.programmes : [];

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

    // CTA band: hydrate bgImage from backend ctaBg, keep text from @data
    const mergedCta = {
      ...ctaBandData,
      bgImage:
        api?.ctaBg && api.ctaBg.trim().length > 0 ? api.ctaBg : ctaBandData.bgImage,
    };

    return { mergedHero, mergedProgrammes, mergedCta };
  } catch {
    // API unavailable or error, return pure fallbacks
    return {
      mergedHero: heroData,
      mergedProgrammes: programmesData,
      mergedCta: ctaBandData,
    };
  }
}

export default async function HomePage() {
  const { mergedHero, mergedProgrammes, mergedCta } = await loadHomeViewModels();

  return (
    <main className="min-h-screen">
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-dam-white text-dam-black px-4 py-2 rounded-md font-medium"
      >
        Skip to main content
      </a>

      <div id="main-content">
        {/* Hero from backend heroBg with fallback */}
        <Hero data={mergedHero} />

        {/* Programmes from backend with per item fallbacks */}
        <Programmes data={mergedProgrammes} />

        {/* Facebook feed */}
        <FacebookSection pageUrl="https://www.facebook.com/mncs.mw" />

        {/* CTA band from backend ctaBg with fallback */}
        <CtaBand data={mergedCta} />
      </div>
    </main>
  );
}
