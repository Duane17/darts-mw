// components/sections/fixtures/FixturesTimelineClient.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CalendarDays, MapPin, CheckCircle2, StickyNote } from "lucide-react";
import { SectionShell } from "@/components/common/SectionShell";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  listFixturesPage,
  SEASON as DEFAULT_SEASON,
} from "@/lib/public-api/api-client";
import type { Fixture } from "@/lib/public-api/api-types";
import { toUiFixtureStatus } from "@/lib/public-api/api-types";
import { mediaUrl } from "@/lib/public-api/media";
import { formatLocal } from "@/lib/datetime";

/* ---------------- UI helpers ---------------- */

const statusBadge = {
  upcoming:
    "bg-amber-500/15 text-amber-300 border-amber-400/30 hover:bg-amber-500/20",
  completed:
    "bg-emerald-500/15 text-emerald-300 border-emerald-400/30 hover:bg-emerald-500/20",
};

function isByeFixture(f: Fixture) {
  // Backend exposes an explicit isBye flag; fall back to awayTeamId/null patterns if needed
  return Boolean(f.isBye) || (!f.awayTeamId && !f.awayTeam && /bye/i.test(f.title));
}


type ViewMode = "all" | "upcoming" | "results";
type RangePreset = "this-month" | "this-week" | "all";

/* Africa/Blantyre local helpers */
function startOfWeekLocal(d = new Date()) {
  // Monday as start of week
  const dt = new Date(d);
  const day = dt.getDay() || 7;
  if (day !== 1) dt.setDate(dt.getDate() - (day - 1));
  dt.setHours(0, 0, 0, 0);
  return dt;
}
function endOfWeekLocal(d = new Date()) {
  const start = startOfWeekLocal(d);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}
function startOfMonthLocal(d = new Date()) {
  const dt = new Date(d.getFullYear(), d.getMonth(), 1);
  dt.setHours(0, 0, 0, 0);
  return dt;
}
function endOfMonthLocal(d = new Date()) {
  const dt = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  dt.setHours(23, 59, 59, 999);
  return dt;
}

/* Build date window based on preset for API params */
function makeDateWindow(preset: RangePreset): { from?: string; to?: string } {
  if (preset === "all") return {};
  if (preset === "this-week") {
    const from = startOfWeekLocal();
    const to = endOfWeekLocal();
    return { from: from.toISOString(), to: to.toISOString() };
  }
  // this-month
  const from = startOfMonthLocal();
  const to = endOfMonthLocal();
  return { from: from.toISOString(), to: to.toISOString() };
}

/* Group fixtures by local date label */
type DayGroup = { dayKey: string; dayLabel: string; items: Fixture[] };

const TZ = "Africa/Blantyre";

// Stable YYYY-MM-DD in local time
function toLocalYYYYMMDD(d: Date): string {
  // en-CA formats as YYYY-MM-DD
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

// Sat, 04 Oct 2025
function toLocalWeekdayShortAndDate(d: Date): string {
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    weekday: "short",
  }).format(d);
  const date = new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
  return `${weekday}, ${date}`;
}

function groupByLocalDay(items: Fixture[]): DayGroup[] {
  const map = new Map<string, DayGroup>();

  for (const f of items) {
    const src = f.kickoff ?? f.date;
    const d = new Date(src);

    const key = toLocalYYYYMMDD(d);
    if (!map.has(key)) {
      map.set(key, {
        dayKey: key,
        dayLabel: toLocalWeekdayShortAndDate(d),
        items: [],
      });
    }
    map.get(key)!.items.push(f);
  }

  // Sort ascending by YYYY-MM-DD key
  return [...map.values()].sort((a, b) => a.dayKey.localeCompare(b.dayKey));
}


/* ---------------- Main component ---------------- */

export default function FixturesTimelineClient() {
  // Filters persisted in the URL would be ideal. Start with local state.
  const [season, setSeason] = useState<string>(DEFAULT_SEASON);
  const [view, setView] = useState<ViewMode>("all");
  const [range, setRange] = useState<RangePreset>("this-month");
  const [page, setPage] = useState<number>(1);
  const pageSize = 20;

  // Compute date window
  const windowParams = useMemo(() => makeDateWindow(range), [range]);

  // Fetch one page. We do not pass status so we can classify in UI and show both.
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["fixtures", { season, view, range, page, pageSize }],
    queryFn: () =>
      listFixturesPage({
        page,
        pageSize,
        season,
        from: windowParams.from,
        to: windowParams.to,
      }),
    staleTime: 15_000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // Classify and filter by view
  const classified = useMemo(() => {
    const items = data?.items ?? [];
    const withStatus = items.map((f) => ({ f, s: toUiFixtureStatus(f) }));
    if (view === "upcoming") return withStatus.filter((x) => x.s === "upcoming").map((x) => x.f);
    if (view === "results") return withStatus.filter((x) => x.s === "completed").map((x) => x.f);
    return withStatus.map((x) => x.f);
  }, [data?.items, view]);

  const groups = useMemo(() => groupByLocalDay(classified), [classified]);

  const total = data?.total ?? 0;
  const pages = data?.pages ?? 1;

  return (
    <SectionShell bgImage="/images/cta/cta-bg.jpg" overlay="dark" className="py-20">
      <div className="max-w-6xl mx-auto px-6 space-y-8">
        <SectionHeading
          overline="MATCH CENTER"
          title="Fixtures and Results"
          subtitle="Live list of upcoming fixtures and completed results"
          centered
        />

        {/* Filter bar */}
        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_1fr_auto] items-center">
          <select
            aria-label="Season"
            className="h-10 rounded-lg border border-white/15 bg-black/40 px-3 text-white/90"
            value={season}
            onChange={(e) => {
              setPage(1);
              setSeason(e.target.value);
            }}
          >
            {/* You can expand this with a seasons endpoint later */}
            <option value={DEFAULT_SEASON}>{DEFAULT_SEASON}</option>
          </select>

          <select
            aria-label="Date range"
            className="h-10 rounded-lg border border-white/15 bg-black/40 px-3 text-white/90"
            value={range}
            onChange={(e) => {
              setPage(1);
              setRange(e.target.value as RangePreset);
            }}
          >
            <option value="this-week">This week</option>
            <option value="this-month">This month</option>
            <option value="all">All</option>
          </select>

          <div className="flex h-10 rounded-lg border border-white/15 bg-black/40 p-1">
            {(["all", "upcoming", "results"] as ViewMode[]).map((v) => (
              <button
                key={v}
                onClick={() => {
                  setPage(1);
                  setView(v);
                }}
                className={cn(
                  "flex-1 rounded-md text-sm font-medium",
                  "px-3",
                  view === v ? "bg-white/15 text-white" : "text-white/80 hover:bg-white/10"
                )}
                aria-pressed={view === v}
              >
                {v === "all" ? "All" : v === "upcoming" ? "Upcoming" : "Results"}
              </button>
            ))}
          </div>

          {/* Pager */}
          <div className="flex items-center justify-end gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="h-10 rounded-lg border border-white/15 bg-black/40 px-3 text-sm text-white/90 disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-white/70 text-sm">
              {page} of {pages}
            </span>
            <button
              disabled={page >= pages}
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              className="h-10 rounded-lg border border-white/15 bg-black/40 px-3 text-sm text-white/90 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="space-y-10">
            {Array.from({ length: 3 }).map((_, i) => (
              <section key={i}>
                <div className="flex items-center gap-4">
                  <div className="h-5 w-48 rounded bg-white/10 animate-pulse" />
                  <Separator className="flex-1 bg-white/10" />
                </div>
                <ul className="mt-6 space-y-3">
                  {Array.from({ length: 3 }).map((__, j) => (
                    <li key={j} className="h-24 rounded-2xl border border-white/10 bg-black/30 animate-pulse" />
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}

        {/* Error */}
        {isError && !isLoading && (
          <div className="rounded-xl border border-red-300/30 bg-red-900/20 p-4 text-red-100">
            Failed to load fixtures.{" "}
            <button onClick={() => refetch()} className="underline underline-offset-4">
              Try again
            </button>
          </div>
        )}

        {/* Empty states */}
        {!isLoading && !isError && classified.length === 0 && (
          <div className="rounded-xl border border-white/10 bg-black/30 p-6 text-center text-white/80">
            {view === "upcoming" ? (
              <>
                <p>No scheduled matches for this window.</p>
                <a
                  href="/fixtures?view=results"
                  className="mt-2 inline-block text-dam-gold underline underline-offset-4"
                >
                  View recent results
                </a>
              </>
            ) : view === "results" ? (
              <>
                <p>No recorded results for this window.</p>
                <a
                  href="/fixtures?view=upcoming"
                  className="mt-2 inline-block text-dam-gold underline underline-offset-4"
                >
                  View upcoming fixtures
                </a>
              </>
            ) : (
              <p>No fixtures found for the selected filters.</p>
            )}
          </div>
        )}

        {/* Groups */}
        {!isLoading && !isError && classified.length > 0 && (
          <div className="space-y-12">
            {groups.map((g, idx) => (
              <section key={g.dayKey} aria-labelledby={`day-${idx}`}>
                <div className="flex items-center gap-4">
                  <h3
                    id={`day-${idx}`}
                    className="dam-heading dam-heading-md font-heading text-white"
                  >
                    {g.dayLabel}
                  </h3>
                  <Separator className="flex-1 bg-white/10" />
                </div>

                <ol className="relative mt-6 border-l border-white/10 pl-4">
                  {g.items.map((f) => (
                    <EventRow key={f.id} f={f} />
                  ))}
                </ol>
              </section>
            ))}
          </div>
        )}
      </div>
    </SectionShell>
  );
}

/* ---------------- Rows ---------------- */

function EventRow({ f }: { f: Fixture }) {
  const ui = toUiFixtureStatus(f);
  const t = formatLocal(f.kickoff ?? f.date);

  const bye = isByeFixture(f);
  const home = f.homeTeam?.name ?? "Home";
  const away = f.awayTeam?.name ?? "Away";
  const homeLogo = mediaUrl(f.homeTeam?.logoUrl ?? "");
  const awayLogo = mediaUrl(f.awayTeam?.logoUrl ?? "");

  const hasScore =
    typeof f.homeScore === "number" &&
    typeof f.awayScore === "number";

  return (
    <motion.li
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={{ duration: 0.35 }}
      className="relative pl-8"
    >
      {/* timeline node */}
      <span className="absolute left-0 top-2 h-3 w-3 rounded-full bg-dam-gold shadow-[0_0_0_4px_rgba(234,179,8,0.15)]" />

      <div className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-sm p-4 hover:bg-black/40 transition-colors">
        {/* meta row */}
        <div className="flex flex-wrap items-center gap-3">
          <Badge
            variant="outline"
            className={cn(
              "border px-2.5 py-0.5 text-xs font-medium",
              ui === "completed"
                ? "bg-emerald-500/15 text-emerald-300 border-emerald-400/30 hover:bg-emerald-500/20"
                : "bg-amber-500/15 text-amber-300 border-amber-400/30 hover:bg-amber-500/20"
            )}
            title={f.status}
          >
            {ui === "completed" ? "Completed" : "Upcoming"}
          </Badge>

          <div className="flex items-center gap-2 text-white/90 text-sm">
            <CalendarDays className="h-4 w-4 opacity-70" />
            <span suppressHydrationWarning>{t.date}</span>
          </div>

          {f.venue ? (
            <div className="flex items-center gap-2 text-white/90 text-sm flex-wrap sm:flex-nowrap">
              <MapPin className="h-4 w-4 opacity-70 shrink-0" />
              <span className="wrap-break-word sm:truncate text-white/90 text-sm leading-snug max-w-full sm:max-w-[260px]">
                {f.venue}
              </span>
            </div>
          ) : null}
        </div>

        {/* content */}
        {bye ? (
          // Bye layout: single column, explicit label
          <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="flex items-center gap-3">
              <TeamBadge name={home} logo={homeLogo} align="left" />
              <Badge
                variant="outline"
                className="border px-2 py-0.5 text-xs font-semibold bg-white/10 text-white"
                aria-label="Bye"
              >
                Bye
              </Badge>
            </div>
            <p className="mt-2 text-sm text-white/80">
              {home} has no opponent this round.
            </p>
          </div>
        ) : (
          <>
            {/* Teams row: stacked on small screens, horizontal on sm and up */}
            <div className="mt-3">
              {/* Mobile stacked */}
              <div className="sm:hidden grid grid-rows-[auto_auto_auto] justify-items-center gap-2">
                <TeamBadge name={home} logo={homeLogo} align="center" />
                <div className="flex flex-col items-center gap-1 px-2">
                  <span className="text-white/70 text-xs font-semibold tracking-wide select-none">VS</span>
                  {ui === "completed" && hasScore ? (
                    <div className="flex items-center gap-1 rounded-md bg-white/10 px-2 py-0.5 text-white">
                      <span className="text-sm font-semibold">
                        {f.homeScore} - {f.awayScore}
                      </span>
                    </div>
                  ) : null}
                </div>
                <TeamBadge name={away} logo={awayLogo} align="center" />
              </div>

              {/* Desktop horizontal */}
              <div className="hidden sm:grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <TeamBadge name={home} logo={homeLogo} align="left" />
                <div className="flex flex-col items-center gap-1 px-2">
                  <span className="text-white/70 text-xs sm:text-sm font-medium select-none">VS</span>
                  {ui === "completed" && hasScore ? (
                    <div className="flex items-center gap-1 rounded-md bg-white/10 px-2 py-0.5 text-white">
                      <span className="text-sm font-semibold">
                        {f.homeScore} - {f.awayScore}
                      </span>
                    </div>
                  ) : null}
                </div>
                <TeamBadge name={away} logo={awayLogo} align="right" />
              </div>
            </div>

            {/* Inline result details for completed fixtures */}
            {ui === "completed" ? <ResultInline f={f} /> : null}
          </>
        )}
      </div>
    </motion.li>
  );
}



function TeamBadge({
  name,
  logo,
  align = "left",
}: {
  name: string;
  logo?: string;
  align?: "left" | "right" | "center";
}) {
  const initials = name
    .split(/\s+/)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 3);

  return (
    <div
      className={cn(
        "flex items-center gap-2 min-w-0",
        align === "right" && "justify-end",
        align === "center" && "justify-center"
      )}
    >
      {align === "right" && (
        <span className="text-white/90 text-sm max-w-48 sm:max-w-none truncate">
          {name}
        </span>
      )}

      {/* eslint-disable-next-line @next/next/no-img-element */}
      {logo ? (
        <img
          src={logo}
          alt={`${name} logo`}
          className="h-8 w-8 rounded-full ring-1 ring-white/15 object-contain bg-white/5 p-1 shrink-0"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className="h-8 w-8 rounded-full ring-1 ring-white/15 bg-white/10 grid place-items-center text-xs text-white/90 shrink-0">
          {initials}
        </div>
      )}

      {align !== "right" && (
        <span className="text-white/90 text-sm max-w-48 sm:max-w-none truncate">
          {name}
        </span>
      )}
    </div>
  );
}



function ResultInline({ f }: { f: Fixture }) {
  const score =
    typeof f.homeScore === "number" && typeof f.awayScore === "number"
      ? { home: f.homeScore, away: f.awayScore }
      : f.result
      ? { home: f.result.homeScore, away: f.result.awayScore }
      : null;

  const notes = f.result?.notes?.trim() ? f.result.notes : null;
  const recordedAt = f.result?.createdAt ? formatLocal(f.result.createdAt) : null;

  // If there is nothing extra to show beyond the center chip,
  // we can still render a very small confirmation row with a check icon.
  return (
    <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="flex flex-wrap items-center gap-3">
        <CheckCircle2 className="h-4 w-4 text-emerald-300" aria-hidden="true" />
        {score ? (
          <span className="text-sm font-semibold text-white">
            Final score: {score.home} - {score.away}
          </span>
        ) : (
          <span className="text-sm font-semibold text-white">
            Result recorded
          </span>
        )}

        {recordedAt ? (
          <span className="text-xs text-white/70">
            Recorded: {recordedAt.date} {recordedAt.time}
          </span>
        ) : null}
      </div>

      {notes ? (
        <div className="mt-2 flex items-start gap-2">
          <StickyNote className="h-4 w-4 text-white/70 mt-0.5 shrink-0" aria-hidden="true" />
          <p className="text-sm text-white/85">{notes}</p>
        </div>
      ) : null}
    </div>
  );
}