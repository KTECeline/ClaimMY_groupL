import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Supplementary text that shouldn't visually compete with the screen's real
 * content. Giving every aside its own bordered card is what turns a screen
 * into a wall of boxes with no hierarchy — most advisory copy just needs an
 * icon and muted text.
 *
 * `highlight` is reserved for the rare thing that should genuinely pull the
 * eye (a promo, a confirmed state) — not the default.
 */
export function Callout({
  icon,
  children,
  tone = 'quiet',
  className,
}: {
  icon: ReactNode
  children: ReactNode
  tone?: 'quiet' | 'highlight'
  className?: string
}) {
  if (tone === 'quiet') {
    return (
      <div className={cn('flex items-start gap-2.5 py-0.5', className)}>
        <span className="mt-0.5 shrink-0 text-muted-foreground">{icon}</span>
        <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
          {children}
        </p>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex items-start gap-2.5 rounded-2xl bg-gold-soft p-4',
        className,
      )}
    >
      <span className="mt-0.5 shrink-0 text-accent-foreground">{icon}</span>
      <p className="text-sm font-semibold leading-relaxed text-accent-foreground text-pretty">
        {children}
      </p>
    </div>
  )
}
