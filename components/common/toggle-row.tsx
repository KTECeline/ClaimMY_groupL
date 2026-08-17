'use client'

import { motion } from 'motion/react'
import { useId } from 'react'
import { cn } from '@/lib/utils'

/**
 * Label + switch. The lo-fi uses these all through Alert Settings, Settings
 * and Security. Implemented as a real checkbox input so it is keyboard- and
 * screen-reader-operable, with the visual switch drawn on top.
 */
export function ToggleRow({
  label,
  hint,
  checked,
  onChange,
  disabled = false,
}: {
  label: string
  hint?: string
  checked: boolean
  onChange: (next: boolean) => void
  disabled?: boolean
}) {
  const id = useId()

  return (
    <label
      htmlFor={id}
      data-tap
      className={cn(
        'flex cursor-pointer items-center gap-3 px-4 py-3.5 transition-colors',
        disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-pine-soft/30',
      )}
    >
      <span className="min-w-0 flex-1">
        <span className="block font-semibold leading-snug">{label}</span>
        {hint && (
          <span className="mt-0.5 block text-sm leading-snug text-muted-foreground text-pretty">
            {hint}
          </span>
        )}
      </span>

      <input
        id={id}
        type="checkbox"
        role="switch"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className={cn(
          'relative flex h-7 w-12 shrink-0 items-center rounded-full px-0.5 transition-colors peer-focus-visible:ring-4 peer-focus-visible:ring-ring/30',
          checked ? 'bg-pine' : 'bg-secondary',
        )}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 34 }}
          className={cn(
            'size-6 rounded-full bg-card shadow-sm',
            checked && 'ml-auto',
          )}
        />
      </span>
    </label>
  )
}
