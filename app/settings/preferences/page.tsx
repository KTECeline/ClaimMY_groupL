'use client'

import { Check, Globe, Type } from 'lucide-react'
import { AppShell } from '@/components/layout/app-shell'
import { SectionGroup, SectionRow } from '@/components/common/section-group'
import { ToggleRow } from '@/components/common/toggle-row'
import { useLanguage } from '@/context/language-context'
import { useSettings, type AlertPrefs } from '@/context/settings-context'
import { useToast } from '@/context/toast-context'
import { LANGUAGES, type Lang } from '@/lib/i18n/dictionary'
import { cn } from '@/lib/utils'

const ALERT_TYPES: { key: keyof AlertPrefs; label: string }[] = [
  { key: 'newMoney', label: 'alertset.newmoney' },
  { key: 'statusUpdates', label: 'alertset.status' },
  { key: 'reminders', label: 'alertset.reminders' },
  { key: 'marketing', label: 'alertset.marketing' },
]

/**
 * S-25b · Settings.
 *
 * The dendrogram clustered Accessibility settings and Language selection at
 * ~70% similarity, so they sit together here as user preferences. Simple Mode
 * is the one that matters: 58.5% flagged accessibility, and Tan Lai Keong (60)
 * is the persona this app is hardest for.
 */
export default function PreferencesPage() {
  const { t, lang, setLang } = useLanguage()
  const { display, toggleDisplay, alerts, toggleAlert } = useSettings()
  const { show } = useToast()

  return (
    <AppShell title={t('prefs.title')} fab={false}>
      <SectionGroup label={t('prefs.group.display')}>
        <ToggleRow
          label={t('prefs.simple')}
          hint={t('prefs.simple.hint')}
          checked={display.simpleMode}
          onChange={(next) => {
            toggleDisplay('simpleMode')
            show({ message: next ? t('prefs.simple.on') : t('prefs.simple.off') })
          }}
        />
        <ToggleRow
          label={t('prefs.contrast')}
          hint={t('prefs.contrast.hint')}
          checked={display.highContrast}
          onChange={() => toggleDisplay('highContrast')}
        />
        <ToggleRow
          label={t('prefs.motion')}
          hint={t('prefs.motion.hint')}
          checked={display.reduceMotion}
          onChange={() => toggleDisplay('reduceMotion')}
        />
      </SectionGroup>

      {/* Language sits with accessibility, per the dendrogram cluster */}
      <SectionGroup label={t('prefs.group.accessibility')}>
        <SectionRow
          icon={<Globe className="size-4" />}
          label={t('prefs.language')}
          trailing={<span />}
        />
        <div className="px-4 pb-4 pt-1">
          <div className="flex flex-col gap-2">
            {LANGUAGES.map((l) => {
              const active = l.code === lang
              return (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code as Lang)}
                  aria-pressed={active}
                  data-tap
                  className={cn(
                    'flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-colors',
                    active
                      ? 'border-pine bg-pine-soft/50'
                      : 'border-border hover:border-pine/40',
                  )}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">{l.native}</span>
                    <span className="block text-xs text-muted-foreground">
                      {l.label}
                    </span>
                  </span>
                  {active && (
                    <Check className="size-5 shrink-0 text-pine" strokeWidth={3} />
                  )}
                </button>
              )
            })}
          </div>
          {/* Honest about the prototype's own limits */}
          {(lang === 'zh' || lang === 'ta') && (
            <p className="mt-3 flex items-start gap-2 rounded-xl bg-gold-soft p-3 text-xs leading-relaxed text-accent-foreground text-pretty">
              <Type className="mt-0.5 size-3.5 shrink-0" />
              {t('prefs.partial')}
            </p>
          )}
        </div>
      </SectionGroup>

      <SectionGroup label={t('prefs.group.notifications')}>
        {ALERT_TYPES.map(({ key, label }) => (
          <ToggleRow
            key={key}
            label={t(label)}
            checked={alerts[key]}
            onChange={() => toggleAlert(key)}
          />
        ))}
      </SectionGroup>
    </AppShell>
  )
}
