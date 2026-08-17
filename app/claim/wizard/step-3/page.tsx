'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { Check, Zap, HelpCircle } from 'lucide-react'
import { StepWrapper } from '@/components/wizard/step-wrapper'
import { useClaim } from '@/context/claim-context'
import { useLanguage } from '@/context/language-context'
import { getDocument, VAULT_DOC_IDS } from '@/lib/mock-data'
import { useRequiredDocs } from '@/lib/use-required-docs'
import { cn } from '@/lib/utils'

/**
 * S-11b · Document Checklist — Step 3 of 6.
 *
 * This screen exists because 27.8% of survey respondents were blocked by
 * "confusing instructions" and the journey map's DECIDE stage records "no
 * upfront document checklist". Telling people what to gather *before* they
 * start is the cheapest fix for mid-flow abandonment.
 */
export default function WizardStep3() {
  const router = useRouter()
  const { t } = useLanguage()
  const { activeClaim, wizard, updateWizard } = useClaim()
  const requiredDocs = useRequiredDocs()

  useEffect(() => {
    if (!activeClaim) router.replace('/home')
  }, [activeClaim, router])

  if (!activeClaim) return null

  const ticked = wizard.checklist
  const allTicked = requiredDocs.every((d) => ticked.includes(d))

  // Documents already in the vault will auto-fill at the upload step.
  const vaultCount = requiredDocs.filter((id) => VAULT_DOC_IDS.includes(id)).length

  function toggle(id: string) {
    updateWizard({
      checklist: ticked.includes(id)
        ? ticked.filter((d) => d !== id)
        : [...ticked, id],
    })
  }

  return (
    <StepWrapper
      title={t('wiz.s3.title')}
      subtitle={t('wiz.s3.sub')}
      disabled={!allTicked}
      disabledHint={t('wiz.s3.gate')}
      continueLabel={t('wiz.s3.ready')}
      onContinue={() => {
        updateWizard({ furthestStep: 4 })
        router.push('/claim/wizard/step-4')
      }}
    >
      <ul className="flex flex-col gap-2.5">
        {requiredDocs.map((id) => {
          const doc = getDocument(id)
          if (!doc) return null
          const checked = ticked.includes(id)
          return (
            <li key={id}>
              <button
                onClick={() => toggle(id)}
                role="checkbox"
                aria-checked={checked}
                data-tap
                className={cn(
                  'flex w-full items-start gap-3 rounded-2xl border-2 p-3.5 text-left transition-colors',
                  checked
                    ? 'border-pine bg-pine-soft/40'
                    : 'border-border bg-card hover:border-pine/40',
                )}
              >
                <span
                  className={cn(
                    'mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-lg border-2 transition-colors',
                    checked
                      ? 'border-pine bg-pine text-pine-foreground'
                      : 'border-border',
                  )}
                >
                  {checked && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 520, damping: 22 }}
                    >
                      <Check className="size-4" strokeWidth={3} />
                    </motion.span>
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold leading-snug">
                    {t(doc.labelKey)}
                  </span>
                  <span className="mt-0.5 block text-sm leading-snug text-muted-foreground text-pretty">
                    {t(doc.hintKey)}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      {/* "Don't have this?" — the deck's inline escape hatch, so a missing
          document sends you to help instead of out of the app entirely. */}
      <button
        onClick={() => router.push('/settings/help')}
        className="mt-4 inline-flex items-center gap-1.5 self-start text-sm font-bold text-pine underline underline-offset-2"
      >
        <HelpCircle className="size-4" />
        {t('wiz.s3.missing')}
      </button>

      {vaultCount > 0 && (
        <div className="mt-5 flex items-start gap-3 rounded-2xl bg-gold-soft p-4">
          <Zap className="mt-0.5 size-4 shrink-0 text-accent-foreground" />
          <p className="text-sm font-semibold leading-snug text-accent-foreground text-pretty">
            {t('wiz.s3.autofill')}
          </p>
        </div>
      )}
    </StepWrapper>
  )
}
