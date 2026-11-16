// src/app/about/page.tsx
import { AboutHero } from "@/components/sections/about/AboutHero";
import { Programmes } from "@/components/sections/home/Programmes"; // Rendering Org Profile here
import { aboutHero as aboutHeroFallback } from "@/data/about";
import { programmesData } from "@/data/home";
import { getAboutContent, getHomeContent } from "@/lib/public-api/api-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function loadAboutViewModels() {
  // allSettled: an API outage should fall back to built-in content, not crash the page
  const [about, home] = await Promise.allSettled([getAboutContent(), getHomeContent()]);
  const apiContent = about.status === "fulfilled" ? about.value : null;
  const homeContent = home.status === "fulfilled" ? home.value : null;

  const heroVm = {
    overline: aboutHeroFallback.overline,
    title: "Darts Association of Malawi",
    sub: apiContent?.missionVision?.motto || aboutHeroFallback.sub,
    bgImage: apiContent?.heroBg || aboutHeroFallback.bgImage,
  };

  // Hydrate the Programmes component with Profile data
  // Using the fallback as the structural base
  const fallback = programmesData;
  const apiItems = homeContent?.programmes || [];
  
  const mergedProfile = {
    heading: {
      overline: "Organization Profile",
      title: "Darts Association of Malawi",
      subtitle: "National governing body for the promotion, regulation, and development of darts across Malawi"
    },
    programmes: apiItems.length > 0 
      ? apiItems.map((p, idx) => ({
          id: p.id || `profile-${idx}`,
          title: p.title || fallback.programmes[idx]?.title,
          description: p.description || fallback.programmes[idx]?.description,
          cta: "Read More",
          bgImage: p.bgImage || fallback.programmes[idx]?.bgImage,
        }))
      : fallback.programmes
  };

  return { heroVm, mergedProfile };
}

export default async function AboutPage() {
  const { heroVm, mergedProfile } = await loadAboutViewModels();

  return (
    <main className="min-h-screen">
      <div id="main-content">
        <AboutHero data={heroVm} />
        
        {/* Render the Programmes component as the Org Profile section */}
        <Programmes data={mergedProfile} />
      </div>
    </main>
  );
}