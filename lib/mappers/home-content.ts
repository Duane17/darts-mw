import { HomeContent } from "../public-api/api-types";
import type { heroData as defaultHero } from "@/data/home";

// shape of the Hero data prop
export type HeroUi = typeof defaultHero;

export function mapHero(content: HomeContent | null | undefined, fallback: HeroUi): HeroUi {
  const bg = content?.heroBg && content.heroBg.trim().length > 0 ? content.heroBg : fallback.bgImage;
  return { ...fallback, bgImage: bg };
}
