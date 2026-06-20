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
    <div className="min-h-dvh w-full bg-[#0a1611] flex items-stretch justify-center sm:items-center sm:py-6">
      <div className="relative w-full max-w-[400px] sm:rounded-[2.75rem] sm:border-[10px] sm:border-[#0a1611] sm:shadow-2xl overflow-hidden">
        {/* Notch — only on framed (sm+) view */}
        <div className="pointer-events-none absolute top-0 left-1/2 z-50 hidden h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-[#0a1611] sm:block" />
        <div
          className={cn(
            'relative flex min-h-dvh sm:min-h-[844px] flex-col bg-background',
            className,
          )}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
