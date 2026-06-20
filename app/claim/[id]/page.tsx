'use client'

import { use, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Info, FileText, CreditCard, Users, Clock, ArrowRight, BadgeCheck } from 'lucide-react'
import { MobileContainer } from '@/components/layout/mobile-container'
import { TopBar } from '@/components/layout/top-bar'
import { ClaimTypeIcon } from '@/components/common/claim-type-icon'
import { Amount } from '@/components/common/amount'
import { AppButton } from '@/components/ui/app-button'
import { PageTransition } from '@/components/common/page-transition'
import { useLanguage } from '@/context/language-context'
import { useClaim } from '@/context/claim-context'

export default function ClaimDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { t } = useLanguage()
  const { getClaim, setActiveClaim, resetWizard } = useClaim()
  const claim = getClaim(id)

  useEffect(() => {
    if (!claim) router.replace('/home')
  }, [claim, router])

  if (!claim) return null

  const docs = [
    { icon: CreditCard, key: 'claim.doc.ic' },
    { icon: FileText, key: 'claim.doc.bank' },
    { icon: Users, key: 'claim.doc.proof' },
  ]

  function startClaim() {
    setActiveClaim(claim!)
    resetWizard()
    router.push('/claim/wizard/step-1')
  }

  return (
    <MobileContainer>
      <TopBar title={t('claim.detail.title')} />
      <PageTransition className="flex flex-1 flex-col">
        <div className="overflow-y-auto no-scrollbar px-5 pb-32">
          {/* Hero */}
          <div className="mt-2 flex items-center gap-3">
            <ClaimTypeIcon type={claim.type} className="size-14 rounded-2xl" />
            <div>
              <h1 className="font-display text-xl font-extrabold leading-tight text-foreground">
                {claim.typeLabel}
              </h1>
              <p className="text-sm text-muted-foreground">{claim.institution}</p>
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

          {/* Meta grid */}
          <dl className="mt-5 grid grid-cols-2 gap-3">
            <Meta label={t('claim.institution')} value={claim.institution} />
            <Meta label={t('claim.type')} value={claim.typeLabel} />
            <Meta label={t('claim.year')} value={String(claim.year)} />
            <Meta label={t('claim.ref')} value={claim.id} mono />
          </dl>

          {/* About */}
          <section className="mt-6 rounded-2xl bg-card p-4 ring-1 ring-border">
            <h2 className="flex items-center gap-2 font-display text-sm font-bold text-foreground">
              <Info className="size-4 text-pine" />
              {t('claim.about')}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {claim.description}
            </p>
          </section>

          {/* Docs needed */}
          <section className="mt-5">
            <h2 className="mb-3 font-display text-sm font-bold text-foreground">
              {t('claim.docs.needed')}
            </h2>
            <ul className="flex flex-col gap-2">
              {docs.map(({ icon: Icon, key }) => (
                <li
                  key={key}
                  className="flex items-center gap-3 rounded-2xl bg-card p-3 ring-1 ring-border"
                >
                  <span className="flex size-9 items-center justify-center rounded-xl bg-pine-soft text-pine">
                    <Icon className="size-4" />
                  </span>
                  <span className="text-sm font-medium text-foreground">{t(key)}</span>
                </li>
              ))}
            </ul>
          </section>

          <p className="mt-5 flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground">
            <Clock className="size-4" />
            {t('claim.estimate')}
          </p>
        </div>

        {/* Sticky CTA */}
        <div className="sticky bottom-0 border-t border-border bg-background/90 px-5 py-4 backdrop-blur-md">
          <AppButton variant="primary" size="block" onClick={startClaim}>
            {t('claim.start')}
            <ArrowRight className="size-5" />
          </AppButton>
        </div>
      </PageTransition>
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
        className={`mt-0.5 text-sm font-bold text-foreground ${mono ? 'font-mono tabular' : ''}`}
      >
        {value}
      </dd>
    </div>
  )
}
