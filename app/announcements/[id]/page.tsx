// app/announcements/[id]/page.tsx
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { getAnnouncement, listAnnouncementsPage } from "@/lib/public-api/api-client";
import Link from "next/link";
import { formatLocal } from "@/lib/datetime";
import { PRIORITY_STYLES_LOCAL } from "./priority-styles";
import { AnnouncementsShell } from "@/components/common/AnnouncementShell"; // fix path
import { Markdown } from "@/components/common/Markdown";

type PageProps = { params: { id: string } };

export const dynamic = "force-static";

export async function generateMetadata(
  { params }: PageProps,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  try {
    const a = await getAnnouncement(params.id);
    const title = a?.title ? `${a.title} | Announcements` : "Announcement";
    const desc =
      a?.body?.slice(0, 160).replace(/\s+/g, " ") || "Official announcement";
    return {
      title,
      description: desc,
      openGraph: { title, description: desc, type: "article" },
      twitter: { card: "summary_large_image", title, description: desc },
    };
  } catch {
    return {};
  }
}

export async function generateStaticParams() {
  try {
    const all = await listAnnouncementsPage({ page: 1, pageSize: 100 });
    return all.items.map((a) => ({ id: a.id }));
  } catch {
    return [];
  }
}

export default async function AnnouncementDetailPage({ params }: PageProps) {
  let a: Awaited<ReturnType<typeof getAnnouncement>> | null = null;
  try {
    a = await getAnnouncement(params.id);
  } catch {
    return notFound();
  }
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
              {badge ? (
                <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${badge}`}>
                  {a.priority === "gold" ? "Priority" : a.priority === "success" ? "Success" : "Alert"}
                </span>
              ) : null}

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

            <h1 className="text-2xl sm:text-3xl font-semibold text-white">
              {a.title}
            </h1>
          </header>

          {a.body ? (
            <Markdown className="text-white">
              {a.body}
            </Markdown>
          ) : (
            <p className="text-white/85">Details will be posted soon.</p>
          )}
        </div>
      </AnnouncementsShell>
    </main>
  );
}
