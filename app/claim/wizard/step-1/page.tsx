'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Landmark } from 'lucide-react'
import { StepWrapper, WizardFooter } from '@/components/wizard/step-wrapper'
import { AppButton } from '@/components/ui/app-button'
import { Field } from '@/components/wizard/field'
import { useLanguage } from '@/context/language-context'
import { useClaim } from '@/context/claim-context'
import { cn } from '@/lib/utils'

export default function Step1() {
  const router = useRouter()
  const { t } = useLanguage()
  const { activeClaim, wizard, updateWizard, editFromReview, setEditFromReview } = useClaim()
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    if (!activeClaim) router.replace('/home')
  }, [activeClaim, router])

  function onContinue() {
    if (editFromReview) {
      setEditFromReview(false)
      router.push('/claim/wizard/step-4')
    } else {
      router.push('/claim/wizard/step-2')
    }
  }

  return (
    <StepWrapper title={t('wiz.s1.title')} subtitle={t('wiz.s1.sub')}>
      <div className="flex flex-col gap-4">
        <Field
          label={t('wiz.s1.name')}
          value={wizard.name}
          onChange={(v) => updateWizard({ name: v })}
        />
        <Field label={t('wiz.s1.ic')} value={wizard.ic} mono readOnly />
        <Field
          label={t('wiz.s1.phone')}
          value={wizard.phone}
          onChange={(v) => updateWizard({ phone: v })}
        />
        <Field
          label={t('wiz.s1.email')}
          type="email"
          value={wizard.email}
          onChange={(v) => updateWizard({ email: v })}
        />

        {/* Bank account for payout */}
        <div className="flex flex-col gap-1.5">
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <Landmark className="size-3.5" />
            {t('wiz.s1.bank')}
          </span>
          <div className="flex items-center gap-3 rounded-2xl border-2 border-border bg-background px-4 focus-within:border-pine transition-colors">
            <input
              value={wizard.bankAccount}
              onChange={(e) => updateWizard({ bankAccount: e.target.value })}
              placeholder="Bank name · Account number"
              className="h-12 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground/50"
            />
          </div>
        </div>

        <button
          onClick={() => setConfirmed((c) => !c)}
          className="mt-2 flex items-start gap-3 rounded-2xl bg-card p-4 text-left ring-1 ring-border"
        >
          <span
            className={cn(
              'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors',
              confirmed ? 'border-pine bg-pine text-pine-foreground' : 'border-border',
            )}
          >
            {confirmed && <Check className="size-3.5" strokeWidth={3} />}
          </span>
          <span className="text-sm font-medium text-foreground">
            {t('wiz.s1.confirm')}
          </span>
        </button>
      </div>

      <WizardFooter>
        <AppButton
          variant="primary"
          size="block"
          disabled={!confirmed}
          onClick={onContinue}
        >
          {editFromReview ? 'Save & return to review' : t('wiz.next')}
        </AppButton>
      </WizardFooter>
    </StepWrapper>
  )
}
