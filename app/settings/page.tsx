'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'motion/react'
import {
  Bell,
  CreditCard,
  FileLock2,
  Globe,
  Info,
  LifeBuoy,
  LogOut,
  RotateCcw,
  ShieldCheck,
  SlidersHorizontal,
  User,
  X,
} from 'lucide-react'
import { MobileContainer } from '@/components/layout/mobile-container'
import { BottomNav } from '@/components/layout/bottom-nav'
import { TopBar } from '@/components/layout/top-bar'
import { SectionGroup, SectionRow } from '@/components/common/section-group'
import { Field } from '@/components/wizard/field'
import { AppButton } from '@/components/ui/app-button'
import { PhoneOverlay } from '@/components/layout/phone-overlay'
import { useLanguage } from '@/context/language-context'
import { useSettings } from '@/context/settings-context'
import { useToast } from '@/context/toast-context'
import { LANGUAGES } from '@/lib/i18n/dictionary'
import { NOTIFICATIONS } from '@/lib/mock-data'
import { clearPersistedState } from '@/lib/use-persistent-state'

/**
 * S-25 · My Profile. An index of grouped rows, exactly as the lo-fi draws it —
 * the deeper screens (Settings, Security, Help, Vault) each get their own
 * route rather than being crammed in here.
 */
export default function ProfilePage() {
  const router = useRouter()
  const { t, lang } = useLanguage()
  const { profile, updateProfile } = useSettings()
  const { show } = useToast()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(profile)

  const unread = NOTIFICATIONS.filter((n) => n.unread).length
  const currentLang = LANGUAGES.find((l) => l.code === lang)

  function openEdit() {
    setDraft(profile)
    setEditing(true)
  }

  function saveEdit() {
    updateProfile(draft)
    setEditing(false)
    show({ message: t('profile.saved') })
  }

  return (
    <MobileContainer>
      <TopBar title={t('profile.title')} back={false} />

      <main className="flex-1 overflow-y-auto no-scrollbar px-5 pb-28">
        {/* Identity */}
        <div className="flex flex-col items-center py-2 text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-pine font-display text-xl font-bold text-pine-foreground">
            {profile.name
              .split(' ')
              .slice(0, 2)
              .map((w) => w[0])
              .join('')}
          </span>
          <p className="mt-3 font-display text-lg font-bold">{profile.name}</p>
          <p className="tabular font-mono text-sm text-muted-foreground">
            {profile.ic}
          </p>
        </div>

        <div className="my-5 h-px bg-border" />

        {/* Account — personal, financial, and language settings live at the
            same "who you are in this app" level, so they share one group
            instead of language getting its own box for a single row. */}
        <SectionGroup label={t('profile.group.account')}>
          <SectionRow
            icon={<User className="size-4" />}
            label={t('profile.personal')}
            hint={t('profile.personal.hint')}
            onClick={openEdit}
          />
          <SectionRow
            icon={<CreditCard className="size-4" />}
            label={t('profile.bank')}
            hint={t('profile.bank.hint')}
            href="/settings/preferences"
          />
          <SectionRow
            icon={<FileLock2 className="size-4" />}
            label={t('profile.vault')}
            hint={t('profile.vault.hint')}
            href="/settings/vault"
          />
          <SectionRow
            icon={<Globe className="size-4" />}
            label={t('profile.language')}
            hint={currentLang?.native}
            href="/settings/preferences"
          />
        </SectionGroup>

        {/* Preferences & alerts — everything that changes how the app
            behaves, grouped together rather than split by a security/
            notifications line that doesn't matter to the user. */}
        <SectionGroup label={t('profile.group.notifications')}>
          <SectionRow
            icon={<Bell className="size-4" />}
            label={t('profile.alerts')}
            href="/notifications/settings"
            trailing={
              unread > 0 ? (
                <span className="flex size-6 items-center justify-center rounded-full bg-pine text-xs font-bold text-pine-foreground">
                  {unread}
                </span>
              ) : undefined
            }
          />
          <SectionRow
            icon={<SlidersHorizontal className="size-4" />}
            label={t('profile.settings')}
            hint={t('profile.settings.hint')}
            href="/settings/preferences"
          />
          <SectionRow
            icon={<ShieldCheck className="size-4" />}
            label={t('profile.security')}
            hint={t('profile.security.hint')}
            href="/settings/security"
          />
        </SectionGroup>

        <SectionGroup label={t('profile.group.about')}>
          <SectionRow
            icon={<LifeBuoy className="size-4" />}
            label={t('profile.help')}
            href="/settings/help"
          />
          <SectionRow
            icon={<Info className="size-4" />}
            label={t('profile.about')}
            hint={t('profile.version')}
            trailing={<span />}
          />
          <SectionRow
            icon={<RotateCcw className="size-4" />}
            label={t('profile.reset')}
            onClick={() => {
              clearPersistedState()
              show({ message: t('profile.reset.done') })
              setTimeout(() => window.location.assign('/'), 600)
            }}
          />
        </SectionGroup>

        <AppButton
          variant="ghost"
          size="block"
          className="text-clay"
          onClick={() => router.push('/')}
        >
          <LogOut className="size-4" />
          {t('profile.logout')}
        </AppButton>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          {t('profile.version')}
        </p>
      </main>

      {/* Edit personal details */}
      <AnimatePresence>
        {editing && (
          <PhoneOverlay>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditing(false)}
              className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="absolute inset-x-0 bottom-0 max-h-[88%] overflow-y-auto no-scrollbar rounded-t-3xl bg-card p-5 pb-8 shadow-2xl"
              role="dialog"
              aria-label={t('profile.personal')}
            >
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-display text-xl font-bold">
                  {t('profile.personal')}
                </h2>
                <button
                  onClick={() => setEditing(false)}
                  aria-label={t('common.close')}
                  className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-foreground/5"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="mt-5 flex flex-col gap-4">
                <Field
                  label={t('wiz.s5.name')}
                  value={draft.name}
                  onChange={(name) => setDraft({ ...draft, name })}
                />
                <Field
                  label={t('wiz.s5.phone')}
                  value={draft.phone}
                  mono
                  inputMode="tel"
                  onChange={(phone) => setDraft({ ...draft, phone })}
                />
                <Field
                  label={t('wiz.s5.email')}
                  value={draft.email}
                  type="email"
                  inputMode="email"
                  onChange={(email) => setDraft({ ...draft, email })}
                />
                <Field
                  label={t('wiz.s5.address')}
                  value={draft.address}
                  multiline
                  onChange={(address) => setDraft({ ...draft, address })}
                />
              </div>

              <AppButton size="block" className="mt-6" onClick={saveEdit}>
                {t('common.save')}
              </AppButton>
            </motion.div>
          </PhoneOverlay>
        )}
      </AnimatePresence>

      <BottomNav />
    </MobileContainer>
  )
}
