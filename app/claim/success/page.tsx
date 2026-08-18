'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { Check, Copy, ArrowRight, BellRing } from 'lucide-react'
import { MobileContainer } from '@/components/layout/mobile-container'
import { AppButton } from '@/components/ui/app-button'
import { ConfettiBurst } from '@/components/common/confetti-burst'
import { useLanguage } from '@/context/language-context'
import { useClaim } from '@/context/claim-context'
import { useSettings } from '@/context/settings-context'
import { useToast } from '@/context/toast-context'
import { getInstitution } from '@/lib/mock-data'

/**
 * S-16 · Submission Confirmed. The lo-fi drops the nav and the help FAB here
 * on purpose — this is a terminal celebration screen with two clear exits.
 *
 * The numbered "What happens next" list is the direct answer to the journey
 * map's RETAIN pain points: "no estimated processing time", "no post-submission
 * communication", "no reason to return to the app".
 */
export default function SuccessPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const { activeClaim, lastRef, resetWizard, setActiveClaim, wizard } = useClaim()
  const { alerts, toggleAlert } = useSettings()
  const { show } = useToast()
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!activeClaim || !lastRef) router.replace('/home')
  }, [activeClaim, lastRef, router])

  if (!activeClaim || !lastRef) return null

  const institution = getInstitution(activeClaim.institutionSlug)
  const steps = [
    {
      title: t('confirm.next.1'),
      body: t('confirm.next.1.body'),
    },
    {
      title: t('confirm.next.2', { institution: activeClaim.institution }),
      body: t('confirm.next.2.body', {
        time: institution?.processingTime ?? '14–21 working days',
      }),
    },
    {
      title: t('confirm.next.3'),
      body: t('confirm.next.3.body', { bank: wizard.bankName }),
    },
  ]

  function done(path: string) {
    setActiveClaim(null)
    resetWizard()
    router.push(path)
  }

  function copyRef() {
    navigator.clipboard?.writeText(lastRef!)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <MobileContainer className="bg-pine text-pine-foreground">
      <div className="relative flex flex-1 flex-col overflow-hidden px-5 pb-10 pt-14">
        <div className="relative flex flex-col items-center text-center">
          <ConfettiBurst />
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.1 }}
            className="relative z-10 flex size-24 items-center justify-center rounded-full bg-gold-bright text-ink"
          >
            <Check className="size-12" strokeWidth={3} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-6 font-display text-3xl font-extrabold text-balance"
          >
            {t('confirm.title')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mt-2 max-w-xs text-sm leading-relaxed text-pine-foreground/80 text-pretty"
          >
            {t('confirm.body', { institution: activeClaim.institution })}
          </motion.p>
        </div>

        {/* Reference card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="relative z-10 mt-7 rounded-3xl bg-pine-foreground/10 p-5 ring-1 ring-pine-foreground/15 backdrop-blur-sm"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-pine-foreground/60">
            {t('confirm.ref')}
          </p>
          <div className="mt-1 flex items-center justify-between gap-3">
            <span className="tabular font-mono text-xl font-bold tracking-wider">
              {lastRef}
            </span>
            <button
              onClick={copyRef}
              className="flex items-center gap-1.5 rounded-full bg-pine-foreground/15 px-3 py-2 text-xs font-bold transition-colors hover:bg-pine-foreground/25"
            >
              {copied ? (
                <Check className="size-3.5" strokeWidth={3} />
              ) : (
                <Copy className="size-3.5" />
              )}
              {copied ? t('common.copied') : t('common.copy')}
            </button>
          </div>
        </motion.div>

        {/* What happens next */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="relative z-10 mt-7"
        >
          <p className="text-sm font-bold text-pine-foreground/90">
            {t('confirm.next')}
          </p>
          <ol className="mt-3 flex flex-col">
            {steps.map((step, i) => (
              <li key={step.title} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-pine-foreground/15 font-mono text-sm font-bold">
                    {i + 1}
                  </span>
                  {i < steps.length - 1 && (
                    <span className="w-0.5 flex-1 bg-pine-foreground/15" />
                  )}
                </div>
                <div className={i < steps.length - 1 ? 'pb-4' : ''}>
                  <p className="text-sm font-semibold leading-snug">
                    {step.title}
                  </p>
                  <p className="mt-0.5 text-sm leading-relaxed text-pine-foreground/70 text-pretty">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </motion.div>

        <div className="relative z-10 mt-auto flex flex-col gap-3 pt-8">
          {!alerts.statusUpdates && (
            <button
              onClick={() => {
                toggleAlert('statusUpdates')
                show({ message: t('confirm.notify.on') })
              }}
              data-tap
              className="flex h-14 items-center justify-center gap-2.5 rounded-2xl border-2 border-pine-foreground/25 font-bold transition-colors hover:bg-pine-foreground/10"
            >
              <BellRing className="size-5 text-gold-bright" />
              {t('confirm.notify')}
            </button>
          )}
          <AppButton variant="gold" size="block" onClick={() => done('/track')}>
            {t('confirm.track')}
            <ArrowRight className="size-5" />
          </AppButton>
          <AppButton
            size="block"
            className="bg-pine-foreground/10 text-pine-foreground hover:bg-pine-foreground/20"
            onClick={() => done('/home')}
          >
            {t('confirm.home')}
          </AppButton>
        </div>
      </div>
    </MobileContainer>
  )
}
