'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Check, ChevronDown, Lock } from 'lucide-react'
import { MobileContainer } from '@/components/layout/mobile-container'
import { TopBar } from '@/components/layout/top-bar'
import { AppButton } from '@/components/ui/app-button'
import { useLanguage } from '@/context/language-context'
import { useClaim } from '@/context/claim-context'
import { DEMO_IC } from '@/lib/mock-data'
import { formatIC, isValidIC, cn } from '@/lib/utils'

/**
 * S-04 IC Verify — the gate into the app. The consent checkbox is explicit
 * because the CONSIDER stage of the journey map showed users bailing at
 * "unfamiliar authentication" they didn't understand.
 */
export default function VerifyPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const { search } = useClaim()
  const [ic, setIc] = useState('')
  const [consent, setConsent] = useState(false)
  const [showWhy, setShowWhy] = useState(false)
  const [touched, setTouched] = useState(false)

  const valid = isValidIC(ic)
  const invalid = touched && ic.length > 0 && !valid

  function submit() {
    setTouched(true)
    if (!valid || !consent) return
    search(ic)
    router.push('/searching')
  }

  return (
    <MobileContainer>
      <TopBar back onBack={() => router.push('/onboarding')} />

      <div className="flex flex-1 flex-col px-6 pb-8">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-balance">
          {t('verify.title')}
        </h1>
        <p className="mt-2 leading-relaxed text-muted-foreground text-pretty">
          {t('verify.sub')}
        </p>

        <label className="mt-8 flex flex-col gap-2">
          <span className="text-sm font-semibold">{t('verify.label')}</span>
          <input
            value={ic}
            onChange={(e) => setIc(formatIC(e.target.value))}
            onBlur={() => setTouched(true)}
            inputMode="numeric"
            placeholder="000000-00-0000"
            aria-invalid={invalid}
            aria-describedby="ic-error"
            className={cn(
              'tabular h-16 rounded-2xl border-2 bg-card px-4 font-mono text-xl tracking-wide transition-colors focus:outline-none',
              invalid
                ? 'border-clay focus:border-clay'
                : 'border-border focus:border-pine',
            )}
          />
          <AnimatePresence>
            {invalid && (
              <motion.span
                id="ic-error"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-sm font-semibold text-clay"
              >
                {t('verify.invalid')}
              </motion.span>
            )}
          </AnimatePresence>
        </label>

        <button
          onClick={() => setIc(DEMO_IC)}
          className="mt-3 self-start rounded-full bg-gold-soft px-3.5 py-1.5 text-xs font-bold text-accent-foreground"
        >
          {t('verify.demo')}
        </button>

        {/* Consent */}
        <button
          onClick={() => setConsent((c) => !c)}
          data-tap
          className="mt-7 flex items-start gap-3 text-left"
          role="checkbox"
          aria-checked={consent}
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
            {t('verify.consent')}
          </span>
        </button>

        {/* Progressive disclosure — the "why" only if you want it */}
        <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-card">
          <button
            onClick={() => setShowWhy((s) => !s)}
            aria-expanded={showWhy}
            data-tap
            className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
          >
            <Lock className="size-4 shrink-0 text-pine" />
            <span className="flex-1 text-sm font-semibold">
              {t('verify.why')}
            </span>
            <motion.span animate={{ rotate: showWhy ? 180 : 0 }}>
              <ChevronDown className="size-4 text-muted-foreground" />
            </motion.span>
          </button>
          <AnimatePresence initial={false}>
            {showWhy && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <p className="border-t border-border px-4 py-3.5 text-sm leading-relaxed text-muted-foreground text-pretty">
                  {t('verify.why.body')}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-auto pt-8">
          <AppButton
            size="block"
            onClick={submit}
            disabled={!valid || !consent}
          >
            {t('verify.submit')}
            <ArrowRight className="size-5" />
          </AppButton>
        </div>
      </div>
    </MobileContainer>
  )
}
