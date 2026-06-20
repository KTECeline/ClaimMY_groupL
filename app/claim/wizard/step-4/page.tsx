'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Loader2, Pencil } from 'lucide-react'
import { StepWrapper, WizardFooter } from '@/components/wizard/step-wrapper'
import { AppButton } from '@/components/ui/app-button'
import { Amount } from '@/components/common/amount'
import { useLanguage } from '@/context/language-context'
import { useClaim } from '@/context/claim-context'
import { cn } from '@/lib/utils'

function genRef() {
  const part = () => Math.random().toString(36).slice(2, 6).toUpperCase()
  return `CLM-${part()}-2026`
}

function Row({
  label,
  children,
  onEdit,
}: {
  label: string
  children: React.ReactNode
  onEdit?: () => void
}) {
  return (
    <div className="flex items-start justify-between gap-3 py-3">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <div className="mt-0.5 text-[0.95rem] font-medium text-foreground">{children}</div>
      </div>
      {onEdit && (
        <button onClick={onEdit} className="shrink-0 text-pine" aria-label="Edit">
          <Pencil className="size-4" />
        </button>
      )}
    </div>
  )
}

export default function Step4() {
  const router = useRouter()
  const { t } = useLanguage()
  const {
    activeClaim,
    wizard,
    setLastRef,
    addSubmittedClaim,
    setEditFromReview,
    resetWizard,
  } = useClaim()
  const [agree, setAgree] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!activeClaim) router.replace('/home')
  }, [activeClaim, router])

  if (!activeClaim) return null

  function goEdit(step: string) {
    setEditFromReview(true)
    router.push(`/claim/wizard/${step}`)
  }

  function submit() {
    setSubmitting(true)
    const ref = genRef()
    setLastRef(ref)

    // Add the newly submitted claim to the live tracker list
    const today = new Date()
    const dateLabel = today.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    addSubmittedClaim({
      id: ref,
      ref,
      type: activeClaim.typeLabel,
      institution: activeClaim.institution,
      amount: activeClaim.amount,
      submittedOn: dateLabel,
      stage: 0,
      status: 'active',
    })

    setTimeout(() => router.push('/claim/success'), 1600)
  }

  const modeLabel = t(`wiz.s2.${wizard.mode}`)

  return (
    <StepWrapper title={t('wiz.s4.title')} subtitle={t('wiz.s4.sub')}>
      <div className="divide-y divide-border rounded-2xl bg-card px-4 ring-1 ring-border">
        <Row label={t('wiz.s4.claimant')} onEdit={() => goEdit('step-1')}>
          <p>{wizard.name}</p>
          <p className="font-mono text-sm tabular-nums text-muted-foreground">{wizard.ic}</p>
        </Row>
        <Row label={t('wiz.s4.bank')} onEdit={() => goEdit('step-1')}>
          <p className="text-sm">{wizard.bankAccount}</p>
        </Row>
        <Row label={t('wiz.s4.claiming')} onEdit={() => goEdit('step-2')}>
          {modeLabel}
        </Row>
        <Row label={t('wiz.s4.docs')} onEdit={() => goEdit('step-3')}>
          {wizard.docsUploaded.length} {t('wiz.s4.docs').toLowerCase()}
        </Row>
        <Row label={t('wiz.s4.payout')}>
          <p>{activeClaim.institution}</p>
        </Row>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-2xl bg-pine px-5 py-4 text-pine-foreground">
        <span className="text-sm font-semibold opacity-90">{activeClaim.typeLabel}</span>
        <Amount value={activeClaim.amount} className="text-pine-foreground" size="md" />
      </div>

      <button
        onClick={() => setAgree((a) => !a)}
        className="mt-4 flex items-start gap-3 rounded-2xl bg-card p-4 text-left ring-1 ring-border"
      >
        <span
          className={cn(
            'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors',
            agree ? 'border-pine bg-pine text-pine-foreground' : 'border-border',
          )}
        >
          {agree && <Check className="size-3.5" strokeWidth={3} />}
        </span>
        <span className="text-sm font-medium text-foreground">{t('wiz.s4.agree')}</span>
      </button>

      <WizardFooter>
        <AppButton
          variant="gold"
          size="block"
          disabled={!agree || submitting}
          onClick={submit}
        >
          {submitting ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              {t('wiz.submit')}…
            </>
          ) : (
            t('wiz.submit')
          )}
        </AppButton>
      </WizardFooter>
    </StepWrapper>
  )
}
