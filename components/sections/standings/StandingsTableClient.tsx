// components/sections/standings/StandingsTableClient.tsx
"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SectionShell } from "@/components/common/SectionShell";
import { SectionHeading } from "@/components/common/SectionHeading";
import { cn } from "@/lib/utils";
import { getStandings, SEASON as DEFAULT_SEASON } from "@/lib/public-api/api-client";
import type { StandingRow } from "@/lib/public-api/api-types";
import { mediaUrl } from "@/lib/public-api/media";

type Last5Token = "W" | "D" | "L" | string;

function Last5Pills({ values }: { values: string[] }) {
  return (
    <div className="flex items-center gap-1" aria-label="Last five results">
      {values.slice(0, 5).map((v, i) => {
        const t = v.toUpperCase() as Last5Token;
        const cls =
          t === "W"
            ? "bg-emerald-500/80"
            : t === "D"
            ? "bg-neutral-400/80"
            : t === "L"
            ? "bg-rose-500/80"
            : "bg-white/40";
        const label =
          t === "W" ? "Win" : t === "D" ? "Draw" : t === "L" ? "Loss" : "N/A";
        return (
          <span
            key={`${t}-${i}`}
            className={cn("h-2.5 w-2.5 rounded-sm", cls)}
            title={label}
            aria-label={label}
          />
        );
      })}
    </div>
  );
}

function TeamCell({
  name,
  logoUrl,
}: {
  name: string;
  logoUrl?: string | null;
}) {
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

export default function StandingsTableClient() {
  const [season, setSeason] = useState<string>(DEFAULT_SEASON);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["standings", { season }],
    queryFn: () => getStandings(season),
    staleTime: 15_000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const rows: StandingRow[] = useMemo(() => data ?? [], [data]);

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

          <div className="flex items-center gap-3">
            <label htmlFor="season" className="text-white/70 text-sm">
              Season
            </label>
            <select
              id="season"
              aria-label="Season"
              className="h-10 rounded-lg border border-white/15 bg-black/40 px-3 text-white/90"
              value={season}
              onChange={(e) => setSeason(e.target.value)}
            >
              <option value={DEFAULT_SEASON}>{DEFAULT_SEASON}</option>
            </select>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
            <div className="h-8 w-40 bg-white/10 rounded mb-4 animate-pulse" />
            <div className="overflow-x-auto">
              <div className="space-y-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-12 rounded bg-white/10 animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {isError && !isLoading && (
          <div className="rounded-2xl border border-red-300/30 bg-red-900/20 p-4 text-red-100">
            Failed to load standings.{" "}
            <button onClick={() => refetch()} className="underline underline-offset-4">
              Try again
            </button>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && rows.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-black/30 p-6 text-white/85">
            <p className="mb-2">Standings are not available yet for this season.</p>
            <a
              href="/fixtures?view=results&range=this-month"
              className="text-dam-gold underline underline-offset-4"
            >
              See recent results
            </a>
          </div>
        )}

        {/* Table */}
        {!isLoading && !isError && rows.length > 0 && (
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
