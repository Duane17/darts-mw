// app/leadership/[id]/page.tsx
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";

import { LeaderProfile } from "@/components/sections/leadership/LeaderProfile";
import { getLeaderBySlug, listLeadersPage } from "@/lib/public-api/api-client";
import type { Leader } from "@/lib/public-api/api-types";

type PageProps = { params: { id: string } };

// Force server rendering at request time.
// If you prefer ISR, replace this with: export const revalidate = 60;
export const dynamic = "force-dynamic";

// Never throw from this helper. Return null on failure.
async function safeGetLeader(idOrSlug: string): Promise<Leader | null> {
  try {
    const leader = await getLeaderBySlug(idOrSlug);
    return leader ?? null;
  } catch {
    return null;
  }
}

// Metadata is computed at request time based on the leader data.
export async function generateMetadata(
  { params }: PageProps,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const leader = await safeGetLeader(params.id);
  if (!leader) return {};

  const title = `${leader.name} | Leadership | Darts Association of Malawi`;
  const description =
    leader.tagline ||
    leader.profile ||
    `Profile of ${leader.name}${leader.title ? `, ${leader.title}` : ""}.`;

  // If you do not use the Next Image optimizer, omitting images is fine.
  const images = leader.photo ? [{ url: leader.photo }] : undefined;

  return {
    title,
    description,
    openGraph: { title, description, type: "profile", images },
    twitter: { card: "summary_large_image", title, description, images },
  };
}

export default async function LeaderProfilePage({ params }: PageProps) {
  const leader = await safeGetLeader(params.id);
  if (!leader) return notFound();

  // Fetch peers for the footer pills, but do not fail the page if the API is down.
  let peers: Leader[] = [];
  try {
    const page = await listLeadersPage({ limit: 50, offset: 0, activeOnly: true });
    peers = page.items;
  } catch {
    peers = [];
  }

  return <LeaderProfile leader={leader} peers={peers} />;
}
