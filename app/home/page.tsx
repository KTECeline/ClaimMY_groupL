'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { Users, FileText, Bell, HelpCircle, ArrowRight, Search } from 'lucide-react'
import { MobileContainer } from '@/components/layout/mobile-container'
import { BottomNav } from '@/components/layout/bottom-nav'
import { HelpFab } from '@/components/layout/help-fab'
import { BrandWordmark } from '@/components/common/brand-mark'
import { LanguageToggle } from '@/components/common/language-toggle'
import { ICSearchInput } from '@/components/search/ic-search-input'
import { CoachMarks } from '@/components/common/coach-marks'
import { useLanguage } from '@/context/language-context'
import { useClaim, TOTAL_STEPS } from '@/context/claim-context'
import { useSettings } from '@/context/settings-context'

const quickActions = [
  { href: '/family', icon: Users, key: 'home.q.family' },
  { href: '/track', icon: FileText, key: 'home.q.track' },
  { href: '/notifications', icon: Bell, key: 'home.q.notify' },
  { href: '/settings/help', icon: HelpCircle, key: 'home.q.help' },
]

/**
 * S-05 · Home Dashboard.
 *
 * Deliberately one job: search, or resume. Everything that isn't one of
 * those two things (total recovered, institution coverage) has moved to
 * where it's actually earned — Track and Results — so this screen has a
 * single clear focal point instead of five boxes at equal weight.
 */
export default function HomePage() {
  const router = useRouter()
  const { t } = useLanguage()
  const { activeClaim, wizard, hasDraft, searchedIC, results } = useClaim()
  const claimableCount = results.filter((c) => c.status === 'claimable').length
  const hasPastSearch = !hasDraft && Boolean(searchedIC) && claimableCount > 0
  const { profile } = useSettings()

  const coachMarks = [1, 2, 3].map((n) => ({
    title: t(`coach.${n}.title`),
    body: t(`coach.${n}.body`),
  }))

  return (
    <MobileContainer>
      {/* Pine header */}
      <div className="relative bg-pine px-5 pb-16 pt-12 text-pine-foreground">
        <div className="relative flex items-center justify-between">
          <button
            onClick={() => router.push('/settings/help')}
            aria-label={t('profile.help')}
            data-tap
            className="rounded-full transition-opacity hover:opacity-80 active:opacity-70"
          >
            <BrandWordmark className="text-pine-foreground" />
          </button>
          <LanguageToggle light />
        </div>
        <p className="relative mt-7 text-sm font-medium text-pine-foreground/70">
          {t('home.greeting')}, {profile.name.split(' ')[0]}
        </p>
        <h1 className="relative mt-1 max-w-[16rem] font-display text-2xl font-extrabold leading-snug text-balance">
          {t('home.prompt')}
        </h1>
      </div>

      <main className="relative z-10 flex-1 px-5 pb-28">
        {/* The one thing this screen is for */}
        <div className="-mt-10">
          <ICSearchInput />
        </div>

        {/* Quick actions — icon row, no boxed heading needed */}
        <div className="mt-7 grid grid-cols-4 gap-2.5">
          {quickActions.map(({ href, icon: Icon, key }, i) => (
            <motion.div
              key={href}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * i }}
            >
              <Link
                href={href}
                className="flex flex-col items-center gap-1.5 rounded-2xl py-3 transition-colors hover:bg-secondary"
              >
                <span className="flex size-11 items-center justify-center rounded-2xl bg-card text-pine ring-1 ring-border">
                  <Icon className="size-5" />
                </span>
                <span className="text-center text-[0.68rem] font-semibold leading-tight text-muted-foreground">
                  {t(key)}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Resume — below Quick Actions, not above: this is a callback to
            something you started, not part of the primary "search or
            resume" job at the top. Only a draft or a past search ever
            shows, never both — a draft in progress outranks a past search. */}
        {hasDraft && activeClaim && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-7"
          >
            <Link
              href={`/claim/wizard/step-${Math.min(wizard.furthestStep, TOTAL_STEPS)}`}
              className="flex items-center gap-3 rounded-2xl border-2 border-gold/40 bg-gold-soft/60 p-4 transition-colors hover:bg-gold-soft"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gold/20 text-gold">
                <FileText className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold">
                  {t('home.resume.title')}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {t('home.resume.step', {
                    step: wizard.furthestStep,
                    total: TOTAL_STEPS,
                    name: activeClaim.typeLabel,
                  })}
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-1 rounded-full bg-pine px-3 py-1.5 text-xs font-bold text-pine-foreground">
                {t('home.resume.cta')}
                <ArrowRight className="size-3.5" />
              </span>
            </Link>
          </motion.div>
        )}

        {hasPastSearch && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-7"
          >
            <Link
              href="/results"
              className="flex items-center gap-3 rounded-2xl border-2 border-pine/25 bg-pine-soft/40 p-4 transition-colors hover:bg-pine-soft/60"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-pine/15 text-pine">
                <Search className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold">
                  {t('home.resume.title')}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {t('home.resume.search.body', { n: claimableCount })}
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-1 rounded-full bg-pine px-3 py-1.5 text-xs font-bold text-pine-foreground">
                {t('home.resume.cta')}
                <ArrowRight className="size-3.5" />
              </span>
            </Link>
          </motion.div>
        )}
      </main>

      <CoachMarks marks={coachMarks} flag="home" />
      <HelpFab />
      <BottomNav />
    </MobileContainer>
  )
}
