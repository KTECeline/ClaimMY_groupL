'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { ChevronRight, FolderOpen, History, Search } from 'lucide-react'
import { MobileContainer } from '@/components/layout/mobile-container'
import { BottomNav } from '@/components/layout/bottom-nav'
import { HelpFab } from '@/components/layout/help-fab'
import { TopBar } from '@/components/layout/top-bar'
import { Amount } from '@/components/common/amount'
import { EmptyState } from '@/components/common/empty-state'
import { StatusBadge } from '@/components/common/status-badge'
import { ProgressDots } from '@/components/common/timeline'
import { ClaimTypeIcon } from '@/components/common/claim-type-icon'
import { AppButton } from '@/components/ui/app-button'
import { useLanguage } from '@/context/language-context'
import { useClaim } from '@/context/claim-context'
import { TRACKED_CLAIMS, type TrackedClaim } from '@/lib/mock-data'

/**
 * My Claims Hub. Card sorting scattered "track progress", "view details" and
 * "claim history" across six categories with no clear winner — one user
 * invented a "My Claim" category for exactly these three. This tab is that
 * category.
 */
export default function TrackPage() {
  const { t } = useLanguage()
  const { submittedClaims } = useClaim()

  const all = [...submittedClaims, ...TRACKED_CLAIMS]
  const active = all.filter((c) => c.status === 'active')
  const past = all.filter((c) => c.status !== 'active')
  const claimable = active.reduce((s, c) => s + c.amount, 0)

  return (
    <MobileContainer>
      <TopBar
        title={t('track.hub.title')}
        back={false}
        right={
          <Link
            href="/track/history"
            aria-label={t('hist.title')}
            className="flex size-10 items-center justify-center rounded-full transition-colors hover:bg-foreground/5"
          >
            <History className="size-5" />
          </Link>
        }
      />

      <main className="flex-1 overflow-y-auto no-scrollbar px-5 pb-6">
        {all.length === 0 ? (
          <EmptyState
            icon={<FolderOpen className="size-9" />}
            title={t('track.empty.title')}
            body={t('track.empty.body')}
            action={
              <Link href="/home">
                <AppButton size="block">
                  <Search className="size-5" />
                  {t('track.empty.cta')}
                </AppButton>
              </Link>
            }
          />
        ) : (
          <>
            <div className="mt-1 rounded-2xl bg-card p-4 ring-1 ring-border">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t('track.total')}
              </p>
              <div className="mt-1.5">
                <Amount value={claimable} size="lg" tone="pine" />
              </div>
            </div>

            {active.length > 0 && (
              <Section label={t('track.group.active')}>
                {active.map((claim, i) => (
                  <ActiveClaimCard key={claim.id} claim={claim} index={i} />
                ))}
              </Section>
            )}

            {past.length > 0 && (
              <section className="mt-6">
                <h2 className="mb-2 px-1 text-[0.7rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">
                  {t('track.group.past')}
                </h2>
                {/* One container with divided rows, not N separate cards —
                    these are simpler records than Active and don't need
                    their own boxes to stay legible. */}
                <div className="overflow-hidden rounded-2xl border border-border bg-card divide-y divide-border">
                  {past.map((claim, i) => (
                    <PastClaimRow key={claim.id} claim={claim} index={i} />
                  ))}
                </div>
              </section>
            )}

            <Link
              href="/track/history"
              className="mt-4 flex items-center justify-center gap-1.5 text-sm font-bold text-pine underline underline-offset-2"
            >
              {t('track.history.link')}
              <ChevronRight className="size-4" />
            </Link>
          </>
        )}
      </main>

      <HelpFab />
      <BottomNav />
    </MobileContainer>
  )
}

function Section({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <section className="mt-6">
      <h2 className="mb-2 px-1 text-[0.7rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </h2>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  )
}

function ActiveClaimCard({
  claim,
  index,
}: {
  claim: TrackedClaim
  index: number
}) {
  const { t } = useLanguage()

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06 * index }}
    >
      <Link
        href={`/track/${claim.id}`}
        className="block rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-pine-soft/30"
      >
        <div className="flex items-center gap-3">
          <ClaimTypeIcon type={claim.claimType} className="size-5 shrink-0" />
          <span className="min-w-0 flex-1">
            <span className="block truncate font-semibold leading-snug">
              {claim.type}
            </span>
            <span className="block truncate text-sm text-muted-foreground">
              {claim.institution}
            </span>
          </span>
          <Amount value={claim.amount} size="sm" tone="pine" />
        </div>

        {/* At-a-glance progress, so opening the claim is optional */}
        <div className="mt-4">
          <ProgressDots
            total={4}
            current={claim.stage}
            labels={[
              t('status.submitted'),
              t('status.review'),
              t('status.approved'),
              t('status.paid'),
            ]}
          />
        </div>
      </Link>
    </motion.div>
  )
}

function PastClaimRow({
  claim,
  index,
}: {
  claim: TrackedClaim
  index: number
}) {
  const { t } = useLanguage()
  const rejected = claim.status === 'rejected'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06 * index }}
      className="flex items-center gap-3 px-4 py-3.5"
    >
      <span className="min-w-0 flex-1">
        <span className="block truncate font-semibold leading-snug">
          {claim.type}
        </span>
        <span className="block truncate text-sm text-muted-foreground">
          {claim.institution} · {claim.submittedOn}
        </span>
        <span className="mt-1.5 block">
          <StatusBadge tone={rejected ? 'rejected' : 'done'}>
            {rejected ? t('hist.rejected') : t('hist.completed')}
          </StatusBadge>
        </span>
      </span>

      {rejected ? (
        <Link
          href={`/claim/${claim.id}/rejected`}
          data-tap
          className="flex shrink-0 items-center gap-1 rounded-xl border-2 border-clay/30 px-3 py-2 text-sm font-bold text-clay"
        >
          {t('hist.fix')}
          <ChevronRight className="size-4" />
        </Link>
      ) : (
        <Link
          href={`/track/${claim.id}`}
          aria-label={t('common.view')}
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/5"
        >
          <ChevronRight className="size-5" />
        </Link>
      )}
    </motion.div>
  )
}
