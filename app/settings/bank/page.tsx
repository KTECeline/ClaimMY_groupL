'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, ChevronDown, Loader2, ShieldCheck } from 'lucide-react'
import { AppShell } from '@/components/layout/app-shell'
import { Field } from '@/components/wizard/field'
import { useLanguage } from '@/context/language-context'
import { useClaim } from '@/context/claim-context'
import { useToast } from '@/context/toast-context'
import { BANKS } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

/**
 * Settings → Bank accounts. The same account the claim wizard's payout step
 * (S-14) reads and writes — there's only ever one saved account in this
 * prototype, so this screen is that step's fields without the "continue"
 * gate, reachable outside a claim instead of buried inside one.
 */
export default function BankAccountsPage() {
  const { t } = useLanguage()
  const { wizard, updateWizard } = useClaim()
  const { show } = useToast()
  const [open, setOpen] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  const canVerify = wizard.bankAccount.replace(/\D/g, '').length >= 10

  function verify() {
    setVerifying(true)
    timer.current = setTimeout(() => {
      setVerifying(false)
      updateWizard({ bankVerified: true })
      show({ message: t('bank.saved') })
    }, 1200)
  }

  return (
    <AppShell title={t('profile.bank')} fab={false}>
      <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
        {t('bank.sub')}
      </p>

      {/* Bank picker */}
      <div className="mt-5 flex flex-col gap-1.5">
        <span className="text-sm font-semibold">{t('wiz.s6.bank')}</span>
        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          data-tap
          className="flex h-13 min-h-[3.25rem] items-center gap-3 rounded-2xl border-2 border-border bg-card px-4 text-left transition-colors hover:border-pine/40"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-pine-soft text-xs font-bold text-pine">
            {wizard.bankName.slice(0, 2).toUpperCase()}
          </span>
          <span className="flex-1 font-semibold">
            {wizard.bankName || t('wiz.s6.bank.select')}
          </span>
          <motion.span animate={{ rotate: open ? 180 : 0 }}>
            <ChevronDown className="size-5 text-muted-foreground" />
          </motion.span>
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden rounded-2xl border border-border bg-card"
            >
              {BANKS.map((bank) => (
                <li key={bank}>
                  <button
                    onClick={() => {
                      updateWizard({ bankName: bank, bankVerified: false })
                      setOpen(false)
                    }}
                    data-tap
                    className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold transition-colors hover:bg-pine-soft/40"
                  >
                    {bank}
                    {bank === wizard.bankName && (
                      <Check className="size-4 text-pine" strokeWidth={3} />
                    )}
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4">
        <Field
          label={t('wiz.s6.account')}
          value={wizard.bankAccount}
          mono
          inputMode="numeric"
          onChange={(bankAccount) =>
            updateWizard({ bankAccount, bankVerified: false })
          }
        />
      </div>

      {/* Inline validation instead of failing at submit */}
      <div className="mt-3">
        <AnimatePresence mode="wait" initial={false}>
          {wizard.bankVerified ? (
            <motion.div
              key="ok"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="flex items-center gap-2.5 rounded-2xl bg-pine-soft px-4 py-3"
            >
              <ShieldCheck className="size-4 shrink-0 text-pine" />
              <span className="text-sm font-semibold text-pine">
                {t('wiz.s6.verified', { name: wizard.name })}
              </span>
            </motion.div>
          ) : (
            <motion.button
              key="verify"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              onClick={verify}
              disabled={!canVerify || verifying}
              data-tap
              className={cn(
                'flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-pine/25 py-3 text-sm font-bold text-pine transition-colors',
                (!canVerify || verifying) && 'opacity-50',
              )}
            >
              {verifying && <Loader2 className="size-4 animate-spin" />}
              {verifying ? t('wiz.s6.verifying') : t('wiz.s6.verify')}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  )
}
