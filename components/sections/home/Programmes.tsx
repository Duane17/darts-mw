"use client"

import { motion } from "framer-motion"
import { ImageCard } from "@/components/common/ImageCard"
import { SectionShell } from "@/components/common/SectionShell"
import { SectionHeading } from "@/components/common/SectionHeading"

interface ProgrammesProps {
  data: {
    heading: {
      overline: string
      title: string
      subtitle: string
    }
    programmes: Array<{
      id: string
      title: string
      description: string
      cta: string
      bgImage: string
    }>
  }
}

export function Programmes({ data }: ProgrammesProps) {
  return (
    <SectionShell className="bg-dam-light-card">
      <div className="space-y-12">
        <SectionHeading
          overline={data.heading.overline}
          title={data.heading.title}
          subtitle={data.heading.subtitle}
          centered
        />

        <div className="grid lg:grid-cols-3 gap-8">
          {data.programmes.map((programme, index) => (
            <motion.div
              key={programme.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="group"
            >
              <ImageCard
                bgImage={programme.bgImage}
                title={programme.title}
                subtitle={programme.description}
                overlay="dark"
                height="xl"
                className="dam-gold-underline hover:border-dam-gold hover:border-2"
                expandable
                expandBehavior="click"     
                clampLines={3} 
                showGlass={false}             
              />
            </motion.div>
          ))}
        </div>
      </div>
    </SectionShell>
  )
}
