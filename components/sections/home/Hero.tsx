// src/components/sections/home/Hero.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    heroBgs: string[];
  };
}

export function Hero({ data }: HeroProps) {
  const [index, setIndex] = useState(0);

  const images = data.heroBgs.length > 0 
    ? data.heroBgs.map(img => mediaUrl(img))
    : [mediaUrl("/images/hero.jpg")];

  useEffect(() => {
    if (images.length <= 1) return;
    
    // Increased to 7 seconds to give the cinematic zoom more "breathing room"
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 7000); 

    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Background Slideshow Layer */}
      <AnimatePresence initial={false}>
        <motion.div
          key={images[index]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: "easeInOut" }} // Slower cross-fade
          className="absolute inset-0 z-0"
        >
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: 1.1 }} // Subtle Ken Burns zoom
            transition={{ duration: 8, ease: "linear" }}
            className="h-full w-full"
          >
            <SectionShell
              bgImage={images[index]}
              overlay="dark"
              diagonals
              className="h-full w-full"
            >
              <div className="hidden" />
            </SectionShell>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Slide Markers (Pagination) */}
      {images.length > 1 && (
        <div className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 gap-3">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className="group relative h-1 w-12 overflow-hidden rounded-full bg-white/20 transition-all"
              aria-label={`Go to slide ${i + 1}`}
            >
              {index === i && (
                <motion.div
                  layoutId="activeSlide"
                  className="absolute inset-0 bg-dam-gold"
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  transition={{ duration: 7, ease: "linear" }} // Progress bar effect
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Static Content Layer */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-dam-gold font-medium tracking-wider uppercase text-sm"
            >
              {data.overline}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="font-heading text-5xl md:text-7xl font-bold leading-tight text-balance"
            >
              {data.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-xl md:text-2xl leading-relaxed text-gray-200 max-w-3xl mx-auto text-pretty"
            >
              {data.subtitle}
            </motion.p>

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
      </div>
    </div>
  );
}