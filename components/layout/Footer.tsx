import Link from "next/link"
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react"
import { brandContent } from "@/data/home"

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/leadership", label: "Leadership" },
  { href: "/fixtures", label: "Fixtures" },
  { href: "/standings", label: "Standings" },
  { href: "/announcements", label: "Blog" },
  { href: "/contact", label: "Contact" },
]

const socialLinks = [
  { href: "#", icon: Facebook, label: "Facebook" },
  { href: "#", icon: Twitter, label: "Twitter" },
  { href: "#", icon: Instagram, label: "Instagram" },
  { href: "#", icon: Youtube, label: "YouTube" },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative bg-white">
      {/* Subtle dartboard background effect */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at center, #000 2px, transparent 2px),
                           radial-gradient(circle at center, transparent 20%, #000 21%, #000 22%, transparent 23%),
                           radial-gradient(circle at center, transparent 40%, #000 41%, #000 42%, transparent 43%),
                           radial-gradient(circle at center, transparent 60%, #000 61%, #000 62%, transparent 63%),
                           radial-gradient(circle at center, transparent 80%, #000 81%, #000 82%, transparent 83%)`,
          backgroundSize: "200px 200px",
          backgroundPosition: "center",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Column 1: Federation Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <img
                  src="/favicon.svg"
                  alt="DAM Logo"
                  className="h-12 w-12 object-contain"
                />
                <div>
                  <div className="dam-heading text-xl font-heading text-dam-black">DAM</div>
                  <div className="text-sm text-dam-black/70">Darts Association of Malawi</div>
                </div>
              </div>

              <p className="text-dam-black/80 leading-relaxed">{brandContent.mission}</p>

              <div className="rounded-lg bg-dam-green/10 border border-dam-green/20 p-4">
                <p className="dam-heading text-lg font-heading text-dam-green text-center">
                  "{brandContent.motto}"
                </p>
              </div>
            </div>

            {/* Column 2: Quick Links (match navbar) */}
            <div className="space-y-6">
              <h3 className="dam-heading text-lg font-heading text-dam-black">Quick Links</h3>
              <div className="grid gap-3">
                {quickLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-dam-black/80 hover:text-dam-green transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Column 3: Contact & Social */}
            <div className="space-y-6">
              <h3 className="dam-heading text-lg font-heading text-dam-black">Get in Touch</h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-dam-green shrink-0" />
                  <span className="text-sm text-dam-black/80">admin@dartsmalawi.org</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar (partners removed) */}
        <div className="border-t border-dam-black/10 bg-dam-black/5">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center md:justify-between">
              <div className="text-xs text-dam-black/60">
                <p>© {year} Darts Association of Malawi. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
