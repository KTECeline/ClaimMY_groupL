'use client'

import { motion } from 'motion/react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Horizontal labelled stepper for the "Claim on her behalf" flow (S-20).
 * Labels stay visible rather than relying on dot colour alone — Group 8's
 * accessibility note asks for "text labels behind every icon-only button".
 */
export function Stepper({
  steps,
  current,
  className,
}: {
  steps: string[]
  /** 1-indexed. */
  current: number
  className?: string
}) {
  return (
    <ol
      className={cn('flex items-start', className)}
      aria-label={`Step ${current} of ${steps.length}`}
    >
      {steps.map((label, i) => {
        const n = i + 1
        const done = n < current
        const active = n === current
        return (
          <li
            key={label}
            className="flex flex-1 flex-col items-center last:flex-none"
            aria-current={active ? 'step' : undefined}
          >
            <div className="flex w-full items-center">
              <motion.span
                initial={false}
                animate={{ scale: active ? 1.08 : 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 24 }}
                className={cn(
                  'flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                  done && 'bg-pine text-pine-foreground',
                  active && 'bg-gold text-gold-foreground',
                  !done && !active && 'border-2 border-border text-muted-foreground',
                )}
              >
                {done ? <Check className="size-3.5" strokeWidth={3} /> : n}
              </motion.span>
              {n < steps.length && (
                <span
                  className={cn(
                    'h-0.5 flex-1',
                    done ? 'bg-pine' : 'bg-border',
                  )}
                />
              )}
            </div>
            <span
              className={cn(
                'mt-2 max-w-[4.5rem] text-center text-[0.62rem] font-semibold leading-tight',
                active ? 'text-foreground' : 'text-muted-foreground',
                n === steps.length && 'max-w-[3.5rem]',
              )}
            >
              {label}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
