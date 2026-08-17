'use client'

import { AppShell } from '@/components/layout/app-shell'
import { SectionGroup } from '@/components/common/section-group'
import { ToggleRow } from '@/components/common/toggle-row'
import { useLanguage } from '@/context/language-context'
import { useSettings, type AlertPrefs } from '@/context/settings-context'
import { useToast } from '@/context/toast-context'

const TYPES: { key: keyof AlertPrefs; label: string; hint: string }[] = [
  { key: 'newMoney', label: 'alertset.newmoney', hint: 'alertset.newmoney.hint' },
  { key: 'statusUpdates', label: 'alertset.status', hint: 'alertset.status.hint' },
  { key: 'reminders', label: 'alertset.reminders', hint: 'alertset.reminders.hint' },
  { key: 'marketing', label: 'alertset.marketing', hint: 'alertset.marketing.hint' },
]

const CHANNELS: { key: keyof AlertPrefs; label: string }[] = [
  { key: 'push', label: 'alertset.push' },
  { key: 'email', label: 'alertset.email' },
  { key: 'sms', label: 'alertset.sms' },
]

/** S-24 · Alert Settings */
export default function AlertSettingsPage() {
  const { t } = useLanguage()
  const { alerts, toggleAlert } = useSettings()
  const { show } = useToast()

  function toggle(key: keyof AlertPrefs) {
    toggleAlert(key)
    show({ message: t('alertset.saved') })
  }

  return (
    <AppShell title={t('alertset.title')} fab={false}>
      {/* Plain subtitle, not a boxed note — it's orienting text, not an aside */}
      <p className="mb-6 text-sm leading-relaxed text-muted-foreground text-pretty">
        {t('alertset.intro')}
      </p>

      <SectionGroup label={t('alertset.types')}>
        {TYPES.map(({ key, label, hint }) => (
          <ToggleRow
            key={key}
            label={t(label)}
            hint={t(hint)}
            checked={alerts[key]}
            onChange={() => toggle(key)}
          />
        ))}
      </SectionGroup>

      <SectionGroup label={t('alertset.channel')}>
        {CHANNELS.map(({ key, label }) => (
          <ToggleRow
            key={key}
            label={t(label)}
            checked={alerts[key]}
            onChange={() => toggle(key)}
          />
        ))}
      </SectionGroup>
    </AppShell>
  )
}
