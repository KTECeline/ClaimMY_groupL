'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { Check, Clock, User, Users, Scroll } from 'lucide-react'
import { StepWrapper } from '@/components/wizard/step-wrapper'
import { ClaimSummaryCard } from '@/components/claim/claim-summary-card'
import { useClaim, type ClaimMode } from '@/context/claim-context'
import { useLanguage } from '@/context/language-context'
import { cn } from '@/lib/utils'

const MODES: { value: ClaimMode; icon: typeof User; labelKey: string; hintKey: string }[] = [
  { value: 'self', icon: User, labelKey: 'wiz.s1.self', hintKey: 'wiz.s1.self.hint' },
  { value: 'family', icon: Users, labelKey: 'wiz.s1.family', hintKey: 'wiz.s1.family.hint' },
  { value: 'deceased', icon: Scroll, labelKey: 'wiz.s1.estate', hintKey: 'wiz.s1.estate.hint' },
]

/** S-10 · Claim Overview — Step 1 of 6 */
export default function WizardStep1() {
  const router = useRouter()
  const { t } = useLanguage()
  const { activeClaim, wizard, updateWizard } = useClaim()

  useEffect(() => {
    if (!activeClaim) router.replace('/home')
  }, [activeClaim, router])

  useEffect(() => {
    updateWizard({ furthestStep: 1 })
    // Run once on mount — updateWizard is stable enough for a prototype and
    // re-running would fight the user's own edits.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!activeClaim) return null

  return (
    <StepWrapper
      title={t('wiz.s1.title')}
      subtitle={t('wiz.s1.sub')}
      onContinue={() => {
        updateWizard({ furthestStep: 2 })
        router.push('/claim/wizard/step-2')
      }}
    >
      <ClaimSummaryCard claim={activeClaim} className="mb-4" />

      <div className="mb-6 flex items-center gap-2.5 rounded-2xl bg-gold-soft px-4 py-3">
        <Clock className="size-4 shrink-0 text-accent-foreground" />
        <span className="text-sm font-semibold text-accent-foreground">
          {t('wiz.s1.time')}
        </span>
      </div>

      <div
        className="grid grid-cols-3 gap-2.5"
        role="radiogroup"
        aria-label={t('wiz.s1.title')}
      >
        {MODES.map(({ value, icon: Icon, labelKey, hintKey }) => {
          const active = wizard.mode === value
          return (
            <button
              key={value}
              role="radio"
              aria-checked={active}
              onClick={() => updateWizard({ mode: value, familyTargetId: null })}
              data-tap
              className={cn(
                'relative flex flex-col items-center gap-2 rounded-2xl border-2 px-2 py-4 text-center transition-colors',
                active
                  ? 'border-pine bg-pine-soft/50'
                  : 'border-border bg-card hover:border-pine/40',
              )}
            >
              {active && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                  className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-pine text-pine-foreground"
                >
                  <Check className="size-3.5" strokeWidth={3} />
                </motion.span>
              )}
              <Icon
                className={cn(
                  'size-7',
                  active ? 'text-pine' : 'text-muted-foreground',
                )}
                strokeWidth={2}
              />
              <span className="text-sm font-bold leading-tight">
                {t(labelKey)}
              </span>
              <span className="text-[0.68rem] leading-tight text-muted-foreground text-pretty">
                {t(hintKey)}
              </span>
            </button>
          )
        })}
      </div>
    </StepWrapper>
  )
}
