import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ChevronRight, Calendar } from "lucide-react";

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

async function getNextAnnouncement(currentId: string) {
  try {
    const { items } = await listAnnouncementsPage({ pageSize: 50 });
    const currentIndex = items.findIndex((a) => a.id === currentId);
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

  const nextAnnouncement = await getNextAnnouncement(id);
  const created = a.createdAt ? formatLocal(a.createdAt) : null;
  const badge = a.priority
    ? PRIORITY_STYLES_LOCAL[a.priority] ?? "bg-white/10 text-white/85 border-white/20"
    : null;

  const editorStyles = `
    .announcement-content {
      color: #1f2937;
      line-height: 1.8;
      font-size: 1.1rem;
    }
    .announcement-content h1, .announcement-content h2, .announcement-content h3 {
      color: #000;
      font-family: var(--font-oswald), sans-serif;
      text-transform: uppercase;
      margin-top: 2.5rem;
      margin-bottom: 1.25rem;
      letter-spacing: -0.01em;
    }
    .announcement-content h1 { font-size: 2.25rem; }
    .announcement-content h2 { font-size: 1.75rem; border-left: 4px solid var(--color-dam-gold); padding-left: 1rem; }
    .announcement-content p { margin-bottom: 1.5rem; }
    .announcement-content strong { color: #000; font-weight: 700; }
    .announcement-content blockquote {
      border-left: 3px solid var(--color-dam-red);
      padding: 0.5rem 0 0.5rem 1.5rem;
      margin: 2.5rem 0;
      font-style: italic;
      font-size: 1.25rem;
      color: #4b5563;
    }
    .announcement-content img {
      width: 100%;
      border-radius: 2px;
      margin: 2.5rem 0;
    }
    .announcement-content a {
      color: var(--color-dam-red);
      text-decoration: underline;
      text-underline-offset: 4px;
    }
    .announcement-content ul { list-style: disc; padding-left: 1.5rem; margin-bottom: 1.5rem; }
  `;

  return (
    <main className="min-h-screen bg-[#f8f9fa]">
      <style>{editorStyles}</style>

      {/* HEADER SECTION: Compact & Elegant */}
      <AnnouncementsShell className="pt-16 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <Link
            href="/announcements"
            className="inline-flex items-center gap-2 text-dam-gold/80 hover:text-white transition-colors text-xs uppercase tracking-widest font-bold mb-10 group"
          >
            <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
            All Announcements
          </Link>

          <div className="space-y-4">
            <h1 className="text-white text-3xl md:text-5xl font-bold leading-tight tracking-tight max-w-4xl">
              {a.title}
            </h1>
          </div>
        </div>
      </AnnouncementsShell>

      {/* BODY SECTION: High-Contrast Article Body */}
      <section className="relative -mt-10 pb-20 px-4 md:px-6">
        <article className="max-w-3xl mx-auto bg-white shadow-xl ring-1 ring-black/5 overflow-hidden">
          {/* Top Branding Bar */}
          <div className="h-1.5 bg-dam-gold w-full" />
          
          <div className="p-8 md:p-16">
            {/* Metadata / Author Line */}
            <div className="flex flex-wrap items-center gap-y-4 gap-x-6 mb-12 pb-8 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 border border-gray-100 rounded-full p-1 bg-gray-50">
                  <Image
                    src="/logo.png"
                    alt="DAM Logo"
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-wider text-black">Darts Association of Malawi</span>
                  <span className="text-[11px] text-gray-500 uppercase tracking-tighter">Official Media Release</span>
                </div>
              </div>

              {created && (
                <div className="flex items-center gap-2 text-gray-400 ml-auto">
                  <Calendar className="w-4 h-4" />
                  <time className="text-xs font-medium uppercase tracking-wide">
                    {created.date}
                  </time>
                </div>
              )}
            </div>

            {/* Main Content Area */}
            {a.body ? (
              <div
                className="announcement-content dam-text-pretty"
                dangerouslySetInnerHTML={{ __html: a.body }}
              />
            ) : (
              <p className="text-gray-400 italic text-center py-20">
                The full text of this announcement is being processed.
              </p>
            )}

            {/* Signature / End of Piece */}
            <div className="mt-20 flex items-center gap-4">
               <div className="h-px bg-gray-200 flex-grow" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">End</span>
               <div className="h-px bg-gray-200 flex-grow" />
            </div>

            {/* Footer Navigation */}
            {nextAnnouncement && (
              <div className="mt-12 group">
                <Link
                  href={`/announcements/${nextAnnouncement.id}`}
                  className="block p-6 border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-dam-gold transition-all duration-300"
                >
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-widest text-dam-red font-bold">
                        Up Next
                      </span>
                      <h3 className="text-lg font-bold text-black line-clamp-1">
                        {nextAnnouncement.title}
                      </h3>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-dam-gold transition-colors group-hover:translate-x-1" />
                  </div>
                </Link>
              </div>
            )}
          </div>
        </article>
      </section>
    </main>
  );
}