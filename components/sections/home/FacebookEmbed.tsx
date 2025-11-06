// components/sections/home/FacebookEmbed.tsx
"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { cn } from "@/lib/utils"

function debounce<T extends (...args: any[]) => void>(fn: T, ms = 120) {
  let t: ReturnType<typeof setTimeout> | null = null
  return (...args: Parameters<T>) => {
    if (t) clearTimeout(t)
    t = setTimeout(() => fn(...args), ms)
  }
}

const FB_MAX = 500; // ← Facebook Page Plugin max width

export function FacebookEmbed({
  pageUrl,
  min = 320,
  tabs = "timeline",
  className,
}: {
  pageUrl: string
  min?: number
  tabs?: string
  className?: string
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [pxWidth, setPxWidth] = useState<number | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(
      debounce(() => {
        const raw = el.clientWidth
        const clamped = Math.max(min, Math.min(FB_MAX, raw)) // ← clamp to 500
        // rounding helps avoid frequent reloads
        const rounded = Math.round(clamped / 10) * 10
        setPxWidth(rounded)
      }, 120)
    )
    ro.observe(el)
    // initial
    const raw = el.clientWidth
    const clamped = Math.max(min, Math.min(FB_MAX, raw))
    const rounded = Math.round(clamped / 10) * 10
    setPxWidth(rounded)

    return () => ro.disconnect()
  }, [min])

  // height tuned per width (optional)
  const height = useMemo(() => {
    if (!pxWidth) return 520
    if (pxWidth < 360) return 420
    if (pxWidth < 420) return 500
    if (pxWidth < 500) return 560
    return 600
  }, [pxWidth])

  const src = useMemo(() => {
    const u = new URL("https://www.facebook.com/plugins/page.php")
    u.searchParams.set("href", pageUrl)
    u.searchParams.set("tabs", tabs)
    u.searchParams.set("width", String(pxWidth ?? 500))   // ← numeric width in URL
    u.searchParams.set("height", String(height))
    u.searchParams.set("small_header", "false")
    u.searchParams.set("adapt_container_width", "true")
    u.searchParams.set("hide_cover", "false")
    u.searchParams.set("show_facepile", "true")
    return u.toString()
  }, [pageUrl, tabs, pxWidth, height])

  return (
    <div
      ref={ref}
      className={cn(
        // hard cap the box to 500px so there’s no grey gutter
        "w-full max-w-[500px] mx-auto",
        "overflow-hidden rounded-2xl border border-white/10 bg-black/20 backdrop-blur-sm",
        "shadow-sm hover:shadow-md transition-shadow",
        className
      )}
      style={{ minHeight: 320 }}
    >
      {/* key=pxWidth forces a refresh when width changes */}
      <iframe
        key={pxWidth ?? "init"}
        title="Facebook Page"
        src={src}
        // IMPORTANT: give FB a number, not 100%
        width={pxWidth ?? 500}
        height={height}
        loading="lazy"
        style={{ border: "none", overflow: "hidden", display: "block" }}
        scrolling="no"
        frameBorder={0}
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
      />
    </div>
  )
}
