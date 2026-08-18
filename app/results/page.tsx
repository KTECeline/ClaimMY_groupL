'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import {
  SearchX,
  Bell,
  RotateCcw,
  PartyPopper,
  ShieldCheck,
  Layers,
} from 'lucide-react'
import { MobileContainer } from '@/components/layout/mobile-container'
import { TopBar } from '@/components/layout/top-bar'
import { BottomNav } from '@/components/layout/bottom-nav'
import { HelpFab } from '@/components/layout/help-fab'
import { ResultCard } from '@/components/search/result-card'
import { Amount } from '@/components/common/amount'
import { AppButton } from '@/components/ui/app-button'
import { EmptyState } from '@/components/common/empty-state'
import { FilterChips } from '@/components/common/filter-chips'
import { CollapsibleGroup } from '@/components/common/collapsible-group'
import { useLanguage } from '@/context/language-context'
import { useClaim } from '@/context/claim-context'
import type { Claim } from '@/lib/mock-data'

type SortKey = 'amount' | 'year' | 'institution'
type StatusFilter = 'claimable' | 'all'

/**
 * S-06 · Search Results.
 *
 * Group 8 · Simplicity asks for institution groups collapsed by default —
 * "totals first, tap to expand". Five records across five institutions is a
 * wall of text otherwise, which is the exact eGUMIS complaint the project
 * exists to fix. Sorting by Institution switches to the grouped view; sorting
 * by Amount or Year shows a flat list, because grouping would fight the sort.
 */
export default function ResultsPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const { searchedIC, results, verifiedSearch } = useClaim()
  const [sort, setSort] = useState<SortKey>('institution')
  // Claimable-first: the money you can actually act on is the point of this
  // screen, so records already in progress or paid out start out of the way
  // rather than mixed in with equal weight.
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('claimable')

  useEffect(() => {
    if (!searchedIC) router.replace('/home')
  }, [searchedIC, router])

  const claimableCount = results.filter((c) => c.status === 'claimable').length

  const filtered = useMemo(
    () =>
      statusFilter === 'claimable'
        ? results.filter((c) => c.status === 'claimable')
        : results,
    [results, statusFilter],
  )

  const total = filtered.reduce((s, c) => s + c.amount, 0)
  const institutionCount = new Set(filtered.map((c) => c.institution)).size

  const sorted = useMemo(() => {
    const list = [...filtered]
    if (sort === 'amount') return list.sort((a, b) => b.amount - a.amount)
    if (sort === 'year') return list.sort((a, b) => b.year - a.year)
    return list.sort((a, b) => a.institution.localeCompare(b.institution))
  }, [filtered, sort])

  const grouped = useMemo(() => {
    const map = new Map<string, Claim[]>()
    sorted.forEach((claim) => {
      const list = map.get(claim.institution) ?? []
      list.push(claim)
      map.set(claim.institution, list)
    })
    return [...map.entries()]
  }, [sorted])

  if (results.length === 0) {
    return (
      <MobileContainer>
        <TopBar title={t('results.title')} />
        <EmptyState
          icon={<SearchX className="size-9" />}
          title={t('results.empty.title')}
          body={t('results.empty.body')}
          action={
            <AppButton size="block" onClick={() => router.push('/notifications')}>
              <Bell className="size-5" />
              {t('results.empty.alerts')}
            </AppButton>
          }
          secondaryAction={
            <AppButton
              variant="outline"
              size="block"
              onClick={() => router.push('/home')}
            >
              <RotateCcw className="size-5" />
              {t('results.empty.retry')}
            </AppButton>
          }
        />
        <HelpFab />
        <BottomNav />
      </MobileContainer>
    )
  }

  return (
    <MobileContainer>
      <TopBar title={t('results.title')} />

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-28">
        {/* Hero total */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="ticket-notch relative mt-2 overflow-hidden rounded-3xl bg-pine p-6 text-pine-foreground"
        >
          <div className="relative flex items-center gap-2 text-sm font-semibold text-gold-bright">
            <PartyPopper className="size-4" />
            {t('results.found')}
          </div>
          <p className="relative mt-3 text-xs font-medium uppercase tracking-wide text-pine-foreground/60">
            {t('results.total')}
          </p>
          <div className="relative mt-1">
            <Amount value={total} size="xl" tone="paper" />
          </div>
          <p className="relative mt-3 text-sm text-pine-foreground/70">
            {t('results.summary', {
              n: filtered.length,
              i: institutionCount,
            })}
          </p>

          {/* The payoff of the MyDigital ID mock — confirms this was pulled
              via the linked government login, not typed in manually. */}
          {verifiedSearch && (
            <div className="relative mt-3 inline-flex items-center gap-1.5 rounded-full bg-pine-foreground/12 px-3 py-1.5 text-xs font-bold text-gold-bright">
              <ShieldCheck className="size-3.5" />
              {t('mydigital.results.badge')}
            </div>
          )}
        </motion.div>

        {/* Filters — one grouped toolbar instead of stray floating rows */}
        {(claimableCount < results.length || filtered.length > 0) && (
          <div className="mt-5 flex flex-col gap-3">
            {claimableCount < results.length && (
              <FilterChips
                label={t('results.filter.label')}
                chips={[
                  {
                    value: 'claimable',
                    label: `${t('results.claimable')} (${claimableCount})`,
                  },
                  {
                    value: 'all',
                    label: `${t('results.filter.all')} (${results.length})`,
                  },
                ]}
                value={statusFilter}
                onChange={setStatusFilter}
                layoutId="resultsStatus"
              />
            )}

            {filtered.length > 0 && (
              <FilterChips
                label={t('results.sort')}
                chips={[
                  { value: 'amount', label: t('results.sort.amount') },
                  { value: 'year', label: t('results.sort.year') },
                  { value: 'institution', label: t('results.sort.institution') },
                ]}
                value={sort}
                onChange={setSort}
                layoutId="resultsSort"
              />
            )}
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="mt-5 flex flex-col items-center rounded-3xl border border-dashed border-border p-6 text-center">
            <Layers className="size-7 text-muted-foreground" />
            <p className="mt-3 font-display font-bold">
              {t('results.filter.empty.title')}
            </p>
            <p className="mt-1 text-sm text-muted-foreground text-pretty">
              {t('results.filter.empty.body', { n: results.length })}
            </p>
            <AppButton
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => setStatusFilter('all')}
            >
              {t('results.filter.empty.showAll')}
            </AppButton>
          </div>
        ) : (
          <>
            {sort === 'institution' ? (
              <div className="mt-4 flex flex-col gap-3">
                {grouped.map(([institution, claims], i) => (
                  <motion.div
                    key={institution}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 * i }}
                  >
                    <CollapsibleGroup
                      title={institution}
                      countLabel={
                        claims.length === 1
                          ? t('common.record.one')
                          : t('common.records', { n: claims.length })
                      }
                      total={claims.reduce((s, c) => s + c.amount, 0)}
                      // The single biggest group opens first, so the screen is
                      // never entirely closed doors.
                      defaultOpen={i === 0}
                    >
                      <div className="flex flex-col gap-2.5">
                        {claims.map((claim, j) => (
                          <ResultCard key={claim.id} claim={claim} index={j} />
                        ))}
                      </div>
                    </CollapsibleGroup>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="mt-4 flex flex-col gap-3">
                {sorted.map((claim, i) => (
                  <ResultCard key={claim.id} claim={claim} index={i} />
                ))}
              </div>
            )}
          </>
        )}

        <AppButton
          variant="ghost"
          size="block"
          className="mt-5"
          onClick={() => router.push('/home')}
        >
          <RotateCcw className="size-4" />
          {t('results.searchAgain')}
        </AppButton>
      </div>

      <HelpFab />
      <BottomNav />
    </MobileContainer>
  )
}
