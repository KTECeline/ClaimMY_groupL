'use client'

import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { Check, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export type TimelineStepState = 'done' | 'active' | 'todo'

export type TimelineStep = {
  label: string
  body?: string
  state: TimelineStepState
  /** Inline "Don't have this? ›" style helper (S-20b). */
  action?: { label: string; onClick: () => void }
}

/**
 * Vertical numbered/status timeline. Serves three lo-fi screens:
 *  · S-16 "What happens next" (numbered, all todo)
 *  · S-20b Deceased Estate Guide (numbered, with per-step help links)
 *  · S-23 Claim Status (status dots: Submitted → Under Review → Approved → Paid)
 */
export function Timeline({
  steps,
  numbered = false,
  className,
}: {
  steps: TimelineStep[]
  numbered?: boolean
  className?: string
}) {
  return (
    <ol className={cn('flex flex-col', className)}>
      {steps.map((step, i) => {
        const last = i === steps.length - 1
        const done = step.state === 'done'
        const active = step.state === 'active'

        return (
          <li key={step.label} className="flex gap-3">
            {/* Rail */}
            <div className="flex flex-col items-center">
              <motion.span
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 340,
                  damping: 22,
                  delay: i * 0.07,
                }}
                className={cn(
                  'flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold',
                  done && 'bg-pine text-pine-foreground',
                  active && 'bg-gold text-gold-foreground',
                  !done && !active && 'border-2 border-border text-muted-foreground',
                )}
              >
                {done && !numbered ? (
                  <Check className="size-4" strokeWidth={3} />
                ) : (
                  i + 1
                )}
              </motion.span>

              {!last && (
                <span
                  className={cn(
                    'w-0.5 flex-1 rounded-full',
                    done ? 'bg-pine' : 'bg-border',
                  )}
                />
              )}
            </div>

            {/* Content */}
            <div className={cn('min-w-0 flex-1', last ? 'pb-0' : 'pb-6')}>
              <p
                className={cn(
                  'font-semibold leading-snug',
                  !done && !active && 'text-muted-foreground',
                )}
              >
                {step.label}
              </p>
              {step.body && (
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground text-pretty">
                  {step.body}
                </p>
              )}
              {step.action && (
                <button
                  onClick={step.action.onClick}
                  className="mt-2 inline-flex items-center gap-0.5 text-sm font-bold text-pine underline underline-offset-2"
                >
                  {step.action.label}
                  <ChevronRight className="size-4" />
                </button>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

/**
 * Compact horizontal 4-dot tracker used on claim cards in the My Claims hub —
 * shows progress at a glance without opening the claim.
 */
export function ProgressDots({
  total,
  current,
  labels,
  className,
}: {
  total: number
  /** 0-indexed stage; every dot up to and including this one reads as done. */
  current: number
  labels?: string[]
  className?: string
}) {
  return (
    <div className={cn('flex items-start', className)}>
      {Array.from({ length: total }).map((_, i) => {
        const done = i <= current
        return (
          <div key={i} className="flex flex-1 flex-col items-center last:flex-none">
            <div className="flex w-full items-center">
              <span
                className={cn(
                  'size-3 shrink-0 rounded-full transition-colors',
                  done ? 'bg-pine' : 'border-2 border-border bg-card',
                )}
              />
              {i < total - 1 && (
                <span
                  className={cn(
                    'h-0.5 flex-1 transition-colors',
                    i < current ? 'bg-pine' : 'bg-border',
                  )}
                />
              )}
            </div>
            {labels?.[i] && (
              <span
                className={cn(
                  '-ml-2 mt-1.5 text-[0.6rem] font-semibold leading-tight',
                  done ? 'text-pine' : 'text-muted-foreground',
                )}
              >
                {labels[i]}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
