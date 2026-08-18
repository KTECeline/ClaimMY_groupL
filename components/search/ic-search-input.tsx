'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search,
  CreditCard,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  PenLine,
  ChevronLeft,
} from 'lucide-react'
import { AppButton } from '@/components/ui/app-button'
import { useLanguage } from '@/context/language-context'
import { useClaim } from '@/context/claim-context'
import { useSettings } from '@/context/settings-context'
import { formatIC, isValidIC } from '@/lib/utils'
import { DEMO_IC } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

/**
 * You're already logged in, so the app already knows your IC — the primary
 * job here is "find MY money" in one tap, not retyping a number you just
 * verified to sign in. Manual IC entry (for a different person) is a
 * secondary mode, one tap away, not the default.
 */
export function ICSearchInput() {
  const router = useRouter()
  const { t } = useLanguage()
  const { search, searchedIC, verifiedSearch } = useClaim()
  const { profile } = useSettings()
  const [mode, setMode] = useState<'mine' | 'manual'>('mine')
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  function onChange(raw: string) {
    setValue(formatIC(raw))
    if (error) setError(false)
  }

  function searchMine() {
    // If MyDigital ID already pulled this IC's results in the background,
    // keep that verified flag instead of resetting it — the badge on
    // Results is earned by *how* you signed in, not lost by tapping search.
    search(profile.ic, verifiedSearch && searchedIC === profile.ic)
    router.push('/searching')
  }

  function onSubmit() {
    if (!isValidIC(value)) {
      setError(true)
      return
    }
    search(value)
    router.push('/searching')
  }

  if (mode === 'mine') {
    return (
      <div className="rounded-3xl bg-card p-5 shadow-lg shadow-ink/10 ring-1 ring-border">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <ShieldCheck className="size-4 text-pine" />
          {t('home.ic.label')}
        </div>
        <p className="tabular mt-2 font-mono text-lg tracking-wide text-foreground">
          {profile.ic}
        </p>

        <AppButton variant="primary" size="block" className="mt-4" onClick={searchMine}>
          <Search className="size-5" />
          {t('home.search.mine')}
        </AppButton>

        <button
          onClick={() => setMode('manual')}
          className="mt-3 flex w-full items-center justify-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          <PenLine className="size-3.5" />
          {t('home.search.other')}
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-3xl bg-card p-5 shadow-lg shadow-ink/10 ring-1 ring-border">
      <div className="flex items-center justify-between">
        <label
          htmlFor="ic-input"
          className="flex items-center gap-2 text-sm font-semibold text-foreground"
        >
          <CreditCard className="size-4 text-pine" />
          {t('home.ic.label')}
        </label>
        <button
          onClick={() => setMode('mine')}
          className="flex items-center gap-1 text-xs font-semibold text-pine hover:underline"
        >
          <ChevronLeft className="size-3.5" />
          {t('home.search.other.back')}
        </button>
      </div>

      <div
        className={cn(
          'mt-3 flex items-center gap-3 rounded-2xl border-2 bg-background px-4 transition-colors',
          error ? 'border-clay' : 'border-border focus-within:border-pine',
        )}
      >
        <input
          id="ic-input"
          inputMode="numeric"
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
          placeholder={t('home.ic.placeholder')}
          aria-invalid={error}
          aria-describedby="ic-hint"
          className="h-14 flex-1 bg-transparent font-mono text-lg tracking-wide tabular outline-none placeholder:text-muted-foreground/50"
        />
      </div>

      {error ? (
        <p
          id="ic-hint"
          className="mt-2 flex items-center gap-1.5 text-sm font-medium text-clay"
        >
          <AlertCircle className="size-4" />
          {t('home.invalid.ic')}
        </p>
      ) : (
        <p id="ic-hint" className="mt-2 text-xs text-muted-foreground">
          {t('home.ic.hint')}
        </p>
      )}

      <AppButton variant="primary" size="block" className="mt-4" onClick={onSubmit}>
        <Search className="size-5" />
        {t('home.search')}
      </AppButton>

      <button
        onClick={() => onChange(DEMO_IC)}
        className="mt-3 flex w-full items-center justify-center gap-1.5 text-sm font-semibold text-gold hover:text-gold/80"
      >
        <Sparkles className="size-4" />
        {t('home.try.demo')}
      </button>
    </div>
  )
}
