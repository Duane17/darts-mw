import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface SectionHeadingProps {
  overline?: string
  title: string
  subtitle?: string
  centered?: boolean
  className?: string
  id?: string
}

export function SectionHeading({
  overline,
  title,
  subtitle,
  centered = false,
  className,
  id,
}: SectionHeadingProps) {
  return (
    <div className={cn("space-y-4", centered ? "text-center" : "text-left", className)}>
      {overline && (
        <Badge
          variant="outline"
          className="border-dam-gold bg-black/80 text-white font-medium tracking-wide backdrop-blur-sm"
        >
          {overline}
        </Badge>
      )}
      <h2 id={id} className="dam-heading dam-heading-lg font-heading text-balance">
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "text-lg leading-relaxed text-muted-foreground max-w-3xl",
            centered && "mx-auto"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
