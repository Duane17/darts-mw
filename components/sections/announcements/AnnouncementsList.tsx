import Link from "next/link";
import { SectionShell } from "@/components/common/SectionShell";
import { SectionHeading } from "@/components/common/SectionHeading";
import { listAnnouncementsPage } from "@/lib/public-api/api-client";
import type { Announcement, Priority } from "@/lib/public-api/api-types";
import { cn } from "@/lib/utils";
import { formatLocal } from "@/lib/datetime";
import { mediaUrl } from "@/lib/public-api/media";

// Helper to strip HTML tags and entities for the preview
function stripHtml(html: string) {
  // 1. Remove tags
  const noTags = html.replace(/<[^>]*>?/gm, " ");
  // 2. Decode common entities and trim
  return noTags
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

const PRIORITY_STYLES: Record<Priority, string> = {
  gold: "bg-yellow-500/15 text-yellow-300 border-yellow-400/30",
  success: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
  error: "bg-rose-500/15 text-rose-300 border-rose-400/30",
};

function Card({ a }: { a: Announcement }) {
  const created = a.createdAt ? formatLocal(a.createdAt) : null;
  const plainTextPreview = a.body ? stripHtml(a.body) : "";

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

      {plainTextPreview ? (
        <p className="mt-3 text-sm text-white/80 line-clamp-3 leading-relaxed">
          {plainTextPreview}
        </p>
      ) : null}

      <div className="mt-auto pt-4 flex items-center justify-between">
        <Link
          href={`/announcements/${encodeURIComponent(a.id)}`}
          className="text-white text-xs font-medium hover:underline flex items-center gap-1 group/link"
          aria-label={`Read announcement: ${a.title}`}
        >
          Read full post
          <span className="transition-transform group-hover/link:translate-x-1">→</span>
        </Link>
      </div>
    </article>
  );
}

export default async function AnnouncementsList({
  page,
  pageSize,
  bgImage,
}: {
  page: number;
  pageSize: number;
  bgImage?: string | null;
}) {
  const data = await listAnnouncementsPage({ page, pageSize });

  const items = data?.items ?? [];
  const pages = data?.pages ?? 1;

  // Use provided bgImage or fallback to default, then resolve full URL
  const backgroundUrlRaw = bgImage && bgImage.trim() ? bgImage : "/images/cta/cta-bg.jpg";
  const backgroundUrl = mediaUrl(backgroundUrlRaw);

  return (
    <SectionShell bgImage={backgroundUrl} overlay="dark" className="py-20">
      <div className="max-w-6xl mx-auto px-6 space-y-8">
        <SectionHeading
          overline="UPDATES"
          title="Announcements"
          subtitle="Official news and updates from the association"
          centered
        />

        {items.length === 0 ? (
          <div className="text-center text-white/80 py-12 bg-white/5 rounded-2xl border border-white/10">
            No announcements yet.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((a) => (
              <Card key={a.id} a={a} />
            ))}
          </div>
        )}

        {pages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-6">
            <Link
              aria-disabled={page <= 1}
              className={cn(
                "rounded-lg border border-white/15 bg-black/40 px-4 py-2 text-sm text-white/90 transition-colors hover:bg-black/60",
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
                "rounded-lg border border-white/15 bg-black/40 px-4 py-2 text-sm text-white/90 transition-colors hover:bg-black/60",
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