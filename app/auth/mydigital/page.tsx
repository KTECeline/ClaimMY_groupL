'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'motion/react'
import {
  ChevronLeft,
  Check,
  Fingerprint,
  IdCard,
  Loader2,
  ShieldCheck,
  User,
} from 'lucide-react'
import { MobileContainer } from '@/components/layout/mobile-container'
import { useLanguage } from '@/context/language-context'
import { useClaim } from '@/context/claim-context'
import { DEMO_IC } from '@/lib/mock-data'

/**
 * Mock MyDigital ID SSO consent screen.
 *
 * This is the "linked government login" shortcut: instead of the manual
 * IC-verify step, the user authorizes ClaimMY to read their already-verified
 * identity from MyDigital ID, and we search on their behalf immediately.
 * The result still flows through the normal /searching → /results path, and
 * the IC search bar on Home is untouched — this only skips *typing your own
 * IC*, not the ability to look up anyone else's.
 *
 * Hardcoded/local mockup only: no real MyDigital ID service is contacted.
 */
export default function MyDigitalIdPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const { search } = useClaim()
  const [stage, setStage] = useState<'consent' | 'verifying'>('consent')

  function authorize() {
    setStage('verifying')
    setTimeout(() => {
      search(DEMO_IC, true)
      router.push('/searching')
    }, 1300)
  }

  return (
    <MobileContainer>
      <header className="flex h-16 items-center px-2">
        <button
          onClick={() => router.push('/')}
          aria-label={t('common.back')}
          disabled={stage === 'verifying'}
          className="flex size-10 items-center justify-center rounded-full transition-colors hover:bg-foreground/5 disabled:opacity-40"
        >
          <ChevronLeft className="size-6" />
        </button>
      </header>

      <div className="flex flex-1 flex-col px-6 pb-8">
        <AnimatePresence mode="wait">
          {stage === 'consent' ? (
            <motion.div
              key="consent"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="flex flex-1 flex-col"
            >
              {/* External-service header — deliberately a different tone from
                  ClaimMY's pine/gold so it reads as "you're now dealing with
                  a different, government-run service". */}
              <div className="flex items-center gap-3">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white">
                  <IdCard className="size-6" />
                </span>
                <div className="min-w-0">
                  <p className="font-display text-lg font-bold leading-tight">
                    {t('mydigital.name')}
                  </p>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {t('mydigital.badge')}
                  </p>
                </div>
              </div>

              <h1 className="mt-6 font-display text-2xl font-extrabold tracking-tight text-balance">
                {t('mydigital.title')}
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
                {t('mydigital.sub')}
              </p>

              {/* The identity being shared — this is the payoff of the flow */}
              <div className="mt-6 flex items-center gap-3 rounded-2xl border-2 border-pine/25 bg-pine-soft/40 p-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-pine text-pine-foreground">
                  <User className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-bold leading-snug">
                    Ahmad bin Razali
                  </span>
                  <span className="tabular block truncate font-mono text-sm text-muted-foreground">
                    {DEMO_IC}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-1 rounded-full bg-pine px-2.5 py-1 text-[0.65rem] font-bold text-pine-foreground">
                  <ShieldCheck className="size-3" />
                  {t('mydigital.identity.verified')}
                </span>
              </div>

              {/* Permissions being requested */}
              <p className="mb-2 mt-6 text-sm font-bold">
                {t('mydigital.permissions')}
              </p>
              <ul className="flex flex-col gap-2">
                {[
                  'mydigital.perm.name',
                  'mydigital.perm.ic',
                  'mydigital.perm.status',
                ].map((key) => (
                  <li
                    key={key}
                    className="flex items-center gap-3 rounded-xl border border-border bg-card px-3.5 py-3"
                  >
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-pine text-pine-foreground">
                      <Check className="size-3.5" strokeWidth={3} />
                    </span>
                    <span className="text-sm font-medium">{t(key)}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground text-pretty">
                <Fingerprint className="mt-0.5 size-3.5 shrink-0" />
                {t('mydigital.note')}
              </p>

              <div className="mt-auto flex flex-col gap-2.5 pt-8">
                <button
                  onClick={authorize}
                  data-tap
                  className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-pine font-bold text-pine-foreground transition-transform active:scale-[0.98]"
                >
                  <ShieldCheck className="size-5" />
                  {t('mydigital.authorize')}
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="h-12 text-sm font-bold text-muted-foreground"
                >
                  {t('mydigital.cancel')}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="verifying"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="flex flex-1 flex-col items-center justify-center text-center"
            >
              <Loader2 className="size-10 animate-spin text-pine" />
              <p className="mt-5 font-display text-lg font-bold text-balance">
                {t('mydigital.verifying')}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {t('mydigital.name')}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MobileContainer>
  )
}
