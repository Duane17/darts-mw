// src/lib/public-api/extractors.ts
export type AnyHomeContent = Record<string, unknown> | { data?: Record<string, unknown> };

export function pickHomeDataShape(input: unknown): Record<string, unknown> | null {
  if (!input || typeof input !== "object") return null;
  const any = input as AnyHomeContent;
  if (any && typeof any === "object") {
    if (any.data && typeof any.data === "object") return any.data as Record<string, unknown>;
    return any as Record<string, unknown>;
  }
  return null;
}

/** Find a hero background path in multiple possible shapes */
export function findHeroBgPath(input: unknown): string | undefined {
  const data = pickHomeDataShape(input);
  if (!data) return undefined;

  // 1) Top level "heroBg"
  const heroBg = data["heroBg"];
  if (typeof heroBg === "string" && heroBg.startsWith("/uploads/")) return heroBg;

  // 2) Nested hero.image or hero.heroBg if you later normalize it
  const hero = data["hero"];
  if (hero && typeof hero === "object") {
    const h = hero as Record<string, unknown>;
    const heroImage = h["image"];
    if (typeof heroImage === "string" && heroImage.startsWith("/uploads/")) return heroImage;
    const nestedHeroBg = h["heroBg"];
    if (typeof nestedHeroBg === "string" && nestedHeroBg.startsWith("/uploads/")) return nestedHeroBg;
  }

  return undefined;
}
