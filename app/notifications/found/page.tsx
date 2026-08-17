'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { ArrowRight, Info, PartyPopper, Sparkles } from 'lucide-react'
import { MobileContainer } from '@/components/layout/mobile-container'
import { Amount } from '@/components/common/amount'
import { AppButton } from '@/components/ui/app-button'
import { useLanguage } from '@/context/language-context'
import { useToast } from '@/context/toast-context'
import { CLAIMS } from '@/lib/mock-data'

/**
 * S-22 · New Claim Found.
 *
 * A full-screen interstitial — no nav, no FAB — because it has exactly one job:
 * convert an alert into a claim. Awareness was the top-of-funnel failure
 * (only 33.3% knew unclaimed money existed), so when we do find money the
 * moment deserves a whole screen.
 */
export default function NewClaimFoundPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const { show } = useToast()

  // The most recent record filed — the dormant BSN account in the mock data.
  const claim = CLAIMS[CLAIMS.length - 1]

  return (
    <MobileContainer className="bg-pine text-pine-foreground">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(120%_80%_at_50%_0%,rgba(201,138,31,0.28),transparent_62%)]" />

      <header className="relative px-5 pt-6">
        <p className="text-center text-sm font-semibold text-pine-foreground/60">
          {t('found.title')}
        </p>
      </header>

      <div className="relative flex flex-1 flex-col items-center justify-center px-6 text-center">
        <motion.span
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 240, damping: 15 }}
          className="flex size-24 items-center justify-center rounded-[2rem] bg-gold text-gold-foreground shadow-[0_16px_44px_-12px_rgba(201,138,31,0.7)]"
        >
          <PartyPopper className="size-11" strokeWidth={2} />
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-7 font-display text-3xl font-extrabold tracking-tight"
        >
          {t('found.heading')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-2 max-w-[17rem] text-sm leading-relaxed text-pine-foreground/75 text-pretty"
        >
          {t('found.body', {
            institution: claim.institution,
            year: claim.year,
          })}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 w-full rounded-3xl bg-pine-foreground/10 p-5 ring-1 ring-pine-foreground/15 backdrop-blur-sm"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-pine-foreground/60">
            {t('found.label')}
          </p>
          <div className="mt-1">
            <Amount value={claim.amount} size="xl" tone="paper" />
          </div>
          <p className="mt-2 text-sm text-pine-foreground/70">
            {claim.typeLabel}
          </p>
        </motion.div>

        <div className="mt-6 flex items-start gap-3 rounded-2xl bg-pine-foreground/8 p-4 text-left ring-1 ring-pine-foreground/10">
          <Info className="mt-0.5 size-4 shrink-0 text-gold" />
          <p className="text-sm leading-relaxed text-pine-foreground/75 text-pretty">
            {t('found.note')}
          </p>
        </div>
      </div>

      <div className="relative flex flex-col gap-3 px-6 pb-10">
        <AppButton
          variant="gold"
          size="block"
          onClick={() => router.push(`/claim/${claim.id}`)}
        >
          <Sparkles className="size-5" />
          {t('found.cta')}
          <ArrowRight className="size-5" />
        </AppButton>
        <AppButton
          size="block"
          className="bg-pine-foreground/10 text-pine-foreground hover:bg-pine-foreground/20"
          onClick={() => {
            show({ message: t('found.snoozed') })
            router.push('/notifications')
          }}
        >
          {t('found.later')}
        </AppButton>
      </div>
    </MobileContainer>
  )
}
