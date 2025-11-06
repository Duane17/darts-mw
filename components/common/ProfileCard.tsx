"use client"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

/* ===================== Types & Variants ===================== */
type Accent = "gold" | "green" | "red" | "white"

export type ProfileCardProps = {
  photo: string
  name: string
  title: string

  /**
   * Kept for API compatibility. The text overlay has been removed,
   * so this value is ignored in the UI.
   */
  profile?: string

  className?: string

  /** Visual accent color for glow and underline. Defaults to "gold". */
  accent?: Accent
  /** Enable subtle parallax tilt on hover. Respects reduced motion. */
  parallax?: boolean
  /** Use a glassy identity chip look. Defaults to true. */
  glass?: boolean

  /**
   * Kept for API compatibility. The overlay mode no longer exists,
   * so this prop is ignored.
   */
  profileMode?: "overlay" | "replace"
}

/* Accent maps to brand tokens */
const ACCENT = {
  gold: {
    ring: "shadow-[0_0_0_3px_rgba(234,179,8,0.25)]",
    text: "text-dam-gold",
    border: "border-dam-gold/30",
    glow: "shadow-[0_0_24px_rgba(234,179,8,0.25)]",
    underline: "bg-dam-gold",
  },
  green: {
    ring: "shadow-[0_0_0_3px_rgba(16,185,129,0.25)]",
    text: "text-dam-green",
    border: "border-dam-green/30",
    glow: "shadow-[0_0_24px_rgba(16,185,129,0.25)]",
    underline: "bg-dam-green",
  },
  red: {
    ring: "shadow-[0_0_0_3px_rgba(239,68,68,0.25)]",
    text: "text-dam-red",
    border: "border-dam-red/30",
    glow: "shadow-[0_0_24px_rgba(239,68,68,0.25)]",
    underline: "bg-dam-red",
  },
  white: {
    ring: "shadow-[0_0_0_3px_rgba(255,255,255,0.25)]",
    text: "text-white",
    border: "border-white/30",
    glow: "shadow-[0_0_24px_rgba(255,255,255,0.25)]",
    underline: "bg-white",
  },
} as const

/* ===================== Hook: prefers-reduced-motion ===================== */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReduced(m.matches)
    update()
    m.addEventListener?.("change", update)
    return () => m.removeEventListener?.("change", update)
  }, [])
  return reduced
}

/* ===================== Component ===================== */
export function ProfileCard({
  photo,
  name,
  title,
  profile: _profileIgnored,
  className,
  accent = "gold",
  parallax = true,
  glass = true,
}: ProfileCardProps) {
  const a = ACCENT[accent]
  const prefersReduced = usePrefersReducedMotion()

  /* ------ Image preload + fallback ------ */
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgSrc, setImgSrc] = useState(photo)
  useEffect(() => {
    let active = true
    const img = new Image()
    img.src = photo
    img.onload = () => active && setImgLoaded(true)
    img.onerror = () => active && setImgSrc("/placeholder-user.jpg")
    return () => {
      active = false
    }
  }, [photo])

  /* ------ Parallax tilt ------ */
  const cardRef = useRef<HTMLDivElement | null>(null)
  const [tilt, setTilt] = useState<{ rx: number; ry: number }>({ rx: 0, ry: 0 })

  const handleMove = useCallback(
    (e: React.MouseEvent) => {
      if (!parallax || prefersReduced) return
      const el = cardRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width
      const py = (e.clientY - rect.top) / rect.height
      const max = 3
      const rx = (py - 0.5) * -2 * max
      const ry = (px - 0.5) * 2 * max
      setTilt({ rx, ry })
    },
    [parallax, prefersReduced]
  )
  const resetTilt = useCallback(() => setTilt({ rx: 0, ry: 0 }), [])

  const transformStyle = useMemo(
    () =>
      parallax && !prefersReduced
        ? {
            transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
            willChange: "transform",
          }
        : { willChange: "auto" },
    [tilt, parallax, prefersReduced]
  )

  /* ------ Keyboard a11y ------ */
  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
    }
  }, [])

  /* ------ Shared styles ------ */
  const chipBase =
    "rounded-xl px-5 py-4 shadow-lg transition-all duration-300 backdrop-blur-md"
  const chipStyle = glass
    ? "bg-black/35 border border-white/5 backdrop-blur-sm"
    : "bg-black/70 border border-black/40"

  return (
    <Card
      ref={cardRef}
      className={cn(
        "relative overflow-hidden rounded-2xl border-0 dam-card-interactive dam-focus-ring group",
        "h-64 md:h-72 bg-black",
        "transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]",
        "focus-within:shadow-lg",
        a.ring,
        className
      )}
      role="button"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseMove={handleMove}
      onMouseLeave={resetTilt}
      aria-label={`Profile card for ${name}, ${title}`}
      style={transformStyle}
    >
      {/* Background photo */}
      <div
        className={cn(
          "absolute inset-0 dam-bg-cover transition-transform duration-500",
          "group-hover:scale-[1.06]",
          "opacity-0",
          imgLoaded ? "opacity-100" : "opacity-30 blur-sm"
        )}
        style={{ backgroundImage: `url('${imgSrc}')` }}
        role="img"
        aria-label={`${name} profile photo`}
      />

      {/* Readability gradient */}
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-black/5" />

      {/* Specular light sweep */}
      <div
        className={cn(
          "pointer-events-none absolute -inset-1 opacity-0 group-hover:opacity-100 group-focus:opacity-100",
          "transition-opacity duration-300"
        )}
        aria-hidden="true"
      >
        <div
          className={cn(
            "absolute -left-1/3 top-0 h-full w-1/2",
            "bg-linear-to-r from-transparent via-white/10 to-transparent",
            "transform -skew-x-12",
            "group-hover:translate-x-[160%] group-focus:translate-x-[160%]",
            "transition-transform duration-500 ease-out"
          )}
        />
      </div>

      {/* Identity chip - always visible now */}
      <div className="absolute inset-x-3 bottom-4 z-10">
        <div className={cn(chipBase, chipStyle, a.glow, "px-4 py-3")}>
          <h3 className="font-semibold text-[1.05rem] leading-tight text-white tracking-tight">
            {name}
            <span
              className={cn(
                "block h-0.5 w-0 mt-1 rounded-full transition-all duration-300",
                "group-hover:w-12 group-focus:w-12 group-focus-visible:w-12",
                a.underline
              )}
              aria-hidden="true"
            />
          </h3>
          <p className={cn("text-xs font-medium mt-1 leading-tight", a.text)}>
            {title}
          </p>
        </div>
      </div>

      {/* Subtle inner glow on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-white/5 to-transparent" />
      </div>
    </Card>
  )
}
