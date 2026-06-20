'use client'

import { motion } from 'motion/react'
import type { ReactNode } from 'react'

export function StepWrapper({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-1 flex-col px-5 pb-32"
    >
      <h1 className="mt-3 font-display text-2xl font-extrabold leading-tight text-balance text-foreground">
        {title}
      </h1>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground text-pretty">
        {subtitle}
      </p>
      <div className="mt-6 flex-1">{children}</div>
    </motion.div>
  )
}

export function WizardFooter({ children }: { children: ReactNode }) {
  return (
    <div className="sticky bottom-0 border-t border-border bg-background/90 px-5 py-4 backdrop-blur-md">
      <div className="flex gap-3">{children}</div>
    </div>
  )
}
