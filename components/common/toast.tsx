'use client'

import { AnimatePresence, motion } from 'motion/react'
import { Check, Info, TriangleAlert, X } from 'lucide-react'
import { useToast } from '@/context/toast-context'
import { useLanguage } from '@/context/language-context'
import { cn } from '@/lib/utils'

const TONE = {
  success: { icon: Check, ring: 'bg-pine text-pine-foreground' },
  info: { icon: Info, ring: 'bg-ink text-paper' },
  danger: { icon: TriangleAlert, ring: 'bg-clay text-clay-foreground' },
} as const

/**
 * Sits above the bottom nav (the lo-fi pins it to `bottom:76`), inside the
 * phone frame rather than the browser viewport so it reads as part of the app.
 */
export function ToastViewport() {
  const { toasts, dismiss } = useToast()
  const { t } = useLanguage()

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex justify-center">
      <div className="w-full max-w-[400px] px-4 pb-[76px]">
        <AnimatePresence initial={false}>
          {toasts.map((toast) => {
            const { icon: Icon, ring } = TONE[toast.tone]
            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                className={cn(
                  'pointer-events-auto mt-2 flex items-center gap-3 rounded-2xl px-4 py-3 shadow-[0_12px_32px_-12px_rgba(21,36,30,0.55)]',
                  ring,
                )}
                role="status"
                aria-live="polite"
              >
                <Icon className="size-[1.1rem] shrink-0" strokeWidth={2.6} />
                <span className="flex-1 text-sm font-semibold leading-snug text-balance">
                  {toast.message}
                </span>

                {toast.undo && (
                  <button
                    onClick={() => {
                      toast.undo?.()
                      dismiss(toast.id)
                    }}
                    className="shrink-0 rounded-full bg-white/20 px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors hover:bg-white/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
                  >
                    {t('common.undo')}
                  </button>
                )}

                <button
                  onClick={() => dismiss(toast.id)}
                  aria-label={t('common.dismiss')}
                  className="shrink-0 rounded-full p-1 opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
                >
                  <X className="size-4" />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
