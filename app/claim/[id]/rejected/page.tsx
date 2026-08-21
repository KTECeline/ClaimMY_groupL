'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { ArrowRight, Phone, Wrench, XCircle } from 'lucide-react'
import { AppShell } from '@/components/layout/app-shell'
import { StatusBadge } from '@/components/common/status-badge'
import { EmptyState } from '@/components/common/empty-state'
import { AppButton } from '@/components/ui/app-button'
import { Amount } from '@/components/common/amount'
import { useLanguage } from '@/context/language-context'
import { useClaim } from '@/context/claim-context'
import { DEMO_IC, TRACKED_CLAIMS, getInstitution } from '@/lib/mock-data'

/**
 * S-29 · Rejection Detail — the `↯` branch off submission.
 *
 * Two things matter here: a plain-language reason (not an error code), and a
 * fix path that does not mean starting over. "Formal/legal terminology" and
 * losing progress were both DECIDE/USE-stage pain points.
 */
export default function RejectedPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { t } = useLanguage()
  const { submittedClaims, setActiveClaim, resetWizard } = useClaim()

  const claim = [...submittedClaims, ...TRACKED_CLAIMS].find(
    (c) => c.id === id || c.ref === id,
  )

  if (!claim) {
    return (
      <AppShell title={t('reject.title')}>
        <EmptyState
          icon={<XCircle className="size-9" />}
          title={t('hist.empty.title')}
          body={t('hist.empty.body')}
          action={
            <AppButton size="block" onClick={() => router.push('/track')}>
              {t('track.hub.title')}
            </AppButton>
          }
        />
      </AppShell>
    )
  }

  const institution = getInstitution(claim.institutionSlug)
  const fixes = claim.howToFix ?? []

  // The wizard gates every step on `activeClaim` — rejected claims never set
  // one, so jumping straight to step-4 was bouncing back to Home. Rebuild it
  // from the tracked claim and go straight to re-uploading docs, since that's
  // what every current rejection reason asks for.
  function startFix() {
    setActiveClaim({
      id: claim!.id,
      ic: DEMO_IC,
      name: 'Ahmad bin Razali',
      amount: claim!.amount,
      type: claim!.claimType,
      typeLabel: claim!.type,
      institution: claim!.institution,
      institutionSlug: claim!.institutionSlug,
      year: new Date().getFullYear(),
      status: 'claimable',
      description: claim!.rejectionReason ?? '',
      requiredDocs: institution?.requiredDocs ?? ['mykad', 'bank-statement'],
    })
    resetWizard()
    router.push('/claim/wizard/step-4')
  }

  return (
    <AppShell title={t('reject.title')}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <StatusBadge tone="rejected" dot>
          {t('reject.badge')}
        </StatusBadge>

        <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-balance">
          {claim.type}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {claim.institution} · {claim.ref}
        </p>
        <div className="mt-3">
          <Amount value={claim.amount} size="lg" />
        </div>

        {/* Why */}
        <section className="mt-6 rounded-2xl border-2 border-clay/30 bg-clay-soft/40 p-4">
          <h3 className="flex items-center gap-2 font-display font-bold text-clay">
            <XCircle className="size-4" />
            {t('reject.why')}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-pretty">
            {claim.rejectionReason}
          </p>
        </section>

        {/* How to fix */}
        <section className="mt-6">
          <h3 className="flex items-center gap-2 font-display font-bold">
            <Wrench className="size-4 text-pine" />
            {t('reject.fix')}
          </h3>
          <ol className="mt-3 flex flex-col gap-3">
            {fixes.map((fix, i) => (
              <li key={fix} className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-pine-soft font-mono text-xs font-bold text-pine">
                  {i + 1}
                </span>
                <span className="text-sm leading-relaxed text-pretty">
                  {fix}
                </span>
              </li>
            ))}
          </ol>
        </section>

        <div className="mt-6 rounded-2xl border border-border bg-card p-4">
          <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
            {t('reject.note')}
          </p>
        </div>

        <div className="mt-7 flex flex-col gap-3">
          <AppButton size="block" onClick={startFix}>
            {t('reject.cta')}
            <ArrowRight className="size-5" />
          </AppButton>
          <AppButton
            variant="outline"
            size="block"
            onClick={() => router.push('/settings/help')}
          >
            <Phone className="size-4" />
            {t('reject.contact')}
            {institution && (
              <span className="text-muted-foreground">
                · {institution.phone}
              </span>
            )}
          </AppButton>
        </div>
      </motion.div>
    </AppShell>
  )
}
