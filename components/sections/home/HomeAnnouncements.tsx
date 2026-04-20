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
    <section className="bg-white py-12 md:py-24 px-4 md:px-6 border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Editorial Masthead */}
        <div className="flex flex-col items-center text-center mb-12 md:mb-20">
          <span className="text-dam-red font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-[9px] md:text-[10px] mb-3 md:mb-4">
            Official Media & Press
          </span>
          {/* Responsive Font Size: text-5xl on mobile, text-8xl on desktop */}
          <h2 className="text-5xl md:text-8xl font-bold tracking-tighter text-black uppercase font-oswald leading-none mb-4 md:mb-6">
            Announcements
          </h2>
          <div className="w-full h-px bg-black mb-1" />
          <div className="w-full h-[3px] md:h-[4px] bg-black" />
          
          <div className="flex flex-col sm:flex-row justify-between w-full mt-3 gap-2 sm:gap-0 text-[10px] font-bold uppercase tracking-widest text-gray-500">
            <span className="order-2 sm:order-1">Darts Association of Malawi</span>
            <span className="hidden md:inline order-2">{new Date().getFullYear()} Edition</span>
            <Link href="/announcements" className="order-1 sm:order-3 hover:text-dam-red transition-colors flex items-center justify-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12">
          
          {/* FEATURED STORY (Stays 7/12 on desktop, full width on mobile) */}
          {featured && (
            <article className="lg:col-span-7 group border-b lg:border-b-0 pb-10 lg:pb-0 border-gray-100">
              <Link href={`/announcements/${featured.id}`} className="space-y-5 md:space-y-6 block">
                {extractFirstImageSrc(featured.body || "") && (
                  <div className="overflow-hidden aspect-video bg-gray-100 rounded-sm">
                    <img 
                      src={mediaUrl(extractFirstImageSrc(featured.body!)!)} 
                      alt="" 
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-black text-white text-[8px] md:text-[9px] font-black px-1.5 py-0.5 uppercase tracking-tighter">
                      Featured
                    </span>
                    <span className="text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                      {featured.createdAt ? formatLocal(featured.createdAt).date : ""}
                    </span>
                  </div>
                  {/* Smaller heading on mobile */}
                  <h3 className="text-3xl md:text-5xl font-bold leading-[1.1] md:leading-[0.95] text-black group-hover:text-dam-red transition-colors font-oswald uppercase">
                    {featured.title}
                  </h3>
                  <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-serif italic line-clamp-3">
                    "{stripHtml(featured.body || "").slice(0, 220)}..."
                  </p>
                  <span className="inline-flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest border-b-2 border-dam-gold pb-1 group-hover:border-black transition-colors">
                    Full Report <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            </article>
          )}

          {/* SECONDARY STORIES (Stays 5/12 on desktop) */}
          <div className="lg:col-span-5 flex flex-col divide-y divide-gray-100">
            {others.map((item) => {
              const image = extractFirstImageSrc(item.body || "");
              return (
                <article key={item.id} className="py-5 md:py-6 first:pt-0 last:pb-0 group">
                  <Link href={`/announcements/${item.id}`} className="flex gap-4 md:gap-6 items-start">
                    <div className="flex-1 space-y-1.5 md:space-y-2">
                      <time className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                         {item.createdAt ? formatLocal(item.createdAt).date : ""}
                      </time>
                      <h4 className="text-base md:text-lg font-bold leading-tight text-black group-hover:text-dam-red transition-colors line-clamp-2 uppercase font-oswald">
                        {item.title}
                      </h4>
                      <p className="text-xs md:text-sm text-gray-500 line-clamp-2 font-serif italic hidden sm:block">
                        {stripHtml(item.body || "").slice(0, 100)}...
                      </p>
                    </div>
                    {image && (
                      <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 bg-gray-100 overflow-hidden rounded-sm">
                         <img 
                          src={mediaUrl(image)} 
                          alt="" 
                          className="w-full h-full object-cover transition-all group-hover:scale-110"
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