'use client'

import { cn } from '@/lib/utils'

export function Field({
  label,
  value,
  onChange,
  type = 'text',
  mono = false,
  readOnly = false,
  placeholder,
}: {
  label: string
  value: string
  onChange?: (v: string) => void
  type?: string
  mono?: boolean
  readOnly?: boolean
  placeholder?: string
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <input
        type={type}
        value={value}
        readOnly={readOnly}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        className={cn(
          'h-13 rounded-2xl bg-card px-4 py-3.5 text-[0.95rem] font-medium text-foreground ring-1 ring-border outline-none transition-shadow',
          'placeholder:text-muted-foreground/60',
          'focus-visible:ring-2 focus-visible:ring-pine',
          mono && 'font-mono tracking-wide tabular-nums',
          readOnly && 'bg-muted/50 text-muted-foreground',
        )}
      />
    </label>
  )
}
