'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { Plus, ChevronRight, X, Search } from 'lucide-react'
import { MobileContainer } from '@/components/layout/mobile-container'
import { BottomNav } from '@/components/layout/bottom-nav'
import { TopBar } from '@/components/layout/top-bar'
import { PageTransition } from '@/components/common/page-transition'
import { AppButton } from '@/components/ui/app-button'
import { Amount } from '@/components/common/amount'
import { Field } from '@/components/wizard/field'
import { useLanguage } from '@/context/language-context'
import { useClaim } from '@/context/claim-context'
import { FAMILY, FAMILY_TOTAL } from '@/lib/mock-data'
import { formatIC } from '@/lib/utils'

const RELATIONSHIPS = [
  'family.add.rel.parent',
  'family.add.rel.spouse',
  'family.add.rel.child',
  'family.add.rel.sibling',
  'family.add.rel.other',
]

export default function FamilyPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const { search } = useClaim()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [name, setName] = useState('')
  const [ic, setIc] = useState('')
  const [rel, setRel] = useState(RELATIONSHIPS[0])

  function searchMember(memberIc: string) {
    search(memberIc)
    router.push('/searching')
  }

  function saveAndSearch() {
    setSheetOpen(false)
    search(ic)
    router.push('/searching')
  }

  return (
    <MobileContainer>
      <TopBar title={t('family.title')} back={false} />
      <PageTransition className="flex flex-1 flex-col">
        <main className="flex-1 px-5 pb-6">
          <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
            {t('family.sub')}
          </p>

          {/* Total found banner */}
          <div className="mt-4 overflow-hidden rounded-3xl bg-pine p-5 text-pine-foreground">
            <p className="text-xs font-semibold uppercase tracking-wide text-pine-foreground/60">
              {t('family.totalFound')}
            </p>
            <div className="mt-1">
              <Amount value={FAMILY_TOTAL} size="lg" tone="paper" />
            </div>
            <p className="mt-1 text-sm text-pine-foreground/70">
              {t('family.members').replace('{n}', String(FAMILY.length))}
            </p>
          </div>

          {/* Members */}
          <div className="mt-5 flex flex-col gap-3">
            {FAMILY.map((m, i) => (
              <motion.button
                key={m.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => searchMember(m.ic)}
                className="flex items-center gap-3 rounded-2xl bg-card p-4 text-left ring-1 ring-border transition-colors hover:ring-pine/40"
              >
                <span
                  className="flex size-12 shrink-0 items-center justify-center rounded-full font-display text-base font-bold text-pine-foreground"
                  style={{ backgroundColor: m.avatarColor }}
                >
                  {m.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.95rem] font-bold text-foreground">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{t(m.relationship)}</p>
                  {m.claimable > 0 ? (
                    <div className="mt-1 flex items-baseline gap-1">
                      <Amount value={m.claimable} size="sm" tone="gold" />
                      <span className="text-xs text-muted-foreground">{t('family.claimable')}</span>
                    </div>
                  ) : (
                    <p className="mt-1 text-xs font-medium text-muted-foreground">—</p>
                  )}
                </div>
                <ChevronRight className="size-5 text-muted-foreground" />
              </motion.button>
            ))}
          </div>

          <AppButton
            variant="outline"
            size="block"
            className="mt-5"
            onClick={() => setSheetOpen(true)}
          >
            <Plus className="size-5" />
            {t('family.add')}
          </AppButton>
        </main>
        <BottomNav />
      </PageTransition>

      {/* Add member bottom sheet */}
      <AnimatePresence>
        {sheetOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSheetOpen(false)}
              className="absolute inset-0 z-40 bg-ink/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="absolute inset-x-0 bottom-0 z-50 rounded-t-3xl bg-background p-5 pb-8"
            >
              <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-border" />
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-extrabold text-foreground">
                  {t('family.add.title')}
                </h2>
                <button
                  onClick={() => setSheetOpen(false)}
                  className="flex size-9 items-center justify-center rounded-full hover:bg-foreground/5"
                  aria-label="Close"
                >
                  <X className="size-5" />
                </button>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{t('family.add.sub')}</p>

              <div className="mt-5 flex flex-col gap-4">
                <Field label={t('family.add.name')} value={name} onChange={setName} placeholder="Nama penuh" />
                <Field
                  label={t('family.add.ic')}
                  value={ic}
                  onChange={(v) => setIc(formatIC(v))}
                  mono
                  placeholder="000000-00-0000"
                />
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {t('family.add.rel')}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {RELATIONSHIPS.map((r) => (
                      <button
                        key={r}
                        onClick={() => setRel(r)}
                        className={
                          rel === r
                            ? 'rounded-full bg-pine px-4 py-2 text-sm font-semibold text-pine-foreground'
                            : 'rounded-full bg-card px-4 py-2 text-sm font-semibold text-muted-foreground ring-1 ring-border'
                        }
                      >
                        {t(r)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <AppButton
                variant="primary"
                size="block"
                className="mt-6"
                disabled={!name || ic.replace(/\D/g, '').length !== 12}
                onClick={saveAndSearch}
              >
                <Search className="size-5" />
                {t('family.add.save')}
              </AppButton>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </MobileContainer>
  )
}
