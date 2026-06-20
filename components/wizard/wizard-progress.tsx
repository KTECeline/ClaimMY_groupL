'use client'

import { motion } from 'motion/react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export function WizardProgress({
  step,
  total,
}: {
  step: number
  total: number
}) {
  return (
    <div className="flex items-center gap-2 px-5 pb-2 pt-1">
      {Array.from({ length: total }).map((_, i) => {
        const n = i + 1
        const complete = n < step
        const active = n === step
        return (
          <div key={n} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                'flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors',
                complete && 'bg-pine text-pine-foreground',
                active && 'bg-gold text-gold-foreground',
                !complete && !active && 'bg-secondary text-muted-foreground',
              )}
            >
              {complete ? <Check className="size-4" strokeWidth={3} /> : n}
            </span>
            {n < total && (
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-secondary">
                <motion.div
                  className="h-full rounded-full bg-pine"
                  initial={false}
                  animate={{ width: complete ? '100%' : '0%' }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
