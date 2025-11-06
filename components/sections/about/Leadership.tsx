"use client"

import { motion } from "framer-motion"
import { SectionShell } from "@/components/common/SectionShell"
import { SectionHeading } from "@/components/common/SectionHeading"
import { ImageCard } from "@/components/common/ImageCard"
import { leadership } from "@/data/about"

export function Leadership() {
  // Group leadership by badge type
  const executives = leadership.filter((leader) => leader.badge === "Executive")
  const technical = leadership.filter((leader) => leader.badge === "Technical")
  const players = leadership.filter((leader) => leader.badge === "Player")

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "Executive":
        return "bg-dam-red/90 border-dam-red text-white backdrop-blur-sm"
      case "Technical":
        return "bg-dam-green/90 border-dam-green text-white backdrop-blur-sm"
      case "Player":
        return "bg-dam-gold/90 border-dam-gold text-black backdrop-blur-sm"
      default:
        return "bg-black/80 border-white/40 text-white backdrop-blur-sm"
    }
  }

  const LeadershipCard = ({ leader, index }: { leader: (typeof leadership)[0]; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <ImageCard bgImage={leader.bgImage} className="h-80 group cursor-pointer" overlay="dark">
        <div className="p-6 h-full flex flex-col justify-end relative">
          {/* Badge */}
          {leader.badge && (
            <div
              className={`absolute top-4 left-4 px-3 py-1 backdrop-blur-sm border rounded-full text-xs font-medium ${getBadgeColor(leader.badge)}`}
            >
              {leader.badge}
            </div>
          )}

          <div className="transform transition-transform duration-300 group-hover:-translate-y-2">
            <h3 className="font-oswald text-xl font-bold text-white mb-2 group-hover:text-dam-gold transition-colors duration-300">
              {leader.name}
            </h3>
            <p className="text-gray-300 font-medium mb-3">{leader.role}</p>

            {/* Hover accent line */}
            <div className="w-0 h-1 bg-dam-gold transition-all duration-300 group-hover:w-16" />
          </div>
        </div>
      </ImageCard>
    </motion.div>
  )

  return (
    <SectionShell
      id="leadership"
      bgImage="/images/ABOUT_leadership.jpg" // STOCK: leadership team, professional group photo
      overlay="dark"
      className="py-20"
    >
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          badge="Our Team"
          title="Leadership Team"
          subtitle="Experienced leaders dedicated to advancing darts excellence and fostering inclusive growth across Malawi"
          className="text-center mb-16"
        />

        {/* Executive Leadership */}
        <div className="mb-16">
          <motion.h3
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="font-oswald text-2xl font-bold text-white mb-8 flex items-center gap-3"
          >
            <div className="w-1 h-8 bg-dam-red rounded-full" />
            Executive Committee
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {executives.map((leader, index) => (
              <LeadershipCard key={leader.name} leader={leader} index={index} />
            ))}
          </div>
        </div>

        {/* Technical Leadership */}
        <div className="mb-16">
          <motion.h3
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="font-oswald text-2xl font-bold text-white mb-8 flex items-center gap-3"
          >
            <div className="w-1 h-8 bg-dam-green rounded-full" />
            Technical Team
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {technical.map((leader, index) => (
              <LeadershipCard key={leader.name} leader={leader} index={index} />
            ))}
          </div>
        </div>

        {/* Player Leadership */}
        <div className="mb-16">
          <motion.h3
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="font-oswald text-2xl font-bold text-white mb-8 flex items-center gap-3"
          >
            <div className="w-1 h-8 bg-dam-gold rounded-full" />
            Team Captains
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {players.map((leader, index) => (
              <LeadershipCard key={leader.name} leader={leader} index={index} />
            ))}
          </div>
        </div>

        {/* Leadership Philosophy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-dam-gold/10 via-dam-gold/5 to-dam-gold/10 border border-dam-gold/20 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="font-oswald text-2xl font-bold text-white mb-4">Collaborative Leadership</h3>
            <p className="text-gray-200 leading-relaxed text-pretty">
              Our leadership team brings together diverse expertise in sports administration, technical development, and
              competitive excellence. United by a shared vision for darts in Malawi, we work collaboratively to ensure
              every decision serves the growth and success of our sport and community.
            </p>
          </div>
        </motion.div>
      </div>
    </SectionShell>
  )
}
