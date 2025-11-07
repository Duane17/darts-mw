// components/sections/announcements/AnnouncementsList.tsx
import Link from "next/link";
import { SectionShell } from "@/components/common/SectionShell";
import { SectionHeading } from "@/components/common/SectionHeading";
import { listAnnouncementsPage } from "@/lib/public-api/api-client";
import type { Announcement, Priority } from "@/lib/public-api/api-types";
import { cn } from "@/lib/utils";
import { formatLocal } from "@/lib/datetime";
import { Markdown } from "@/components/common/Markdown";

// This is a Server Component. No "use client" and no client fetching.

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
          {/* <PriorityBadge value={a.priority as Priority | undefined} /> */}
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
          <Markdown compact>{a.body}</Markdown>
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

export default async function AnnouncementsList({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}) {
  // Server side data fetch. This call goes through your centralized http client.
  // Cache policy is defined at the page level with export const revalidate.
  const data = await listAnnouncementsPage({ page, pageSize });

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

        {items.length === 0 ? (
          <div className="text-center text-white/80">No announcements yet.</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((a) => (
              <Card key={a.id} a={a} />
            ))}
          </div>
        )}

        {pages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-2">
            {/* Use links so pagination is fully server rendered */}
            <Link
              aria-disabled={page <= 1}
              className={cn(
                "rounded-lg border border-white/15 bg-black/40 px-3 py-1.5 text-sm text-white/90",
                page <= 1 && "pointer-events-none opacity-50"
              )}
              href={`/announcements?page=${Math.max(1, page - 1)}`}
            >
              Previous
            </Link>
            <span className="text-sm text-white/70">
              Page {page} of {pages}
            </span>
            <Link
              aria-disabled={page >= pages}
              className={cn(
                "rounded-lg border border-white/15 bg-black/40 px-3 py-1.5 text-sm text-white/90",
                page >= pages && "pointer-events-none opacity-50"
              )}
              href={`/announcements?page=${Math.min(pages, page + 1)}`}
            >
              Next
            </Link>
          </div>
        )}
      </div>
    </SectionShell>
  );
}
