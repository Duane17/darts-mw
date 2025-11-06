"use client"

import { motion } from "framer-motion"
import type { PropsWithChildren } from "react"

export function FadeIn({ children, delay = 0.05 }: PropsWithChildren<{ delay?: number }>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
    >
      {children}
    </motion.div>
  )
}
