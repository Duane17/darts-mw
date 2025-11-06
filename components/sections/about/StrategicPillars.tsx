"use client"

import { motion } from "framer-motion"
import { SectionShell } from "@/components/common/SectionShell"
import { SectionHeading } from "@/components/common/SectionHeading"
import { ImageCard } from "@/components/common/ImageCard"
import { pillars } from "@/data/about"

export function StrategicPillars() {
  return (
    <SectionShell
      bgImage="/images/ABOUT_pillars.jpg" // STOCK: strategic planning, development activities
      overlay="dark"
      className="py-20"
    >
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          badge="Our Strategy"
          title="Strategic Pillars"
          subtitle="Eight foundational areas driving our comprehensive approach to darts development in Malawi"
          className="text-center mb-16"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ImageCard bgImage={pillar.bgImage} className="h-80 group cursor-pointer" overlay="dark">
                <div className="p-6 h-full flex flex-col justify-end relative">
                  {/* Pillar number indicator */}
                  <div className="absolute top-4 right-4 w-8 h-8 bg-dam-gold/20 backdrop-blur-sm border border-dam-gold/40 rounded-full flex items-center justify-center">
                    <span className="text-dam-gold text-sm font-bold">{index + 1}</span>
                  </div>

                  <div className="transform transition-transform duration-300 group-hover:-translate-y-2">
                    <h3 className="font-oswald text-xl font-bold text-white mb-3 group-hover:text-dam-gold transition-colors duration-300 leading-tight">
                      {pillar.title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed text-pretty">{pillar.desc}</p>

                    {/* Hover underline */}
                    <div className="w-0 h-0.5 bg-dam-gold mt-3 transition-all duration-300 group-hover:w-full" />
                  </div>
                </div>
              </ImageCard>
            </motion.div>
          ))}
        </div>

        {/* Strategic Focus Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="font-oswald text-2xl font-bold text-white mb-4">Integrated Development Approach</h3>
            <p className="text-gray-200 leading-relaxed text-pretty">
              Our strategic pillars work in harmony to create a comprehensive ecosystem for darts development. From
              grassroots programs that discover talent to elite performance pathways that produce champions, each pillar
              reinforces the others to build a sustainable and thriving darts community across Malawi.
            </p>
          </div>
        </motion.div>
      </div>
    </SectionShell>
  )
}
