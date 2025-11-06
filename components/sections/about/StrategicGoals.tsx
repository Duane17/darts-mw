"use client"

import { motion } from "framer-motion"
import { SectionShell } from "@/components/common/SectionShell"
import { SectionHeading } from "@/components/common/SectionHeading"
import { Card, CardContent } from "@/components/ui/card"
import {
  Megaphone,
  Users,
  Sparkles,
  Trophy,
  Globe2,
  GraduationCap,
  ShieldCheck,
  Handshake,
  type LucideIcon,
} from "lucide-react"
import { strategicGoals } from "@/data/about"

// Map string keys from data -> Lucide icons to keep data serializable
const ICONS: Record<
  "megaphone" | "users" | "sparkles" | "trophy" | "globe" | "cap" | "shield" | "handshake",
  LucideIcon
> = {
  megaphone: Megaphone,
  users: Users,
  sparkles: Sparkles,
  trophy: Trophy,
  globe: Globe2,
  cap: GraduationCap,
  shield: ShieldCheck,
  handshake: Handshake,
}

export function StrategicGoals() {
  return (
    <SectionShell className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          badge="Our Roadmap"
          title="Strategic Goals"
          className="text-center mb-16"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {strategicGoals.map((goal, index) => {
            const Icon = ICONS[goal.iconKey]
            return (
              <motion.div
                key={goal.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <Card className="bg-white border border-dam-gold/10 shadow-sm hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-6 flex gap-4">
                    <div className="shrink-0 p-3 rounded-full bg-dam-gold/10">
                      <Icon className="h-6 w-6 text-dam-gold" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-oswald text-xl font-semibold text-neutral-900">
                        {goal.title}
                      </h3>
                      <p className="text-neutral-700 leading-relaxed text-sm">
                        {goal.desc}
                      </p>
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
