'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Info, X } from 'lucide-react'
import { AppShell } from '@/components/layout/app-shell'
import { Timeline, type TimelineStep } from '@/components/common/timeline'
import { AppButton } from '@/components/ui/app-button'
import { PhoneOverlay } from '@/components/layout/phone-overlay'
import { useLanguage } from '@/context/language-context'
import { useClaim } from '@/context/claim-context'
import { ESTATE_STEPS } from '@/lib/mock-data'

/**
 * S-20b · Deceased Estate Guide — the `↯` branch off the normal on-behalf flow.
 *
 * This is the hardest journey in the product and the one most likely to send
 * someone to Google. Every step carries its own "Don't have this? ›" answer,
 * so a missing document is a detour rather than a dead end.
 */
export default function DeceasedEstatePage() {
  const router = useRouter()
  const { t } = useLanguage()
  const { updateWizard } = useClaim()
  const [helpFor, setHelpFor] = useState<string | null>(null)

  const steps: TimelineStep[] = ESTATE_STEPS.map((step) => ({
    label: step.label,
    body: step.body,
    state: 'todo',
    action: {
      label: t('estate.missing'),
      onClick: () => setHelpFor(step.id),
    },
  }))

  const helpStep = ESTATE_STEPS.find((s) => s.id === helpFor)

  return (
    <AppShell title={t('estate.title')}>
      <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
        {t('estate.sub')}
      </p>

      <div className="mt-7">
        <Timeline steps={steps} numbered />
      </div>

      <div className="mt-7 flex items-start gap-3 rounded-2xl bg-gold-soft p-4">
        <Info className="mt-0.5 size-4 shrink-0 text-accent-foreground" />
        <p className="text-sm leading-relaxed text-accent-foreground text-pretty">
          {t('estate.note')}
        </p>
      </div>

      <AppButton
        size="block"
        className="mt-7"
        onClick={() => {
          updateWizard({ mode: 'deceased', furthestStep: 1 })
          router.push('/claim/wizard/step-1')
        }}
      >
        {t('estate.cta')}
        <ArrowRight className="size-5" />
      </AppButton>

      {/* Per-step help sheet */}
      <AnimatePresence>
        {helpStep && (
          <PhoneOverlay>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setHelpFor(null)}
              className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-card p-5 pb-8 shadow-2xl"
              role="dialog"
              aria-label={t('estate.help.title')}
            >
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    {t('estate.help.title')}
                  </p>
                  <h2 className="mt-1 font-display text-lg font-bold text-balance">
                    {helpStep.label}
                  </h2>
                </div>
                <button
                  onClick={() => setHelpFor(null)}
                  aria-label={t('common.close')}
                  className="flex size-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-foreground/5"
                >
                  <X className="size-5" />
                </button>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground text-pretty">
                {t(`estate.help.${helpStep.id}`)}
              </p>
              <AppButton
                variant="outline"
                size="block"
                className="mt-5"
                onClick={() => setHelpFor(null)}
              >
                {t('common.done')}
              </AppButton>
            </motion.div>
          </PhoneOverlay>
        )}
      </AnimatePresence>
    </AppShell>
  )
}
