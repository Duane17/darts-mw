"use client"

import type React from "react"
import { useState, useMemo, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"

interface ImageCardProps {
  bgImage: string
  title: string
  subtitle?: string
  overlay?: "dark" | "red" | "green" | "light"
  children?: React.ReactNode
  className?: string
  onClick?: () => void
  href?: string
  height?: "sm" | "md" | "lg" | "xl"
  expandable?: boolean
  expandBehavior?: "hover" | "click"
  clampLines?: number
  showGlass?: boolean
}

export function ImageCard({
  bgImage,
  title,
  subtitle,
  overlay = "dark",
  children,
  className,
  onClick,
  href,
  height = "md",
  expandable = false,
  expandBehavior = "hover",
  clampLines = 3,
  showGlass = true,
}: ImageCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const overlayClasses = useMemo(
    () => ({
      dark: "before:bg-gradient-to-t before:from-black/90 before:via-black/45 before:to-black/15",
      red: "before:bg-gradient-to-t before:from-dam-red/80 before:via-dam-red/40 before:to-dam-red/10",
      green: "before:bg-gradient-to-t before:from-dam-green/80 before:via-dam-green/40 before:to-dam-green/10",
      light: "before:bg-gradient-to-t before:from-white/95 before:via-white/60 before:to-white/20",
    }),
    []
  )

  const textColorClasses = useMemo(
    () => ({
      dark: "text-white",
      red: "text-white",
      green: "text-white",
      light: "text-black",
    }),
    []
  )

  // We use min-heights so the card can grow when expanded
  const heightClasses = useMemo(
    () => ({
      sm: "min-h-48",
      md: "min-h-64 md:min-h-72",
      lg: "min-h-72 md:min-h-80",
      xl: "min-h-80 md:min-h-96",
    }),
    []
  )

  // Allow keyboard and click control for accessibility when expandable
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!expandable) return
      if (expandBehavior === "click" && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault()
        setIsExpanded((v) => !v)
      }
    },
    [expandable, expandBehavior]
  )

  const handleClick = useCallback(() => {
    if (expandable && expandBehavior === "click") {
      setIsExpanded((v) => !v)
    } else if (onClick) {
      onClick()
    }
  }, [expandable, expandBehavior, onClick])

  const handleMouseEnter = useCallback(() => {
    if (expandable && expandBehavior === "hover") {
      setIsExpanded(true)
    }
  }, [expandable, expandBehavior])

  const handleMouseLeave = useCallback(() => {
    if (expandable && expandBehavior === "hover") {
      setIsExpanded(false)
    }
  }, [expandable, expandBehavior])

  const CardComponent = href ? "a" : "div"
  const cardProps = href ? { href } : onClick ? { onClick: handleClick } : {}

  // Inline clamping is robust and does not require the Tailwind line-clamp plugin
  const paragraphStyleCollapsed: React.CSSProperties = expandable
    ? {
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: String(clampLines),
        overflow: "hidden",
      }
    : {}

  const paragraphStyleExpanded: React.CSSProperties = expandable
    ? {
        display: "block",
        overflow: "visible",
      }
    : {}

  return (
    <motion.div
      layout
      // Slight scale on expansion provides a tactile feel
      animate={{ scale: isExpanded ? 1.01 : 1 }}
      transition={{ 
        layout: { type: "spring", stiffness: 300, damping: 30 },
        scale: { type: "spring", stiffness: 300, damping: 30 }
      }}
    >
      <Card
        className={cn(
          "group relative overflow-hidden rounded-2xl border-0 dam-card-interactive dam-focus-ring",
          "before:absolute before:inset-0 before:z-10",
          overlayClasses[overlay],
          heightClasses[height],
          className
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <CardComponent
          {...cardProps}
          role={expandable ? "button" : onClick || href ? "button" : undefined}
          tabIndex={expandable || onClick || href ? 0 : undefined}
          onKeyDown={handleKeyDown}
          aria-expanded={expandable ? isExpanded : undefined}
          aria-label={expandable ? `${title} card` : undefined}
          onClick={href ? undefined : handleClick}
        >
          <div
            className="absolute inset-0 dam-bg-cover transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url('${bgImage}')` }}
            role="img"
            aria-label={`Background image for ${title}`}
          />
          <motion.div
            layout
            className={cn("relative z-20 flex flex-col justify-end p-6", textColorClasses[overlay])}
            transition={{ type: "spring", stiffness: 240, damping: 26 }}
          >
            <div
              className={cn(
                showGlass ? "bg-black/20 backdrop-blur-sm rounded-lg p-4 space-y-2" : "space-y-2",
                expandable && !isExpanded ? "overflow-hidden" : ""
              )}
            >
              <h3 className="dam-heading dam-heading-md font-heading dam-text-balance">{title}</h3>

              {subtitle && (
                <motion.p
                  layout
                  className="text-sm leading-relaxed dam-text-pretty"
                  style={isExpanded ? paragraphStyleExpanded : paragraphStyleCollapsed}
                  transition={{ type: "spring", stiffness: 240, damping: 26 }}
                >
                  {subtitle}
                </motion.p>
              )}
              {/* Optional helper control for click behavior */}
              {expandable && expandBehavior === "click" && subtitle ? (
                <motion.button
                  layout
                  initial={false}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsExpanded((v) => !v)
                  }}
                  className="mt-2 inline-flex items-center text-xs font-medium underline underline-offset-4 focus:outline-none focus:ring-2 focus:ring-dam-gold rounded"
                  aria-label={isExpanded ? "Collapse text" : "Expand text"}
                  transition={{ layout: { type: "spring", stiffness: 300, damping: 30 } }}
                >
                  {isExpanded ? "Show less" : "Read more"}
                </motion.button>
              ) : null}
            </div>

            {children && <div className="mt-4">{children}</div>}
          </motion.div>
        </CardComponent>
      </Card>
    </motion.div>
  )
}
