'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'motion/react'
import { HelpCircle, MessageCircle, BookOpen, Phone, X } from 'lucide-react'
import { useLanguage } from '@/context/language-context'
import { PhoneOverlay } from '@/components/layout/phone-overlay'
import { cn } from '@/lib/utils'

const EASE = [0.22, 1, 0.36, 1] as const

/**
 * Global support entry point. Card sorting put help in 5–6 different categories
 * (Search 40% vs Guided 30%), which reads as "no single home" — so it lives
 * everywhere instead of being nested under one section.
 */
export function HelpFab({ className }: { className?: string }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()

  const actions = [
    {
      icon: MessageCircle,
      label: t('help.fab.chat'),
      hint: t('help.fab.chat.hint'),
      onClick: () => router.push('/settings/help'),
    },
    {
      icon: BookOpen,
      label: t('help.fab.faq'),
      hint: t('help.fab.faq.hint'),
      onClick: () => router.push('/settings/help'),
    },
    {
      icon: Phone,
      label: t('help.fab.call'),
      hint: '1-300-88-2525',
      onClick: () => setOpen(false),
    },
  ]

  return (
    <>
      <PhoneOverlay align="bottom" className="pointer-events-none">
        <button
          onClick={() => setOpen(true)}
          aria-label={t('help.fab.aria')}
          className={cn(
            // A floating action button genuinely needs elevation to read as
            // "above" the page — but a neutral shadow says that; a pine-tinted
            // glow just says "generated".
            'pointer-events-auto absolute right-4 bottom-[5.25rem] flex size-12 items-center justify-center rounded-full bg-pine text-pine-foreground shadow-lg shadow-ink/20 transition-transform active:scale-95 focus-visible:ring-4 focus-visible:ring-ring/30',
            className,
          )}
        >
          <HelpCircle className="size-6" strokeWidth={2.2} />
        </button>
      </PhoneOverlay>

      <AnimatePresence>
        {open && (
          <PhoneOverlay>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-card p-5 pb-8 shadow-2xl"
              role="dialog"
              aria-label={t('help.fab.aria')}
            >
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />

              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl font-bold">
                    {t('help.fab.title')}
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground text-pretty">
                    {t('help.fab.sub')}
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label={t('common.close')}
                  className="flex size-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-foreground/5 focus-visible:ring-4 focus-visible:ring-ring/30"
                >
                  <X className="size-5" />
                </button>
              </div>

              <ul className="flex flex-col gap-2">
                {actions.map(({ icon: Icon, label, hint, onClick }) => (
                  <li key={label}>
                    <button
                      onClick={() => {
                        setOpen(false)
                        onClick()
                      }}
                      className="flex w-full items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3.5 text-left transition-colors hover:bg-pine-soft/40 focus-visible:ring-4 focus-visible:ring-ring/30"
                    >
                      <Icon
                        className="size-5 shrink-0 text-pine"
                        strokeWidth={2.2}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold">{label}</span>
                        <span className="block truncate text-sm text-muted-foreground">
                          {hint}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          </PhoneOverlay>
        )}
      </AnimatePresence>
    </>
  )
}
