'use client'

import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

export type Chip<T extends string> = { value: T; label: string }

/**
 * Sort chips on Search Results (S-06) and filter chips on Claims History
 * (S-26). One component, because they behave identically — a single-select
 * row where the active chip is filled.
 */
export function FilterChips<T extends string>({
  chips,
  value,
  onChange,
  label,
  layoutId = 'chipPill',
  className,
}: {
  chips: Chip<T>[]
  value: T
  onChange: (next: T) => void
  /** Optional leading caption, e.g. "Sort by:". */
  label?: string
  layoutId?: string
  className?: string
}) {
  return (
    <div
      className={cn('flex items-center gap-2 overflow-x-auto no-scrollbar', className)}
      role="group"
      aria-label={label}
    >
      {label && (
        <span className="shrink-0 text-xs font-semibold text-muted-foreground">
          {label}
        </span>
      )}
      {chips.map((chip) => {
        const active = chip.value === value
        return (
          <button
            key={chip.value}
            onClick={() => onChange(chip.value)}
            aria-pressed={active}
            className={cn(
              'relative shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors',
              active ? 'text-pine-foreground' : 'border border-border text-muted-foreground hover:text-foreground',
            )}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-full bg-pine"
                transition={{ type: 'spring', stiffness: 460, damping: 34 }}
              />
            )}
            <span className="relative">{chip.label}</span>
          </button>
        )
      })}
    </div>
  )
}
