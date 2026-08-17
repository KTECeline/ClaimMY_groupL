'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { ChevronRight, BadgeCheck } from 'lucide-react'
import { ClaimTypeIcon } from '@/components/common/claim-type-icon'
import { Amount } from '@/components/common/amount'
import { useLanguage } from '@/context/language-context'
import type { Claim } from '@/lib/mock-data'

/**
 * Self-animating rather than variant-driven: this card now renders both in a
 * flat sorted list and inside a collapsed institution group, and inherited
 * variants only work when a parent is orchestrating them.
 */
export function ResultCard({
  claim,
  index = 0,
}: {
  claim: Claim
  index?: number
}) {
  const { t } = useLanguage()
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
      <Link
        href={`/claim/${claim.id}`}
        className="block rounded-3xl bg-card p-4 ring-1 ring-border transition-colors hover:ring-pine/40"
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
            <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-pine-soft px-2 py-0.5 text-[0.65rem] font-semibold text-pine">
              <BadgeCheck className="size-3" />
              {t('claim.verified')}
            </span>
          </div>
          <ChevronRight className="mt-1 size-5 shrink-0 text-muted-foreground" />
        </div>
        <div className="mt-3 flex items-end justify-between border-t border-dashed border-border pt-3">
          <Amount value={claim.amount} size="md" tone="pine" />
          <span className="text-sm font-semibold text-gold">
            {t('results.viewClaim')}
          </span>
        </div>
      </Link>
    </motion.div>
  )
}
