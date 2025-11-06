"use client";

import * as React from "react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listLeadersPage } from "@/lib/public-api/api-client";
import type { Leader as ApiLeader } from "@/lib/public-api/api-types";
import { mediaUrl } from "@/lib/public-api/media";
import { SectionShell } from "@/components/common/SectionShell";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ProfileCard } from "@/components/common/ProfileCard";
import Link from "next/link";

/** Props allow an optional heading override if you want to customize copy later */
export interface LeadershipGridClientProps {
  heading?: {
    overline?: string;
    title?: string;
    subtitle?: string;
  };
  /** Initial page size for the list */
  pageSize?: number;
}

/** View model used by ProfileCard and LeadershipGrid layout */
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

export default function LeadershipGridClient({
  heading,
  pageSize = 24,
}: LeadershipGridClientProps) {
  const [offset, setOffset] = useState(0);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["leaders", { offset, limit: pageSize }],
    queryFn: () => listLeadersPage({ activeOnly: true, limit: pageSize, offset }),
    staleTime: 15_000,
    retry: 1,
  });

  const leaders: GridLeader[] = (data?.items ?? []).map(toGridLeader);
  const total = data?.total ?? 0;
  const hasMore = data?.hasMore ?? false;
  const limit = data?.limit ?? pageSize;

  const h = {
    overline: heading?.overline ?? "Leadership",
    title: heading?.title ?? "Meet the team",
    subtitle:
      heading?.subtitle ??
      "Vision, stewardship, and service for the sport across Malawi",
  };

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

        {/* Loading state */}
        {isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 rounded-xl bg-white/60 animate-pulse" />
            ))}
          </div>
        )}

        {/* Error state */}
        {isError && !isLoading && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            Failed to load leaders.{" "}
            <button
              onClick={() => refetch()}
              className="underline underline-offset-4"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && leaders.length === 0 && (
          <div className="rounded-xl border border-neutral-200 bg-white p-6 text-center">
            <p className="text-neutral-700">
              No leaders found yet. Please check back later.
            </p>
          </div>
        )}

        {/* Grid */}
        {!isLoading && !isError && leaders.length > 0 && (
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
                    glass profile={""}                  />
                </Link>
              );
            })}
          </div>
        )}

        {/* Simple pager controls if there are more results */}
        {!isLoading && !isError && total > limit && (
          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              disabled={offset === 0}
              onClick={() => setOffset(Math.max(0, offset - limit))}
              className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-neutral-600">
              {Math.floor(offset / limit) + 1} of{" "}
              {Math.max(1, Math.ceil(total / limit))}
            </span>
            <button
              disabled={!hasMore}
              onClick={() => setOffset(offset + limit)}
              className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </SectionShell>
  );
}
