"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionShell } from "@/components/common/SectionShell";
import { mediaUrl } from "@/lib/public-api/media";

interface ProgrammeItem {
  id: string;
  title: string;
  description: string;
  cta: string;
  bgImage: string;
}

interface ProgrammesProps {
  data: {
    heading: {
      overline: string;
      title: string;
      subtitle: string;
    };
    programmes: ProgrammeItem[];
  };
}

export function Programmes({ data }: ProgrammesProps) {
  return (
    <SectionShell className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Editorial Header */}
        <header className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8 border-l-4 border-black pl-8">
          <div className="max-w-2xl">
            <span className="text-dam-red font-black uppercase tracking-[0.3em] text-xs mb-4 block">
              {data.heading.overline}
            </span>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-black uppercase font-oswald leading-none">
              {data.heading.title}
            </h2>
            <p className="mt-6 text-xl text-gray-500 font-serif italic max-w-lg">
              {data.heading.subtitle}
            </p>
          </div>
          <div className="hidden lg:block text-right">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-300 transform -rotate-90 origin-right inline-block">
              Scroll To Explore
            </span>
          </div>
        </header>

        {/* The Editorial Spread List */}
        <div className="space-y-32 md:space-y-48">
          {data.programmes.map((programme, index) => (
            <motion.div
              key={programme.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true, margin: "-100px" }}
              className={`flex flex-col ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } items-center gap-12 lg:gap-24`}
            >
              
              {/* IMAGE SECTION - High Impact */}
              <div className="relative w-full md:w-3/5 group">
                {/* Background Numbering (Editorial Style) */}
                <span className={`absolute -top-12 ${index % 2 === 0 ? "-left-4" : "-right-4"} text-9xl font-black text-gray-50 opacity-10 select-none font-oswald pointer-events-none z-0`}>
                  0{index + 1}
                </span>

                <div className="relative z-10 overflow-hidden bg-gray-100 aspect-[4/5] md:aspect-[16/10]">
                  <img
                    src={mediaUrl(programme.bgImage)}
                    alt={programme.title}
                    className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                  />
                  {/* Decorative corner accent */}
                  <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-dam-gold m-6" />
                </div>
              </div>

              {/* CONTENT SECTION - Curated Typography */}
              <div className="w-full md:w-2/5 space-y-6">
                <div className="space-y-2">
                  <div className="h-px w-12 bg-dam-red" />
                  <h3 className="text-4xl md:text-5xl font-bold font-oswald text-black uppercase leading-tight">
                    {programme.title}
                  </h3>
                </div>

                <p className="text-lg text-gray-600 leading-relaxed font-serif">
                  {programme.description}
                </p>

                {/* <Link 
                  href={`/programmes/${programme.id}`}
                  className="inline-flex items-center gap-4 group/link"
                >
                  <span className="w-12 h-12 rounded-full border border-black flex items-center justify-center group-hover/link:bg-black group-hover/link:text-white transition-all duration-300">
                    <ArrowUpRight className="w-5 h-5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                  </span>
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-black">
                    {programme.cta || "Discover More"}
                  </span>
                </Link> */}
              </div>

            </motion.div>
          ))}
        </div>
      </div>

      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gray-50/50 -z-10 pointer-events-none" />
    </SectionShell>
  );
}