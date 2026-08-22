'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'motion/react'
import {
  BellOff,
  Coins,
  CircleCheck,
  Clock,
  Info,
  Settings2,
} from 'lucide-react'
import { MobileContainer } from '@/components/layout/mobile-container'
import { BottomNav } from '@/components/layout/bottom-nav'
import { TopBar } from '@/components/layout/top-bar'
import { Amount } from '@/components/common/amount'
import { EmptyState } from '@/components/common/empty-state'
import { ListSkeleton } from '@/components/common/list-skeleton'
import { AppButton } from '@/components/ui/app-button'
import { useLanguage } from '@/context/language-context'
import { useClaim } from '@/context/claim-context'
import { useToast } from '@/context/toast-context'
import {
  NOTIFICATIONS,
  TRACKED_CLAIMS,
  DEMO_IC,
  type AppNotification,
} from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const ICONS = {
  found: Coins,
  status: CircleCheck,
  reminder: Clock,
  system: Info,
}

const TONES = {
  found: 'bg-gold-soft text-gold',
  status: 'bg-pine-soft text-pine',
  reminder: 'bg-clay-soft text-clay',
  system: 'bg-muted text-muted-foreground',
}

/**
 * S-21 · Alerts Inbox.
 *
 * Card sorting put "Notification inbox" in its own category 90% of the time —
 * the clearest single result in the study — so alerts keep their own tab and
 * their own settings rather than living inside Profile.
 *
 * The lo-fi omits the help FAB here on purpose; this screen is a list, not a
 * task, so there is nothing to be stuck on.
 */
export default function NotificationsPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const { show } = useToast()
  const { search, submittedClaims } = useClaim()
  const [items, setItems] = useState<AppNotification[]>(NOTIFICATIONS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  const today = items.filter((n) => n.group === 'today')
  const earlier = items.filter((n) => n.group === 'earlier')
  const unread = items.filter((n) => n.unread).length

  function open(n: AppNotification) {
    setItems((list) =>
      list.map((x) => (x.id === n.id ? { ...x, unread: false } : x)),
    )
    if (n.type === 'found') {
      search(DEMO_IC)
      router.push('/notifications/found')
      return
    }
    if (n.type === 'status' || n.type === 'reminder') {
      const claim = [...submittedClaims, ...TRACKED_CLAIMS].find(
        (c) => c.id === n.claimId,
      )
      if (claim?.status === 'rejected') {
        router.push(`/claim/${claim.id}/rejected`)
        return
      }
      router.push(claim ? `/track/${claim.id}` : '/track')
    }
  }

  function markAllRead() {
    const previous = items
    setItems((list) => list.map((n) => ({ ...n, unread: false })))
    show({
      message: t('alerts.marked'),
      undo: () => setItems(previous),
    })
  }

  return (
    <MobileContainer>
      <TopBar
        title={t('alerts.title')}
        back={false}
        right={
          <div className="flex items-center gap-1">
            {unread > 0 && (
              <button
                onClick={markAllRead}
                className="rounded-full px-2.5 py-1.5 text-sm font-bold text-pine transition-colors hover:bg-pine-soft"
              >
                {t('alerts.mark.read')}
              </button>
            )}
            <Link
              href="/notifications/settings"
              aria-label={t('alertset.title')}
              className="flex size-10 items-center justify-center rounded-full transition-colors hover:bg-foreground/5"
            >
              <Settings2 className="size-5" />
            </Link>
          </div>
        }
      />

      <main className="flex-1 overflow-y-auto no-scrollbar px-5 pb-28">
        {loading ? (
          <ListSkeleton rows={4} />
        ) : items.length === 0 ? (
          <EmptyState
            icon={<BellOff className="size-9" />}
            title={t('alerts.empty.title')}
            body={t('alerts.empty.body')}
            action={
              <Link href="/home">
                <AppButton size="block">{t('track.empty.cta')}</AppButton>
              </Link>
            }
          />
        ) : (
          <>
            {today.length > 0 && (
              <Group label={t('alerts.today')}>
                {today.map((n, i) => (
                  <NotifRow key={n.id} n={n} index={i} onTap={() => open(n)} />
                ))}
              </Group>
            )}
            {earlier.length > 0 && (
              <Group label={t('alerts.earlier')}>
                {earlier.map((n, i) => (
                  <NotifRow key={n.id} n={n} index={i} onTap={() => open(n)} />
                ))}
              </Group>
            )}
          </>
        )}
      </main>

      <BottomNav />
    </MobileContainer>
  )
}

function Group({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <section className="mt-4 first:mt-1">
      <h2 className="mb-2 px-1 text-[0.7rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </h2>
      <div className="flex flex-col gap-2">{children}</div>
    </section>
  )
}

function NotifRow({
  n,
  index,
  onTap,
}: {
  n: AppNotification
  index: number
  onTap: () => void
}) {
  const Icon = ICONS[n.type]

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index }}
      onClick={onTap}
      data-tap
      className={cn(
        'relative flex w-full gap-3 rounded-2xl p-4 text-left ring-1 transition-colors',
        n.unread
          ? 'bg-card ring-border'
          : 'bg-transparent ring-transparent hover:bg-card/60',
      )}
    >
      {n.unread && (
        <span
          aria-label="Unread"
          className="absolute left-1.5 top-5 size-2 rounded-full bg-pine"
        />
      )}
      <span
        className={cn(
          'flex size-11 shrink-0 items-center justify-center rounded-xl',
          TONES[n.type],
        )}
      >
        <Icon className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-2">
          <span className="text-[0.9rem] font-bold leading-snug">
            {n.title}
          </span>
          <span className="shrink-0 text-[0.7rem] font-medium text-muted-foreground">
            {n.time}
          </span>
        </span>
        <span className="mt-0.5 block text-sm leading-relaxed text-muted-foreground text-pretty">
          {n.body}
        </span>
        {n.amount != null && (
          <span className="mt-2 block">
            <Amount value={n.amount} size="sm" tone="pine" />
          </span>
        )}
      </span>
    </motion.button>
  )
}
