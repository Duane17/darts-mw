// components/sections/leadership/LeadershipGrid.tsx
"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { SectionShell } from "@/components/common/SectionShell"
import { SectionHeading } from "@/components/common/SectionHeading"
import { ProfileCard } from "@/components/common/ProfileCard"

export interface Leader {
  id: string
  name: string
  title: string
  profile: string
  photo: string
}

interface LeadershipData {
  heading: {
    overline: string
    title: string
    subtitle: string
  }
  people: (Leader & { slug?: string })[]
}

interface LeadershipGridProps {
  data: LeadershipData
}

export function LeadershipGrid({ data }: LeadershipGridProps) {
  return (
    <SectionShell className="py-20 bg-dam-light-card">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        <SectionHeading
          overline={data.heading.overline}
          title={data.heading.title}
          subtitle={data.heading.subtitle}
          centered
          className="mb-4"
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.people.map((person, index) => {
            const href = `/leadership/${person.slug || person.id}`
            return (
              <motion.div
                key={person.slug || person.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                viewport={{ once: true, margin: "0px 0px -80px 0px" }}
              >
                <Link href={href} className="block group focus:outline-none">
                  <ProfileCard
                    photo={person.photo}
                    name={person.name}
                    title={person.title}
                    profile={person.profile}
                    accent="gold"
                    parallax
                    glass
                    profileMode="overlay"
                  />
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </SectionShell>
  )
}
