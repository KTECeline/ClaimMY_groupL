'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function TopBar({
  title,
  back = true,
  onBack,
  right,
  variant = 'paper',
}: {
  title?: string
  back?: boolean
  onBack?: () => void
  right?: ReactNode
  variant?: 'paper' | 'pine' | 'transparent'
}) {
  const router = useRouter()

  const styles = {
    paper: 'bg-background/85 text-foreground border-b border-border',
    pine: 'bg-pine text-pine-foreground',
    transparent: 'text-foreground',
  }[variant]

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-16 items-center gap-2 px-4 backdrop-blur-md',
        styles,
      )}
    >
      {back ? (
        <button
          onClick={() => (onBack ? onBack() : router.back())}
          aria-label="Go back"
          className={cn(
            'flex size-10 items-center justify-center rounded-full transition-colors',
            variant === 'pine' ? 'hover:bg-white/15' : 'hover:bg-foreground/5',
          )}
        >
          <ChevronLeft className="size-6" />
        </button>
      ) : (
        <span className="w-2" />
      )}
      {title && (
        <h1 className="font-display text-lg font-bold tracking-tight truncate">
          {title}
        </h1>
      )}
      <div className="ml-auto flex items-center gap-1">{right}</div>
    </header>
  )
}
