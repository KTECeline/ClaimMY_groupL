'use client'

import { useState } from 'react'
import { Check, ChevronRight, Bell, ShieldCheck, Fingerprint, Info, User } from 'lucide-react'
import { MobileContainer } from '@/components/layout/mobile-container'
import { BottomNav } from '@/components/layout/bottom-nav'
import { TopBar } from '@/components/layout/top-bar'
import { PageTransition } from '@/components/common/page-transition'
import { useLanguage } from '@/context/language-context'
import { LANGUAGES, type Lang } from '@/lib/i18n/dictionary'
import { cn } from '@/lib/utils'

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      role="switch"
      aria-checked={on}
      className={cn(
        'relative h-7 w-12 shrink-0 rounded-full transition-colors',
        on ? 'bg-pine' : 'bg-border',
      )}
    >
      <span
        className={cn(
          'absolute top-1 size-5 rounded-full bg-card shadow transition-transform',
          on ? 'translate-x-6' : 'translate-x-1',
        )}
      />
    </button>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="mb-2 px-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">
        {title}
      </h2>
      <div className="divide-y divide-border overflow-hidden rounded-2xl bg-card ring-1 ring-border">
        {children}
      </div>
    </section>
  )
}

export default function SettingsPage() {
  const { t, lang, setLang } = useLanguage()
  const [newAlerts, setNewAlerts] = useState(true)
  const [statusAlerts, setStatusAlerts] = useState(true)
  const [biometric, setBiometric] = useState(false)

  return (
    <MobileContainer>
      <TopBar title={t('set.title')} back={false} />
      <PageTransition className="flex flex-1 flex-col">
        <main className="flex-1 px-5 pb-6">
          {/* Profile card */}
          <div className="mt-1 flex items-center gap-4 rounded-2xl bg-pine p-4 text-pine-foreground">
            <span className="flex size-14 items-center justify-center rounded-full bg-pine-foreground/15 font-display text-lg font-bold">
              AR
            </span>
            <div className="min-w-0">
              <p className="text-base font-bold">Ahmad bin Razali</p>
              <p className="font-mono text-sm tabular-nums text-pine-foreground/70">900214-08-5127</p>
            </div>
            <button className="ml-auto flex size-9 items-center justify-center rounded-full bg-pine-foreground/15" aria-label={t('set.profile')}>
              <User className="size-4" />
            </button>
          </div>

          {/* Language */}
          <Section title={t('set.language')}>
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code as Lang)}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
              >
                <span className="flex-1">
                  <span className="block text-[0.95rem] font-semibold text-foreground">{l.native}</span>
                  <span className="block text-xs text-muted-foreground">{l.label}</span>
                </span>
                <span
                  className={cn(
                    'flex size-6 items-center justify-center rounded-full border-2 transition-colors',
                    lang === l.code ? 'border-pine bg-pine text-pine-foreground' : 'border-border',
                  )}
                >
                  {lang === l.code && <Check className="size-3.5" strokeWidth={3} />}
                </span>
              </button>
            ))}
          </Section>

          {/* Notifications */}
          <Section title={t('set.notifs')}>
            <div className="flex items-center gap-3 px-4 py-3.5">
              <Bell className="size-5 text-muted-foreground" />
              <span className="flex-1 text-[0.95rem] font-medium text-foreground">{t('set.notifs.new')}</span>
              <Toggle on={newAlerts} onToggle={() => setNewAlerts((v) => !v)} />
            </div>
            <div className="flex items-center gap-3 px-4 py-3.5">
              <ShieldCheck className="size-5 text-muted-foreground" />
              <span className="flex-1 text-[0.95rem] font-medium text-foreground">{t('set.notifs.status')}</span>
              <Toggle on={statusAlerts} onToggle={() => setStatusAlerts((v) => !v)} />
            </div>
          </Section>

          {/* Security */}
          <Section title={t('set.security')}>
            <div className="flex items-center gap-3 px-4 py-3.5">
              <Fingerprint className="size-5 text-muted-foreground" />
              <span className="flex-1 text-[0.95rem] font-medium text-foreground">{t('set.security.biometric')}</span>
              <Toggle on={biometric} onToggle={() => setBiometric((v) => !v)} />
            </div>
          </Section>

          {/* About */}
          <Section title={t('set.about')}>
            <div className="flex gap-3 px-4 py-3.5">
              <Info className="size-5 shrink-0 text-muted-foreground" />
              <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
                {t('set.about.body')}
              </p>
            </div>
            <div className="flex items-center gap-3 px-4 py-3.5">
              <span className="flex-1 text-[0.95rem] font-medium text-foreground">{t('set.version')}</span>
              <span className="font-mono text-sm text-muted-foreground">1.0.0 · demo</span>
            </div>
          </Section>
        </main>
        <BottomNav />
      </PageTransition>
    </MobileContainer>
  )
}
