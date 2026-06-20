'use client'

import type { ReactNode } from 'react'
import { LanguageProvider } from '@/context/language-context'
import { ClaimProvider } from '@/context/claim-context'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <ClaimProvider>{children}</ClaimProvider>
    </LanguageProvider>
  )
}
