import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ChevronRight } from "lucide-react"; // Added ChevronRight

import { AnnouncementsShell } from "@/components/common/AnnouncementShell";
import { formatLocal } from "@/lib/datetime";
import { PRIORITY_STYLES_LOCAL } from "./priority-styles";
import { getAnnouncement, listAnnouncementsPage } from "@/lib/public-api/api-client";

type PageProps = { params: Promise<{ id: string }> | { id: string } };

export const dynamic = "force-dynamic";

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

/**
 * Helper to find the next announcement in the chronological list
 */
async function getNextAnnouncement(currentId: string) {
  try {
    // Fetch the latest announcements to find neighbors
    const { items } = await listAnnouncementsPage({ pageSize: 50 });
    const currentIndex = items.findIndex((a) => a.id === currentId);

    // If we are at index 0, there is no "newer" announcement.
    // Usually, "Next" implies the next one in the list (older).
    // If you want "Next" to mean "Newer", use currentIndex - 1.
    // Below we provide the next one in the feed (index + 1).
    if (currentIndex !== -1 && currentIndex < items.length - 1) {
      return items[currentIndex + 1];
    }
    return null;
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
  const desc = a.body ? stripHtml(a.body).slice(0, 160) : "Official announcement";

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

  // Fetch the next announcement for navigation
  const nextAnnouncement = await getNextAnnouncement(id);

  const created = a.createdAt ? formatLocal(a.createdAt) : null;
  const badge = a.priority
    ? PRIORITY_STYLES_LOCAL[a.priority] ?? "bg-white/10 text-white/85 border-white/20"
    : null;

  const editorStyles = `
    .announcement-content {
      color: #1a1a1a;
      line-height: 1.75;
      font-size: 1.125rem;
    }
    .announcement-content h1, 
    .announcement-content h2, 
    .announcement-content h3 {
      color: #000;
      font-family: var(--font-oswald), sans-serif;
      text-transform: uppercase;
      margin-top: 2rem;
      margin-bottom: 1rem;
    }
    .announcement-content h1 { font-size: 2rem; border-bottom: 2px solid #eee; padding-bottom: 0.5rem; }
    .announcement-content h2 { font-size: 1.5rem; }
    .announcement-content p { margin-bottom: 1.5rem; }
    .announcement-content strong { font-weight: 700; color: #000; }
    .announcement-content blockquote {
      border-left: 4px solid var(--color-dam-gold);
      padding: 1rem 1.5rem;
      margin: 2rem 0;
      background: #f9f9f9;
      font-style: italic;
      color: #444;
    }
    .announcement-content ul, .announcement-content ol {
      margin-bottom: 1.5rem;
      padding-left: 1.5rem;
    }
    .announcement-content li { margin-bottom: 0.5rem; }
    .announcement-content img {
      width: 100%;
      height: auto;
      border-radius: 4px;
      margin: 2rem 0;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }
    .announcement-content a {
      color: var(--color-dam-red);
      text-decoration: underline;
      text-underline-offset: 4px;
      font-weight: 600;
    }
  `;

  return (
    <main className="min-h-screen bg-dam-light-card">
      <style>{editorStyles}</style>

      {/* HEADER SECTION */}
      <AnnouncementsShell className="pt-24 pb-32">
        <div className="max-w-4xl mx-auto px-6">
          <Link
            href="/announcements"
            className="inline-flex items-center gap-2 text-dam-gold hover:text-white transition-colors text-sm font-medium mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to announcements
          </Link>

          <header className="space-y-6">
            <div className="flex items-center gap-3">
              {created && (
                <time className="text-sm text-white/60 tracking-wide uppercase">
                  {created.date}
                </time>
              )}
            </div>

            <h1 className="dam-heading dam-heading-lg text-white max-w-3xl">{a.title}</h1>
          </header>
        </div>
      </AnnouncementsShell>

      {/* BODY SECTION */}
      <section className="relative -mt-16 pb-24 px-6">
        <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-sm overflow-hidden border-t-4 border-dam-gold">
          <div className="p-8 md:p-16">
            {/* Attribution Line */}
            <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-100 text-gray-500 text-sm">
              <div className="flex items-center gap-2">
                <Image
                  src="/logo.png"
                  alt="DAM Logo"
                  width={32}
                  height={32}
                  className="rounded-full object-contain"
                />
                <span className="font-medium text-black">Darts Association Malawi</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span>Official Release</span>
            </div>

            {a.body ? (
              <div
                className="announcement-content dam-text-pretty"
                dangerouslySetInnerHTML={{ __html: a.body }}
              />
            ) : (
              <p className="text-gray-500 italic">Details will be posted soon.</p>
            )}

            {/* Footer / Navigation */}
            <div className="mt-16 pt-8 border-t-2 border-double border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">
                End of Announcement
              </p>

              {nextAnnouncement && (
                <Link
                  href={`/announcements/${nextAnnouncement.id}`}
                  className="group flex flex-col items-end gap-1 text-right"
                >
                  <span className="text-[10px] uppercase tracking-tighter text-gray-400 font-bold">
                    Read Next
                  </span>
                  <span className="flex items-center gap-2 text-dam-red font-bold group-hover:underline decoration-2 underline-offset-4">
                    {nextAnnouncement.title}
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}