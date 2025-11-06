import { Hero } from "@/components/sections/home/Hero"
import { Programmes } from "@/components/sections/home/Programmes"
import { CtaBand } from "@/components/sections/home/CtaBand"
import { FacebookSection } from "@/components/sections/home/FacebookSection"
import {
  heroData,
  programmesData,
  ctaBandData,
} from "@/data/home"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-dam-white text-dam-black px-4 py-2 rounded-md font-medium"
      >
        Skip to main content
      </a>

      <div id="main-content">
        {/* Hero Section */}
        <Hero data={heroData} />

        {/* Programmes Section */}
        <Programmes data={programmesData} />

        {/* Facebook feed */}
        <FacebookSection pageUrl="https://www.facebook.com/mncs.mw" />

        {/* Call to Action Band */}
        <CtaBand data={ctaBandData} />
      </div>
    </main>
  )
}
