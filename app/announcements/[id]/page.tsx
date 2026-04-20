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

  // Reuse the exact editor styles to ensure consistent rendering
  const editorStyles = `
    .announcement-content {
      color: rgba(255, 255, 255, 0.9);
    }
    .announcement-content h1 {
      font-size: 1.75rem;
      font-weight: 700;
      line-height: 1.25;
      margin: 1rem 0 0.5rem;
      color: inherit;
    }
    .announcement-content h2 {
      font-size: 1.35rem;
      font-weight: 600;
      line-height: 1.3;
      margin: 0.875rem 0 0.4rem;
      color: inherit;
    }
    .announcement-content strong { font-weight: 700; }
    .announcement-content em { font-style: italic; }
    .announcement-content u { text-decoration: underline; }
    .announcement-content s { text-decoration: line-through; }
    .announcement-content p {
      margin: 0.4rem 0;
    }
    .announcement-content p:first-child {
      margin-top: 0;
    }
    .announcement-content ul {
      list-style-type: disc;
      padding-left: 1.5rem;
      margin: 0.5rem 0;
    }
    .announcement-content ol {
      list-style-type: decimal;
      padding-left: 1.5rem;
      margin: 0.5rem 0;
    }
    .announcement-content li {
      margin: 0.2rem 0;
    }
    .announcement-content li > p {
      margin: 0;
    }
    .announcement-content blockquote {
      border-left: 3px solid #D4AF37;
      padding-left: 1rem;
      margin: 0.75rem 0;
      color: #9CA3AF;
      font-style: italic;
    }
    .announcement-content pre {
      background: #1e1e1e;
      color: #d4d4d4;
      border-radius: 0.375rem;
      padding: 0.75rem 1rem;
      margin: 0.75rem 0;
      overflow-x: auto;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.85rem;
      line-height: 1.6;
    }
    .announcement-content code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.85em;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 0.25rem;
      padding: 0.15em 0.35em;
    }
    .announcement-content pre code {
      background: transparent;
      padding: 0;
      font-size: inherit;
    }
    .announcement-content img {
      max-width: 100%;
      border-radius: 0.375rem;
      margin: 0.5rem 0;
      display: block;
    }
    .announcement-content a {
      color: var(--color-dam-gold, #f4a300);
      text-decoration: underline;
    }
    .announcement-content a:hover {
      text-decoration: none;
    }
  `;

  return (
    <main className="min-h-screen">
      <AnnouncementsShell className="py-20">
        <div className="max-w-3xl mx-auto px-6 space-y-6">
          <style>{editorStyles}</style>

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
              {badge && (
                <span className={badge}>
                  {a.priority === "gold" ? "Priority" : a.priority === "success" ? "Success" : "Alert"}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-semibold text-white">
              {a.title}
            </h1>
          </header>

          {a.body ? (
            <div
              className="announcement-content"
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