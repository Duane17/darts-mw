import type { Metadata } from "next"
import { ContactHero } from "@/components/sections/contact/ContactHero"
import { EmailList } from "@/components/sections/contact/EmailList"
import { contactHero, emails } from "@/data/contact"

export const metadata: Metadata = {
  title: "Contact Us | Darts Association of Malawi",
  description:
    "Get in touch with the DAM team. Contact our President, Admin, and Technical staff for inquiries and support.",
  keywords: ["contact", "darts malawi", "dam team", "president", "admin", "technical"],
  openGraph: {
    title: "Contact Us | Darts Association of Malawi",
    description: "Get in touch with the DAM team for inquiries and support.",
    type: "website",
  },
}

export default function ContactPage() {
  return (
    <main>
      <ContactHero {...contactHero} />

      <div id="main-content">
        <EmailList emails={emails} />
      </div>
    </main>
  )
}
