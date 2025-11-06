// app/leadership/[id]/page.tsx
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { LeaderProfile } from "@/components/sections/leadership/LeaderProfile";
import { getLeaderBySlug, listLeadersPage } from "@/lib/public-api/api-client";
import type { Leader } from "@/lib/public-api/api-types";

type PageProps = { params: { id: string } };

// Helper to page through leaders with the API's limit <= 100
async function fetchAllLeaderRefs(max = 2000) {
  const limit = 100; // backend maximum
  let offset = 0;
  const out: Pick<Leader, "id" | "slug">[] = [];

  try {
    // loop until no more
    // stop early if we reach the max safety cap
    for (;;) {
      const page = await listLeadersPage({ limit, offset, activeOnly: true });
      for (const l of page.items) out.push({ id: l.id, slug: l.slug });
      if (!page.hasMore) break;
      offset += page.items.length;
      if (out.length >= max) break;
    }
  } catch {
    // swallow errors so build does not crash in dev
  }
  return out;
}

export async function generateStaticParams() {
  const items: { id: string; slug?: string }[] = []
  let offset = 0
  const limit = 100
  for (let guard = 0; guard < 20; guard++) {
    const page = await listLeadersPage({ activeOnly: true, limit, offset })
    items.push(...page.items.map(l => ({ id: l.id, slug: l.slug })))
    if (!page.hasMore) break
    offset += page.items.length
  }
  return items.map(l => ({ id: l.slug || l.id }))
}


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

  // If your Next Image domain is configured, use the absolute photo URL;
  // otherwise omit images to avoid warnings.
  const images = leader.photo ? [{ url: leader.photo }] : undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
  };
}

export default async function LeaderProfilePage({ params }: PageProps) {
  const leader = await safeGetLeader(params.id);
  if (!leader) return notFound();

  // Load a small peer list for the footer pills, but do not fail the page if it errors
  let peers: Leader[] = [];
  try {
    const page = await listLeadersPage({ limit: 50, offset: 0, activeOnly: true });
    peers = page.items;
  } catch {
    peers = [];
  }

  return <LeaderProfile leader={leader} peers={peers} />;
}

async function safeGetLeader(idOrSlug: string): Promise<Leader | null> {
  try {
    const leader = await getLeaderBySlug(idOrSlug);
    return leader ?? null;
  } catch {
    return null;
  }
}
