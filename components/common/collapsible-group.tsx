'use client'

import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import { Amount } from '@/components/common/amount'
import { cn } from '@/lib/utils'

/**
 * Group 8 · Simplicity — "collapse institution groups in Search Results by
 * default; totals first, tap to expand." Five records across five institutions
 * is a wall of text otherwise, which is exactly the eGUMIS complaint.
 */
export function CollapsibleGroup({
  title,
  countLabel,
  total,
  children,
  defaultOpen = false,
  className,
}: {
  title: string
  /** Pre-translated, e.g. "2 records". */
  countLabel: string
  total: number
  children: ReactNode
  defaultOpen?: boolean
  className?: string
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-border bg-card',
        className,
      )}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        data-tap
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-pine-soft/30"
      >
        <span className="min-w-0 flex-1">
          <span className="block truncate font-display font-bold">{title}</span>
          <span className="block text-xs font-medium text-muted-foreground">
            {countLabel}
          </span>
        </span>
        <Amount value={total} size="sm" tone="pine" />
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="shrink-0 text-muted-foreground"
        >
          <ChevronDown className="size-5" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-border p-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
