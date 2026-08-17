'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Anything that should float over the phone frame — bottom sheets, the help
 * FAB, coach marks, the vault lock.
 *
 * These have to be `fixed`, not `absolute`. `MobileContainer` is the nearest
 * positioned ancestor and it grows with the page, so an absolutely positioned
 * `bottom-0` lands at the bottom of the *document* rather than the viewport —
 * on a long screen like the Vault or Help, a bottom sheet would open far below
 * the fold. Fixing to the viewport and re-centering to the 400px frame keeps
 * overlays where the wireframes draw them regardless of page length.
 */
export function PhoneOverlay({
  children,
  className,
  align = 'stretch',
}: {
  children: ReactNode
  className?: string
  /** 'bottom' pins content to the bottom edge of the frame. */
  align?: 'stretch' | 'bottom'
}) {
  return (
    <div
      className={cn(
        'pointer-events-none fixed inset-0 z-50 flex justify-center',
        align === 'bottom' && 'items-end',
      )}
    >
      <div
        className={cn(
          'pointer-events-auto relative w-full max-w-[400px]',
          align === 'stretch' && 'h-full',
          className,
        )}
      >
        {children}
      </div>
    </div>
  )
}
