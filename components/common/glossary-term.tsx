'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Info } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Tap-to-reveal definition for legal/financial jargon (Power of Attorney,
 * Letters of Administration, ...). Usability testing found users stalling
 * on "Power of Attorney" specifically — this keeps the explanation on the
 * same screen instead of sending someone off to search for it.
 */
export function GlossaryTerm({
  definition,
  children,
  className,
}: {
  definition: string
  children: ReactNode
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!open) return
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  return (
    <span className="relative inline-block" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        data-tap
        className={cn(
          'inline-flex items-baseline gap-1 border-b-2 border-dotted border-current/40',
          className,
        )}
      >
        <span>{children}</span>
        <Info className="size-3.5 shrink-0 translate-y-0.5 text-pine" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            role="tooltip"
            className="absolute left-0 top-full z-50 mt-2 w-64 max-w-[80vw] rounded-2xl border border-border bg-popover p-3 text-sm font-normal leading-relaxed text-popover-foreground shadow-xl"
          >
            {definition}
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  )
}
