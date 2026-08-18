'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function MobileContainer({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className="min-h-dvh w-full bg-[#0e1f1e] flex items-stretch justify-center sm:items-center sm:py-6">
      <div
        // sm:[transform:...] establishes a new containing block for
        // `position: fixed` descendants (PhoneOverlay — nav, help FAB, coach
        // marks, vault lock). Without it, those overlays are fixed to the
        // *browser* viewport, not this frame, so on wide "web" viewports
        // where the frame doesn't fill the viewport height they float
        // detached from the phone bezel with square corners instead of
        // nesting inside its rounded edge. On mobile widths (no frame) this
        // is inert since the frame already fills the viewport.
        className="relative w-full max-w-[400px] sm:rounded-[2.75rem] sm:border-[10px] sm:border-[#0e1f1e] sm:shadow-2xl overflow-hidden sm:[transform:translateZ(0)]"
      >
        {/* Notch — only on framed (sm+) view */}
        <div className="pointer-events-none absolute top-0 left-1/2 z-50 hidden h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-[#0e1f1e] sm:block" />
        <div
          className={cn(
            // Fixed (not min-) height on sm+ so the phone frame is always
            // the same size regardless of a screen's content length — long
            // screens scroll *inside* the frame instead of stretching it.
            'relative flex min-h-dvh flex-col overflow-y-auto bg-background sm:h-[844px]',
            className,
          )}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
