'use client'

import type { ReactNode } from 'react'
import { MotionConfig } from 'motion/react'
import { LanguageProvider } from '@/context/language-context'
import { SettingsProvider, useSettings } from '@/context/settings-context'
import { ToastProvider } from '@/context/toast-context'
import { ClaimProvider } from '@/context/claim-context'

/** Reads the accessibility toggle, so "Reduce motion" disables every animation. */
function MotionGate({ children }: { children: ReactNode }) {
  const { display } = useSettings()
  return (
    <MotionConfig reducedMotion={display.reduceMotion ? 'always' : 'user'}>
      {children}
    </MotionConfig>
  )
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <SettingsProvider>
        <MotionGate>
          <ToastProvider>
            <ClaimProvider>{children}</ClaimProvider>
          </ToastProvider>
        </MotionGate>
      </SettingsProvider>
    </LanguageProvider>
  )
}
