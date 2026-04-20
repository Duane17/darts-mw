import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { formatLocal } from "@/lib/datetime";
import type { Announcement } from "@/lib/public-api/api-types";
import { mediaUrl } from "@/lib/public-api/media";

// --- Utilities from your config ---
function stripHtml(html: string) {
  const noTags = html.replace(/<[^>]*>?/gm, " ");
  return noTags
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function extractFirstImageSrc(html: string): string | null {
  const imgMatch = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return imgMatch ? imgMatch[1] : null;
}

export function HomeAnnouncements({ announcements }: { announcements: Announcement[] }) {
  const [featured, ...others] = announcements;

  return (
    <section className="bg-white py-24 px-6 border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Editorial Masthead */}
        <div className="flex flex-col items-center text-center mb-20">
          <span className="text-dam-red font-black uppercase tracking-[0.4em] text-[10px] mb-4">
            Official Media & Press
          </span>
          <h2 className="text-6xl md:text-8xl font-bold tracking-tighter text-black uppercase font-oswald leading-none mb-6">
            Announcements
          </h2>
          <div className="w-full h-px bg-black mb-1" />
          <div className="w-full h-[4px] bg-black" />
          <div className="flex justify-between w-full mt-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
            <span>Darts Association of Malawi</span>
            <span>{new Date().getFullYear()} Edition</span>
            <Link href="/announcements" className="hover:text-dam-red transition-colors">View All →</Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* FEATURED STORY (Left Column - 7/12) */}
          {featured && (
            <article className="lg:col-span-7 group">
              <Link href={`/announcements/${featured.id}`} className="space-y-6 block">
                {extractFirstImageSrc(featured.body || "") && (
                  <div className="overflow-hidden aspect-video bg-gray-100">
                    <img 
                      src={mediaUrl(extractFirstImageSrc(featured.body!)!)} 
                      alt="" 
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-black text-white text-[9px] font-black px-2 py-0.5 uppercase tracking-tighter">Featured Report</span>
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                      {featured.createdAt ? formatLocal(featured.createdAt).date : ""}
                    </span>
                  </div>
                  <h3 className="text-4xl md:text-5xl font-bold leading-[0.95] text-black group-hover:text-dam-red transition-colors font-oswald uppercase">
                    {featured.title}
                  </h3>
                  <p className="text-xl text-gray-600 leading-relaxed font-serif italic line-clamp-3">
                    "{stripHtml(featured.body || "").slice(0, 240)}..."
                  </p>
                  <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest border-b-2 border-dam-gold pb-1 group-hover:border-black transition-colors">
                    Full Story <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            </article>
          )}

          {/* SECONDARY STORIES (Right Column - 5/12) */}
          <div className="lg:col-span-5 flex flex-col divide-y divide-gray-100">
            {others.map((item) => {
              const image = extractFirstImageSrc(item.body || "");
              return (
                <article key={item.id} className="py-6 first:pt-0 last:pb-0 group">
                  <Link href={`/announcements/${item.id}`} className="flex gap-6">
                    <div className="flex-1 space-y-2">
                      <time className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                         {item.createdAt ? formatLocal(item.createdAt).date : ""}
                      </time>
                      <h4 className="text-lg font-bold leading-tight text-black group-hover:text-dam-red transition-colors line-clamp-2">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-500 line-clamp-2 font-serif italic">
                        {stripHtml(item.body || "").slice(0, 100)}...
                      </p>
                    </div>
                    {image && (
                      <div className="w-24 h-24 flex-shrink-0 bg-gray-100 overflow-hidden">
                         <img 
                          src={mediaUrl(image)} 
                          alt="" 
                          className="w-full h-full object-cover transition-all"
                        />
                      </div>
                    )}
                  </Link>
                </article>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}