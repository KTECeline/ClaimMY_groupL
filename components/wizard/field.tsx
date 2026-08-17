'use client'

import { useId } from 'react'
import { cn } from '@/lib/utils'

export function Field({
  label,
  value,
  onChange,
  type = 'text',
  mono = false,
  readOnly = false,
  placeholder,
  hint,
  optional = false,
  optionalLabel,
  multiline = false,
  error,
  inputMode,
}: {
  label: string
  value: string
  onChange?: (v: string) => void
  type?: string
  mono?: boolean
  readOnly?: boolean
  placeholder?: string
  hint?: string
  optional?: boolean
  optionalLabel?: string
  multiline?: boolean
  error?: string
  inputMode?: 'text' | 'numeric' | 'tel' | 'email'
}) {
  const id = useId()

  const shared = cn(
    'w-full rounded-2xl border-2 bg-card px-4 py-3 text-[0.95rem] transition-colors focus:outline-none',
    mono && 'tabular font-mono tracking-wide',
    readOnly && 'bg-secondary text-muted-foreground',
    error ? 'border-clay focus:border-clay' : 'border-border focus:border-pine',
  )

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="flex items-baseline gap-1.5 text-sm font-semibold">
        {label}
        {optional && (
          <span className="text-xs font-medium text-muted-foreground">
            ({optionalLabel})
          </span>
        )}
      </label>

      {multiline ? (
        <textarea
          id={id}
          value={value}
          rows={3}
          readOnly={readOnly}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={hint || error ? `${id}-hint` : undefined}
          onChange={(e) => onChange?.(e.target.value)}
          className={cn(shared, 'resize-none leading-relaxed')}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          readOnly={readOnly}
          placeholder={placeholder}
          inputMode={inputMode}
          aria-invalid={Boolean(error)}
          aria-describedby={hint || error ? `${id}-hint` : undefined}
          onChange={(e) => onChange?.(e.target.value)}
          className={cn(shared, 'h-13 min-h-[3.25rem]')}
        />
      )}

      {(hint || error) && (
        <p
          id={`${id}-hint`}
          className={cn(
            'text-xs leading-snug',
            error ? 'font-semibold text-clay' : 'text-muted-foreground',
          )}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  )
}
