"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CarouselProps {
  children: React.ReactNode[]
  className?: string
  itemClassName?: string
  showControls?: boolean
  autoScroll?: boolean
  autoScrollInterval?: number
}

export function Carousel({
  children,
  className,
  itemClassName,
  showControls = true,
  autoScroll = false,
  autoScrollInterval = 5000,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const updateScrollButtons = () => {
    if (!scrollContainerRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
  }

  const scrollTo = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return

    const container = scrollContainerRef.current
    const itemWidth = container.children[0]?.clientWidth || 0
    const gap = 16 // 1rem gap
    const scrollAmount = itemWidth + gap

    if (direction === "left") {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" })
      setCurrentIndex(Math.max(0, currentIndex - 1))
    } else {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" })
      setCurrentIndex(Math.min(children.length - 1, currentIndex + 1))
    }
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => updateScrollButtons()
    container.addEventListener("scroll", handleScroll)
    updateScrollButtons()

    return () => container.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (!autoScroll) return

    const interval = setInterval(() => {
      if (canScrollRight) {
        scrollTo("right")
      } else {
        // Reset to beginning
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTo({ left: 0, behavior: "smooth" })
          setCurrentIndex(0)
        }
      }
    }, autoScrollInterval)

    return () => clearInterval(interval)
  }, [autoScroll, autoScrollInterval, canScrollRight, currentIndex])

  return (
    <div className={cn("relative", className)}>
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {children.map((child, index) => (
          <div key={index} className={cn("flex-none snap-start", itemClassName || "w-80 md:w-96")}>
            {child}
          </div>
        ))}
      </div>

      {showControls && (
        <>
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2 z-30",
              "bg-black/20 border-white/20 text-white backdrop-blur-sm",
              "hover:bg-black/40 hover:border-white/40",
              !canScrollLeft && "opacity-50 cursor-not-allowed",
            )}
            onClick={() => scrollTo("left")}
            disabled={!canScrollLeft}
            aria-label="Previous item"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className={cn(
              "absolute right-4 top-1/2 -translate-y-1/2 z-30",
              "bg-black/20 border-white/20 text-white backdrop-blur-sm",
              "hover:bg-black/40 hover:border-white/40",
              !canScrollRight && "opacity-50 cursor-not-allowed",
            )}
            onClick={() => scrollTo("right")}
            disabled={!canScrollRight}
            aria-label="Next item"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}

      {/* Scroll indicators */}
      <div className="flex justify-center mt-4 gap-2">
        {children.map((_, index) => (
          <button
            key={index}
            className={cn(
              "h-2 w-2 rounded-full transition-colors",
              index === currentIndex ? "bg-dam-gold" : "bg-gray-300",
            )}
            onClick={() => {
              if (scrollContainerRef.current) {
                const container = scrollContainerRef.current
                const itemWidth = container.children[0]?.clientWidth || 0
                const gap = 16
                const scrollAmount = (itemWidth + gap) * index
                container.scrollTo({ left: scrollAmount, behavior: "smooth" })
                setCurrentIndex(index)
              }
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
