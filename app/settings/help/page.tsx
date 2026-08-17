'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  ChevronDown,
  Headphones,
  MessageCircle,
  Phone,
  Search,
  SearchX,
} from 'lucide-react'
import { AppShell } from '@/components/layout/app-shell'
import { SectionGroup, SectionRow } from '@/components/common/section-group'
import { EmptyState } from '@/components/common/empty-state'
import { AppButton } from '@/components/ui/app-button'
import { useLanguage } from '@/context/language-context'
import { useToast } from '@/context/toast-context'
import { FAQ_TOPICS } from '@/lib/mock-data'

/**
 * S-28 · Help & FAQ.
 *
 * Card sorting spread help across five or six categories with no winner, which
 * reads as "it belongs everywhere". So this is the destination, and the `?` FAB
 * on every other screen is the doorway.
 *
 * No help FAB here — you have already arrived.
 */
export default function HelpPage() {
  const { t } = useLanguage()
  const { show } = useToast()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState<string | null>(null)

  const topics = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return FAQ_TOPICS
    return FAQ_TOPICS.filter(
      (topic) =>
        topic.question.toLowerCase().includes(q) ||
        topic.answer.toLowerCase().includes(q),
    )
  }, [query])

  return (
    <AppShell title={t('help.title')} fab={false}>
      {/* Live support */}
      <div className="flex items-center gap-3 rounded-2xl bg-pine p-4 text-pine-foreground">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-pine-foreground/15">
          <Headphones className="size-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-bold leading-snug">
            {t('help.now.title')}
          </span>
          <span className="block text-sm leading-snug text-pine-foreground/70 text-pretty">
            {t('help.now.body')}
          </span>
        </span>
      </div>
      <AppButton
        variant="gold"
        size="block"
        className="mt-3"
        onClick={() => show({ message: t('help.fab.chat.hint') })}
      >
        <MessageCircle className="size-5" />
        {t('help.chat')}
      </AppButton>

      {/* Search */}
      <label className="mt-6 flex items-center gap-2.5 rounded-2xl border-2 border-border bg-card px-4 focus-within:border-pine">
        <Search className="size-4 shrink-0 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('help.search')}
          aria-label={t('help.search')}
          className="h-13 min-h-[3.25rem] flex-1 bg-transparent text-[0.95rem] focus:outline-none"
        />
      </label>

      <h2 className="mb-2 mt-6 px-1 text-[0.7rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">
        {t('help.browse')}
      </h2>

      {topics.length === 0 ? (
        <EmptyState
          icon={<SearchX className="size-9" />}
          title={t('help.title')}
          body={t('help.empty', { q: query })}
          action={
            <AppButton
              size="block"
              onClick={() => show({ message: t('help.fab.chat.hint') })}
            >
              <MessageCircle className="size-5" />
              {t('help.chat')}
            </AppButton>
          }
        />
      ) : (
        <ul className="overflow-hidden rounded-2xl border border-border bg-card divide-y divide-border">
          {topics.map((topic) => {
            const isOpen = open === topic.id
            return (
              <li key={topic.id}>
                <button
                  onClick={() => setOpen(isOpen ? null : topic.id)}
                  aria-expanded={isOpen}
                  data-tap
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-pine-soft/30"
                >
                  <span className="flex-1 font-semibold leading-snug text-pretty">
                    {topic.question}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.22 }}
                    className="shrink-0 text-muted-foreground"
                  >
                    <ChevronDown className="size-4" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground text-pretty">
                        {topic.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            )
          })}
        </ul>
      )}

      <div className="mt-6">
        <SectionGroup label={t('help.contact')}>
          <SectionRow
            icon={<Phone className="size-4" />}
            label={t('help.phone')}
            hint={t('help.phone.hint')}
            onClick={() => show({ message: t('help.phone') })}
          />
          <SectionRow
            icon={<MessageCircle className="size-4" />}
            label={t('help.whatsapp')}
            hint={t('help.whatsapp.hint')}
            onClick={() => show({ message: t('help.whatsapp.hint') })}
          />
        </SectionGroup>
      </div>
    </AppShell>
  )
}
