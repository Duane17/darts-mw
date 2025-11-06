"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SectionShell } from "@/components/common/SectionShell"
import Link from "next/link"

interface HeroProps {
  data: {
    overline: string
    title: string
    subtitle: string
    primaryCta: string
    secondaryCta: string
    stats: Array<{
      label: string
      value: string
    }>
  }
}

export function Hero({ data }: HeroProps) {
  return (
    <SectionShell
      bgImage="/hero.jpg"
      overlay="dark"
      diagonals
      className="min-h-screen flex items-center bg-black/80" // slightly softer than bg-gray-900
    >
      <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8 relative z-30"
        >
          <div className="space-y-6 bg-black/30 backdrop-blur-sm rounded-2xl p-8">
            <Badge
              variant="outline"
              className="border-dam-gold bg-black/70 text-white font-medium tracking-wide backdrop-blur-sm"
            >
              {data.overline}
            </Badge>
            <h1 className="dam-heading dam-heading-xl font-heading text-white text-balance drop-shadow-lg">
              {data.title}
            </h1>
            <p className="text-xl leading-relaxed text-white max-w-2xl drop-shadow-md">{data.subtitle}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/about" passHref>
              <Button size="lg" className="bg-dam-green hover:bg-dam-green/90 text-white font-medium">
                {data.primaryCta}
              </Button>
            </Link>
            <Link href="/contact" passHref>
              <Button
                size="lg"
                variant="outline"
                className="border-dam-red text-dam-red hover:bg-dam-red hover:text-white bg-transparent"
              >
                {data.secondaryCta}
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:justify-self-end relative z-30"
        >
          <div className="grid grid-cols-2 gap-4 max-w-sm">
            {data.stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className="bg-black/70 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20"
              >
                <div className="dam-heading dam-heading-md font-heading text-dam-gold">{stat.value}</div>
                <div className="text-sm text-white mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div> */}
      </div>
    </SectionShell>
  )
}
