// src/components/sections/fixtures/FixturesTimeline.tsx
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SectionShell } from "@/components/common/SectionShell";
import { SectionHeading } from "@/components/common/SectionHeading";
import { cn } from "@/lib/utils";
import { listFixturesPageCompat, SEASON_OPTIONS, type LeagueFilter, type LeagueCode } from "@/lib/public-api/api-client";
import type { Fixture } from "@/lib/public-api/api-types";
import { toUiFixtureStatus } from "@/lib/public-api/api-types";
import { mediaUrl } from "@/lib/public-api/media";
import { formatLocal } from "@/lib/datetime";
import { CalendarDays, MapPin, CheckCircle2, StickyNote } from "lucide-react";

type ViewMode = "all" | "upcoming" | "results";
type RangePreset = "this-month" | "this-week" | "all";

const TZ = "Africa/Blantyre";

/* ---------------- date helpers ---------------- */
function startOfWeekLocal(d = new Date()) {
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

function makeDateWindow(preset: RangePreset): { from?: string; to?: string } {
  if (preset === "all") return {};
  if (preset === "this-week") {
    return { from: startOfWeekLocal().toISOString(), to: endOfWeekLocal().toISOString() };
  }
  return { from: startOfMonthLocal().toISOString(), to: endOfMonthLocal().toISOString() };
}

/* ---------------- grouping helpers ---------------- */
function toLocalYYYYMMDD(d: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}
function toLocalWeekdayShortAndDate(d: Date): string {
  const weekday = new Intl.DateTimeFormat("en-US", { timeZone: TZ, weekday: "short" }).format(d);
  const date = new Intl.DateTimeFormat("en-GB", { timeZone: TZ, day: "2-digit", month: "short", year: "numeric" }).format(d);
  return `${weekday}, ${date}`;
}

type DayGroup = { dayKey: string; dayLabel: string; items: Fixture[] };

function groupByLocalDay(items: Fixture[]): DayGroup[] {
  const map = new Map<string, DayGroup>();
  for (const f of items) {
    const src = f.kickoff ?? f.date;
    const d = new Date(src);
    const key = toLocalYYYYMMDD(d);
    if (!map.has(key)) {
      map.set(key, { dayKey: key, dayLabel: toLocalWeekdayShortAndDate(d), items: [] });
    }
    map.get(key)!.items.push(f);
  }
  return [...map.values()].sort((a, b) => a.dayKey.localeCompare(b.dayKey));
}

/* ---------------- classification helpers ---------------- */
function isByeFixture(f: Fixture) {
  return Boolean(f.isBye) || (!f.awayTeamId && !f.awayTeam && /bye/i.test(f.title));
}

/**
 * Infer the league code from multiple possible shapes.
 * Priority:
 * 1) f.league ("SRDL" | "CRDL")
 * 2) f.season?.leagueCode
 * 3) Last token of legacy seasonLabel like "2025 SRDL"
 * 4) Fallback: map known FixtureType values to a league code
 */
function inferLeagueCode(f: Fixture): LeagueCode | undefined {
  const direct = (f as any).league as string | undefined;
  if (direct && (direct === "SRDL" || direct === "CRDL")) return direct;

  const keyed = (f as any)?.season?.leagueCode as string | undefined;
  if (keyed && (keyed === "SRDL" || keyed === "CRDL")) return keyed;

  const label = (f as any)?.seasonLabel as string | undefined;
  if (label && typeof label === "string") {
    const last = label.trim().split(/\s+/).pop();
    if (last === "SRDL" || last === "CRDL") return last;
  }

  // New: derive from type when league fields are absent
  const t = (f as any)?.type as string | undefined;
  if (t) {
    // Normalize once
    const T = String(t).toUpperCase();
    if (T.includes("CRDL")) return "CRDL";
    if (T.includes("SRDL")) return "SRDL";
  }

  return undefined;
}


/* build qs for links while preserving other params */
function buildQS(base: URLSearchParams, patch: Record<string, string | number | undefined>) {
  const q = new URLSearchParams(base);
  for (const [k, v] of Object.entries(patch)) {
    if (v === undefined) continue;
    q.set(k, String(v));
  }
  return `?${q.toString()}`;
}

/* ---------------- main component ---------------- */
export default async function FixturesTimeline({
  seasonYear,
  league,
  view,
  range,
  page,
  pageSize,
  baseSearch,
}: {
  seasonYear: number;
  league: LeagueFilter;   // "ALL" | "SRDL" | "CRDL"
  view: ViewMode;
  range: RangePreset;
  page: number;
  pageSize: number;
  baseSearch: URLSearchParams;
}) {
  const windowParams = makeDateWindow(range);

  // Fetch one page from API. Backend may or may not apply league filter.
  const data = await listFixturesPageCompat({
    seasonYear,
    league,
    from: windowParams.from,
    to: windowParams.to,
    page,
    pageSize,
    includeResults: true,
    type: league === "CRDL" ? "SMK_TRADING_CRDL" : league === "SRDL" ? "SRDL_LEAGUE" : undefined,
  });


  // Enforce league filtering on the server component to guarantee correctness
  const filteredByLeague = league === "ALL"
    ? data.items
    : data.items.filter((f) => inferLeagueCode(f) === league);

  // Apply view classification after league filtering
  const classified = filteredByLeague.filter((f) => {
    const s = toUiFixtureStatus(f); // "upcoming" | "completed"
    if (view === "upcoming") return s === "upcoming";
    if (view === "results") return s === "completed";
    return true;
  });

  const groups = groupByLocalDay(classified);

  const seasons = SEASON_OPTIONS;
  const leagues: Array<LeagueFilter> = ["ALL", "CRDL", "SRDL"];

  const pages = data.pages || 1;
  const prevHref = page > 1 ? buildQS(baseSearch, { page: page - 1 }) : null;
  const nextHref = page < pages ? buildQS(baseSearch, { page: page + 1 }) : null;

  return (
    <SectionShell bgImage="/images/cta/cta-bg.jpg" overlay="dark" className="py-20">
      <div className="max-w-6xl mx-auto px-6 space-y-8">
        <SectionHeading
          overline="MATCH CENTER"
          title="Fixtures and Results"
          subtitle="Upcoming fixtures and completed results in one timeline"
          centered
        />

        {/* GET re-render filter bar */}
        <form method="GET" className="grid gap-3 sm:grid-cols-[1fr_1fr_1fr_auto] items-center">
          <select
            name="seasonYear"
            aria-label="Season"
            defaultValue={String(seasonYear)}
            className="h-10 rounded-lg border border-white/15 bg-black/40 px-3 text-white/90"
          >
            {seasons.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <select
            name="league"
            aria-label="League"
            defaultValue={league}
            className="h-10 rounded-lg border border-white/15 bg-black/40 px-3 text-white/90"
          >
            {leagues.map((lg) => (
              <option key={lg} value={lg}>{lg === "ALL" ? "All leagues" : lg}</option>
            ))}
          </select>

          <select
            name="range"
            aria-label="Date range"
            defaultValue={range}
            className="h-10 rounded-lg border border-white/15 bg-black/40 px-3 text-white/90"
          >
            <option value="this-week">This week</option>
            <option value="this-month">This month</option>
            <option value="all">All</option>
          </select>

          <div
            className="flex h-10 rounded-lg border border-white/15 bg-black/40 p-1"
            role="radiogroup"
            aria-label="View"
          >
            {(["all", "upcoming", "results"] as ViewMode[]).map((v) => (
              <label
                key={v}
                // The has-[input:checked]:* variants apply immediately on click,
                // so the user sees the selection change before the GET submit happens.
                className={cn(
                  "flex-1 cursor-pointer rounded-md px-3 text-sm font-medium grid place-items-center",
                  "text-white/80 hover:bg-white/10",
                  "has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-white/40",
                  "has-[input:checked]:bg-white/15 has-[input:checked]:text-white"
                )}
              >
                <input
                  type="radio"
                  name="view"
                  value={v}
                  defaultChecked={v === view}
                  className="sr-only"
                />
                {v === "all" ? "All" : v === "upcoming" ? "Upcoming" : "Results"}
              </label>
            ))}
          </div>

          {/* Preserve paging shape and reset to first page on submit */}
          <input type="hidden" name="pageSize" value={pageSize} />
          <input type="hidden" name="page" value={1} />

          <div className="sm:col-start-4 sm:justify-self-end">
            <button className="h-10 rounded-lg border border-white/15 bg-black/40 px-3 text-sm text-white/90">
              Apply
            </button>
          </div>
        </form>

        {/* Empty */}
        {classified.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-black/30 p-6 text-center text-white/80">
            {view === "upcoming" ? (
              <>
                <p>No scheduled matches for this window.</p>
                <Link href={buildQS(baseSearch, { view: "results", page: 1 })} className="mt-2 inline-block text-dam-gold underline underline-offset-4">
                  View recent results
                </Link>
              </>
            ) : view === "results" ? (
              <>
                <p>No recorded results for this window.</p>
                <Link href={buildQS(baseSearch, { view: "upcoming", page: 1 })} className="mt-2 inline-block text-dam-gold underline underline-offset-4">
                  View upcoming fixtures
                </Link>
              </>
            ) : (
              <p>No fixtures found for the selected filters.</p>
            )}
          </div>
        ) : (
          <div className="space-y-12">
            {groups.map((g, idx) => (
              <section key={g.dayKey} aria-labelledby={`day-${idx}`}>
                <div className="flex items-center gap-4">
                  <h3 id={`day-${idx}`} className="dam-heading dam-heading-md font-heading text-white">
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

        {/* Pager */}
        <div className="flex items-center justify-end gap-2">
          <a
            aria-disabled={!prevHref}
            href={prevHref ?? "#"}
            className={cn(
              "h-10 rounded-lg border border-white/15 bg-black/40 px-3 text-sm text-white/90",
              !prevHref && "pointer-events-none opacity-50"
            )}
          >
            Prev
          </a>
          <span className="text-white/70 text-sm">
            {page} of {pages}
          </span>
          <a
            aria-disabled={!nextHref}
            href={nextHref ?? "#"}
            className={cn(
              "h-10 rounded-lg border border-white/15 bg-black/40 px-3 text-sm text-white/90",
              !nextHref && "pointer-events-none opacity-50"
            )}
          >
            Next
          </a>
        </div>
      </div>
    </SectionShell>
  );
}

/* ---------------- Rows and atoms ---------------- */

function EventRow({ f }: { f: Fixture }) {
  const ui = toUiFixtureStatus(f);
  const t = formatLocal(f.kickoff ?? f.date);
  const bye = isByeFixture(f);

  const home = f.homeTeam?.name ?? "Home";
  const away = f.awayTeam?.name ?? "Away";
  const homeLogo = mediaUrl(f.homeTeam?.logoUrl ?? "");
  const awayLogo = mediaUrl(f.awayTeam?.logoUrl ?? "");

  // Prefer flat scores if present, otherwise use the included result relation
  const hasFlat = typeof f.homeScore === "number" && typeof f.awayScore === "number";
  const score = hasFlat
    ? { home: f.homeScore as number, away: f.awayScore as number }
    : f.result
    ? { home: f.result.homeScore, away: f.result.awayScore }
    : null;

  return (
    <li className="relative pl-8">
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
            <span>{t.date}</span>
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
          <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="flex items-center gap-3">
              <TeamBadge name={home} logo={homeLogo} align="left" />
              <Badge variant="outline" className="border px-2 py-0.5 text-xs font-semibold bg-white/10 text-white" aria-label="Bye">
                Bye
              </Badge>
            </div>
            <p className="mt-2 text-sm text-white/80">{home} has no opponent this round.</p>
          </div>
        ) : (
          <>
            {/* Teams row: stacked on small screens, horizontal on sm and up */}
            <div className="mt-3">
              <div className="sm:hidden grid grid-rows-[auto_auto_auto] justify-items-center gap-2">
                <TeamBadge name={home} logo={homeLogo} align="center" />
                <div className="flex flex-col items-center gap-1 px-2">
                  <span className="text-white/70 text-xs font-semibold tracking-wide select-none">VS</span>
                  {ui === "completed" && score ? (
                    <div className="flex items-center gap-1 rounded-md bg-white/10 px-2 py-0.5 text-white">
                      <span className="text-sm font-semibold">
                        {score.home} - {score.away}
                      </span>
                    </div>
                  ) : null}
                </div>
                <TeamBadge name={away} logo={awayLogo} align="center" />
              </div>

              <div className="hidden sm:grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <TeamBadge name={home} logo={homeLogo} align="left" />
                <div className="flex flex-col items-center gap-1 px-2">
                  <span className="text-white/70 text-xs sm:text-sm font-medium select-none">VS</span>
                  {ui === "completed" && score ? (
                    <div className="flex items-center gap-1 rounded-md bg-white/10 px-2 py-0.5 text-white">
                      <span className="text-sm font-semibold">
                        {score.home} - {score.away}
                      </span>
                    </div>
                  ) : null}
                </div>
                <TeamBadge name={away} logo={awayLogo} align="right" />
              </div>
            </div>

            {ui === "completed" ? <ResultInline f={f} /> : null}
          </>
        )}
      </div>
    </li>
  );
}


function TeamBadge({ name, logo, align = "left" }: { name: string; logo?: string; align?: "left" | "right" | "center" }) {
  const initials = name
    .split(/\s+/)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 3);

  return (
    <div className={cn("flex items-center gap-2 min-w-0", align === "right" && "justify-end", align === "center" && "justify-center")}>
      {align === "right" && <span className="text-white/90 text-sm max-w-48 sm:max-w-none truncate">{name}</span>}
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
      {align !== "right" && <span className="text-white/90 text-sm max-w-48 sm:max-w-none truncate">{name}</span>}
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

  return (
    <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="flex flex-wrap items-center gap-3">
        <CheckCircle2 className="h-4 w-4 text-emerald-300" aria-hidden="true" />
        {score ? (
          <span className="text-sm font-semibold text-white">
            Final score: {score.home} - {score.away}
          </span>
        ) : (
          <span className="text-sm font-semibold text-white">Result recorded</span>
        )}
        {recordedAt ? <span className="text-xs text-white/70">Recorded: {recordedAt.date} {recordedAt.time}</span> : null}
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
