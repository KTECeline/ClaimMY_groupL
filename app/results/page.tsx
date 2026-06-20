'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { SearchX, Bell, RotateCcw, PartyPopper } from 'lucide-react'
import { MobileContainer } from '@/components/layout/mobile-container'
import { TopBar } from '@/components/layout/top-bar'
import { ResultCard } from '@/components/search/result-card'
import { Amount } from '@/components/common/amount'
import { AppButton } from '@/components/ui/app-button'
import { PageTransition } from '@/components/common/page-transition'
import { useLanguage } from '@/context/language-context'
import { useClaim } from '@/context/claim-context'

const container = {
  animate: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

export default function ResultsPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const { searchedIC, results } = useClaim()

  useEffect(() => {
    if (!searchedIC) router.replace('/home')
  }, [searchedIC, router])

  const total = results.reduce((s, c) => s + c.amount, 0)
  const institutions = new Set(results.map((c) => c.institution)).size

  if (results.length === 0) {
    return (
      <MobileContainer>
        <TopBar title={t('results.title')} />
        <PageTransition className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <span className="flex size-20 items-center justify-center rounded-3xl bg-secondary text-muted-foreground">
            <SearchX className="size-9" />
          </span>
          <h1 className="mt-6 font-display text-2xl font-extrabold text-balance">
            {t('results.empty.title')}
          </h1>
          <p className="mt-3 max-w-xs leading-relaxed text-muted-foreground text-pretty">
            {t('results.empty.body')}
          </p>
          <div className="mt-8 flex w-full max-w-xs flex-col gap-3">
            <AppButton variant="primary" size="block" onClick={() => router.push('/notifications')}>
              <Bell className="size-5" />
              {t('results.empty.alerts')}
            </AppButton>
            <AppButton variant="outline" size="block" onClick={() => router.push('/home')}>
              <RotateCcw className="size-5" />
              {t('results.empty.retry')}
            </AppButton>
          </div>
        </PageTransition>
      </MobileContainer>
    )
  }

  return (
    <MobileContainer>
      <TopBar title={t('results.title')} />
      <PageTransition className="flex flex-1 flex-col">
        <div className="overflow-y-auto no-scrollbar px-5 pb-8">
          {/* Hero total */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="ticket-notch relative mt-2 overflow-hidden rounded-3xl bg-pine p-6 text-pine-foreground"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_90%_0%,rgba(201,138,31,0.25),transparent_55%)]" />
            <div className="relative flex items-center gap-2 text-sm font-semibold text-gold">
              <PartyPopper className="size-4" />
              {t('results.found')}
            </div>
            <p className="relative mt-3 text-xs font-medium uppercase tracking-wide text-pine-foreground/60">
              {t('results.total')}
            </p>
            <div className="relative mt-1">
              <Amount value={total} size="xl" tone="paper" />
            </div>
            <p className="relative mt-3 text-sm text-pine-foreground/70">
              {t('results.count', { n: results.length })} ·{' '}
              {t('results.from', { n: institutions })}
            </p>
          </motion.div>

          <p className="mb-3 mt-6 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t('results.sortBy')}
          </p>

          <motion.div
            variants={container}
            initial="initial"
            animate="animate"
            className="flex flex-col gap-3"
          >
            {[...results]
              .sort((a, b) => b.amount - a.amount)
              .map((claim) => (
                <ResultCard key={claim.id} claim={claim} />
              ))}
          </motion.div>

          <AppButton
            variant="ghost"
            size="block"
            className="mt-4"
            onClick={() => router.push('/home')}
          >
            <RotateCcw className="size-4" />
            {t('results.searchAgain')}
          </AppButton>
        </div>
      </PageTransition>
    </MobileContainer>
  )
}
