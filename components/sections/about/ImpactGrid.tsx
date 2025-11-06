"use client"

import { motion } from "framer-motion"
import { SectionShell } from "@/components/common/SectionShell"
import { SectionHeading } from "@/components/common/SectionHeading"
import { ImageCard } from "@/components/common/ImageCard"
import { impact } from "@/data/about"

export function ImpactGrid() {
  return (
    <SectionShell
      bgImage="/images/ABOUT_impact_bg.jpg" // STOCK: community impact, diverse participation
      overlay="green"
      className="py-20"
    >
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeading
          badge="Our Impact"
          title="Making a Difference"
          subtitle="Measurable outcomes that demonstrate our commitment to developing darts across all communities in Malawi"
          className="text-center mb-16"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {impact.map((kpi, index) => (
            <motion.div
              key={kpi.metric}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ImageCard bgImage={kpi.bgImage} className="h-64 group cursor-pointer" overlay="green">
                <div className="p-6 h-full flex flex-col justify-center items-center text-center relative">
                  {/* Impact number with animation */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                    viewport={{ once: true }}
                    className="transform transition-transform duration-300 group-hover:scale-110"
                  >
                    <div className="text-5xl md:text-6xl font-oswald font-bold text-white mb-2 group-hover:text-dam-gold transition-colors duration-300">
                      {kpi.value}
                    </div>
                    <div className="text-gray-200 font-medium text-lg group-hover:text-white transition-colors duration-300">
                      {kpi.metric}
                    </div>
                  </motion.div>

                  {/* Animated border */}
                  <div className="absolute inset-4 border-2 border-transparent group-hover:border-dam-gold/30 rounded-xl transition-all duration-300" />

                  {/* Pulse effect on hover */}
                  <div className="absolute inset-0 bg-dam-gold/0 group-hover:bg-dam-gold/5 rounded-2xl transition-all duration-300" />
                </div>
              </ImageCard>
            </motion.div>
          ))}
        </div>

        {/* Impact Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-dam-green/10 via-dam-green/5 to-dam-green/10 border border-dam-green/20 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="font-oswald text-2xl font-bold text-white mb-4">Growing Together</h3>
            <p className="text-gray-200 leading-relaxed text-pretty">
              These numbers represent more than statistics—they reflect lives touched, communities engaged, and dreams
              realized through the sport of darts. Every school reached, every coach trained, and every tournament held
              contributes to building a stronger, more inclusive darts community across Malawi.
            </p>
          </div>
        </motion.div>
      </div>
    </SectionShell>
  )
}
