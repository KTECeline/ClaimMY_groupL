'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { ArrowRight, Bell, Check, Info, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { MobileContainer } from '@/components/layout/mobile-container'
import { TopBar } from '@/components/layout/top-bar'
import { BottomNav } from '@/components/layout/bottom-nav'
import { HelpFab } from '@/components/layout/help-fab'
import {
  SectionGroup,
  SectionValueRow,
} from '@/components/common/section-group'
import { AppButton } from '@/components/ui/app-button'
import { useClaim } from '@/context/claim-context'
import { useSettings } from '@/context/settings-context'
import { useLanguage } from '@/context/language-context'
import { useRequiredDocs } from '@/lib/use-required-docs'
import { formatRM, cn } from '@/lib/utils'

function genRef() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const block = Array.from(
    { length: 4 },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join('')
  return `CLM-${block}-2026`
}

/** S-15 · Review & Submit */
export default function ReviewPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const {
    activeClaim,
    wizard,
    updateWizard,
    setLastRef,
    addSubmittedClaim,
    setEditFromReview,
  } = useClaim()
  const { family } = useSettings()
  const requiredDocs = useRequiredDocs()
  const [submitting, setSubmitting] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!activeClaim) router.replace('/home')
  }, [activeClaim, router])

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  if (!activeClaim) return null

  const target = family.find((m) => m.id === wizard.familyTargetId)
  const uploaded = requiredDocs.filter((d) => wizard.docs[d] === 'done').length

  function editAt(step: number) {
    setEditFromReview(true)
    router.push(`/claim/wizard/step-${step}`)
  }

  function submit() {
    if (!wizard.agreed || !activeClaim) return
    setSubmitting(true)
    const ref = genRef()
    setLastRef(ref)
    addSubmittedClaim({
      id: `sub-${Date.now()}`,
      ref,
      type: activeClaim.typeLabel,
      claimType: activeClaim.type,
      institution: activeClaim.institution,
      institutionSlug: activeClaim.institutionSlug,
      amount: activeClaim.amount,
      submittedOn: new Date().toLocaleDateString('en-MY', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      stage: 0,
      status: 'active',
    })
    timer.current = setTimeout(() => router.push('/claim/success'), 1400)
  }

  return (
    <MobileContainer>
      <TopBar
        title={t('review.title')}
        right={
          <Link
            href="/notifications"
            aria-label={t('alerts.title')}
            className="flex size-10 items-center justify-center rounded-full transition-colors hover:bg-foreground/5"
          >
            <Bell className="size-5" />
          </Link>
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 overflow-y-auto no-scrollbar px-5 pb-6"
      >
        <p className="mb-5 text-sm leading-relaxed text-muted-foreground text-pretty">
          {t('review.sub')}
        </p>

        <SectionGroup label={t('review.group.claim')}>
          <SectionValueRow
            label={t('review.institution')}
            value={activeClaim.institution}
          />
          <SectionValueRow
            label={t('review.type')}
            value={activeClaim.typeLabel}
          />
          <SectionValueRow
            label={t('review.amount')}
            value={
              <span className="tabular font-display text-lg font-bold text-pine">
                {formatRM(activeClaim.amount)}
              </span>
            }
          />
          <SectionValueRow
            label={t('review.reference')}
            value={activeClaim.id}
            mono
          />
          <SectionValueRow
            label={t('review.docs')}
            value={t('review.docs.count', { n: uploaded })}
            onEdit={() => editAt(4)}
            editLabel={t('common.edit')}
          />
        </SectionGroup>

        <SectionGroup label={t('review.group.you')}>
          <SectionValueRow
            label={t('review.name')}
            value={target ? `${wizard.name} → ${target.name}` : wizard.name}
            onEdit={() => editAt(5)}
            editLabel={t('common.edit')}
          />
          <SectionValueRow label={t('review.ic')} value={wizard.ic} mono />
          <SectionValueRow
            label={t('review.phone')}
            value={wizard.phone}
            mono
            onEdit={() => editAt(5)}
            editLabel={t('common.edit')}
          />
          <SectionValueRow label={t('review.address')} value={wizard.address} />
        </SectionGroup>

        <SectionGroup label={t('review.group.payment')}>
          <SectionValueRow
            label={t('review.bank')}
            value={wizard.bankName}
            onEdit={() => editAt(6)}
            editLabel={t('common.edit')}
          />
          <SectionValueRow
            label={t('review.account')}
            value={wizard.bankAccount}
            mono
          />
        </SectionGroup>

        {/* Consent */}
        <button
          onClick={() => updateWizard({ agreed: !wizard.agreed })}
          role="checkbox"
          aria-checked={wizard.agreed}
          data-tap
          className="flex items-start gap-3 text-left"
        >
          <span
            className={cn(
              'mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-lg border-2 transition-colors',
              wizard.agreed
                ? 'border-pine bg-pine text-pine-foreground'
                : 'border-border',
            )}
          >
            {wizard.agreed && <Check className="size-4" strokeWidth={3} />}
          </span>
          <span className="text-sm leading-relaxed text-pretty">
            {t('review.consent')}
          </span>
        </button>

        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
          <Info className="mt-0.5 size-4 shrink-0 text-pine" />
          <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
            {t('review.note')}
          </p>
        </div>

        <div className="mt-6">
          {!wizard.agreed && (
            <p className="mb-2 text-center text-xs font-semibold text-muted-foreground">
              {t('review.gate')}
            </p>
          )}
          <AppButton
            variant="gold"
            size="block"
            onClick={submit}
            disabled={!wizard.agreed || submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                {t('review.submitting')}
              </>
            ) : (
              <>
                {t('review.submit')}
                <ArrowRight className="size-5" />
              </>
            )}
          </AppButton>
        </div>
      </motion.div>

      <HelpFab />
      <BottomNav />
    </MobileContainer>
  )
}
