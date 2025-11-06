"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { ImageCard } from "@/components/common/ImageCard"
import { SectionShell } from "@/components/common/SectionShell"
import { SectionHeading } from "@/components/common/SectionHeading"

interface NationalTeamProps {
  data: {
    heading: {
      overline: string
      title: string
      subtitle: string
    }
    players: Array<{
      id: string
      name: string
      role: string
      badge?: string
      bgImage: string
    }>
    doublesPairs: Array<{
      id: string
      pair: [string, string]
      bgImage: string
    }>
  }
}

export function NationalTeam({ data }: NationalTeamProps) {
  return (
    <SectionShell className="bg-dam-slate-dark">
      <div className="space-y-16">
        <SectionHeading
          overline={data.heading.overline}
          title={data.heading.title}
          subtitle={data.heading.subtitle}
          centered
          className="text-dam-white"
        />

        {/* Individual Players */}
        <div className="space-y-8">
          <h3 className="dam-heading dam-heading-md font-heading text-dam-white text-center">Individual Players</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.players.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <ImageCard
                  bgImage={player.bgImage}
                  title={player.name}
                  subtitle={player.role}
                  overlay="dark"
                  height="lg"
                  className="hover:border-dam-gold hover:border-2"
                >
                  {player.badge && <Badge className="bg-dam-gold text-dam-black font-medium">{player.badge}</Badge>}
                </ImageCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Doubles Pairs */}
        <div className="space-y-8">
          <h3 className="dam-heading dam-heading-md font-heading text-dam-white text-center">Doubles Pairs</h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {data.doublesPairs.map((pair, index) => (
              <motion.div
                key={pair.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <ImageCard
                  bgImage={pair.bgImage}
                  title={`${pair.pair[0]} & ${pair.pair[1]}`}
                  subtitle="Doubles Partnership"
                  overlay="green"
                  height="md"
                  className="hover:border-dam-green hover:border-2"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  )
}
