// components/sections/home/FacebookSection.tsx
import { SectionShell } from "@/components/common/SectionShell"
import { SectionHeading } from "@/components/common/SectionHeading"
import { FacebookEmbed } from "./FacebookEmbed"

export function FacebookSection({ pageUrl }: { pageUrl: string }) {
  return (
    <SectionShell className="py-16 bg-dam-light-card">
      <div className="max-w-7xl mx-auto px-6 space-y-10">
        <SectionHeading
          overline="SOCIAL"
          title="From Facebook"
          subtitle="Latest updates from our official page"
          centered
        />
        {/* Let the embed cap itself at 500px and center */}
        <FacebookEmbed pageUrl={pageUrl} />
      </div>
    </SectionShell>
  )
}
