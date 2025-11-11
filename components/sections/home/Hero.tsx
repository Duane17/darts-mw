"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
      className="min-h-screen flex items-center bg-black/80"
    >
      <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8 relative z-30"
        >
          <div className="space-y-6 bg-black/30 backdrop-blur-sm rounded-2xl p-8">
            <Badge
              variant="outline"
              className="border-dam-gold bg-black/70 text-white font-medium tracking-wide backdrop-blur-sm"
            >
              {data.overline}
            </Badge>
            <h1 className="dam-heading dam-heading-xl font-heading text-white text-balance drop-shadow-lg">
              {data.title}
            </h1>
            <p className="text-xl leading-relaxed text-white max-w-2xl drop-shadow-md">
              {data.subtitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
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
          </div>
        </motion.div>
      </div>
    </SectionShell>
  );
}
