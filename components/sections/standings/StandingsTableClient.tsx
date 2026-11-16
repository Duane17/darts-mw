// components/sections/standings/StandingsTable.tsx
import Link from "next/link";
import { SectionShell } from "@/components/common/SectionShell";
import { SectionHeading } from "@/components/common/SectionHeading";
import { cn } from "@/lib/utils";
import { mediaUrl } from "@/lib/public-api/media";
import { getStandings, SEASON_OPTIONS, type LeagueCode } from "@/lib/public-api/api-client";
import type { StandingRow } from "@/lib/public-api/api-types";

/** A small badge row for the last five results if you add it later */
// function Last5Pills({ values }: { values: string[] }) { ... }

function TeamCell({ name, logoUrl }: { name: string; logoUrl?: string | null }) {
  const src = mediaUrl(logoUrl ?? "");
  return (
    <div className="flex items-center gap-2 min-w-0 text-white/90">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {src ? (
        <img
          src={src}
          alt={`${name} logo`}
          className="h-6 w-6 rounded-full ring-1 ring-white/15 object-contain bg-white/5 p-0.5 shrink-0"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className="h-6 w-6 rounded-full ring-1 ring-white/15 bg-white/10 grid place-items-center text-[10px] text-white/90 shrink-0">
          {name
            .split(/\s+/)
            .map((w) => w[0]?.toUpperCase() ?? "")
            .join("")
            .slice(0, 3)}
        </div>
      )}
      <span className="truncate">{name}</span>
    </div>
  );
}

export default async function StandingsTable({
  seasonYear,
  league,
}: {
  seasonYear: number;
  league: LeagueCode;
}) {
  let rows: StandingRow[] = [];
  try {
    rows = await getStandings({ seasonYear, league });
  } catch {
    rows = [];
  }

  // Seasons to show in the selector. Adjust as needed.
  const seasons = SEASON_OPTIONS;

  return (
    <SectionShell bgImage="/images/cta/cta-bg.jpg" overlay="dark" className="py-20">
      <div className="max-w-6xl mx-auto px-6 space-y-8">
        <div className="flex flex-col items-center gap-4">
          <SectionHeading
            overline="LEAGUE TABLE"
            title="Standings"
            subtitle="Points, goal difference, and recent form"
            centered
          />

          {/* Minimal selectors that trigger server re rendering using GET */}
          <form
            method="GET"
            action="/standings"
            className="flex flex-wrap items-center gap-3"
          >
            <label htmlFor="seasonYear" className="text-white/70 text-sm">
              Season
            </label>
            <select
              id="seasonYear"
              name="seasonYear"
              defaultValue={String(seasonYear)}
              className="h-10 rounded-lg border border-white/15 bg-black/40 px-3 text-white/90"
            >
              {seasons.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            <label htmlFor="league" className="text-white/70 text-sm">
              League
            </label>
            <select
              id="league"
              name="league"
              defaultValue={league}
              className="h-10 rounded-lg border border-white/15 bg-black/40 px-3 text-white/90"
            >
              <option value="SRDL">SRDL</option>
              <option value="CRDL">CRDL</option>
            </select>

            <button
              type="submit"
              className="rounded-lg border border-white/15 bg-black/40 px-4 py-2 text-sm text-white/90"
            >
              Apply
            </button>
          </form>
        </div>

        {/* Empty */}
        {rows.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-black/30 p-6 text-white/85">
            <p className="mb-2">
              Standings are not available yet for this selection.
            </p>
            <Link
              href="/fixtures?view=results&range=this-month"
              className="text-dam-gold underline underline-offset-4"
            >
              See recent results
            </Link>
          </div>
        )}

        {/* Table */}
        {rows.length > 0 && (
          <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-white/70">
                    <th className="p-3 text-left font-medium">Pos</th>
                    <th className="p-3 text-left font-medium">Team</th>
                    <th className="p-3 text-center font-medium">P</th>
                    <th className="p-3 text-center font-medium">W</th>
                    <th className="p-3 text-center font-medium">D</th>
                    <th className="p-3 text-center font-medium">L</th>
                    <th className="p-3 text-center font-medium">GF</th>
                    <th className="p-3 text-center font-medium">GA</th>
                    <th className="p-3 text-center font-medium">GD</th>
                    <th className="p-3 text-center font-medium">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => {
                    const zebra = i % 2 === 0 ? "bg-white/5" : "bg-white/[0.03]";
                    return (
                      <tr key={`${r.teamId}-${r.rank}`} className={cn("text-white/90", zebra)}>
                        <td className="p-3 align-middle">{r.rank}</td>
                        <td className="p-3 align-middle min-w-48">
                          <TeamCell name={r.teamName} logoUrl={r.teamLogoUrl} />
                        </td>
                        <td className="p-3 text-center align-middle">{r.played}</td>
                        <td className="p-3 text-center align-middle">{r.won}</td>
                        <td className="p-3 text-center align-middle">{r.drawn}</td>
                        <td className="p-3 text-center align-middle">{r.lost}</td>
                        <td className="p-3 text-center align-middle">{r.goalsFor}</td>
                        <td className="p-3 text-center align-middle">{r.goalsAgainst}</td>
                        <td className="p-3 text-center align-middle">
                          <span
                            className={cn(
                              "inline-block rounded px-2 py-0.5",
                              r.goalDiff > 0
                                ? "bg-emerald-500/15 text-emerald-300"
                                : r.goalDiff < 0
                                ? "bg-rose-500/15 text-rose-300"
                                : "bg-white/10 text-white/90"
                            )}
                          >
                            {r.goalDiff}
                          </span>
                        </td>
                        <td className="p-3 text-center align-middle font-semibold">{r.points}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </SectionShell>
  );
}
