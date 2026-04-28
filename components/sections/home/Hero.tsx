// src/components/sections/home/Hero.tsx
"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SectionShell } from "@/components/common/SectionShell";
import Link from "next/link";
import { mediaUrl } from "@/lib/media";

interface HeroStats {
  label: string;
  value: string;
}

interface HeroProps {
  data: {
    overline: string;
    title: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    stats: HeroStats[];
    /** Can be either a static file or a backend path like /uploads/home/hero-1234567890.webp */
    bgImage?: string;
  };
}

/**
 * Decides the best background image to use and normalizes it via mediaUrl.
 * mediaUrl should handle both static assets and /uploads paths.
 */
function resolveBgImage(raw?: string) {
  const fallback = "/images/hero.jpg";
  const pick = raw && raw.trim().length > 0 ? raw : fallback;
  return mediaUrl(pick);
}

export function Hero({ data }: HeroProps) {
  const bg = resolveBgImage(data.bgImage);

  return (
    <SectionShell
      bgImage={bg}
      overlay="dark"
      diagonals
      className="min-h-screen flex items-center justify-center"
    >
      {/* Centered content */}
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
            className="font-heading text-5xl md:text-7xl font-bold leading-tight text-balance"
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
            {data.subtitle}
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-6"
          >
            <Link href="/about" passHref>
              <Button size="lg" className="bg-dam-green hover:bg-dam-green/90 text-white font-medium">
                {data.primaryCta}
              </Button>
            </Link>
            <Link href="/contact" passHref>
              <Button
                size="lg"
                variant="outline"
                className="border-dam-red text-dam-red hover:bg-dam-red hover:text-white bg-transparent"
              >
                {data.secondaryCta}
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </SectionShell>
  );
}