"use client"

import { motion } from "framer-motion"
import { SectionShell } from "@/components/common/SectionShell"
import { SectionHeading } from "@/components/common/SectionHeading"
import { Carousel } from "@/components/common/Carousel"
import { ImageCard } from "@/components/common/ImageCard"
import { milestones } from "@/data/about"

export function Milestones() {
  return (
    <SectionShell
      bgImage="/images/ABOUT_milestones.jpg" // STOCK: historical moments, achievement timeline
      overlay="dark"
      className="py-20"
    >
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          badge="Our Journey"
          title="Key Milestones"
          subtitle="Celebrating the pivotal moments that have shaped the growth and success of darts in Malawi"
          className="text-center mb-16"
        />

        {/* Timeline Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Carousel className="pb-8">
            {milestones.map((milestone, index) => (
              <div key={milestone.year} className="flex-none w-80 mr-6">
                <ImageCard bgImage={milestone.bgImage} className="h-96 group cursor-pointer" overlay="dark">
                  <div className="p-6 h-full flex flex-col justify-between relative">
                    {/* Year Badge */}
                    <div className="self-start">
                      <div className="bg-black/80 backdrop-blur-sm border border-dam-gold rounded-full px-4 py-2">
                        <span className="text-white font-bold text-lg">{milestone.year}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="transform transition-transform duration-300 group-hover:-translate-y-2">
                      <h3 className="font-oswald text-xl font-bold text-white mb-3 group-hover:text-white transition-colors duration-300 leading-tight">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-300 text-sm leading-relaxed text-pretty">{milestone.desc}</p>

                      {/* Timeline connector */}
                      <div className="w-0 h-1 bg-dam-gold mt-4 transition-all duration-300 group-hover:w-20" />
                    </div>

                    {/* Milestone number */}
                    <div className="absolute top-4 right-4 w-8 h-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{index + 1}</span>
                    </div>
                  </div>
                </ImageCard>
              </div>
            ))}
          </Carousel>
        </motion.div>

        {/* Timeline Progress Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 max-w-2xl mx-auto">
            <h3 className="font-oswald text-xl font-bold text-white mb-3">Continuing Our Legacy</h3>
            <p className="text-gray-200 text-sm leading-relaxed text-pretty">
              Each milestone represents not just an achievement, but a stepping stone toward our vision of making Malawi
              a recognized force in African and international darts. Our journey continues with ambitious goals for the
              years ahead.
            </p>
          </div>
        </motion.div>
      </div>
    </SectionShell>
  )
}
