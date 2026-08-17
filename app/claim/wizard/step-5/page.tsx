'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ScanLine } from 'lucide-react'
import { StepWrapper } from '@/components/wizard/step-wrapper'
import { Field } from '@/components/wizard/field'
import { useClaim } from '@/context/claim-context'
import { useLanguage } from '@/context/language-context'
import { formatIC, isValidIC } from '@/lib/utils'

/** S-13 · Form Fill — Step 5 of 6 */
export default function WizardStep5() {
  const router = useRouter()
  const { t } = useLanguage()
  const { wizard, updateWizard, editFromReview, setEditFromReview } = useClaim()
  const [touched, setTouched] = useState(false)

  const errors = {
    name: !wizard.name.trim(),
    ic: !isValidIC(wizard.ic),
    phone: wizard.phone.replace(/\D/g, '').length < 9,
    address: !wizard.address.trim(),
  }
  const hasErrors = Object.values(errors).some(Boolean)

  function next() {
    setTouched(true)
    if (hasErrors) return
    if (editFromReview) {
      setEditFromReview(false)
      router.push('/claim/review')
      return
    }
    updateWizard({ furthestStep: 6 })
    router.push('/claim/wizard/step-6')
  }

  return (
    <StepWrapper
      title={t('wiz.s5.title')}
      subtitle={t('wiz.s5.sub')}
      disabled={touched && hasErrors}
      disabledHint={t('wiz.s5.required')}
      onContinue={next}
      continueLabel={editFromReview ? t('common.save') : undefined}
    >
      {/* Where the data came from — recognition over recall */}
      <div className="mb-5 flex items-center gap-2.5 rounded-2xl bg-pine-soft px-4 py-3">
        <ScanLine className="size-4 shrink-0 text-pine" />
        <span className="text-sm font-semibold text-pine">
          {t('wiz.s5.prefilled')}
        </span>
      </div>

      <div className="flex flex-col gap-4">
        <Field
          label={t('wiz.s5.name')}
          value={wizard.name}
          onChange={(name) => updateWizard({ name })}
          error={touched && errors.name ? t('wiz.s5.required') : undefined}
        />
        <Field
          label={t('wiz.s5.ic')}
          value={wizard.ic}
          mono
          inputMode="numeric"
          onChange={(ic) => updateWizard({ ic: formatIC(ic) })}
          error={touched && errors.ic ? t('verify.invalid') : undefined}
        />
        <Field
          label={t('wiz.s5.phone')}
          value={wizard.phone}
          mono
          inputMode="tel"
          onChange={(phone) => updateWizard({ phone })}
          error={touched && errors.phone ? t('wiz.s5.required') : undefined}
        />
        <Field
          label={t('wiz.s5.address')}
          value={wizard.address}
          multiline
          onChange={(address) => updateWizard({ address })}
          error={touched && errors.address ? t('wiz.s5.required') : undefined}
        />
        <Field
          label={t('wiz.s5.email')}
          value={wizard.email}
          type="email"
          inputMode="email"
          optional
          optionalLabel={t('common.optional')}
          hint={t('wiz.s5.email.hint')}
          onChange={(email) => updateWizard({ email })}
        />
      </div>
    </StepWrapper>
  )
}
