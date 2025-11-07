// components/sections/leadership/LeadershipGrid.tsx
import Link from "next/link";
import { SectionShell } from "@/components/common/SectionShell";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ProfileCard } from "@/components/common/ProfileCard";
import { listLeadersPage } from "@/lib/public-api/api-client";
import type { Leader as ApiLeader } from "@/lib/public-api/api-types";
import { mediaUrl } from "@/lib/public-api/media";
import { cn } from "@/lib/utils";

/** Props allow an optional heading override and server pagination */
export interface LeadershipGridProps {
  heading?: {
    overline?: string;
    title?: string;
    subtitle?: string;
  };
  offset: number;
  limit: number;
}

/** View model used by ProfileCard and grid layout */
type GridLeader = {
  id: string;
  slug?: string;
  name: string;
  title: string;
  profile: string;
  photo: string;
};

/** Map API Leader into the grid view model */
function toGridLeader(l: ApiLeader): GridLeader {
  return {
    id: l.id,
    slug: l.slug,
    name: l.name,
    title: l.title,
    profile: l.profile ?? "",
    photo: mediaUrl(l.photo ?? ""),
  };
}

/**
 * Server rendered leadership grid.
 * Fetches data on the server, builds absolute image URLs, and returns static markup.
 */
export default async function LeadershipGrid({
  heading,
  offset,
  limit,
}: LeadershipGridProps) {
  let leaders: GridLeader[] = [];
  let total = 0;
  let hasMore = false;

  try {
    const page = await listLeadersPage({
      activeOnly: true,
      limit,
      offset,
      sort: "name_asc",
    });
    leaders = (page.items ?? []).map(toGridLeader);
    total = page.total ?? leaders.length;
    hasMore = page.hasMore ?? offset + leaders.length < total;
  } catch {
    // On API error, show an empty state below
    leaders = [];
    total = 0;
    hasMore = false;
  }

  const h = {
    overline: heading?.overline ?? "Leadership",
    title: heading?.title ?? "Meet the team",
    subtitle:
      heading?.subtitle ??
      "Vision, stewardship, and service for the sport across Malawi",
  };

  const currentPage = Math.floor(offset / limit) + 1;
  const pages = Math.max(1, Math.ceil(total / limit));

  return (
    <SectionShell className="py-20 bg-dam-light-card">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        <SectionHeading
          overline={h.overline}
          title={h.title}
          subtitle={h.subtitle}
          centered
          className="mb-4"
        />

        {/* Empty state */}
        {leaders.length === 0 ? (
          <div className="rounded-xl border border-neutral-200 bg-white p-6 text-center">
            <p className="text-neutral-700">
              No leaders found yet. Please check back later.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {leaders.map((person) => {
              const href = `/leadership/${person.slug || person.id}`;
              return (
                <Link
                  href={href}
                  key={person.slug || person.id}
                  className="block group focus:outline-none"
                >
                  <ProfileCard
                    photo={person.photo}
                    name={person.name}
                    title={person.title}
                    accent="gold"
                    parallax
                    glass
                    profile=""
                  />
                </Link>
              );
            })}
          </div>
        )}

        {/* Pager as links so each page is server rendered */}
        {total > limit && (
          <div className="flex items-center justify-center gap-3 pt-4">
            <Link
              aria-disabled={offset === 0}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-sm",
                offset === 0 && "pointer-events-none opacity-50"
              )}
              href={`/leadership?offset=${Math.max(0, offset - limit)}&limit=${limit}`}
            >
              Previous
            </Link>
            <span className="text-sm text-neutral-600">
              {currentPage} of {pages}
            </span>
            <Link
              aria-disabled={!hasMore}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-sm",
                !hasMore && "pointer-events-none opacity-50"
              )}
              href={`/leadership?offset=${offset + limit}&limit=${limit}`}
            >
              Next
            </Link>
          </div>
        )}
      </div>
    </SectionShell>
  );
}
