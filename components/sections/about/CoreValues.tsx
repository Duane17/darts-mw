// src/components/sections/about/CoreValues.tsx
"use client";

import { motion } from "framer-motion";
import { SectionShell } from "@/components/common/SectionShell";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ImageCard } from "@/components/common/ImageCard";
import { mediaUrl } from "@/lib/media";

interface CoreValueItem {
  title: string;
  desc: string;
  bgImage: string;
}

interface CoreValuesProps {
  data: {
    items: CoreValueItem[];
  };
}

export function CoreValues({ data }: CoreValuesProps) {
  const items = Array.isArray(data.items) ? data.items : [];

  return (
    <SectionShell overlay="dark" className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading title="Core Values" className="text-center mb-16" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((value, index) => (
            <motion.div
              key={`${value.title}-${index}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ImageCard
                bgImage={mediaUrl(value.bgImage)}
                className="h-80 group cursor-pointer"
                overlay="dark"
                title=""
                showGlass={false}
              >
                <div className="p-6 h-full flex flex-col justify-end">
                  <div className="transform transition-transform duration-300 group-hover:-translate-y-2">
                    <h3 className="font-oswald text-2xl font-bold text-white mb-3 group-hover:text-dam-gold transition-colors duration-300">
                      {value.title}
                    </h3>
                    <p className="text-gray-200 leading-relaxed text-sm text-pretty">
                      {value.desc}
                    </p>
                  </div>
                  <div className="w-0 h-1 bg-dam-gold mt-4 transition-all duration-300 group-hover:w-16" />
                </div>
              </ImageCard>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
