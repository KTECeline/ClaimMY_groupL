'use client'

import type { ReactNode } from 'react'
import { MobileContainer } from '@/components/layout/mobile-container'
import { TopBar } from '@/components/layout/top-bar'
import { BottomNav } from '@/components/layout/bottom-nav'
import { HelpFab } from '@/components/layout/help-fab'
import { cn } from '@/lib/utils'

/**
 * The chrome every in-app screen shares: phone frame → top bar → scrollable
 * body → help FAB → bottom nav. Screens that deliberately drop a piece (the
 * lo-fi omits the FAB on Alerts/Profile, and the nav on modal interstitials)
 * opt out via props rather than rebuilding the shell.
 */
export function AppShell({
  children,
  title,
  subtitle,
  back = true,
  onBack,
  right,
  topBarVariant = 'paper',
  nav = true,
  fab = true,
  className,
  bodyClassName,
  footer,
}: {
  children: ReactNode
  title?: string
  subtitle?: string
  back?: boolean
  onBack?: () => void
  right?: ReactNode
  topBarVariant?: 'paper' | 'pine' | 'transparent'
  nav?: boolean
  fab?: boolean
  className?: string
  bodyClassName?: string
  /** Sticky action bar pinned above the nav (wizard Continue buttons, etc.). */
  footer?: ReactNode
}) {
  return (
    <MobileContainer className={className}>
      {(title || back || right) && (
        <TopBar
          title={title}
          subtitle={subtitle}
          back={back}
          onBack={onBack}
          right={right}
          variant={topBarVariant}
        />
      )}

      <div className={cn('flex-1 px-5 pb-6', bodyClassName)}>{children}</div>

      {footer && (
        <div className="sticky bottom-0 z-20 border-t border-border bg-background/92 px-5 pb-3 pt-3 backdrop-blur-md">
          {footer}
        </div>
      )}

      {fab && <HelpFab className={nav ? undefined : 'bottom-6'} />}
      {nav && <BottomNav />}
    </MobileContainer>
  )
}
