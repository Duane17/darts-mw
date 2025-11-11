// src/components/sections/about/MissionVision.tsx
"use client";

import { motion } from "framer-motion";
import { SectionShell } from "@/components/common/SectionShell";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ImageCard } from "@/components/common/ImageCard";
import { mediaUrl } from "@/lib/media";

interface MissionVisionProps {
  data: {
    images: {
      mission: string;
      vision: string;
    };
    mission: string;
    vision: string;
    motto: string;
  };
}

export function MissionVision({ data }: MissionVisionProps) {
  const imgMission = mediaUrl(data.images.mission || "/images/about/ABOUT_mission.jpg");
  const imgVision = mediaUrl(data.images.vision || "/images/about/ABOUT_vision.jpg");

  return (
    <SectionShell id="mission" className="py-20 bg-dam-light-card">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeading title="Mission & Vision" className="text-center mb-16" />

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <ImageCard
              bgImage={imgVision}
              title="Our Vision"
              subtitle={data.vision}
              overlay="dark"
              height="xl"
              className="h-auto"
              expandable
              expandBehavior="click"
              clampLines={3}
              showGlass={false}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <ImageCard
              bgImage={imgMission}
              title="Our Mission"
              subtitle={data.mission}
              overlay="dark"
              height="xl"
              className="h-auto"
              expandable
              expandBehavior="click"
              clampLines={3}
              showGlass={false}
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="bg-dam-gold/10 backdrop-blur-sm border border-dam-gold/20 rounded-2xl p-8 text-center">
            <div className="absolute inset-0 bg-linear-to-r from-dam-gold/5 via-dam-gold/10 to-dam-gold/5 rounded-2xl" />
            <div className="relative z-10">
              <p className="text-sm font-medium text-dam-gold mb-2 tracking-wider uppercase">Our Motto</p>
              <h2 className="font-oswald text-4xl md:text-5xl font-bold text-black">{data.motto}</h2>
            </div>
          </div>
        </motion.div>
      </div>
    </SectionShell>
  );
}
