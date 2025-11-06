"use client"

import * as React from "react"
import { motion, useScroll, useTransform } from "framer-motion"

type TimelineEntry = {
  title?: string
  content: React.ReactNode
}

type TimelineProps = {
  data: TimelineEntry[]
  className?: string
}

/**
 * Timeline
 * Left gold spine with animated progress and a soft glow that rises as you scroll.
 * Markers are small gold orbs without outlines.
 */
export function Timeline({ data, className = "" }: TimelineProps) {
  const sectionRef = React.useRef<HTMLDivElement>(null)
  const railRef = React.useRef<HTMLDivElement>(null)
  const [railHeight, setRailHeight] = React.useState(0)

  // Keep animated elements in sync with actual content height
  React.useEffect(() => {
    if (!railRef.current) return
    const ro = new ResizeObserver(() => {
      setRailHeight(railRef.current?.getBoundingClientRect().height ?? 0)
    })
    ro.observe(railRef.current)
    return () => ro.disconnect()
  }, [])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 10%", "end 60%"],
  })

  // Line fill height and opacity
  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, railHeight])
  const opacityTransform = useTransform(scrollYProgress, [0, 0.08], [0, 1])

  // Traveling glow follows the same height
  const glowOpacity = useTransform(scrollYProgress, [0, 0.15, 1], [0, 0.6, 0.9])

  return (
    <div ref={sectionRef} className={`relative w-full ${className}`}>
      {/* Gold spine, animated fill, and glow */}
      <div ref={railRef} className="absolute left-8 md:left-10 top-0 bottom-0 w-[2px]">
        {/* Base spine gradient */}
        <div
          aria-hidden
          className="absolute inset-0 w-[2px] bg-gradient-to-b from-transparent via-dam-gold/40 to-transparent [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        />
        {/* Animated inner fill */}
        <motion.div
          aria-hidden
          style={{ height: heightTransform, opacity: opacityTransform }}
          className="absolute left-0 top-0 w-[2px] bg-gradient-to-b from-dam-gold/90 to-transparent rounded-full"
        />
        {/* Traveling glow halo */}
        <motion.div
          aria-hidden
          style={{ height: heightTransform, opacity: glowOpacity }}
          className="absolute left-1/2 -translate-x-1/2 top-0 w-8 md:w-10 rounded-b-full"
        >
          <div className="absolute inset-0 rounded-b-full bg-[radial-gradient(closest-side,rgba(255,215,0,0.55),rgba(255,215,0,0.15),transparent)] blur-md" />
        </motion.div>
      </div>

      {/* Entries */}
      <div className="relative max-w-6xl mx-auto">
        {data.map((item, index) => (
          <div key={index} className="flex justify-start md:gap-10 pt-12 md:pt-24">
            {/* Marker */}
            <div className="sticky top-32 z-10 flex items-start md:w-80 lg:w-96">
              <div
                className="relative h-10 w-10 rounded-full grid place-items-center bg-transparent"
                style={{ marginLeft: "calc(2rem - 20px)" }}
                aria-hidden
              >
                <div className="h-3.5 w-3.5 rounded-full bg-dam-gold shadow-[0_0_12px_rgba(255,215,0,0.6)]" />
              </div>
            </div>

            {/* Content column */}
            <div className="relative pl-20 md:pl-0 pr-4 w-full">
              {item.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
