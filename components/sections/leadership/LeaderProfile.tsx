// components/sections/leadership/LeaderProfile.tsx
import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/ux/FadeIn";
import { Medal } from "lucide-react";
import type { Leader } from "@/lib/public-api/api-types";
import { mediaUrl } from "@/lib/public-api/media";

// helpers
function splitLead(text: string) {
  const match = text.match(/(.+?[.!?])(\s+|$)/);
  if (!match) return { lead: text, rest: "" };
  const lead = match[1];
  const rest = text.slice(lead.length).trim();
  return { lead, rest };
}

// small inline icons to avoid extra deps
function MortarboardIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path d="M12 3l10 5-10 5L2 8l10-5z" fill="currentColor" />
      <path d="M6 11v4c0 1.1 2.7 2 6 2s6-.9 6-2v-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
function BriefcaseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 12h18" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
function TargetIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  );
}

type Props = {
  leader: Leader;
  peers?: Leader[]; // for footer pills
};

export function LeaderProfile({ leader, peers = [] }: Props) {
  const hasBio = Boolean(leader.bio && leader.bio.trim().length > 0);
  const bioParts = hasBio ? splitLead(leader.bio as string) : { lead: "", rest: "" };

  const blurDataURL =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottQAAAABJRU5ErkJggg==";

  const photoSrc = mediaUrl(leader.photo ?? "");

  return (
    <main className="min-h-screen bg-linear-to-b from-white to-neutral-50 text-neutral-900">
      {/* Hero */}
      <section className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(70rem_40rem_at_70%_-10%,rgba(218,41,28,0.10),transparent)]"
        />
        <div className="max-w-6xl mx-auto px-6 pt-14 pb-6">
          <div className="grid gap-8 lg:grid-cols-[340px_1fr] items-start">
            {/* Portrait */}
            <FadeIn delay={0.02}>
              <figure className="rounded-2xl overflow-hidden ring-1 ring-black/5 bg-white shadow-sm">
                {photoSrc ? (
                  <Image
                    src={photoSrc}
                    alt={`${leader.name} portrait`}
                    width={740}
                    height={880}
                    className="h-full w-full object-cover"
                    priority={false}
                    placeholder="blur"
                    blurDataURL={blurDataURL}
                    sizes="(min-width: 1024px) 340px, (min-width: 640px) 50vw, 100vw"
                  />
                ) : (
                  <div className="h-[420px] w-full grid place-items-center text-neutral-500">
                    <span className="text-sm">No photo available</span>
                  </div>
                )}
              </figure>
            </FadeIn>

            {/* Hero text */}
            <FadeIn delay={0.05}>
              <header className="space-y-4">
                <div className="inline-flex items-center gap-2 text-sm text-dam-red">
                  <span className="font-semibold tracking-wide">Leadership</span>
                  <span className="opacity-60">•</span>
                  <Link
                    href="/leadership"
                    className="underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-dam-red focus:ring-offset-2 rounded"
                  >
                    Back to team
                  </Link>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight">
                  {leader.name}
                </h1>

                {leader.title ? (
                  <p className="text-lg md:text-xl text-neutral-700">{leader.title}</p>
                ) : null}

                {leader.tagline ? (
                  <p className="text-neutral-700/90">{leader.tagline}</p>
                ) : null}
              </header>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24">
        <div className="max-w-6xl mx-auto px-6 space-y-10">
          {/* Lead bio card */}
          {hasBio ? (
            <FadeIn delay={0.07}>
              <article className="rounded-2xl bg-white/70 backdrop-blur ring-1 ring-black/5 p-6 md:p-7 shadow-sm">
                <h2 className="sr-only">About</h2>
                <p className="text-lg md:text-xl leading-relaxed tracking-[0.005em] text-neutral-800">
                  <span className="font-semibold">{bioParts.lead}</span>
                  {bioParts.rest ? <span className="text-neutral-700"> {" "}{bioParts.rest}</span> : null}
                </p>
              </article>
            </FadeIn>
          ) : null}

          {/* Mosaic: left education timeline, right editorial cards */}
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="space-y-8">
              {/* Education timeline */}
              {leader.education && leader.education.length > 0 ? (
                <FadeIn delay={0.08}>
                  <section className="rounded-2xl bg-white ring-1 ring-black/5 p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <MortarboardIcon className="h-5 w-5 text-dam-red" />
                      <h2 className="text-base font-semibold">Education</h2>
                    </div>
                    <ol className="relative ml-3">
                      <span className="absolute left-0 top-0 h-full w-px bg-neutral-200" aria-hidden />
                      <div className="space-y-5">
                        {leader.education.map((item, i) => (
                          <li key={i} className="relative pl-4">
                            <span className="absolute left-[-7px] top-1.5 h-3 w-3 rounded-full bg-dam-red ring-2 ring-white" aria-hidden />
                            <p className="text-sm leading-6 text-neutral-800">{item}</p>
                          </li>
                        ))}
                      </div>
                    </ol>
                  </section>
                </FadeIn>
              ) : null}

              {/* Professional background */}
              {leader.professionalBackground ? (
                <FadeIn delay={0.1}>
                  <section className="rounded-2xl bg-white ring-1 ring-black/5 p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <BriefcaseIcon className="h-5 w-5 text-dam-red" />
                      <h2 className="text-base font-semibold">Professional background</h2>
                    </div>
                    <p className="text-sm leading-7 text-neutral-800">{leader.professionalBackground}</p>
                  </section>
                </FadeIn>
              ) : null}
            </div>

            <div className="space-y-8">
              {/* Sporting journey */}
              {leader.sportingJourney ? (
                <FadeIn delay={0.11}>
                  <section className="rounded-2xl bg-white ring-1 ring-black/5 p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <TargetIcon className="h-5 w-5 text-dam-red" />
                      <h2 className="text-base font-semibold">Sporting journey</h2>
                    </div>
                    <p className="text-sm leading-7 text-neutral-800">{leader.sportingJourney}</p>
                  </section>
                </FadeIn>
              ) : null}
            </div>
          </div>

          {/* Responsibilities */}
          {leader.responsibilities && leader.responsibilities.length > 0 ? (
            <FadeIn delay={0.12}>
              <section className="space-y-4">
                <h2 className="text-base font-semibold tracking-wide text-neutral-900">Responsibilities</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {leader.responsibilities.map((item, i) => (
                    <div
                      key={i}
                      className="rounded-xl bg-white ring-1 ring-black/5 p-4 shadow-sm flex items-start gap-3"
                    >
                      <div className="mt-0.5 shrink-0 h-5 w-5 rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/30 grid place-items-center">
                        <span className="block h-3 w-3 rounded-sm bg-emerald-500" />
                      </div>
                      <p className="text-sm leading-6 text-neutral-800">{item}</p>
                    </div>
                  ))}
                </div>
              </section>
            </FadeIn>
          ) : null}

          {/* Achievements with medal icon */}
          {leader.achievements && leader.achievements.length > 0 ? (
            <FadeIn delay={0.14}>
              <section className="space-y-4">
                <h2 className="text-base font-semibold tracking-wide text-neutral-900">Achievements</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {leader.achievements.map((a, i) => (
                    <div
                      key={i}
                      className="rounded-xl bg-linear-to-br from-[#d4af37]/10 to-transparent ring-1 ring-[#d4af37]/30 p-4 shadow-sm flex items-start gap-3"
                    >
                      <div className="mt-0.5 shrink-0">
                        <Medal className="h-5 w-5 text-[#d4af37]" strokeWidth={1.5} />
                      </div>
                      <p className="text-sm leading-6 text-neutral-800">{a}</p>
                    </div>
                  ))}
                </div>
              </section>
            </FadeIn>
          ) : null}
        </div>
      </section>

      {/* Team pills footer */}
      {peers && peers.length > 0 ? <TeamPills currentSlug={leader.slug} peers={peers} /> : null}
    </main>
  );
}

function MetaChip({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-white ring-1 ring-black/5 px-4 py-2.5 text-sm shadow-sm flex items-center justify-between">
      <span className="text-neutral-600">{label}</span>
      <span className="font-medium text-neutral-900">{value}</span>
    </div>
  );
}

function TeamPills({ currentSlug, peers }: { currentSlug: string; peers: Leader[] }) {
  return (
    <nav className="sticky bottom-0 z-30">
      <div className="backdrop-blur bg-white/80 ring-1 ring-black/5">
        <div className="max-w-6xl mx-auto px-6 py-3 flex flex-wrap gap-2">
          {peers.map((p) => (
            <Link
              key={p.slug || p.id}
              href={`/leadership/${p.slug || p.id}`}
              prefetch
              className={[
                "text-sm rounded-full px-3 py-1.5 ring-1 ring-black/5 hover:ring-dam-red",
                p.slug === currentSlug ? "bg-dam-red text-white" : "bg-white",
              ].join(" ")}
            >
              {(p.name || "").split(" ")[0] || "Profile"}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
