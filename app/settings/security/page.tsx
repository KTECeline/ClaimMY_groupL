'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { Monitor, Smartphone } from 'lucide-react'
import { AppShell } from '@/components/layout/app-shell'
import { SectionGroup } from '@/components/common/section-group'
import { ToggleRow } from '@/components/common/toggle-row'
import { StatusBadge } from '@/components/common/status-badge'
import { AppButton } from '@/components/ui/app-button'
import { useLanguage } from '@/context/language-context'
import { useSettings, type SecurityPrefs } from '@/context/settings-context'
import { useToast } from '@/context/toast-context'
import { SESSIONS, type Session } from '@/lib/mock-data'

const METHODS: { key: keyof SecurityPrefs; label: string; hint: string }[] = [
  { key: 'biometric', label: 'sec.biometric', hint: 'sec.biometric.hint' },
  { key: 'pin', label: 'sec.pin', hint: 'sec.pin.hint' },
  { key: 'twoFactor', label: 'sec.twofactor', hint: 'sec.twofactor.hint' },
  { key: 'loginAlerts', label: 'sec.alerts', hint: 'sec.alerts.hint' },
]

/** S-27 · Security Settings */
export default function SecurityPage() {
  const { t } = useLanguage()
  const { security, toggleSecurity } = useSettings()
  const { show } = useToast()
  const [sessions, setSessions] = useState<Session[]>(SESSIONS)

  /** Destructive actions get an Undo bar, not a confirm dialog (Group 8). */
  function signOut(session: Session) {
    const previous = sessions
    setSessions((list) => list.filter((s) => s.id !== session.id))
    show({
      message: t('sec.logout.done', { device: session.device }),
      tone: 'danger',
      undo: () => setSessions(previous),
    })
  }

  function signOutAll() {
    const previous = sessions
    setSessions((list) => list.filter((s) => s.current))
    show({
      message: t('sec.logout.all.done'),
      tone: 'danger',
      undo: () => setSessions(previous),
    })
  }

  const others = sessions.filter((s) => !s.current)

  return (
    <AppShell title={t('sec.title')} fab={false}>
      <SectionGroup label={t('sec.group.login')}>
        {METHODS.map(({ key, label, hint }) => (
          <ToggleRow
            key={key}
            label={t(label)}
            hint={t(hint)}
            checked={security[key]}
            onChange={() => toggleSecurity(key)}
          />
        ))}
      </SectionGroup>

      <h2 className="mb-2 px-1 text-[0.7rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">
        {t('sec.group.sessions')}
      </h2>
      <ul className="overflow-hidden rounded-2xl border border-border bg-card divide-y divide-border">
        {sessions.map((session, i) => (
          <motion.li
            key={session.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ delay: 0.05 * i }}
            className="flex items-center gap-3 px-4 py-3.5"
          >
            <span className="flex size-5 shrink-0 items-center justify-center text-muted-foreground">
              {session.current ? (
                <Smartphone className="size-4" />
              ) : (
                <Monitor className="size-4" />
              )}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-semibold leading-snug">
                {session.device}
              </span>
              <span className="block truncate text-sm text-muted-foreground">
                {session.detail}
              </span>
            </span>
            {session.current ? (
              <StatusBadge tone="outline">{t('sec.current')}</StatusBadge>
            ) : (
              <button
                onClick={() => signOut(session)}
                data-tap
                className="shrink-0 rounded-full border-2 border-clay/40 px-3 py-1.5 text-xs font-bold text-clay transition-colors hover:bg-clay-soft"
              >
                {t('sec.logout.one')}
              </button>
            )}
          </motion.li>
        ))}
      </ul>

      {others.length > 0 && (
        <AppButton
          variant="danger"
          size="block"
          className="mt-6"
          onClick={signOutAll}
        >
          {t('sec.logout.all')}
        </AppButton>
      )}
    </AppShell>
  )
}
