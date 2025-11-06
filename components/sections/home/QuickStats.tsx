"use client"

import { motion } from "framer-motion"
import { ImageCard } from "@/components/common/ImageCard"
import { SectionShell } from "@/components/common/SectionShell"
import { SectionHeading } from "@/components/common/SectionHeading"

interface QuickStatsProps {
  data: {
    heading: {
      overline: string
      title: string
      subtitle: string
    }
    stats: Array<{
      id: string
      label: string
      value: string
      bgImage: string
    }>
  }
}

export function QuickStats({ data }: QuickStatsProps) {
  return (
    <SectionShell className="bg-dam-light-card">
      <div className="space-y-12">
        <SectionHeading
          overline={data.heading.overline}
          title={data.heading.title}
          subtitle={data.heading.subtitle}
          centered
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ImageCard
                bgImage={stat.bgImage}
                title={stat.value}
                subtitle={stat.label}
                overlay="dark"
                height="md"
                className="hover:border-dam-green hover:border-2"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </SectionShell>
  )
}
