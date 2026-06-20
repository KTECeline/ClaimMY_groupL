'use client'

import {
  createContext,
  useContext,
  useState,
  useMemo,
  type ReactNode,
} from 'react'
import { CLAIMS, FAMILY_CLAIMS, DEMO_IC, type Claim, type TrackedClaim } from '@/lib/mock-data'

export type ClaimMode = 'self' | 'family' | 'deceased'

type WizardData = {
  name: string
  ic: string
  phone: string
  email: string
  bankAccount: string
  mode: ClaimMode
  docsUploaded: string[]
}

const defaultWizard: WizardData = {
  name: 'Ahmad bin Razali',
  ic: DEMO_IC,
  phone: '012-345 6789',
  email: 'ahmad.razali@email.com',
  bankAccount: 'Maybank · 1234 5678 9012',
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
  submittedClaims: TrackedClaim[]
  addSubmittedClaim: (claim: TrackedClaim) => void
  editFromReview: boolean
  setEditFromReview: (v: boolean) => void
}

const ClaimContext = createContext<ClaimContextValue | null>(null)

export function ClaimProvider({ children }: { children: ReactNode }) {
  const [searchedIC, setSearchedIC] = useState<string | null>(null)
  const [results, setResults] = useState<Claim[]>([])
  const [activeClaim, setActiveClaim] = useState<Claim | null>(null)
  const [wizard, setWizard] = useState<WizardData>(defaultWizard)
  const [lastRef, setLastRef] = useState<string | null>(null)
  const [submittedClaims, setSubmittedClaims] = useState<TrackedClaim[]>([])
  const [editFromReview, setEditFromReview] = useState(false)

  const value = useMemo<ClaimContextValue>(
    () => ({
      searchedIC,
      results,
      search: (ic: string) => {
        setSearchedIC(ic)
        const normalized = ic.replace(/\D/g, '')
        const demoNormalized = DEMO_IC.replace(/\D/g, '')
        // Check main demo IC first, then family member ICs
        if (normalized === demoNormalized) {
          setResults(CLAIMS)
        } else if (FAMILY_CLAIMS[normalized]) {
          setResults(FAMILY_CLAIMS[normalized])
        } else {
          setResults([])
        }
      },
      getClaim: (id: string) =>
        [...CLAIMS, ...Object.values(FAMILY_CLAIMS).flat()].find((c) => c.id === id),
      activeClaim,
      setActiveClaim,
      wizard,
      updateWizard: (patch) => setWizard((w) => ({ ...w, ...patch })),
      resetWizard: () => setWizard(defaultWizard),
      lastRef,
      setLastRef,
      submittedClaims,
      addSubmittedClaim: (claim) =>
        setSubmittedClaims((prev) => [claim, ...prev]),
      editFromReview,
      setEditFromReview,
    }),
    [searchedIC, results, activeClaim, wizard, lastRef, submittedClaims, editFromReview],
  )

  return <ClaimContext.Provider value={value}>{children}</ClaimContext.Provider>
}

export function useClaim() {
  const ctx = useContext(ClaimContext)
  if (!ctx) throw new Error('useClaim must be used within ClaimProvider')
  return ctx
}
