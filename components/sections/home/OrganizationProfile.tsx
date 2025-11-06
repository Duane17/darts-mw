"use client"

import { motion } from "framer-motion"
import { SectionShell } from "@/components/common/SectionShell"
import { SectionHeading } from "@/components/common/SectionHeading"
import { Card, CardContent } from "@/components/ui/card"
import { ShieldCheck, Users, Flag, BookOpen, Target, Globe2, type LucideIcon } from "lucide-react"

interface OrgProfileProps {
  data: {
    heading: { overline: string; title: string; subtitle: string }
    paragraphs: string[]
  }
}

/** Build a short label from the paragraph itself */
function firstWords(s: string, n: number) {
  const words = s.trim().split(/\s+/).filter(Boolean)
  const head = words.slice(0, n).join(" ")
  return head + (words.length > n ? "..." : "")
}

/** Optional icons to add visual rhythm. Cycles over the list as needed. */
const ICONS: LucideIcon[] = [ShieldCheck, Users, Flag, BookOpen, Target, Globe2]

/**
 * OrganizationProfile
 * Renders only the organization profile information as cards.
 * One card per paragraph, animated in, with a compact label derived from the paragraph text.
 */
export function OrganizationProfile({ data }: OrgProfileProps) {
  const { heading, paragraphs } = data

  return (
    <SectionShell className="bg-dam-light-card">
      <div className="space-y-12 md:space-y-16">
        <SectionHeading
          overline={heading.overline}
          title={heading.title}
          subtitle={heading.subtitle}
          centered
        />

        <div className="grid gap-8 md:gap-10 md:grid-cols-2 lg:grid-cols-3">
          {paragraphs.map((text, idx) => {
            const Icon = ICONS[idx % ICONS.length]
            const label = firstWords(text, 6)

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: "easeOut", delay: idx * 0.05 }}
                viewport={{ once: true, margin: "-10% 0% -10% 0%" }}
              >
                <Card className="bg-white border border-dam-gold/10 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6 md:p-8">
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 p-3 rounded-full bg-dam-gold/10">
                        <Icon className="h-6 w-6 text-dam-gold" />
                      </div>

                      <div className="w-full">
                        <div className="text-sm font-medium tracking-wide text-neutral-700">
                          {label}
                        </div>

                        {/* Animated underline */}
                        <motion.div
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                          className="mt-2 h-[2px] bg-gradient-to-r from-dam-gold/70 to-transparent rounded-full origin-left"
                        />

                        <p className="mt-4 text-neutral-800 text-base md:text-lg leading-relaxed">
                          {text}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </SectionShell>
  )
}
