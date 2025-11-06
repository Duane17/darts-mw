"use client"

import { motion } from "framer-motion"
import { Calendar, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ImageCard } from "@/components/common/ImageCard"
import { Carousel } from "@/components/common/Carousel"
import { SectionShell } from "@/components/common/SectionShell"
import { SectionHeading } from "@/components/common/SectionHeading"

interface UpcomingEventsProps {
  data: {
    heading: {
      overline: string
      title: string
      subtitle: string
    }
    bgImage: string
    events: Array<{
      id: string
      title: string
      date: string
      location: string
      type: string
      bgImage: string
    }>
  }
}

export function UpcomingEvents({ data }: UpcomingEventsProps) {
  return (
    <SectionShell bgImage={data.bgImage} overlay="dark">
      <div className="space-y-12">
        <SectionHeading
          overline={data.heading.overline}
          title={data.heading.title}
          subtitle={data.heading.subtitle}
          centered
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Carousel itemClassName="w-80 md:w-96">
            {data.events.map((event) => (
              <ImageCard key={event.id} bgImage={event.bgImage} title={event.title} overlay="dark" height="lg">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-dam-white/80">
                    <Calendar className="h-4 w-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-dam-white/80">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="bg-black/80 text-white border-dam-gold/50 backdrop-blur-sm">
                      {event.type}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-dam-white text-dam-white hover:bg-dam-white hover:text-dam-black bg-transparent"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </ImageCard>
            ))}
          </Carousel>
        </motion.div>
      </div>
    </SectionShell>
  )
}
