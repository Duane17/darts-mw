"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const navigationLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/leadership", label: "Leadership" },
  { href: "/fixtures", label: "Fixtures" },
  { href: "/standings", label: "Standings" },
  { href: "/announcements", label: "Blog" },
  { href: "/contact", label: "Contact" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // exact match for "/", prefix match for subpages (e.g., /about/team highlights "About")
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  return (
    <nav
      className="sticky top-0 z-50 w-full bg-dam-white backdrop-blur-md border-b border-dam-white/20 shadow-sm"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <Link
            href="/"
            className="flex items-center gap-3 group dam-focus-ring rounded-lg p-2 -m-2"
            aria-label="Darts Association of Malawi - Go to homepage"
          >
            <img
              src="/logo.png"
              alt="DAM Logo"
              className="h-12 w-12 object-contain"
            />
            <div className="hidden sm:block">
              <div className="dam-heading text-lg font-heading text-dam-black">DAM</div>
              <div className="text-xs text-dam-black/70 -mt-1">Darts Association of Malawi</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8" role="menubar">
            {navigationLinks.map((link) => {
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-3 py-2 text-sm font-medium transition-colors dam-focus-ring rounded-md",
                    "text-dam-black hover:text-dam-green",
                    "after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-dam-green after:transition-all after:duration-300",
                    "hover:after:w-full",
                    active && "text-dam-green after:w-full"
                  )}
                  role="menuitem"
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-dam-black hover:text-dam-green hover:bg-dam-green/10 dam-focus-ring"
                  aria-label="Open navigation menu"
                  aria-expanded={isOpen}
                  aria-controls="mobile-menu"
                >
                  <Menu className="h-6 w-6" aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-80 bg-dam-white"
                id="mobile-menu"
                aria-label="Mobile navigation menu"
              >
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-3">
                    <img
                      src="/logo.png"
                      alt="DAM Logo"
                      className="h-12 w-12 object-contain"
                    />
                    <span className="dam-heading font-heading text-dam-black">
                      DAM Navigation
                    </span>
                  </SheetTitle>
                </SheetHeader>

                <nav className="mt-8 space-y-4" role="navigation" aria-label="Mobile navigation">
                  {navigationLinks.map((link) => {
                    const active = isActive(link.href)
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "block px-4 py-3 text-lg font-medium rounded-lg transition-colors dam-focus-ring",
                          "text-dam-black hover:text-dam-green hover:bg-dam-green/10",
                          active && "text-dam-green bg-dam-green/10"
                        )}
                        aria-current={active ? "page" : undefined}
                      >
                        {link.label}
                      </Link>
                    )
                  })}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
