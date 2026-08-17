'use client'

import { use, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { Clock, Globe, Info, Phone } from 'lucide-react'
import { AppShell } from '@/components/layout/app-shell'
import {
  SectionGroup,
  SectionRow,
} from '@/components/common/section-group'
import { AppButton } from '@/components/ui/app-button'
import { useLanguage } from '@/context/language-context'
import { getDocument, getInstitution } from '@/lib/mock-data'

/**
 * S-09 · Institution Info (from the mid-fi deck).
 *
 * Users left the eGUMIS site to Google what an institution wanted — the DECIDE
 * stage records "users leave the site to find guidance elsewhere". Keeping that
 * answer in-app is what stops the drop-off.
 */
export default function InstitutionPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const router = useRouter()
  const { t } = useLanguage()
  const institution = getInstitution(slug)

  useEffect(() => {
    if (!institution) router.replace('/home')
  }, [institution, router])

  if (!institution) return null

  return (
    <AppShell title={institution.shortName} subtitle={t('inst.title')}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center gap-3">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-pine-soft font-display text-lg font-bold text-pine">
            {institution.shortName.slice(0, 2).toUpperCase()}
          </span>
          <h1 className="font-display text-xl font-extrabold leading-tight text-balance">
            {institution.name}
          </h1>
        </div>

        <section className="mt-5 rounded-2xl bg-card p-4 ring-1 ring-border">
          <h2 className="flex items-center gap-2 font-display text-sm font-bold">
            <Info className="size-4 text-pine" />
            {t('inst.title')}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
            {institution.about}
          </p>
        </section>

        <div className="mt-4 flex items-center gap-3 rounded-2xl bg-gold-soft px-4 py-3.5">
          <Clock className="size-4 shrink-0 text-accent-foreground" />
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-semibold uppercase tracking-wide text-accent-foreground/70">
              {t('inst.processing')}
            </span>
            <span className="block font-bold text-accent-foreground">
              {institution.processingTime}
            </span>
          </span>
        </div>

        <h2 className="mb-2 mt-6 px-1 text-[0.7rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">
          {t('inst.docs')}
        </h2>
        <ul className="overflow-hidden rounded-2xl border border-border bg-card divide-y divide-border">
          {institution.requiredDocs.map((docId) => {
            const doc = getDocument(docId)
            if (!doc) return null
            return (
              <li key={docId} className="px-4 py-3">
                <p className="font-semibold leading-snug">{t(doc.labelKey)}</p>
                <p className="mt-0.5 text-sm leading-snug text-muted-foreground text-pretty">
                  {t(doc.hintKey)}
                </p>
              </li>
            )
          })}
        </ul>

        <div className="mt-6">
          <SectionGroup label={t('inst.contact')}>
            <SectionRow
              icon={<Phone className="size-4" />}
              label={t('inst.phone')}
              hint={institution.phone}
              trailing={<span />}
            />
            <SectionRow
              icon={<Globe className="size-4" />}
              label={t('inst.website')}
              hint={institution.website}
              trailing={<span />}
            />
          </SectionGroup>
        </div>

        <AppButton variant="outline" size="block" onClick={() => router.back()}>
          {t('inst.back.claim')}
        </AppButton>
      </motion.div>
    </AppShell>
  )
}
