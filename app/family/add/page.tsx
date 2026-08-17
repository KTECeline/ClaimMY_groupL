'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Search } from 'lucide-react'
import { AppShell } from '@/components/layout/app-shell'
import { Field } from '@/components/wizard/field'
import { AppButton } from '@/components/ui/app-button'
import { useLanguage } from '@/context/language-context'
import { useSettings } from '@/context/settings-context'
import { useClaim } from '@/context/claim-context'
import { useToast } from '@/context/toast-context'
import { formatIC, isValidIC, cn } from '@/lib/utils'

const RELATIONSHIPS = [
  'family.add.rel.parent',
  'family.add.rel.spouse',
  'family.add.rel.child',
  'family.add.rel.sibling',
  'family.add.rel.other',
]

const AVATAR_COLORS = ['var(--pine)', 'var(--gold)', 'var(--clay)', 'var(--teal)']

/**
 * S-18 · Add Member. A full route rather than the bottom sheet it used to be —
 * the deck draws it as its own screen, and consent to search someone else's IC
 * deserves a screen, not a sheet you can dismiss by accident.
 */
export default function AddFamilyMemberPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const { family, addFamilyMember, removeFamilyMember } = useSettings()
  const { search } = useClaim()
  const { show } = useToast()

  const [name, setName] = useState('')
  const [ic, setIc] = useState('')
  const [rel, setRel] = useState(RELATIONSHIPS[0])
  const [consent, setConsent] = useState(false)

  const valid = name.trim().length > 1 && isValidIC(ic) && consent

  function submit() {
    if (!valid) return
    const id = `fam-${Date.now()}`
    const initials = name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? '')
      .join('')

    addFamilyMember({
      id,
      name: name.trim(),
      ic,
      relationship: rel,
      avatarColor: AVATAR_COLORS[family.length % AVATAR_COLORS.length],
      initials,
      claimable: 0,
      claims: 0,
    })

    // Visibility principle: confirm the action, and offer Undo rather than
    // making the user hunt for a delete afterwards.
    show({
      message: t('family.added.toast', { name: name.trim() }),
      undo: () => removeFamilyMember(id),
    })

    search(ic)
    router.push('/searching')
  }

  return (
    <AppShell title={t('family.add.title')} fab={false}>
      <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
        {t('family.add.sub')}
      </p>

      <div className="mt-6 flex flex-col gap-4">
        <Field
          label={t('family.add.name')}
          value={name}
          onChange={setName}
          placeholder="Zainab binti Hamid"
        />
        <Field
          label={t('family.add.ic')}
          value={ic}
          mono
          inputMode="numeric"
          placeholder="000000-00-0000"
          onChange={(v) => setIc(formatIC(v))}
        />

        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold">{t('family.add.rel')}</span>
          <div className="flex flex-wrap gap-2" role="radiogroup">
            {RELATIONSHIPS.map((key) => {
              const active = rel === key
              return (
                <button
                  key={key}
                  role="radio"
                  aria-checked={active}
                  onClick={() => setRel(key)}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                    active
                      ? 'bg-pine text-pine-foreground'
                      : 'border border-border bg-card text-muted-foreground hover:text-foreground',
                  )}
                >
                  {t(key)}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Consent — searching someone else's IC is not the user's to assume */}
      <button
        onClick={() => setConsent((c) => !c)}
        role="checkbox"
        aria-checked={consent}
        data-tap
        className="mt-6 flex items-start gap-3 text-left"
      >
        <span
          className={cn(
            'mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-lg border-2 transition-colors',
            consent ? 'border-pine bg-pine text-pine-foreground' : 'border-border',
          )}
        >
          {consent && <Check className="size-4" strokeWidth={3} />}
        </span>
        <span className="text-sm leading-relaxed text-pretty">
          {t('family.add.consent')}
        </span>
      </button>

      <div className="mt-8">
        {!valid && (
          <p className="mb-2 text-center text-xs font-semibold text-muted-foreground">
            {t('family.add.gate')}
          </p>
        )}
        <AppButton size="block" onClick={submit} disabled={!valid}>
          <Search className="size-5" />
          {t('family.add.submit')}
        </AppButton>
      </div>
    </AppShell>
  )
}
