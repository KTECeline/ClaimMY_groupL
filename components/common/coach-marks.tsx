'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, X } from 'lucide-react'
import { AppButton } from '@/components/ui/app-button'
import { PhoneOverlay } from '@/components/layout/phone-overlay'
import { useLanguage } from '@/context/language-context'
import { useOnceFlag } from '@/lib/use-persistent-state'

export type CoachMark = { title: string; body: string }

/**
 * Group 8 · Learnability — "first-time coach-marks on Home". Only 33.3% of
 * survey respondents knew unclaimed money existed, so the first run has to
 * teach rather than assume. Shown once, then never again.
 */
export function CoachMarks({ marks, flag }: { marks: CoachMark[]; flag: string }) {
  const [seen, markSeen, hydrated] = useOnceFlag(flag)
  const [index, setIndex] = useState(0)
  const { t } = useLanguage()

  // Wait for storage — otherwise this flashes on every visit.
  if (!hydrated || seen) return null

  const mark = marks[index]
  const last = index === marks.length - 1

  return (
    <AnimatePresence>
      <PhoneOverlay>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 flex items-end bg-ink/55 p-5 pb-24 backdrop-blur-[2px]"
        >
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          className="w-full rounded-3xl bg-card p-5 shadow-2xl"
          role="dialog"
          aria-label={mark.title}
        >
          <div className="flex items-start justify-between gap-3">
            <span className="rounded-full bg-gold-soft px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-accent-foreground">
              {index + 1} / {marks.length}
            </span>
            <button
              onClick={markSeen}
              aria-label={t('common.skip')}
              className="-mr-1 -mt-1 flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/5"
            >
              <X className="size-4" />
            </button>
          </div>

          <h2 className="mt-3 font-display text-xl font-bold text-balance">
            {mark.title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
            {mark.body}
          </p>

          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={markSeen}
              className="text-sm font-bold text-muted-foreground underline underline-offset-2"
            >
              {t('common.skip')}
            </button>
            <AppButton
              className="ml-auto"
              onClick={() => (last ? markSeen() : setIndex((i) => i + 1))}
            >
              {last ? t('coach.done') : t('common.next')}
              <ArrowRight className="size-4" />
            </AppButton>
            </div>
          </motion.div>
        </motion.div>
      </PhoneOverlay>
    </AnimatePresence>
  )
}
