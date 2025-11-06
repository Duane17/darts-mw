"use client"

import { motion } from "framer-motion"
import { SectionShell } from "@/components/common/SectionShell"
import { DiagonalAccent } from "@/components/common/DiagonalAccent"

interface ContactHeroProps {
  overline: string
  title: string
  subtitle: string
  bgImage: string
}

export function ContactHero({ overline, title, subtitle, bgImage }: ContactHeroProps) {
  return (
    <SectionShell bgImage={bgImage} overlay="dark" className="min-h-screen flex items-center justify-center relative">
      <DiagonalAccent variant="red" className="top-20 left-10" />
      <DiagonalAccent variant="green" className="bottom-32 right-16" />

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-dam-gold font-semibold text-sm md:text-base tracking-wider uppercase mb-4"
          >
            {overline}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 text-balance"
          >
            {title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto text-pretty leading-relaxed"
          >
            {subtitle}
          </motion.p>
        </motion.div>
      </div>
    </SectionShell>
  )
}
