"use client"

import { motion } from "framer-motion"
import { SectionShell } from "@/components/common/SectionShell"
import { DiagonalAccent } from "@/components/common/DiagonalAccent"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface CtaBandProps {
  text: string
  bgImage: string
  ctas: Array<{
    label: string
    href: string
  }>
}

export function CtaBand({ text, bgImage, ctas }: CtaBandProps) {
  return (
    <SectionShell bgImage={bgImage} overlay="green" className="py-20 relative">
      <DiagonalAccent variant="gold" className="top-8 left-8" />
      <DiagonalAccent variant="red" className="bottom-8 right-8" />

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-8 text-balance">{text}</h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            {ctas.map((cta, index) => (
              <Button
                key={cta.href}
                asChild
                variant={index === 0 ? "default" : "outline"}
                size="lg"
                className={`
                  px-8 py-3 text-lg font-semibold transition-all duration-300
                  ${
                    index === 0
                      ? "bg-dam-gold hover:bg-dam-gold/90 text-black border-dam-gold"
                      : "border-white text-white hover:bg-white hover:text-black"
                  }
                `}
              >
                <Link href={cta.href}>{cta.label}</Link>
              </Button>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </SectionShell>
  )
}
