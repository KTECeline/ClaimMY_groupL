'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'motion/react'
import { Home, FileText, Users, Bell, Settings } from 'lucide-react'
import { useLanguage } from '@/context/language-context'
import { PhoneOverlay } from '@/components/layout/phone-overlay'
import { cn } from '@/lib/utils'

const items = [
  { href: '/home', icon: Home, key: 'nav.home' },
  { href: '/track', icon: FileText, key: 'nav.claims' },
  { href: '/family', icon: Users, key: 'nav.family' },
  { href: '/notifications', icon: Bell, key: 'nav.alerts' },
  { href: '/settings', icon: Settings, key: 'nav.settings' },
]

export function BottomNav() {
  const pathname = usePathname()
  const { t } = useLanguage()

  return (
    // `fixed` via PhoneOverlay, not `sticky` — MobileContainer only sets a
    // min-height, so on long pages a sticky/in-flow nav's containing block
    // grows with the content and the bar drifts away instead of pinning to
    // the viewport. See phone-overlay.tsx for the full explanation.
    <PhoneOverlay align="bottom" className="pointer-events-auto">
      <nav className="border-t border-border bg-background/90 backdrop-blur-md">
        <ul className="flex items-stretch justify-around px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
          {items.map(({ href, icon: Icon, key }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <li key={href} className="flex-1">
                <Link
                  href={href}
                  className="relative flex flex-col items-center gap-1 py-1.5"
                  aria-current={active ? 'page' : undefined}
                >
                  <span className="relative flex h-8 w-12 items-center justify-center">
                    {active && (
                      <motion.span
                        layoutId="navPill"
                        className="absolute inset-0 rounded-full bg-pine-soft"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}
                    <Icon
                      className={cn(
                        'relative size-[1.35rem] transition-colors',
                        active ? 'text-pine' : 'text-muted-foreground',
                      )}
                      strokeWidth={active ? 2.4 : 2}
                    />
                  </span>
                  <span
                    className={cn(
                      'text-[0.65rem] font-semibold transition-colors',
                      active ? 'text-pine' : 'text-muted-foreground',
                    )}
                  >
                    {t(key)}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </PhoneOverlay>
  )
}
