'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { Check, FileText, FolderOpen } from 'lucide-react'
import { MobileContainer } from '@/components/layout/mobile-container'
import { BottomNav } from '@/components/layout/bottom-nav'
import { TopBar } from '@/components/layout/top-bar'
import { PageTransition } from '@/components/common/page-transition'
import { Amount } from '@/components/common/amount'
import { useLanguage } from '@/context/language-context'
import { TRACKED_CLAIMS, type TrackedClaim } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const STAGE_KEYS = [
  'track.stage.submitted',
  'track.stage.verifying',
  'track.stage.review',
  'track.stage.paid',
]

function Timeline({ stage }: { stage: number }) {
  const { t } = useLanguage()
  return (
    <ol className="mt-4 flex flex-col gap-0">
      {STAGE_KEYS.map((key, i) => {
        const done = i < stage
        const active = i === stage
        const last = i === STAGE_KEYS.length - 1
        return (
          <li key={key} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  'flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors',
                  done && 'bg-pine text-pine-foreground',
                  active && 'bg-gold text-gold-foreground ring-4 ring-gold/20',
                  !done && !active && 'bg-muted text-muted-foreground',
                )}
              >
                {done ? <Check className="size-3.5" strokeWidth={3} /> : i + 1}
              </span>
              {!last && (
                <span className={cn('my-1 w-0.5 flex-1', done ? 'bg-pine' : 'bg-border')} style={{ minHeight: 20 }} />
              )}
            </div>
            <span
              className={cn(
                'pb-4 text-sm',
                active ? 'font-bold text-foreground' : done ? 'font-medium text-foreground' : 'text-muted-foreground',
              )}
            >
              {t(key)}
              {active && (
                <span className="ml-2 inline-flex items-center rounded-full bg-gold-soft px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-gold">
                  Now
                </span>
              )}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

function ClaimCard({ claim }: { claim: TrackedClaim }) {
  const [open, setOpen] = useState(false)
  const { t } = useLanguage()
  return (
    <div className="overflow-hidden rounded-2xl bg-card ring-1 ring-border">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center gap-3 p-4 text-left">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-pine-soft text-pine">
          <FileText className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[0.95rem] font-bold text-foreground">{claim.type}</p>
          <p className="truncate text-xs text-muted-foreground">{claim.institution}</p>
          <p className="mt-0.5 font-mono text-[0.7rem] tracking-wide text-muted-foreground">{claim.ref}</p>
        </div>
        <div className="text-right">
          <Amount value={claim.amount} size="sm" tone="pine" />
          <p className="mt-0.5 text-[0.7rem] text-muted-foreground">{claim.submittedOn}</p>
        </div>
      </button>
      <motion.div initial={false} animate={{ height: open ? 'auto' : 0 }} className="overflow-hidden">
        <div className="border-t border-border px-4 pb-4 pt-1">
          <Timeline stage={claim.stage} />
        </div>
      </motion.div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full border-t border-border py-2.5 text-center text-xs font-semibold text-pine"
      >
        {open ? '—' : t('track.view')}
      </button>
    </div>
  )
}

export default function TrackPage() {
  const { t } = useLanguage()
  const [tab, setTab] = useState<'active' | 'done'>('active')

  const filtered = TRACKED_CLAIMS.filter((c) => c.status === tab)

  return (
    <MobileContainer>
      <TopBar title={t('track.title')} back={false} />
      <PageTransition className="flex flex-1 flex-col">
        <main className="flex-1 px-5 pb-6">
          {/* Tabs */}
          <div className="mt-1 flex gap-1 rounded-full bg-muted p-1">
            {(['active', 'done'] as const).map((key) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className="relative flex-1 rounded-full py-2 text-sm font-semibold"
              >
                {tab === key && (
                  <motion.span
                    layoutId="trackTab"
                    className="absolute inset-0 rounded-full bg-background shadow-sm"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className={cn('relative', tab === key ? 'text-foreground' : 'text-muted-foreground')}>
                  {t(`track.${key}`)}
                </span>
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <FolderOpen className="size-10 text-muted-foreground" />
              <p className="mt-3 font-display text-base font-bold text-foreground">{t('track.empty')}</p>
              <p className="mt-1 max-w-xs text-sm leading-relaxed text-muted-foreground text-pretty">
                {t('track.empty.body')}
              </p>
            </div>
          ) : (
            <div className="mt-4 flex flex-col gap-3">
              {filtered.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <ClaimCard claim={c} />
                </motion.div>
              ))}
            </div>
          )}
        </main>
        <BottomNav />
      </PageTransition>
    </MobileContainer>
  )
}
