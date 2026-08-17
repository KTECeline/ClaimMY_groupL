'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'motion/react'
import {
  Info,
  Clock,
  ArrowRight,
  BadgeCheck,
  Zap,
  ChevronRight,
  Check,
  Loader2,
} from 'lucide-react'
import { MobileContainer } from '@/components/layout/mobile-container'
import { TopBar } from '@/components/layout/top-bar'
import { BottomNav } from '@/components/layout/bottom-nav'
import { HelpFab } from '@/components/layout/help-fab'
import { ClaimTypeIcon } from '@/components/common/claim-type-icon'
import { Amount } from '@/components/common/amount'
import { AppButton } from '@/components/ui/app-button'
import { useLanguage } from '@/context/language-context'
import { useClaim } from '@/context/claim-context'
import { useSettings } from '@/context/settings-context'
import { useToast } from '@/context/toast-context'
import {
  DEMO_IC,
  VAULT_DOC_IDS,
  getDocument,
  getInstitution,
} from '@/lib/mock-data'

/**
 * S-08 · Claim Detail.
 *
 * Two routes out, exactly as the deck draws them: One-Click Claim when the
 * vault already holds everything (Aisyah, 22 — "I hope I don't lose my
 * progress again"), and the guided six-step process when it doesn't
 * (Tan, 60 — "I'd better ask my daughter").
 */
export default function ClaimDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { t } = useLanguage()
  const { show } = useToast()
  const {
    getClaim,
    setActiveClaim,
    resetWizard,
    updateWizard,
    setLastRef,
    addSubmittedClaim,
  } = useClaim()
  const { profile } = useSettings()
  const [submitting, setSubmitting] = useState(false)
  const claim = getClaim(id)

  useEffect(() => {
    if (!claim) router.replace('/home')
  }, [claim, router])

  if (!claim) return null

  const institution = getInstitution(claim.institutionSlug)
  const isOwn = claim.ic === DEMO_IC
  // One-click is only offered when the vault genuinely covers every document.
  const oneClickReady =
    isOwn && claim.requiredDocs.every((d) => VAULT_DOC_IDS.includes(d))

  function startClaim() {
    setActiveClaim(claim!)
    resetWizard()
    if (!isOwn) updateWizard({ mode: 'family' })
    router.push('/claim/wizard/step-1')
  }

  function oneClickClaim() {
    if (!claim) return
    setSubmitting(true)
    setActiveClaim(claim)
    const ref = `CLM-1CLK-2026`
    setLastRef(ref)
    addSubmittedClaim({
      id: `sub-${Date.now()}`,
      ref,
      type: claim.typeLabel,
      claimType: claim.type,
      institution: claim.institution,
      institutionSlug: claim.institutionSlug,
      amount: claim.amount,
      submittedOn: new Date().toLocaleDateString('en-MY', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      stage: 0,
      status: 'active',
    })
    show({ message: t('claim.oneclick.toast') })
    setTimeout(() => router.push('/claim/success'), 1200)
  }

  return (
    <MobileContainer>
      <TopBar title={t('claim.detail.title')} />

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-32">
        {/* Hero */}
        <div className="mt-2 flex items-center gap-3">
          <ClaimTypeIcon type={claim.type} className="size-14 rounded-2xl" />
          <div className="min-w-0">
            <h1 className="font-display text-xl font-extrabold leading-tight">
              {claim.typeLabel}
            </h1>
            <p className="truncate text-sm text-muted-foreground">
              {claim.institution}
            </p>
          </div>
        </div>

        {/* Amount ticket */}
        <div className="ticket-notch relative mt-5 overflow-hidden rounded-3xl bg-gold-soft p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-gold-foreground/60">
            {t('claim.amount')}
          </p>
          <div className="mt-1">
            <Amount value={claim.amount} size="xl" tone="gold" />
          </div>
          <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-pine px-2.5 py-1 text-[0.7rem] font-semibold text-pine-foreground">
            <BadgeCheck className="size-3.5" />
            {t('claim.verified')}
          </span>
        </div>

        {/* One-Click Claim — the deck's dashed-border block */}
        {oneClickReady && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-5 rounded-3xl border-2 border-dashed border-pine/40 bg-pine-soft/40 p-5"
          >
            <h2 className="flex items-center gap-2 font-display font-bold text-pine">
              <Zap className="size-4" />
              {t('claim.oneclick.title')}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-pretty">
              {t('claim.oneclick.body')}
            </p>

            <button
              onClick={() => router.push('/settings/preferences')}
              data-tap
              className="mt-3 flex w-full items-center gap-2 rounded-2xl border border-pine/20 bg-card px-4 py-3 text-left"
            >
              <span className="flex-1 text-sm font-semibold">
                {t('claim.oneclick.bank', {
                  bank: 'Maybank ••9012',
                })}
              </span>
              <span className="shrink-0 text-sm font-bold text-pine">
                {t('common.change')}
              </span>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
            </button>

            <AppButton
              size="block"
              className="mt-4"
              onClick={oneClickClaim}
              disabled={submitting}
            >
              {submitting ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <Zap className="size-5" />
              )}
              {t('claim.oneclick.cta')}
            </AppButton>

            <div className="mt-4 flex items-center gap-3">
              <span className="h-px flex-1 bg-pine/20" />
              <span className="text-xs font-semibold text-muted-foreground">
                {t('claim.or')}
              </span>
              <span className="h-px flex-1 bg-pine/20" />
            </div>

            <AppButton
              variant="outline"
              size="block"
              className="mt-4"
              onClick={startClaim}
            >
              {t('claim.guided.cta')}
              <ArrowRight className="size-4" />
            </AppButton>
          </motion.section>
        )}

        {/* Meta grid */}
        <dl className="mt-5 grid grid-cols-2 gap-3">
          <Meta label={t('claim.institution')} value={claim.institution} />
          <Meta label={t('claim.type')} value={claim.typeLabel} />
          <Meta label={t('claim.year')} value={String(claim.year)} />
          <Meta label={t('claim.ref')} value={claim.id} mono />
        </dl>

        {/* About */}
        <section className="mt-6 rounded-2xl bg-card p-4 ring-1 ring-border">
          <h2 className="flex items-center gap-2 font-display text-sm font-bold">
            <Info className="size-4 text-pine" />
            {t('claim.about')}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
            {claim.description}
          </p>
          {institution && (
            <Link
              href={`/institution/${institution.slug}`}
              className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-pine underline underline-offset-2"
            >
              {t('claim.about.institution', { name: institution.shortName })}
              <ChevronRight className="size-4" />
            </Link>
          )}
        </section>

        {/* Docs needed — driven by the claim's own requirements, not a
            generic list, so the checklist matches what actually gets asked. */}
        <section className="mt-5">
          <h2 className="mb-3 font-display text-sm font-bold">
            {t('claim.docs.needed')}
          </h2>
          <ul className="flex flex-col gap-2">
            {claim.requiredDocs.map((docId) => {
              const doc = getDocument(docId)
              if (!doc) return null
              const inVault = VAULT_DOC_IDS.includes(docId)
              return (
                <li
                  key={docId}
                  className="flex items-center gap-3 rounded-2xl bg-card p-3 ring-1 ring-border"
                >
                  <span
                    className={
                      inVault
                        ? 'flex size-9 shrink-0 items-center justify-center rounded-xl bg-pine text-pine-foreground'
                        : 'flex size-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-muted-foreground'
                    }
                  >
                    {inVault ? (
                      <Check className="size-4" strokeWidth={3} />
                    ) : (
                      <Info className="size-4" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">
                      {t(doc.labelKey)}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {inVault ? t('vault.stored') : t(doc.hintKey)}
                    </span>
                  </span>
                </li>
              )
            })}
          </ul>
        </section>

        <p className="mt-5 flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground">
          <Clock className="size-4" />
          {institution?.processingTime ?? t('claim.estimate')}
        </p>
      </div>

      {/* Sticky CTA — hidden when one-click already offers both routes above */}
      {!oneClickReady && (
        <div className="sticky bottom-0 z-20 border-t border-border bg-background/90 px-5 py-4 backdrop-blur-md">
          <AppButton size="block" onClick={startClaim}>
            {t('claim.start')}
            <ArrowRight className="size-5" />
          </AppButton>
        </div>
      )}

      <HelpFab className={oneClickReady ? undefined : 'bottom-32'} />
      <BottomNav />
    </MobileContainer>
  )
}

function Meta({
  label,
  value,
  mono,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="rounded-2xl bg-card p-3 ring-1 ring-border">
      <dt className="text-[0.7rem] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd
        className={`mt-0.5 text-sm font-bold ${mono ? 'tabular font-mono' : ''}`}
      >
        {value}
      </dd>
    </div>
  )
}
