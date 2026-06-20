'use client'

import {
  createContext,
  useContext,
  useState,
  useMemo,
  type ReactNode,
} from 'react'
import { CLAIMS, DEMO_IC, type Claim } from '@/lib/mock-data'

export type ClaimMode = 'self' | 'family' | 'deceased'

type WizardData = {
  name: string
  ic: string
  phone: string
  email: string
  mode: ClaimMode
  docsUploaded: string[] // doc keys
}

const defaultWizard: WizardData = {
  name: 'Ahmad bin Razali',
  ic: DEMO_IC,
  phone: '012-345 6789',
  email: 'ahmad.razali@email.com',
  mode: 'self',
  docsUploaded: [],
}

type ClaimContextValue = {
  searchedIC: string | null
  results: Claim[]
  search: (ic: string) => void
  getClaim: (id: string) => Claim | undefined
  activeClaim: Claim | null
  setActiveClaim: (claim: Claim | null) => void
  wizard: WizardData
  updateWizard: (patch: Partial<WizardData>) => void
  resetWizard: () => void
  lastRef: string | null
  setLastRef: (ref: string) => void
}

const ClaimContext = createContext<ClaimContextValue | null>(null)

export function ClaimProvider({ children }: { children: ReactNode }) {
  const [searchedIC, setSearchedIC] = useState<string | null>(null)
  const [results, setResults] = useState<Claim[]>([])
  const [activeClaim, setActiveClaim] = useState<Claim | null>(null)
  const [wizard, setWizard] = useState<WizardData>(defaultWizard)
  const [lastRef, setLastRef] = useState<string | null>(null)

  const value = useMemo<ClaimContextValue>(
    () => ({
      searchedIC,
      results,
      search: (ic: string) => {
        setSearchedIC(ic)
        // Demo IC returns results; everything else is empty (empty-state demo).
        const normalized = ic.replace(/\D/g, '')
        const demoNormalized = DEMO_IC.replace(/\D/g, '')
        setResults(normalized === demoNormalized ? CLAIMS : [])
      },
      getClaim: (id: string) => CLAIMS.find((c) => c.id === id),
      activeClaim,
      setActiveClaim,
      wizard,
      updateWizard: (patch) => setWizard((w) => ({ ...w, ...patch })),
      resetWizard: () => setWizard(defaultWizard),
      lastRef,
      setLastRef,
    }),
    [searchedIC, results, activeClaim, wizard, lastRef],
  )

  return <ClaimContext.Provider value={value}>{children}</ClaimContext.Provider>
}

export function useClaim() {
  const ctx = useContext(ClaimContext)
  if (!ctx) throw new Error('useClaim must be used within ClaimProvider')
  return ctx
}
