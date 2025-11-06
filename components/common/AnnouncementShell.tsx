// components/common/AnnouncementsShell.tsx
import { cn } from "@/lib/utils";

type AnnouncementsShellProps = {
  className?: string;
  children: React.ReactNode;
  /** Background image url. Defaults to the same image used on standings and fixtures if not provided. */
  bgImage?: string;
  /** Overlay tone. */
  overlay?: "none" | "dark" | "light";
  /** Optional header area to render above main content, inside the shell. */
  header?: React.ReactNode;
};

/**
 * Full height shell tailored for announcements pages.
 * Ensures the background covers the full viewport even for short posts.
 */
export function AnnouncementsShell({
  className,
  children,
  bgImage = "/images/cta/cta-bg.jpg",
  overlay = "dark",
  header,
}: AnnouncementsShellProps) {
  return (
    <section
      className={cn(
        "relative isolate w-full min-h-svh flex flex-col",
        className
      )}
    >
      {/* Background layer */}
      {bgImage ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-center bg-cover bg-no-repeat"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
      ) : null}

      {/* Overlay layer */}
      {overlay !== "none" ? (
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 -z-10",
            overlay === "dark" && "bg-black/55",
            overlay === "light" && "bg-white/40"
          )}
        />
      ) : null}

      {/* Optional header area */}
      {header ? <div className="w-full">{header}</div> : null}

      {/* Content */}
      <div className="flex-1">{children}</div>
    </section>
  );
}
