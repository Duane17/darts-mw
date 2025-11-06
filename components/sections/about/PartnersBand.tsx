"use client"

import { motion } from "framer-motion"
import { DiagonalAccent } from "@/components/common/DiagonalAccent"
import { partners } from "@/data/about"

export function PartnersBand() {
  return (
    <section className="relative py-16 bg-gray-50 overflow-hidden">
      {/* Diagonal brush background */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-white to-gray-100" />
      <DiagonalAccent className="absolute top-8 left-12 opacity-20" color="green" />
      <DiagonalAccent className="absolute bottom-12 right-16 opacity-15 rotate-180" color="red" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-dam-green font-medium tracking-wider uppercase text-sm mb-2">Our Partners</p>
          <h2 className="font-oswald text-3xl md:text-4xl font-bold text-gray-900 mb-4">Building Success Together</h2>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed text-pretty">
            Collaborating with leading organizations to advance darts development and create opportunities for all
            Malawians
          </p>
        </motion.div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <a
                href={partner.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 h-24 border border-gray-200 hover:border-dam-green/30"
              >
                <div className="h-full flex items-center justify-center relative">
                  {/* Placeholder for partner logo */}
                  <div
                    className="w-full h-full bg-cover bg-center bg-no-repeat rounded-lg opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      backgroundImage: `url(/images/partners/${partner.name.toLowerCase().replace(/\s+/g, "-")}-logo.png)`,
                    }}
                    aria-label={partner.logoAlt}
                  />

                  {/* Fallback text for demo */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg group-hover:bg-gray-50 transition-colors duration-300">
                    <span className="text-xs font-medium text-gray-500 text-center px-2 leading-tight">
                      {partner.name}
                    </span>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-dam-green/0 group-hover:bg-dam-green/5 rounded-lg transition-all duration-300" />
                </div>
              </a>
            </motion.div>
          ))}
        </div>

        {/* Partnership Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 max-w-3xl mx-auto">
            <p className="text-gray-700 leading-relaxed text-pretty">
              Through strategic partnerships with local and international organizations, we leverage collective
              expertise and resources to accelerate the growth of darts in Malawi and create sustainable pathways for
              excellence.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
