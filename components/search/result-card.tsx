'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { ChevronRight, BadgeCheck, Clock, CheckCircle2 } from 'lucide-react'
import { ClaimTypeIcon } from '@/components/common/claim-type-icon'
import { StatusBadge } from '@/components/common/status-badge'
import { Amount } from '@/components/common/amount'
import { useLanguage } from '@/context/language-context'
import { cn } from '@/lib/utils'
import type { Claim } from '@/lib/mock-data'

/**
 * Self-animating rather than variant-driven: this card now renders both in a
 * flat sorted list and inside a collapsed institution group, and inherited
 * variants only work when a parent is orchestrating them.
 *
 * Status-aware: a 'claimable' record is the only one you can actually start
 * a claim on, so it's the only one that opens the claim flow. 'processing'
 * and 'paid' records are shown for context (so the total makes sense) but
 * read as settled, not actionable.
 */
export function ResultCard({
  claim,
  index = 0,
}: {
  claim: Claim
  index?: number
}) {
  const { t } = useLanguage()
  const claimable = claim.status === 'claimable'

  const badge = claimable ? (
    <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-pine-soft px-2 py-0.5 text-[0.65rem] font-semibold text-pine">
      <BadgeCheck className="size-3" />
      {t('claim.verified')}
    </span>
  ) : claim.status === 'processing' ? (
    <StatusBadge tone="progress" className="mt-1.5" dot>
      {t('results.status.processing')}
    </StatusBadge>
  ) : (
    <StatusBadge tone="neutral" className="mt-1.5" dot>
      {t('results.status.paid')}
    </StatusBadge>
  )

  const content = (
    <div
      className={cn(
        'rounded-3xl bg-card p-4 ring-1 ring-border transition-colors',
        claimable && 'hover:ring-pine/40',
        !claimable && 'opacity-70',
      )}
    >
      <div className="flex items-start gap-3">
        <ClaimTypeIcon type={claim.type} className="mt-0.5 size-5 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-[0.95rem] font-bold text-foreground">
            {claim.typeLabel}
          </p>
          <p className="truncate text-sm text-muted-foreground">
            {claim.institution}
          </p>
          {badge}
        </div>
        {claimable ? (
          <ChevronRight className="mt-1 size-5 shrink-0 text-muted-foreground" />
        ) : claim.status === 'processing' ? (
          <Clock className="mt-1 size-5 shrink-0 text-muted-foreground" />
        ) : (
          <CheckCircle2 className="mt-1 size-5 shrink-0 text-muted-foreground" />
        )}
      </div>
      <div className="mt-3 flex items-end justify-between border-t border-dashed border-border pt-3">
        <Amount value={claim.amount} size="md" tone={claimable ? 'pine' : 'ink'} />
        {claimable ? (
          <span className="text-sm font-semibold text-gold">
            {t('results.viewClaim')}
          </span>
        ) : claim.status === 'processing' ? (
          <span className="text-sm font-semibold text-pine">
            {t('results.status.viewTrack')}
          </span>
        ) : (
          <span className="text-sm font-medium text-muted-foreground">
            {t('results.status.paidNote')}
          </span>
        )}
      </div>
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.32,
        delay: index * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {claimable ? (
        <Link href={`/claim/${claim.id}`} className="block">
          {content}
        </Link>
      ) : claim.status === 'processing' ? (
        <Link href="/track" className="block">
          {content}
        </Link>
      ) : (
        content
      )}
    </motion.div>
  )
}
