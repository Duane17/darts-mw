"use client"

import { motion } from "framer-motion"
import { SectionShell } from "@/components/common/SectionShell"
import { DiagonalAccent } from "@/components/common/DiagonalAccent"

interface PartnersStripProps {
  data: {
    title: string
    partners: Array<{
      id: string
      name: string
      logoAlt: string
      href?: string
    }>
  }
}

export function PartnersStrip({ data }: PartnersStripProps) {
  return (
    <SectionShell dense className="bg-dam-light-card relative">
      <DiagonalAccent />
      <div className="space-y-8">
        <h3 className="dam-heading dam-heading-md font-heading text-center text-dam-black">{data.title}</h3>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center items-center gap-8 md:gap-12"
        >
          {data.partners.map((partner, index) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              {partner.href ? (
                <a
                  href={partner.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block transition-transform hover:scale-105"
                  aria-label={`Visit ${partner.name} website`}
                >
                  <PartnerLogo name={partner.name} alt={partner.logoAlt} />
                </a>
              ) : (
                <PartnerLogo name={partner.name} alt={partner.logoAlt} />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </SectionShell>
  )
}

function PartnerLogo({ name, alt }: { name: string; alt: string }) {
  return (
    <div
      className="w-32 h-16 bg-gray-200 rounded-lg flex items-center justify-center border border-gray-300 group-hover:border-dam-gold transition-colors"
      role="img"
      aria-label={alt}
    >
      <span className="text-xs font-medium text-gray-600 text-center px-2">{name}</span>
    </div>
  )
}
