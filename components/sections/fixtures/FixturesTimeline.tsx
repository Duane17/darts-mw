// components/sections/fixtures/FixturesTimeline.tsx
"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { CalendarDays, MapPin } from "lucide-react"
import { SectionShell } from "@/components/common/SectionShell"
import { SectionHeading } from "@/components/common/SectionHeading"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  fixturesByWeek as defaultData,
  type FixturesWeek,
  type FixtureEvent,
} from "@/data/fixtures"
import { cn } from "@/lib/utils"
import { formatLocal } from "@/lib/datetime"
import {
  WeekFilter,
  ALL_WEEKS_VALUE,
} from "@/components/sections/fixtures/WeekFilter"
import { getTeamLogo } from "@/data/teamLogos"

// --- helpers ---------------------------------------------------------

const typeClass: Record<string, string> = {
  "SMK Trading CRDL": "bg-green-600/20 text-green-300 border-green-600/40",
  Friendly: "bg-sky-600/20 text-sky-300 border-sky-600/40",
  Tournament: "bg-purple-600/20 text-purple-300 border-purple-600/40",
  Training: "bg-amber-600/20 text-amber-300 border-amber-600/40",
  Community: "bg-rose-600/20 text-rose-300 border-rose-600/40",
  Workshop: "bg-indigo-600/20 text-indigo-300 border-indigo-600/40",
}

// --- team avatar -----------------------------------------------------

function TeamBadge({
  name,
  align = "left",
}: {
  name: string
  align?: "left" | "right" | "center"
}) {
  const src = getTeamLogo(name)
  const initials = name
    .split(/\s+/)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 3)

  return (
    <div
      className={cn(
        "flex items-center gap-2 min-w-0",
        align === "right" && "justify-end",
        align === "center" && "justify-center"
      )}
    >
      {align === "right" && (
        <span className="truncate text-white/90 text-sm">{name}</span>
      )}
      {src ? (
        <img
          src={src}
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
        <span className="truncate text-white/90 text-sm">{name}</span>
      )}
    </div>
  )
}

// Derive teams if missing
function deriveTeams(ev: FixtureEvent): { home: string; away: string } {
  let home = ev.homeTeam
  let away = ev.awayTeam
  if (!home || !away) {
    const parts = ev.title.split(" vs ")
    if (parts.length === 2) {
      home = home ?? parts[0].trim()
      away = away ?? parts[1].trim()
    }
  }
  return { home: home ?? "Home", away: away ?? "Away" }
}

// --- components ------------------------------------------------------

function EventItem({
  ev,
  onMore,
}: {
  ev: FixtureEvent
  onMore: (ev: FixtureEvent) => void
}) {
  const t = formatLocal(ev.date)
  const { home, away } = deriveTeams(ev)

  return (
    <motion.li
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={{ duration: 0.4 }}
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
              typeClass[ev.type] ?? "bg-white/10 text-white border-white/20"
            )}
          >
            {ev.type}
          </Badge>

          <div className="flex items-center gap-2 text-white/90 text-sm">
            <CalendarDays className="h-4 w-4 opacity-70" />
            <span suppressHydrationWarning>{t.date}</span>
          </div>

          <div className="flex items-center gap-2 text-white/90 text-sm flex-wrap sm:flex-nowrap">
            <MapPin className="h-4 w-4 opacity-70 shrink-0" />
            <span className="wrap-break-word sm:truncate text-white/90 text-sm leading-snug max-w-full sm:max-w-[220px]">
              {ev.venue}
            </span>
          </div>
        </div>

        {/* logos row */}
        <div className="mt-3">
          {/* desktop and tablets: side by side */}
          <div className="hidden sm:grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <TeamBadge name={home} align="left" />
            <span className="text-white/70 text-xs sm:text-sm font-medium select-none px-2">
              VS
            </span>
            <TeamBadge name={away} align="right" />
          </div>

        {/* mobile: stacked vertically with VS between teams */}
          <div className="sm:hidden grid grid-rows-[auto_auto_auto] justify-items-center gap-2">
            <TeamBadge name={home} align="center" />
            <span className="text-white/70 text-xs font-semibold tracking-wide select-none">
              VS
            </span>
            <TeamBadge name={away} align="center" />
          </div>
        </div>

        {/* keep title for accessibility */}
        <h4 className="sr-only">{ev.title}</h4>
                {ev.description && (
          <p className="text-sm text-white/80 mt-3 line-clamp-2">{ev.description}</p>
        )}

      </div>
    </motion.li>
  )
}

export function FixturesTimeline({ data = defaultData }: { data?: FixturesWeek[] }) {
  const weeks = useMemo(() => data, [data])

  // Selected week query state
  const [selectedWeekISO, setSelectedWeekISO] = useState<string>(ALL_WEEKS_VALUE)

  // Compute upcoming-only weeks and events
  const nowTs = Date.now()
  const upcomingWeeks: FixturesWeek[] = useMemo(() => {
    // Filter each week's events to future ones and drop weeks that become empty
    const filtered = weeks
      .map<FixturesWeek>((w) => ({
        ...w,
        events: w.events.filter((ev) => new Date(ev.date).getTime() >= nowTs),
      }))
      .filter((w) => w.events.length > 0)

    // Keep chronological order by weekStartISO
    return filtered.sort((a, b) => a.weekStartISO.localeCompare(b.weekStartISO))
  }, [weeks, nowTs])

  // Initialize from ?week= if it exists and is valid among upcoming weeks
  useEffect(() => {
    if (typeof window === "undefined") return
    const params = new URLSearchParams(window.location.search)
    const fromQuery = params.get("week")
    if (fromQuery && upcomingWeeks.some((w) => w.weekStartISO === fromQuery)) {
      setSelectedWeekISO(fromQuery)
    } else {
      // If the query points to an invalid or past-only week, normalize to ALL
      setSelectedWeekISO(ALL_WEEKS_VALUE)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [/* run once on mount, upcomingWeeks computed already */])

  // If selection becomes invalid after filtering, reset to ALL
  useEffect(() => {
    if (
      selectedWeekISO !== ALL_WEEKS_VALUE &&
      !upcomingWeeks.some((w) => w.weekStartISO === selectedWeekISO)
    ) {
      setSelectedWeekISO(ALL_WEEKS_VALUE)
    }
  }, [selectedWeekISO, upcomingWeeks])

  const visibleWeeks = useMemo<FixturesWeek[]>(() => {
    if (selectedWeekISO === ALL_WEEKS_VALUE) return upcomingWeeks
    return upcomingWeeks.filter((w) => w.weekStartISO === selectedWeekISO)
  }, [upcomingWeeks, selectedWeekISO])

  const handleChangeWeek = (iso: string) => {
    setSelectedWeekISO(iso)

    if (typeof window !== "undefined") {
      const url = new URL(window.location.href)
      if (iso === ALL_WEEKS_VALUE) {
        url.searchParams.delete("week")
      } else {
        url.searchParams.set("week", iso)
      }
      window.history.replaceState({}, "", url.toString())
    }
  }

  return (
    <SectionShell bgImage="/images/cta/cta-bg.jpg" overlay="dark" className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeading
          overline="UPCOMING"
          title="Upcoming Fixtures"
          subtitle="Matches grouped by week."
          centered
          className="mb-8"
        />

        <div className="mb-8 flex items-center justify-center">
          <WeekFilter
            weeks={upcomingWeeks}
            value={selectedWeekISO}
            onChange={handleChangeWeek}
            includeAll
            allLabel="All upcoming weeks"
            onlyUpcoming
          />
        </div>

        {visibleWeeks.length === 0 ? (
          <p className="text-center text-white/80">
            No upcoming fixtures available.
          </p>
        ) : (
          <div className="space-y-12">
            {visibleWeeks.map((week, idx) => (
              <section key={week.weekStartISO} aria-labelledby={`week-${idx}`}>
                <div className="flex items-center gap-4">
                  <h3
                    id={`week-${idx}`}
                    className="dam-heading dam-heading-md font-heading text-white"
                  >
                    {week.weekLabel}
                  </h3>
                  <Separator className="flex-1 bg-white/10" />
                </div>

                <ol className="relative mt-6 border-l border-white/10 pl-4">
                  {week.events.map((ev) => (
                    <EventItem key={ev.id} ev={ev} onMore={() => {}} />
                  ))}
                </ol>
              </section>
            ))}
          </div>
        )}
      </div>
    </SectionShell>
  )
}
