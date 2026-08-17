'use client'

import type { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { AppButton } from '@/components/ui/app-button'
import { useLanguage } from '@/context/language-context'
import { useToast } from '@/context/toast-context'

/**
 * Every wizard step shares the same skeleton: heading, subtitle, body, then a
 * primary Continue and the "Save & continue later" escape hatch the lo-fi puts
 * on all six steps. That escape hatch is the direct answer to the journey
 * map's "no save-and-resume" pain point — state is already persisted, so
 * leaving genuinely loses nothing.
 */
export function StepWrapper({
  title,
  subtitle,
  children,
  onContinue,
  continueLabel,
  disabled = false,
  disabledHint,
  extraAction,
}: {
  title: string
  subtitle?: string
  children: ReactNode
  onContinue: () => void
  continueLabel?: string
  disabled?: boolean
  /** Shown instead of nothing when the Continue button is blocked. */
  disabledHint?: string
  extraAction?: ReactNode
}) {
  const router = useRouter()
  const { t } = useLanguage()
  const { show } = useToast()

  return (
    <motion.div
      initial={{ opacity: 0, x: 28 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-1 flex-col px-5 pb-28"
    >
      <h2 className="font-display text-2xl font-bold tracking-tight text-balance">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground text-pretty">
          {subtitle}
        </p>
      )}

      <div className="mt-6 flex flex-1 flex-col">{children}</div>

      {extraAction}

      <div className="mt-8 flex flex-col gap-2.5">
        {disabled && disabledHint && (
          <p className="text-center text-xs font-semibold text-muted-foreground">
            {disabledHint}
          </p>
        )}
        <AppButton size="block" onClick={onContinue} disabled={disabled}>
          {continueLabel ?? t('wiz.next')}
          <ArrowRight className="size-5" />
        </AppButton>
        <AppButton
          variant="outline"
          size="block"
          onClick={() => {
            show({ message: t('wiz.saved.toast') })
            router.push('/home')
          }}
        >
          {t('wiz.save.later')}
        </AppButton>
      </div>
    </motion.div>
  )
}
