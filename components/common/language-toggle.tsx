'use client'

import { useState, useRef, useEffect } from 'react'
import { Globe, Check } from 'lucide-react'
import { useLanguage } from '@/context/language-context'
import { LANGUAGES, type Lang } from '@/lib/i18n/dictionary'
import { cn } from '@/lib/utils'

export function LanguageToggle({ light = false }: { light?: boolean }) {
  const { lang, setLang } = useLanguage()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const current = LANGUAGES.find((l) => l.code === lang)!

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Change language"
        aria-expanded={open}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full px-3 h-9 text-sm font-semibold transition-colors',
          light
            ? 'bg-white/15 text-pine-foreground hover:bg-white/25'
            : 'bg-secondary text-foreground hover:bg-secondary/70',
        )}
      >
        <Globe className="size-4" />
        {current.code.toUpperCase()}
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-2xl border border-border bg-popover shadow-xl">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLang(l.code as Lang)
                setOpen(false)
              }}
              className="flex w-full items-center justify-between px-4 py-3 text-left text-sm hover:bg-muted"
            >
              <span>
                <span className="font-semibold text-foreground">{l.native}</span>
                <span className="ml-2 text-xs text-muted-foreground">{l.label}</span>
              </span>
              {l.code === lang && <Check className="size-4 text-pine" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
