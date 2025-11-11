// src/components/sections/home/CtaBand.tsx
"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SectionShell } from "@/components/common/SectionShell";
import Link from "next/link";
import { mediaUrl } from "@/lib/media";

interface CtaBandProps {
  data: {
    title: string;
    primaryCta: string;
    bgImage: string; // can be a static asset or /uploads/...
  };
}

export function CtaBand({ data }: CtaBandProps) {
  const bg = mediaUrl(data.bgImage || "/images/cta/cta-bg.jpg");

  return (
    <SectionShell bgImage={bg} overlay="dark" dense>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center space-y-8"
      >
        <h2 className="dam-heading dam-heading-lg font-heading text-dam-white text-balance">
          {data.title}
        </h2>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/contact" passHref>
            <Button size="lg" className="bg-dam-red hover:bg-dam-red/90 text-dam-white font-medium">
              {data.primaryCta}
            </Button>
          </Link>
        </div>
      </motion.div>
    </SectionShell>
  );
}
