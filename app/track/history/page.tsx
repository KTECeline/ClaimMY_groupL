'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { ChevronRight, Download, FolderOpen } from 'lucide-react'
import { AppShell } from '@/components/layout/app-shell'
import { Amount } from '@/components/common/amount'
import { EmptyState } from '@/components/common/empty-state'
import { FilterChips } from '@/components/common/filter-chips'
import { ListSkeleton } from '@/components/common/list-skeleton'
import { StatusBadge } from '@/components/common/status-badge'
import { useLanguage } from '@/context/language-context'
import { useClaim } from '@/context/claim-context'
import { useToast } from '@/context/toast-context'
import { TRACKED_CLAIMS } from '@/lib/mock-data'

type Filter = 'all' | 'active' | 'done' | 'rejected'

/** S-26 · Claims History */
export default function ClaimsHistoryPage() {
  const { t } = useLanguage()
  const { show } = useToast()
  const { submittedClaims } = useClaim()
  const [filter, setFilter] = useState<Filter>('all')
  const [loading, setLoading] = useState(true)

  // Group 8 · Fidelity — skeletons on every list screen, not just Home search.
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 550)
    return () => clearTimeout(timer)
  }, [])

  const all = useMemo(
    () => [...submittedClaims, ...TRACKED_CLAIMS],
    [submittedClaims],
  )

  const visible = useMemo(
    () => (filter === 'all' ? all : all.filter((c) => c.status === filter)),
    [all, filter],
  )

  return (
    <AppShell
      title={t('hist.title')}
      fab={false}
      bodyClassName="overflow-y-auto no-scrollbar"
    >
      <FilterChips
        chips={[
          { value: 'all', label: t('hist.all') },
          { value: 'active', label: t('hist.progress') },
          { value: 'done', label: t('hist.completed') },
          { value: 'rejected', label: t('hist.rejected') },
        ]}
        value={filter}
        onChange={setFilter}
        layoutId="historyFilter"
      />

      <div className="mt-4">
        {loading ? (
          <ListSkeleton rows={3} avatar={false} />
        ) : visible.length === 0 ? (
          <EmptyState
            icon={<FolderOpen className="size-9" />}
            title={t('hist.empty.title')}
            body={t('hist.empty.body')}
          />
        ) : (
          <ul className="overflow-hidden rounded-2xl border border-border bg-card divide-y divide-border">
            {visible.map((claim, i) => {
              const rejected = claim.status === 'rejected'
              const done = claim.status === 'done'
              return (
                <motion.li
                  key={claim.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="px-4 py-3.5"
                >
                  <div className="flex items-start gap-3">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold leading-snug">
                        {claim.type}
                      </span>
                      <span className="block truncate text-sm text-muted-foreground">
                        {claim.institution} · {claim.submittedOn}
                      </span>
                    </span>
                    <Amount value={claim.amount} size="sm" />
                  </div>

                  <div className="mt-3 flex items-center gap-3">
                    <StatusBadge
                      tone={rejected ? 'rejected' : done ? 'done' : 'progress'}
                    >
                      {rejected
                        ? t('hist.rejected')
                        : done
                          ? t('hist.completed')
                          : t('hist.progress')}
                    </StatusBadge>

                    {rejected ? (
                      <Link
                        href={`/claim/${claim.id}/rejected`}
                        data-tap
                        className="ml-auto flex items-center gap-1 rounded-xl border-2 border-clay/30 px-3 py-1.5 text-sm font-bold text-clay"
                      >
                        {t('hist.fix')}
                        <ChevronRight className="size-4" />
                      </Link>
                    ) : (
                      <Link
                        href={`/track/${claim.id}`}
                        className="ml-auto flex items-center gap-1 text-sm font-bold text-pine underline underline-offset-2"
                      >
                        {t('common.view')}
                        <ChevronRight className="size-4" />
                      </Link>
                    )}
                  </div>
                </motion.li>
              )
            })}
          </ul>
        )}
      </div>

      {/* Group 8 · Efficiency — bulk export */}
      <button
        onClick={() => show({ message: t('hist.exported') })}
        data-tap
        className="mt-5 flex w-full items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5 text-left transition-colors hover:bg-pine-soft/30"
      >
        <Download className="size-5 shrink-0 text-pine" />
        <span className="flex-1 text-sm font-semibold">{t('hist.export')}</span>
        <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
      </button>
    </AppShell>
  )
}
