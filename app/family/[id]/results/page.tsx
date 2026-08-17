'use client'

import { use, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { ArrowRight, Eye, SearchX } from 'lucide-react'
import { AppShell } from '@/components/layout/app-shell'
import { Amount } from '@/components/common/amount'
import { EmptyState } from '@/components/common/empty-state'
import { ClaimTypeIcon } from '@/components/common/claim-type-icon'
import { AppButton } from '@/components/ui/app-button'
import { useLanguage } from '@/context/language-context'
import { useSettings } from '@/context/settings-context'
import { useClaim } from '@/context/claim-context'
import { FAMILY_CLAIMS } from '@/lib/mock-data'

/** S-19 · Family Results */
export default function FamilyResultsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { t } = useLanguage()
  const { family } = useSettings()
  const { setActiveClaim, resetWizard, updateWizard } = useClaim()

  const member = family.find((m) => m.id === id)

  useEffect(() => {
    if (!member) router.replace('/family')
  }, [member, router])

  if (!member) return null

  const claims = FAMILY_CLAIMS[member.ic.replace(/\D/g, '')] ?? []
  const firstName = member.name.split(' ')[0]

  function claimFor(claimId: string) {
    const claim = claims.find((c) => c.id === claimId)
    if (!claim || !member) return
    setActiveClaim(claim)
    resetWizard()
    updateWizard({ mode: 'family', familyTargetId: member.id })
    router.push(`/family/${member.id}/claim`)
  }

  return (
    <AppShell title={t('family.results.title')}>
      {/* Whose claims am I looking at — stated, not implied */}
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3">
        <Eye className="size-4 shrink-0 text-pine" />
        <span className="min-w-0 flex-1 truncate text-sm font-semibold">
          {t('family.results.viewing', { name: firstName })}
        </span>
        <span
          className="flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-pine-foreground"
          style={{ background: member.avatarColor }}
        >
          {member.initials}
        </span>
      </div>

      {claims.length === 0 ? (
        <EmptyState
          icon={<SearchX className="size-9" />}
          title={t('family.results.empty.title')}
          body={t('family.results.empty.body')}
          action={
            <AppButton
              variant="outline"
              size="block"
              onClick={() => router.push('/family')}
            >
              {t('family.hub.title')}
            </AppButton>
          }
        />
      ) : (
        <ul className="mt-4 flex flex-col gap-3">
          {claims.map((claim, i) => (
            <motion.li
              key={claim.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
              className="rounded-2xl border border-border bg-card p-4"
            >
              <div className="flex items-center gap-3">
                <ClaimTypeIcon type={claim.type} className="size-5 shrink-0" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold leading-snug">
                    {claim.typeLabel}
                  </span>
                  <span className="block truncate text-sm text-muted-foreground">
                    {claim.institution} · {claim.year}
                  </span>
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between gap-3">
                <Amount value={claim.amount} size="md" tone="pine" />
                <button
                  onClick={() => claimFor(claim.id)}
                  data-tap
                  className="flex shrink-0 items-center gap-1.5 rounded-xl bg-pine px-4 py-2.5 text-sm font-bold text-pine-foreground transition-transform active:scale-95"
                >
                  {t('claim.start')}
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </AppShell>
  )
}
