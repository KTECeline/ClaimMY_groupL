'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * The uppercase group header + rounded row list that the lo-fi repeats across
 * Review & Submit, Alert Settings, Profile, Settings, Security and the Vault.
 */
export function SectionGroup({
  label,
  children,
  className,
  action,
}: {
  label?: string
  children: ReactNode
  className?: string
  action?: ReactNode
}) {
  return (
    <section className={cn('mb-6', className)}>
      {(label || action) && (
        <div className="mb-2 flex items-center justify-between px-1">
          {label && (
            <h2 className="text-[0.7rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">
              {label}
            </h2>
          )}
          {action}
        </div>
      )}
      <div className="overflow-hidden rounded-2xl border border-border bg-card divide-y divide-border">
        {children}
      </div>
    </section>
  )
}

/** A tappable row with an icon, label, optional hint and a chevron or badge. */
export function SectionRow({
  icon,
  label,
  hint,
  href,
  onClick,
  trailing,
  danger = false,
}: {
  icon?: ReactNode
  label: string
  hint?: string
  href?: string
  onClick?: () => void
  trailing?: ReactNode
  danger?: boolean
}) {
  const inner = (
    <>
      {icon && (
        <span
          className={cn(
            'flex size-9 shrink-0 items-center justify-center rounded-xl',
            danger ? 'bg-clay-soft text-clay' : 'bg-pine-soft text-pine',
          )}
        >
          {icon}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span
          className={cn(
            'block font-semibold leading-snug',
            danger && 'text-clay',
          )}
        >
          {label}
        </span>
        {hint && (
          <span className="mt-0.5 block text-sm leading-snug text-muted-foreground text-pretty">
            {hint}
          </span>
        )}
      </span>
      {trailing ?? (
        <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
      )}
    </>
  )

  const classes =
    'flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-pine-soft/30 focus-visible:relative focus-visible:z-10'

  if (href) {
    return (
      <Link href={href} className={classes} data-tap>
        {inner}
      </Link>
    )
  }

  if (onClick) {
    return (
      <button onClick={onClick} className={classes} data-tap>
        {inner}
      </button>
    )
  }

  return <div className={cn(classes, 'hover:bg-transparent')}>{inner}</div>
}

/** A read-only label/value pair — the Review & Submit tables (S-15). */
export function SectionValueRow({
  label,
  value,
  mono = false,
  onEdit,
  editLabel,
}: {
  label: string
  value: ReactNode
  mono?: boolean
  onEdit?: () => void
  editLabel?: string
}) {
  return (
    <div className="flex items-baseline gap-3 px-4 py-3">
      <span className="w-[38%] shrink-0 text-sm font-medium text-muted-foreground">
        {label}
      </span>
      <span
        className={cn(
          'min-w-0 flex-1 font-semibold text-pretty',
          mono && 'tabular font-mono text-[0.95em]',
        )}
      >
        {value}
      </span>
      {onEdit && (
        <button
          onClick={onEdit}
          className="shrink-0 text-sm font-bold text-pine underline underline-offset-2"
        >
          {editLabel}
        </button>
      )}
    </div>
  )
}
