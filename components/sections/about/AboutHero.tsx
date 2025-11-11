// src/components/sections/about/AboutHero.tsx
"use client";

import { motion } from "framer-motion";
import { DiagonalAccent } from "@/components/common/DiagonalAccent";
import { mediaUrl } from "@/lib/media";

interface AboutHeroProps {
  data: {
    overline: string;
    title: string;
    sub: string;
    bgImage?: string;
  };
}

export function AboutHero({ data }: AboutHeroProps) {
  const bg = mediaUrl(data.bgImage || "/images/ABOUT_hero.jpg");

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bg})` }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Diagonal Accents */}
      <DiagonalAccent className="absolute top-20 left-10 opacity-80" />
      <DiagonalAccent className="absolute bottom-32 right-16 opacity-60 rotate-180" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          {/* Overline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-dam-gold font-medium tracking-wider uppercase text-sm"
          >
            {data.overline}
          </motion.p>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="font-oswald text-5xl md:text-7xl font-bold leading-tight text-balance"
          >
            {data.title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-xl md:text-2xl leading-relaxed text-gray-200 max-w-3xl mx-auto text-pretty"
          >
            {data.sub}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
