import type React from "react"
import { cn } from "@/lib/utils"
import { DiagonalAccent } from "./DiagonalAccent"

interface SectionShellProps {
  children: React.ReactNode
  bgImage?: string
  overlay?: "dark" | "red" | "green" | "none"
  diagonals?: boolean
  dense?: boolean
  className?: string
  id?: string
  "aria-labelledby"?: string
}

export function SectionShell({
  children,
  bgImage,
  overlay = "none",
  diagonals = false,
  dense = false,
  className,
  id,
  "aria-labelledby": ariaLabelledBy,
}: SectionShellProps) {
  const overlayClasses = {
    // Increased overlay opacity for better text contrast
    dark: "before:bg-gradient-to-b before:from-black/75 before:to-black/75",
    red: "before:bg-gradient-to-b before:from-dam-red/60 before:to-dam-red/60",
    green: "before:bg-gradient-to-b before:from-dam-green/60 before:to-dam-green/60",
    none: "",
  }

  const textColorClasses = {
    // Ensured proper text colors for contrast
    dark: "text-white",
    red: "text-white",
    green: "text-white",
    none: "",
  }

  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={cn(
        "relative w-full",
        dense ? "py-12 md:py-16" : "py-16 md:py-24",
        overlay !== "none" && "before:absolute before:inset-0 before:z-10",
        overlayClasses[overlay],
        textColorClasses[overlay],
        className,
      )}
      style={
        bgImage
          ? {
              backgroundImage: `url('${bgImage}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }
          : undefined
      }
    >
      {diagonals && <DiagonalAccent />}
      <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  )
}
