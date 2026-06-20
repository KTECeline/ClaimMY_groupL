'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { Check, Copy, ArrowRight } from 'lucide-react'
import { AppButton } from '@/components/ui/app-button'
import { Amount } from '@/components/common/amount'
import { ConfettiBurst } from '@/components/common/confetti-burst'
import { useLanguage } from '@/context/language-context'
import { useClaim } from '@/context/claim-context'
import { formatRM } from '@/lib/utils'

export default function SuccessPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const { activeClaim, lastRef, resetWizard, setActiveClaim } = useClaim()

  useEffect(() => {
    if (!activeClaim || !lastRef) router.replace('/home')
  }, [activeClaim, lastRef, router])

  if (!activeClaim || !lastRef) return null

  const steps = ['success.next.1', 'success.next.2', 'success.next.3']

  function done(path: string) {
    setActiveClaim(null)
    resetWizard()
    router.push(path)
  }

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-pine px-5 pb-10 pt-16 text-pine-foreground">
      {/* Celebration */}
      <div className="relative flex flex-col items-center text-center">
        <ConfettiBurst />
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.1 }}
          className="relative z-10 flex size-24 items-center justify-center rounded-full bg-gold text-gold-foreground shadow-[0_12px_40px_-8px_rgba(201,138,31,0.6)]"
        >
          <Check className="size-12" strokeWidth={3} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-6 font-display text-3xl font-extrabold text-balance"
        >
          {t('success.title')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mt-2 max-w-xs text-sm leading-relaxed text-pine-foreground/80 text-pretty"
        >
          {t('success.body').replace('{amount}', formatRM(activeClaim.amount))}
        </motion.p>
      </div>

      {/* Reference card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="relative z-10 mt-8 rounded-3xl bg-pine-foreground/10 p-5 ring-1 ring-pine-foreground/15 backdrop-blur-sm"
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-pine-foreground/60">
          {t('success.ref')}
        </p>
        <div className="mt-1 flex items-center justify-between gap-3">
          <span className="font-mono text-xl font-bold tracking-wider tabular-nums">
            {lastRef}
          </span>
          <button
            className="flex items-center gap-1.5 rounded-full bg-pine-foreground/15 px-3 py-1.5 text-xs font-semibold"
            onClick={() => navigator.clipboard?.writeText(lastRef)}
          >
            <Copy className="size-3.5" />
            Copy
          </button>
        </div>
      </motion.div>

      {/* What happens next */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="relative z-10 mt-6"
      >
        <p className="text-sm font-bold text-pine-foreground/90">{t('success.next')}</p>
        <ol className="mt-3 flex flex-col gap-3">
          {steps.map((key, i) => (
            <li key={key} className="flex items-center gap-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-pine-foreground/15 font-mono text-sm font-bold">
                {i + 1}
              </span>
              <span className="text-sm leading-relaxed text-pine-foreground/85">{t(key)}</span>
            </li>
          ))}
        </ol>
      </motion.div>

      <div className="relative z-10 mt-auto flex flex-col gap-3 pt-8">
        <AppButton variant="gold" size="block" onClick={() => done('/track')}>
          {t('success.track')}
          <ArrowRight className="size-5" />
        </AppButton>
        <AppButton
          size="block"
          className="bg-pine-foreground/10 text-pine-foreground hover:bg-pine-foreground/20"
          onClick={() => done('/home')}
        >
          {t('success.home')}
        </AppButton>
      </div>
    </div>
  )
}
