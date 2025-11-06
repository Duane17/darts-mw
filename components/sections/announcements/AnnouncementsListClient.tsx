// components/sections/announcements/AnnouncementsListClient.tsx
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SectionShell } from "@/components/common/SectionShell";
import { SectionHeading } from "@/components/common/SectionHeading";
import { listAnnouncementsPage } from "@/lib/public-api/api-client";
import type { Announcement, Priority } from "@/lib/public-api/api-types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { formatLocal } from "@/lib/datetime";
import { Markdown } from "@/components/common/Markdown";

const PRIORITY_STYLES: Record<Priority, string> = {
  gold: "bg-yellow-500/15 text-yellow-300 border-yellow-400/30",
  success: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
  error: "bg-rose-500/15 text-rose-300 border-rose-400/30",
};

function PriorityBadge({ value }: { value?: Priority }) {
  if (!value) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        PRIORITY_STYLES[value]
      )}
    >
      {value === "gold" ? "Priority" : value === "success" ? "Success" : "Alert"}
    </span>
  );
}

function Card({ a }: { a: Announcement }) {
  const created = a.createdAt ? formatLocal(a.createdAt) : null;
  return (
    <article className="group rounded-2xl border border-white/10 bg-black/30 p-5 shadow-sm hover:bg-black/40 transition-colors h-full flex flex-col">
      <header className="space-y-2">
        <div className="flex items-center gap-2">
          {created ? (
            <time
              className="text-xs text-white/70"
              dateTime={new Date(a.createdAt as string).toISOString()}
              suppressHydrationWarning
            >
              {created.date} {created.time}
            </time>
          ) : null}
        </div>
        <h3 className="text-lg font-semibold text-white leading-snug">
          <Link
            href={`/announcements/${encodeURIComponent(a.id)}`}
            className="hover:underline underline-offset-4"
          >
            {a.title}
          </Link>
        </h3>
      </header>

      {a.body ? (
        <div className="mt-3 text-sm text-white/90 line-clamp-4 prose prose-invert prose-sm max-w-none">
          {/* compact Markdown preview inside card */}
          <Markdown compact>
            {a.body}
          </Markdown>
        </div>
      ) : null}

      <div className="mt-auto pt-3 border-t border-white/10">
        <Link
          href={`/announcements/${encodeURIComponent(a.id)}`}
          className="text-dam-gold text-sm font-medium hover:underline underline-offset-4"
          aria-label={`Read announcement: ${a.title}`}
        >
          Read more
        </Link>
      </div>
    </article>
  );
}

export default function AnnouncementsListClient() {
  const [page, setPage] = useState(1);
  const pageSize = 9;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["announcements", { page, pageSize }],
    queryFn: () => listAnnouncementsPage({ page, pageSize }),
    staleTime: 15_000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const items = data?.items ?? [];
  const pages = data?.pages ?? 1;

  return (
    <SectionShell bgImage="/images/cta/cta-bg.jpg" overlay="dark" className="py-20">
      <div className="max-w-6xl mx-auto px-6 space-y-8">
        <SectionHeading
          overline="UPDATES"
          title="Announcements"
          subtitle="Official news and updates from the association"
          centered
        />

        {/* Loading, Error, Empty unchanged... */}

        {!isLoading && !isError && items.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((a) => (
              <Card key={a.id} a={a} />
            ))}
          </div>
        )}

        {!isLoading && !isError && pages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-white/15 bg-black/40 px-3 py-1.5 text-sm text-white/90 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-white/70">Page {page} of {pages}</span>
            <button
              disabled={page >= pages}
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              className="rounded-lg border border-white/15 bg-black/40 px-3 py-1.5 text-sm text-white/90 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </SectionShell>
  );
}
