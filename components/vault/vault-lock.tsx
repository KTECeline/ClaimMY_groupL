'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { Lock, ScanFace, X } from 'lucide-react'
import { PinPad } from '@/components/common/pin-pad'
import { PhoneOverlay } from '@/components/layout/phone-overlay'
import { useLanguage } from '@/context/language-context'
import { useSettings } from '@/context/settings-context'
import { useToast } from '@/context/toast-context'

/**
 * S-31 · Vault Lock Screen. Rendered as a sheet over the vault rather than a
 * separate route, so unlocking lands you exactly where you were headed.
 * The lo-fi gives it its own lighter background and a close `✕` instead of a
 * back arrow — it is a modal, not a page.
 */
export function VaultLock() {
  const router = useRouter()
  const { t } = useLanguage()
  const { unlockVault, security } = useSettings()
  const { show } = useToast()
  const [scanning, setScanning] = useState(false)

  function unlock() {
    unlockVault()
    show({ message: t('vault.unlocked') })
  }

  function faceId() {
    setScanning(true)
    setTimeout(unlock, 900)
  }

  return (
    <PhoneOverlay>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 flex flex-col bg-secondary"
      >
      <header className="flex h-16 items-center px-4">
        <button
          onClick={() => router.push('/settings')}
          aria-label={t('common.close')}
          className="flex size-10 items-center justify-center rounded-full transition-colors hover:bg-foreground/5"
        >
          <X className="size-6" />
        </button>
        <h1 className="flex-1 pr-10 text-center font-display text-lg font-bold">
          {t('vault.title')}
        </h1>
      </header>

      <div className="flex flex-1 flex-col items-center overflow-y-auto no-scrollbar px-6 pb-8 text-center">
        <motion.span
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 320, damping: 24 }}
          className="flex size-16 items-center justify-center rounded-full border-2 border-border bg-card text-pine"
        >
          <Lock className="size-7" />
        </motion.span>

        <h2 className="mt-5 font-display text-xl font-bold">
          {t('vault.lock.title')}
        </h2>
        <p className="mt-1.5 max-w-[17rem] text-sm leading-relaxed text-muted-foreground text-pretty">
          {t('vault.lock.sub')}
        </p>

        {security.biometric && (
          <>
            <button
              onClick={faceId}
              aria-label={t('vault.lock.face')}
              className="mt-7 flex size-24 items-center justify-center rounded-full border-2 border-pine/30 bg-card text-pine transition-transform active:scale-95"
            >
              <motion.span
                animate={scanning ? { scale: [1, 1.12, 1] } : {}}
                transition={{ repeat: scanning ? Infinity : 0, duration: 0.9 }}
              >
                <ScanFace className="size-11" strokeWidth={1.6} />
              </motion.span>
            </button>
            <p className="mt-2.5 text-sm font-semibold text-pine">
              {t('vault.lock.face')}
            </p>

            <div className="mt-6 flex w-full items-center gap-3">
              <span className="h-px flex-1 bg-border" />
              <span className="text-xs font-semibold text-muted-foreground">
                {t('vault.lock.or')}
              </span>
              <span className="h-px flex-1 bg-border" />
            </div>
          </>
        )}

        <p className="mt-5 text-sm font-semibold">{t('vault.lock.pin')}</p>
        <div className="mt-4 w-full">
          <PinPad onComplete={unlock} backspaceLabel={t('common.backspace')} />
        </div>

        <button className="mt-5 text-sm font-bold text-pine underline underline-offset-2">
          {t('vault.lock.forgot')}
        </button>
          <p className="mt-3 text-xs text-muted-foreground">
            {t('vault.lock.demo')}
          </p>
        </div>
      </motion.div>
    </PhoneOverlay>
  )
}
