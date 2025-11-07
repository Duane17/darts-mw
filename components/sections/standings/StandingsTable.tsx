// components/sections/standings/StandingsTable.tsx
import Link from "next/link";
import { SectionShell } from "@/components/common/SectionShell";
import { SectionHeading } from "@/components/common/SectionHeading";
import { cn } from "@/lib/utils";
import { mediaUrl } from "@/lib/public-api/media";
import { getStandingsCompat, type LeagueCode } from "@/lib/public-api/api-client";
import type { StandingRow } from "@/lib/public-api/api-types";

/** Safely render a team cell with logo or initials */
function TeamCell({
  name,
  logoUrl,
}: {
  name: string | undefined | null;
  logoUrl?: string | null;
}) {
  const safeName =
    typeof name === "string" && name.trim().length > 0 ? name : "Team";
  const src = mediaUrl(logoUrl ?? "");

  const initials = safeName
    .toString()
    .trim()
    .split(/\s+/)
    .map((w) => (w && w[0] ? w[0].toUpperCase() : ""))
    .join("")
    .slice(0, 3);

  return (
    <div className="flex items-center gap-2 min-w-0 text-white/90">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {src ? (
        <img
          src={src}
          alt={`${safeName} logo`}
          className="h-6 w-6 rounded-full ring-1 ring-white/15 object-contain bg-white/5 p-0.5 shrink-0"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className="h-6 w-6 rounded-full ring-1 ring-white/15 bg-white/10 grid place-items-center text-[10px] text-white/90 shrink-0">
          {initials}
        </div>
      )}
      <span className="truncate">{safeName}</span>
    </div>
  );
}

/** Split rows into groups when present, returning null if there are no groups at all */
function splitIntoGroups(rows: StandingRow[]) {
  const hasAnyGroup =
    rows.some((r) => typeof r.group === "string" && r.group.trim().length > 0);
  if (!hasAnyGroup) return null;

  const A = rows.filter((r) => (r.group || "").toUpperCase() === "A");
  const B = rows.filter((r) => (r.group || "").toUpperCase() === "B");
  return { A, B };
}

/** Mobile card row for standings */
function MobileRow({ r, index }: { r: StandingRow; index: number }) {
  const safeTeamName = r.teamName ?? (r as any)?.team?.name ?? "Team";
  const logo = r.teamLogoUrl ?? (r as any)?.team?.logoUrl ?? null;
  const pos = typeof r.rank === "number" && r.rank > 0 ? r.rank : index + 1;

  return (
    <li className="rounded-lg border border-white/10 bg-black/20 p-3">
      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded bg-white/10 text-sm font-semibold text-white">
          {pos}
        </div>

        <div className="min-w-0 flex-1">
          <TeamCell name={safeTeamName} logoUrl={logo} />
        </div>

        <div className="ml-auto rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-white">
          {r.points} pts
        </div>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs text-white/85">
        <div className="rounded-md border border-white/10 py-1">
          <div className="text-white/60">P</div>
          <div className="font-semibold">{r.played}</div>
        </div>
        <div className="rounded-md border border-white/10 py-1">
          <div className="text-white/60">W</div>
          <div className="font-semibold">{r.won}</div>
        </div>
        <div className="rounded-md border border-white/10 py-1">
          <div className="text-white/60">GD</div>
          <div className="font-semibold">{r.goalDiff}</div>
        </div>
        <div className="rounded-md border border-white/10 py-1">
          <div className="text-white/60">GF</div>
          <div className="font-semibold">{r.goalsFor}</div>
        </div>
      </div>
    </li>
  );
}

/** Reusable table renderer with responsive mobile layout and reliable Pos column */
function StandingsTableBlock({
  title,
  rows,
}: {
  title?: string;
  rows: StandingRow[];
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
      {title ? (
        <div className="px-1 pb-3 text-white/80 text-sm font-medium">{title}</div>
      ) : null}

      {/* Mobile list, visible below md */}
      <div className="md:hidden">
        {rows.length === 0 ? (
          <div className="rounded-lg border border-white/10 bg-black/20 p-6 text-center text-white/80">
            No standings to display
          </div>
        ) : (
          <ul className="space-y-3">
            {rows.map((r, i) => (
              <MobileRow key={`${r.teamId}-m-${i}`} r={r} index={i} />
            ))}
          </ul>
        )}
      </div>

      {/* Desktop table, visible from md */}
      <div className="hidden md:block overflow-x-auto">
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
              const safeTeamName = r.teamName ?? (r as any)?.team?.name ?? "Team";
              const safeLogo = r.teamLogoUrl ?? (r as any)?.team?.logoUrl ?? null;
              const pos = typeof r.rank === "number" && r.rank > 0 ? r.rank : i + 1;

              return (
                <tr key={`${r.teamId}-${pos}`} className={cn("text-white/90", zebra)}>
                  <td className="p-3 align-middle">{pos}</td>
                  <td className="p-3 align-middle min-w-48">
                    <TeamCell name={safeTeamName} logoUrl={safeLogo} />
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
                  <td className="p-3 text-center align-middle font-semibold">
                    {r.points}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
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
    rows = await getStandingsCompat({ seasonYear, league });
  } catch {
    rows = [];
  }

  const seasons = [2025, 2024, 2023];
  const grouped = splitIntoGroups(rows);

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

          {/* Server re-render via GET */}
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
            <p className="mb-2">Standings are not available yet for this selection.</p>
            <Link
              href="/fixtures?view=results&range=this-month"
              className="text-dam-gold underline underline-offset-4"
            >
              See recent results
            </Link>
          </div>
        )}

        {/* SRDL with groups stacked vertically on all breakpoints */}
        {rows.length > 0 && grouped && (
          <div className="space-y-6">
            <StandingsTableBlock title="Group A" rows={grouped.A} />
            <StandingsTableBlock title="Group B" rows={grouped.B} />
          </div>
        )}

        {/* Single table for CRDL or SRDL without group markers */}
        {rows.length > 0 && !grouped && <StandingsTableBlock rows={rows} />}
      </div>
    </SectionShell>
  );
}
