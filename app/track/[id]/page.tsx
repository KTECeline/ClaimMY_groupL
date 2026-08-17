'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { FolderOpen, Phone, RotateCw } from 'lucide-react'
import { AppShell } from '@/components/layout/app-shell'
import { Timeline, type TimelineStep } from '@/components/common/timeline'
import { Amount } from '@/components/common/amount'
import { EmptyState } from '@/components/common/empty-state'
import { ClaimTypeIcon } from '@/components/common/claim-type-icon'
import { StatusBadge } from '@/components/common/status-badge'
import { AppButton } from '@/components/ui/app-button'
import { useLanguage } from '@/context/language-context'
import { useClaim } from '@/context/claim-context'
import { useToast } from '@/context/toast-context'
import { TRACKED_CLAIMS, getInstitution } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

/**
 * S-23 · Claim Status Timeline.
 *
 * The RETAIN stage of the journey map is a list of silences: "no estimated
 * processing time", "unclear status meanings", "no post-submission
 * communication". Each timeline step therefore says what is happening in plain
 * language, not just a status word.
 */
export default function ClaimStatusPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { t } = useLanguage()
  const { show } = useToast()
  const { submittedClaims, wizard } = useClaim()
  const [refreshing, setRefreshing] = useState(false)

  const claim = [...submittedClaims, ...TRACKED_CLAIMS].find((c) => c.id === id)

  useEffect(() => {
    if (!claim) router.replace('/track')
  }, [claim, router])

  if (!claim) {
    return (
      <AppShell title={t('status.title')}>
        <EmptyState
          icon={<FolderOpen className="size-9" />}
          title={t('track.empty.title')}
          body={t('track.empty.body')}
        />
      </AppShell>
    )
  }

  const institution = getInstitution(claim.institutionSlug)
  const rejected = claim.status === 'rejected'

  const labels = [
    t('status.submitted'),
    t('status.review'),
    t('status.approved'),
    t('status.paid'),
  ]
  const bodies = [
    t('status.submitted.body'),
    t('status.review.body', {
      institution: claim.institution,
      time: institution?.processingTime ?? '14–21 working days',
    }),
    t('status.approved.body'),
    t('status.paid.body', { bank: wizard.bankName }),
  ]

  const steps: TimelineStep[] = labels.map((label, i) => ({
    label,
    body: bodies[i],
    state: i < claim.stage ? 'done' : i === claim.stage ? 'active' : 'todo',
  }))

  function refresh() {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
      show({ message: t('status.refreshed') })
    }, 900)
  }

  return (
    <AppShell title={t('status.title')}>
      {/* Claim summary */}
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
        <ClaimTypeIcon type={claim.claimType} className="size-5 shrink-0" />
        <span className="min-w-0 flex-1">
          <span className="block truncate font-semibold leading-snug">
            {claim.type}
          </span>
          <span className="tabular block truncate font-mono text-sm text-muted-foreground">
            {claim.ref}
          </span>
        </span>
        <Amount value={claim.amount} size="sm" tone="pine" />
      </div>

      {rejected && (
        <button
          onClick={() => router.push(`/claim/${claim.id}/rejected`)}
          data-tap
          className="mt-3 flex w-full items-center gap-3 rounded-2xl border-2 border-clay/30 bg-clay-soft/40 p-4 text-left"
        >
          <StatusBadge tone="rejected" dot>
            {t('reject.badge')}
          </StatusBadge>
          <span className="flex-1 text-sm font-bold text-clay">
            {t('reject.cta')}
          </span>
        </button>
      )}

      <h2 className="mb-4 mt-7 font-display text-lg font-bold">
        {t('status.timeline')}
      </h2>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <Timeline steps={steps} />
      </motion.div>

      <button
        onClick={refresh}
        data-tap
        className="mt-6 flex w-full items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5 text-left"
      >
        <span className="flex-1 text-sm text-muted-foreground">
          {t('status.updated', { time: claim.submittedOn })}
        </span>
        <RotateCw
          className={cn(
            'size-4 shrink-0 text-pine',
            refreshing && 'animate-spin',
          )}
        />
      </button>

      <AppButton
        variant="outline"
        size="block"
        className="mt-4"
        onClick={() => router.push('/settings/help')}
      >
        <Phone className="size-4" />
        {t('status.contact')}
      </AppButton>
    </AppShell>
  )
}
