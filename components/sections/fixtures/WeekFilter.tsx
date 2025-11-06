// components/sections/fixtures/WeekFilter.tsx
"use client"

import { useMemo } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { FixturesWeek } from "@/data/fixtures"

export const ALL_WEEKS_VALUE = "__ALL__"

export function WeekFilter({
  weeks,
  value,
  onChange,
  className,
  includeAll = true,
  allLabel = "All weeks",
  // New: only show weeks that have at least one future event
  onlyUpcoming = false,
  // Optional: pass a custom time reference for testing
  now,
}: {
  weeks: FixturesWeek[]
  /** Selected weekStartISO or ALL_WEEKS_VALUE */
  value: string
  onChange: (val: string) => void
  className?: string
  includeAll?: boolean
  allLabel?: string
  onlyUpcoming?: boolean
  now?: Date | string
}) {
  const nowTs = useMemo(
    () => (now ? new Date(now).getTime() : Date.now()),
    [now]
  )

  const filteredWeeks = useMemo(() => {
    if (!onlyUpcoming) return weeks
    return weeks.filter(w => w.events.some(ev => new Date(ev.date).getTime() >= nowTs))
  }, [weeks, onlyUpcoming, nowTs])

  const options = useMemo(
    () =>
      [...filteredWeeks]
        .sort((a, b) => a.weekStartISO.localeCompare(b.weekStartISO))
        .map((w) => ({ value: w.weekStartISO, label: w.weekLabel })),
    [filteredWeeks]
  )

  return (
    <div className={className}>
      <label htmlFor="week-filter" className="sr-only">
        Filter by week
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="week-filter" className="w-full sm:w-[320px]">
          <SelectValue placeholder="Filter by week" />
        </SelectTrigger>
        <SelectContent>
          {includeAll && (
            <SelectItem value={ALL_WEEKS_VALUE}>{allLabel}</SelectItem>
          )}
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
