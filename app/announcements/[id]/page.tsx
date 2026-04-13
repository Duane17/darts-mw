// app/announcements/[id]/page.tsx
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import { AnnouncementsShell } from "@/components/common/AnnouncementShell";
import { formatLocal } from "@/lib/datetime";
import { PRIORITY_STYLES_LOCAL } from "./priority-styles";
import { getAnnouncement } from "@/lib/public-api/api-client";

type PageProps = { params: Promise<{ id: string }> | { id: string } };

export const dynamic = "force-dynamic";

// Helper to strip HTML for metadata/SEO
function stripHtml(html: string) {
  return html
    .replace(/<[^>]*>?/gm, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function safeGetAnnouncement(id: string) {
  try {
    const a = await getAnnouncement(id);
    return a ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: any },
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const a = await safeGetAnnouncement(id);
  if (!a) return {};

  const title = a.title ? `${a.title} | Announcements` : "Announcement";
  // Strip tags so the description is clean text
  const desc = a.body 
    ? stripHtml(a.body).slice(0, 160) 
    : "Official announcement";

  return {
    title,
    description: desc,
    openGraph: { title, description: desc, type: "article" },
    twitter: { card: "summary_large_image", title, description: desc },
  };
}

export default async function AnnouncementDetailPage({ params }: { params: any }) {
  const { id } = await params;
  const a = await safeGetAnnouncement(id);
  if (!a) return notFound();

  const created = a.createdAt ? formatLocal(a.createdAt) : null;
  const badge =
    a.priority
      ? PRIORITY_STYLES_LOCAL[a.priority] ?? "bg-white/10 text-white/85 border-white/20"
      : null;

  return (
    <main className="min-h-screen">
      <AnnouncementsShell className="py-20">
        <div className="max-w-3xl mx-auto px-6 space-y-6">
          <div className="text-sm">
            <Link href="/announcements" className="text-dam-gold underline underline-offset-4">
              Back to announcements
            </Link>
          </div>

          <header className="space-y-3">
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

            <h1 className="text-3xl sm:text-4xl font-semibold text-white">
              {a.title}
            </h1>
          </header>

          {a.body ? (
            <div 
              className="prose prose-invert prose-emerald max-w-none text-white/90 
                prose-headings:text-white prose-strong:text-white prose-img:rounded-xl 
                prose-a:text-dam-gold prose-a:underline"
              dangerouslySetInnerHTML={{ __html: a.body }}
            />
          ) : (
            <p className="text-white/85">Details will be posted soon.</p>
          )}
        </div>
      </AnnouncementsShell>
    </main>
  );
}