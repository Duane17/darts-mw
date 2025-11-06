"use client"

import { motion } from "framer-motion"
import { SectionShell } from "@/components/common/SectionShell"
import { SectionHeading } from "@/components/common/SectionHeading"
import { ImageCard } from "@/components/common/ImageCard"
import { DiagonalAccent } from "@/components/common/DiagonalAccent"
import { governance } from "@/data/about"

export function Governance() {
  return (
    <SectionShell
      bgImage="/images/ABOUT_governance.jpg" // STOCK: official meeting, professional governance
      overlay="dark"
      className="py-20 relative"
    >
      {/* Gold diagonal accents */}
      <DiagonalAccent className="absolute top-16 right-12 opacity-30" color="gold" />
      <DiagonalAccent className="absolute bottom-20 left-16 opacity-20 rotate-180" color="gold" />

      <div className="max-w-6xl mx-auto px-6">
        <SectionHeading
          badge="Leadership"
          title="Governance & Structure"
          subtitle="Transparent leadership and accountable governance ensuring the integrity and growth of darts in Malawi"
          className="text-center mb-16"
        />

        {/* Governance Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 max-w-4xl mx-auto">
            <p className="text-gray-200 text-lg leading-relaxed text-pretty">
              The Darts Association of Malawi operates under a democratic governance structure that ensures
              transparency, accountability, and inclusive decision-making. Our leadership is committed to serving the
              best interests of all stakeholders while maintaining the highest standards of integrity and
              professionalism.
            </p>
          </div>
        </motion.div>

        {/* Governance Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {governance.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
            >
              <ImageCard bgImage={item.bgImage} className="h-72 group cursor-pointer" overlay="dark">
                <div className="p-8 h-full flex flex-col justify-center relative">
                  {/* Gold accent border */}
                  <div className="absolute top-6 left-8 w-12 h-1 bg-dam-gold transform transition-all duration-300 group-hover:w-20" />

                  <div className="transform transition-transform duration-300 group-hover:-translate-y-1">
                    <h3 className="font-oswald text-2xl font-bold text-white mb-4 group-hover:text-dam-gold transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-gray-200 leading-relaxed text-pretty">{item.desc}</p>
                  </div>
                </div>
              </ImageCard>
            </motion.div>
          ))}
        </div>

        {/* Governance Commitment Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-dam-gold/10 via-dam-gold/5 to-dam-gold/10 border border-dam-gold/20 rounded-2xl p-8">
            <h3 className="font-oswald text-2xl font-bold text-white mb-4">Our Commitment to Excellence</h3>
            <p className="text-gray-200 leading-relaxed max-w-3xl mx-auto text-pretty">
              We pledge to maintain the highest standards of governance, ensuring that every decision serves the
              advancement of darts in Malawi and the welfare of our community. Through transparent processes and
              accountable leadership, we build trust and foster sustainable growth.
            </p>
          </div>
        </motion.div>
      </div>
    </SectionShell>
  )
}
