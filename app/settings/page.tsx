'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  Check,
  ChevronRight,
  Bell,
  ShieldCheck,
  Fingerprint,
  Info,
  User,
  CloudOff,
  X,
  Phone,
  Mail,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { MobileContainer } from '@/components/layout/mobile-container'
import { BottomNav } from '@/components/layout/bottom-nav'
import { TopBar } from '@/components/layout/top-bar'
import { PageTransition } from '@/components/common/page-transition'
import { AppButton } from '@/components/ui/app-button'
import { Field } from '@/components/wizard/field'
import { useLanguage } from '@/context/language-context'
import { useClaim } from '@/context/claim-context'
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
  const router = useRouter()
  const { t, lang, setLang } = useLanguage()
  const { updateWizard } = useClaim()
  const [newAlerts, setNewAlerts] = useState(true)
  const [statusAlerts, setStatusAlerts] = useState(true)
  const [biometric, setBiometric] = useState(false)

  // Profile edit sheet
  const [profileOpen, setProfileOpen] = useState(false)
  const [profileName, setProfileName] = useState('Ahmad bin Razali')
  const [profilePhone, setProfilePhone] = useState('012-345 6789')
  const [profileEmail, setProfileEmail] = useState('ahmad.razali@email.com')

  const initials = profileName
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <MobileContainer>
      <TopBar title={t('set.title')} back={false} />
      <PageTransition className="flex flex-1 flex-col">
        <main className="flex-1 px-5 pb-6">
          {/* Profile card */}
          <div className="mt-1 flex items-center gap-4 rounded-2xl bg-pine p-4 text-pine-foreground">
            <span className="flex size-14 items-center justify-center rounded-full bg-pine-foreground/15 font-display text-lg font-bold">
              {initials || 'AR'}
            </span>
            <div className="min-w-0">
              <p className="text-base font-bold">{profileName}</p>
              <p className="font-mono text-sm tabular-nums text-pine-foreground/70">900214-08-5127</p>
            </div>
            <button
              onClick={() => setProfileOpen(true)}
              className="ml-auto flex size-9 items-center justify-center rounded-full bg-pine-foreground/15 transition-colors hover:bg-pine-foreground/25"
              aria-label={t('set.profile')}
            >
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

          {/* Demo utilities */}
          <Section title="Demo">
            <button
              onClick={() => router.push('/error-demo')}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
            >
              <CloudOff className="size-5 text-clay" />
              <span className="flex-1 text-[0.95rem] font-medium text-foreground">Error state</span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </button>
          </Section>
        </main>
        <BottomNav />
      </PageTransition>

      {/* Profile edit bottom sheet */}
      <AnimatePresence>
        {profileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setProfileOpen(false)}
              className="absolute inset-0 z-40 bg-ink/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="absolute inset-x-0 bottom-0 z-50 rounded-t-3xl bg-background p-5 pb-10"
            >
              <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-border" />
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-extrabold text-foreground">
                  Edit profile
                </h2>
                <button
                  onClick={() => setProfileOpen(false)}
                  className="flex size-9 items-center justify-center rounded-full hover:bg-foreground/5"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="mt-5 flex flex-col gap-4">
                <Field
                  label="Full name"
                  value={profileName}
                  onChange={setProfileName}
                />
                <div className="flex flex-col gap-1.5">
                  <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <Phone className="size-3.5" />
                    Mobile number
                  </span>
                  <div className="flex items-center rounded-2xl border-2 border-border bg-background px-4 focus-within:border-pine transition-colors">
                    <input
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      className="h-12 flex-1 bg-transparent text-sm font-medium outline-none"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <Mail className="size-3.5" />
                    Email address
                  </span>
                  <div className="flex items-center rounded-2xl border-2 border-border bg-background px-4 focus-within:border-pine transition-colors">
                    <input
                      type="email"
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      className="h-12 flex-1 bg-transparent text-sm font-medium outline-none"
                    />
                  </div>
                </div>
              </div>

              <AppButton
                variant="primary"
                size="block"
                className="mt-6"
                onClick={() => {
                  updateWizard({ name: profileName, phone: profilePhone, email: profileEmail })
                  setProfileOpen(false)
                }}
              >
                <Check className="size-5" />
                Save changes
              </AppButton>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </MobileContainer>
  )
}
