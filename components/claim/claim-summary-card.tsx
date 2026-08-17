'use client'

import { ClaimTypeIcon } from '@/components/common/claim-type-icon'
import { Amount } from '@/components/common/amount'
import type { Claim } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

/**
 * The "which claim am I in?" card. Repeated at the top of the wizard steps and
 * the review screen so users never lose track of what they're filling in —
 * recognition over recall.
 */
export function ClaimSummaryCard({
  claim,
  className,
}: {
  claim: Claim
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5',
        className,
      )}
    >
      <ClaimTypeIcon type={claim.type} className="size-5 shrink-0" />
      <span className="min-w-0 flex-1">
        <span className="block truncate font-semibold leading-snug">
          {claim.typeLabel}
        </span>
        <span className="block truncate text-sm text-muted-foreground">
          {claim.institution} · {claim.year}
        </span>
      </span>
      <Amount value={claim.amount} size="sm" tone="pine" />
    </div>
  )
}
