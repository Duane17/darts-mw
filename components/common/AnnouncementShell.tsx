// components/common/AnnouncementShell.tsx
import { cn } from "@/lib/utils";
import { getAnnouncementsContent } from "@/lib/public-api/api-client";
import { mediaUrl } from "@/lib/public-api/media";

type AnnouncementsShellProps = {
  className?: string;
  children: React.ReactNode;
  /** Background image url. If not provided, fetches from CMS. */
  bgImage?: string;
  /** Overlay tone. */
  overlay?: "none" | "dark" | "light";
  /** Optional header area to render above main content, inside the shell. */
  header?: React.ReactNode;
};

/**
 * Full height shell tailored for announcements pages.
 * Automatically uses the same dynamic background image as the announcements list.
 */
export async function AnnouncementsShell({
  className,
  children,
  bgImage: propBgImage,
  overlay = "dark",
  header,
}: AnnouncementsShellProps) {
  let backgroundUrl: string;

  if (propBgImage) {
    backgroundUrl = mediaUrl(propBgImage);
  } else {
    try {
      const content = await getAnnouncementsContent();
      const rawBg = content?.backgroundImage ?? "/images/cta/cta-bg.jpg";
      backgroundUrl = mediaUrl(rawBg);
    } catch (error) {
      console.error("Failed to fetch announcements background:", error);
      backgroundUrl = mediaUrl("/images/cta/cta-bg.jpg");
    }
  }

  return (
    <section
      className={cn(
        "relative isolate w-full min-h-svh flex flex-col",
        className
      )}
    >
      {/* Background layer */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundUrl})` }}
      />

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