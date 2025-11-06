"use client"

import { motion } from "framer-motion"
import { SectionShell } from "@/components/common/SectionShell"
import { SectionHeading } from "@/components/common/SectionHeading"
import { ImageCard } from "@/components/common/ImageCard"
import { Mail, Copy } from "lucide-react"
import { useState } from "react"

interface Email {
  role: string
  email: string
  bgImage: string
}

interface EmailListProps {
  emails: Email[]
}

export function EmailList({ emails }: EmailListProps) {
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null)

  const handleEmailClick = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email)
      setCopiedEmail(email)
      setTimeout(() => setCopiedEmail(null), 2000)
    } catch (err) {
      // Fallback to mailto if clipboard fails
      window.location.href = `mailto:${email}`
    }
  }

  return (
    <SectionShell className="py-20">
      <div className="container mx-auto px-4">
        <SectionHeading
          badge="Contact"
          title="Get in Touch"
          subtitle="Reach out to our team members directly"
          className="mb-16"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {emails.map((contact, index) => (
            <motion.div
              key={contact.role}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ImageCard
                bgImage={contact.bgImage}
                overlay="dark"
                className="h-80 cursor-pointer group transition-transform hover:scale-105"
                onClick={() => handleEmailClick(contact.email)}
                showGlass={false}      
              >
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-full p-4 mb-4 group-hover:bg-dam-gold/20 transition-colors">
                    <Mail className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2">{contact.role}</h3>

                  <div className="flex items-center gap-2 text-white/90 group-hover:text-white transition-colors">
                    <span className="text-sm md:text-base">{contact.email}</span>
                    <Copy className="w-4 h-4" />
                  </div>

                  {copiedEmail === contact.email && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-2 bg-dam-green text-white text-sm px-3 py-1 rounded-full"
                    >
                      Copied!
                    </motion.div>
                  )}
                </div>
              </ImageCard>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionShell>
  )
}
