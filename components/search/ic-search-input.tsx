'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, CreditCard, AlertCircle, Sparkles } from 'lucide-react'
import { AppButton } from '@/components/ui/app-button'
import { useLanguage } from '@/context/language-context'
import { useClaim } from '@/context/claim-context'
import { formatIC, isValidIC } from '@/lib/utils'
import { DEMO_IC } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export function ICSearchInput() {
  const router = useRouter()
  const { t } = useLanguage()
  const { search } = useClaim()
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  function onChange(raw: string) {
    setValue(formatIC(raw))
    if (error) setError(false)
  }

  function onSubmit() {
    if (!isValidIC(value)) {
      setError(true)
      return
    }
    search(value)
    router.push('/searching')
  }

  return (
    <div className="rounded-3xl bg-card p-5 shadow-[0_18px_40px_-24px_rgba(12,107,82,0.45)] ring-1 ring-border">
      <label
        htmlFor="ic-input"
        className="flex items-center gap-2 text-sm font-semibold text-foreground"
      >
        <CreditCard className="size-4 text-pine" />
        {t('home.ic.label')}
      </label>

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
