'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { Bell, Coins, CircleCheck, Clock, Info, BellOff } from 'lucide-react'
import { MobileContainer } from '@/components/layout/mobile-container'
import { BottomNav } from '@/components/layout/bottom-nav'
import { TopBar } from '@/components/layout/top-bar'
import { PageTransition } from '@/components/common/page-transition'
import { Amount } from '@/components/common/amount'
import { useLanguage } from '@/context/language-context'
import { NOTIFICATIONS, type AppNotification } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const NOTIF_ROUTES: Record<string, string> = {
  found: '/results',
  status: '/track',
  reminder: '/track',
  system: '',
}

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

function NotifRow({ n, onTap }: { n: AppNotification; onTap?: () => void }) {
  const Icon = ICONS[n.type]
  const route = NOTIF_ROUTES[n.type]
  return (
    <div
      role={route ? 'button' : undefined}
      onClick={onTap}
      className={cn(
        'relative flex gap-3 rounded-2xl p-4 ring-1 transition-colors',
        n.unread ? 'bg-card ring-border' : 'bg-transparent ring-transparent',
        route && 'cursor-pointer active:opacity-70',
      )}
    >
      <span className={cn('flex size-11 shrink-0 items-center justify-center rounded-xl', TONES[n.type])}>
        <Icon className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[0.9rem] font-bold leading-snug text-foreground">{n.title}</p>
          <span className="shrink-0 text-[0.7rem] font-medium text-muted-foreground">{n.time}</span>
        </div>
        <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground text-pretty">{n.body}</p>
        {n.amount != null && (
          <div className="mt-2">
            <Amount value={n.amount} size="sm" tone="gold" />
          </div>
        )}
      </div>
      {n.unread && <span className="absolute right-3 top-3 size-2 rounded-full bg-clay" />}
    </div>
  )
}

export default function NotificationsPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [items, setItems] = useState(NOTIFICATIONS)

  function handleTap(n: AppNotification) {
    // mark read
    setItems((arr) => arr.map((x) => x.id === n.id ? { ...x, unread: false } : x))
    const route = NOTIF_ROUTES[n.type]
    if (route) router.push(route)
  }

  const today = items.filter((n) => n.group === 'today')
  const earlier = items.filter((n) => n.group === 'earlier')
  const hasUnread = items.some((n) => n.unread)

  return (
    <MobileContainer>
      <TopBar
        title={t('notif.title')}
        back={false}
        right={
          hasUnread ? (
            <button
              onClick={() => setItems((arr) => arr.map((n) => ({ ...n, unread: false })))}
              className="px-2 text-xs font-semibold text-pine"
            >
              {t('notif.markAll')}
            </button>
          ) : null
        }
      />
      <PageTransition className="flex flex-1 flex-col">
        <main className="flex-1 px-4 pb-6">
          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center py-24 text-center">
              <BellOff className="size-10 text-muted-foreground" />
              <p className="mt-3 text-sm font-medium text-muted-foreground">{t('notif.empty')}</p>
            </div>
          ) : (
            <>
              {today.length > 0 && (
                <section className="mt-2">
                  <h2 className="mb-2 px-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    {t('notif.today')}
                  </h2>
                  <div className="flex flex-col gap-2">
                    {today.map((n, i) => (
                      <motion.div
                        key={n.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <NotifRow n={n} onTap={() => handleTap(n)} />
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}
              {earlier.length > 0 && (
                <section className="mt-5">
                  <h2 className="mb-2 px-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    {t('notif.earlier')}
                  </h2>
                  <div className="flex flex-col gap-2">
                    {earlier.map((n) => (
                      <NotifRow key={n.id} n={n} onTap={() => handleTap(n)} />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </main>
        <BottomNav />
      </PageTransition>
    </MobileContainer>
  )
}
