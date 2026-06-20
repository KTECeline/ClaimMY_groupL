'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { Users, FileText, Bell, HelpCircle, ChevronRight } from 'lucide-react'
import { MobileContainer } from '@/components/layout/mobile-container'
import { BottomNav } from '@/components/layout/bottom-nav'
import { BrandWordmark } from '@/components/common/brand-mark'
import { LanguageToggle } from '@/components/common/language-toggle'
import { ICSearchInput } from '@/components/search/ic-search-input'
import { Amount } from '@/components/common/amount'
import { PageTransition } from '@/components/common/page-transition'
import { useLanguage } from '@/context/language-context'

const quickActions = [
  { href: '/family', icon: Users, key: 'home.q.family' },
  { href: '/track', icon: FileText, key: 'home.q.track' },
  { href: '/notifications', icon: Bell, key: 'home.q.notify' },
  { href: '/settings', icon: HelpCircle, key: 'home.q.help' },
]

export default function HomePage() {
  const { t } = useLanguage()

  return (
    <MobileContainer>
      {/* Pine header */}
      <div className="relative bg-pine px-5 pb-20 pt-12 text-pine-foreground">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-full bg-[radial-gradient(110%_70%_at_80%_0%,rgba(201,138,31,0.18),transparent_55%)]" />
        <div className="relative flex items-center justify-between">
          <BrandWordmark className="text-pine-foreground" />
          <LanguageToggle light />
        </div>
        <p className="relative mt-7 text-sm font-medium text-pine-foreground/70">
          {t('home.greeting')}, Ahmad
        </p>
        <h1 className="relative mt-1 max-w-[16rem] font-display text-2xl font-extrabold leading-snug text-balance">
          {t('home.prompt')}
        </h1>
      </div>

      <PageTransition className="flex flex-1 flex-col">
        <main className="flex-1 px-5 pb-6">
          {/* Search card pulled up over the header */}
          <div className="-mt-12">
            <ICSearchInput />
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-card p-4 ring-1 ring-border">
              <Amount value={47200000} size="sm" tone="pine" />
              <p className="mt-1 text-xs font-medium text-muted-foreground">
                {t('home.stat.recovered')}
              </p>
            </div>
            <div className="rounded-2xl bg-card p-4 ring-1 ring-border">
              <p className="font-display text-2xl font-extrabold tabular text-foreground">
                18,240
              </p>
              <p className="mt-1 text-xs font-medium text-muted-foreground">
                {t('home.stat.claims')}
              </p>
            </div>
          </div>

          {/* Quick actions */}
          <h2 className="mt-7 mb-3 font-display text-base font-bold text-foreground">
            {t('home.quick')}
          </h2>
          <div className="grid grid-cols-4 gap-3">
            {quickActions.map(({ href, icon: Icon, key }, i) => (
              <motion.div
                key={href}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
              >
                <Link
                  href={href}
                  className="flex flex-col items-center gap-2 rounded-2xl bg-card py-3 ring-1 ring-border transition-colors hover:bg-secondary"
                >
                  <span className="flex size-10 items-center justify-center rounded-xl bg-pine-soft text-pine">
                    <Icon className="size-5" />
                  </span>
                  <span className="text-center text-[0.7rem] font-semibold leading-tight text-foreground">
                    {t(key)}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Continue claim */}
          <h2 className="mt-7 mb-3 font-display text-base font-bold text-foreground">
            {t('home.recent')}
          </h2>
          <Link
            href="/track"
            className="flex items-center gap-3 rounded-2xl border border-gold/30 bg-gold-soft/50 p-4 transition-colors hover:bg-gold-soft"
          >
            <span className="flex size-11 items-center justify-center rounded-xl bg-gold/15 text-gold">
              <FileText className="size-5" />
            </span>
            <span className="flex-1">
              <span className="block text-sm font-bold text-foreground">
                KWSP Dividend Balance
              </span>
              <span className="block text-xs text-muted-foreground">
                Step 3 of 4 · Upload documents
              </span>
            </span>
            <ChevronRight className="size-5 text-muted-foreground" />
          </Link>
        </main>

        <BottomNav />
      </PageTransition>
    </MobileContainer>
  )
}
