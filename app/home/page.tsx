'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import {
  Users,
  FileText,
  Bell,
  LifeBuoy,
  ChevronRight,
  ArrowRight,
} from 'lucide-react'
import { MobileContainer } from '@/components/layout/mobile-container'
import { BottomNav } from '@/components/layout/bottom-nav'
import { HelpFab } from '@/components/layout/help-fab'
import { BrandWordmark } from '@/components/common/brand-mark'
import { LanguageToggle } from '@/components/common/language-toggle'
import { ICSearchInput } from '@/components/search/ic-search-input'
import { Amount } from '@/components/common/amount'
import { CoachMarks } from '@/components/common/coach-marks'
import { useLanguage } from '@/context/language-context'
import { useClaim, TOTAL_STEPS } from '@/context/claim-context'
import { useSettings } from '@/context/settings-context'
import { INSTITUTIONS } from '@/lib/mock-data'

const quickActions = [
  { href: '/family', icon: Users, key: 'home.q.family' },
  { href: '/track', icon: FileText, key: 'home.q.track' },
  { href: '/notifications', icon: Bell, key: 'home.q.notify' },
  { href: '/settings/help', icon: LifeBuoy, key: 'home.q.help' },
]

/** S-05 · Home Dashboard */
export default function HomePage() {
  const { t } = useLanguage()
  const { activeClaim, wizard, hasDraft, submittedClaims } = useClaim()
  const { profile } = useSettings()

  const completed = submittedClaims.filter((c) => c.status === 'done')
  const recovered = completed.reduce((sum, c) => sum + c.amount, 0)

  const coachMarks = [1, 2, 3].map((n) => ({
    title: t(`coach.${n}.title`),
    body: t(`coach.${n}.body`),
  }))

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
          {t('home.greeting')}, {profile.name.split(' ')[0]}
        </p>
        <h1 className="relative mt-1 max-w-[16rem] font-display text-2xl font-extrabold leading-snug text-balance">
          {t('home.prompt')}
        </h1>
      </div>

      <main className="relative z-10 flex-1 px-5 pb-6">
        {/* Search card pulled up over the header */}
        <div className="-mt-12">
          <ICSearchInput />
        </div>

        {/* Total recovered — the deck's headline card */}
        <div className="mt-6 rounded-2xl bg-card p-4 ring-1 ring-border">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t('home.total.recovered')}
          </p>
          <div className="mt-1.5">
            <Amount value={recovered} size="lg" tone="pine" />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('home.total.sub', { n: completed.length })}
          </p>
        </div>

        {/* Resume — only shown when there is genuinely something to resume.
            State is persisted, so this survives a refresh. */}
        {hasDraft && activeClaim && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3"
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

        {/* Quick actions */}
        <h2 className="mb-3 mt-7 font-display text-base font-bold">
          {t('home.quick.title')}
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
                <span className="text-center text-[0.7rem] font-semibold leading-tight">
                  {t(key)}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Which sources we cover — answers "is this everything?" up front,
            since only 33.3% knew unclaimed money existed at all. */}
        <h2 className="mb-3 mt-7 font-display text-base font-bold">
          {t('home.institutions')}
        </h2>
        <ul className="flex flex-col gap-2">
          {INSTITUTIONS.slice(0, 4).map((inst, i) => (
            <motion.li
              key={inst.slug}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.04 * i }}
            >
              <Link
                href={`/institution/${inst.slug}`}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 transition-colors hover:bg-pine-soft/30"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-pine-soft text-xs font-bold text-pine">
                  {inst.shortName.slice(0, 2).toUpperCase()}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">
                    {inst.name}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {inst.processingTime}
                  </span>
                </span>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
              </Link>
            </motion.li>
          ))}
        </ul>
      </main>

      <CoachMarks marks={coachMarks} flag="home" />
      <HelpFab />
      <BottomNav />
    </MobileContainer>
  )
}
