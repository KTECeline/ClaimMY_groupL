'use client'

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import {
  CLAIMS,
  FAMILY_CLAIMS,
  DEMO_IC,
  type Claim,
  type TrackedClaim,
} from '@/lib/mock-data'
import { usePersistentState } from '@/lib/use-persistent-state'

export type ClaimMode = 'self' | 'family' | 'deceased'

export type DocState = 'idle' | 'uploading' | 'done'

export type WizardData = {
  // Step 1 — who the claim is for
  mode: ClaimMode
  // Step 2 — which family member (when mode !== 'self')
  familyTargetId: string | null
  // Step 3 — checklist acknowledgement, keyed by document id
  checklist: string[]
  // Step 4 — uploads, keyed by document id
  docs: Record<string, DocState>
  // Step 5 — claimant details
  name: string
  ic: string
  phone: string
  email: string
  address: string
  // Step 6 — payout destination
  bankName: string
  bankAccount: string
  bankVerified: boolean
  saveBank: boolean
  // Review
  agreed: boolean
  /** Highest step reached, so "Resume →" returns to the right place. */
  furthestStep: number
}

const defaultWizard: WizardData = {
  mode: 'self',
  familyTargetId: null,
  checklist: [],
  docs: {},
  name: 'Ahmad bin Razali',
  ic: DEMO_IC,
  phone: '012-345 6789',
  email: 'ahmad.razali@email.com',
  address: 'No 12, Jalan Kenanga 3, Taman Seri Indah, 47100 Puchong, Selangor',
  bankName: 'Maybank',
  bankAccount: '1234 5678 9012',
  bankVerified: false,
  saveBank: true,
  agreed: false,
  furthestStep: 1,
}

export const TOTAL_STEPS = 6

type ClaimContextValue = {
  searchedIC: string | null
  results: Claim[]
  /** True when the current results came from the MyDigital ID mock SSO, not manual entry. */
  verifiedSearch: boolean
  search: (ic: string, verified?: boolean) => void
  getClaim: (id: string) => Claim | undefined
  activeClaim: Claim | null
  setActiveClaim: (claim: Claim | null) => void
  wizard: WizardData
  updateWizard: (patch: Partial<WizardData>) => void
  resetWizard: () => void
  /** True when a claim is part-finished and can be resumed from Home. */
  hasDraft: boolean
  lastRef: string | null
  setLastRef: (ref: string) => void
  submittedClaims: TrackedClaim[]
  addSubmittedClaim: (claim: TrackedClaim) => void
  editFromReview: boolean
  setEditFromReview: (v: boolean) => void
}

const ClaimContext = createContext<ClaimContextValue | null>(null)

export function ClaimProvider({ children }: { children: ReactNode }) {
  const [searchedIC, setSearchedIC] = usePersistentState<string | null>(
    'searched-ic',
    null,
  )
  const [results, setResults] = usePersistentState<Claim[]>('results', [])
  const [verifiedSearch, setVerifiedSearch] = usePersistentState(
    'verified-search',
    false,
  )
  const [activeClaim, setActiveClaim] = usePersistentState<Claim | null>(
    'active-claim',
    null,
  )
  const [wizard, setWizard] = usePersistentState<WizardData>(
    'wizard',
    defaultWizard,
  )
  const [lastRef, setLastRef] = usePersistentState<string | null>(
    'last-ref',
    null,
  )
  const [submittedClaims, setSubmittedClaims] = usePersistentState<
    TrackedClaim[]
  >('submitted-claims', [])
  // Session-only: which screen you came from shouldn't survive a refresh.
  const [editFromReview, setEditFromReview] = usePersistentState(
    'edit-from-review',
    false,
  )

  const value = useMemo<ClaimContextValue>(
    () => ({
      searchedIC,
      results,
      verifiedSearch,
      // `verified` is only ever true for the MyDigital ID mock — every manual
      // search (Home, Family) defaults to false, so the badge on Results only
      // shows when it's actually earned.
      search: (ic: string, verified = false) => {
        setSearchedIC(ic)
        setVerifiedSearch(verified)
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
        [...CLAIMS, ...Object.values(FAMILY_CLAIMS).flat()].find(
          (c) => c.id === id,
        ),
      activeClaim,
      setActiveClaim,
      wizard,
      updateWizard: (patch) =>
        setWizard((w) => {
          const next = { ...w, ...patch }
          if (patch.furthestStep !== undefined) {
            // Never move the resume marker backwards.
            next.furthestStep = Math.max(w.furthestStep, patch.furthestStep)
          }
          return next
        }),
      resetWizard: () => setWizard(defaultWizard),
      hasDraft: activeClaim !== null && wizard.furthestStep > 1,
      lastRef,
      setLastRef,
      submittedClaims,
      addSubmittedClaim: (claim) =>
        setSubmittedClaims((prev) => [claim, ...prev]),
      editFromReview,
      setEditFromReview,
    }),
    [
      searchedIC,
      setSearchedIC,
      results,
      setResults,
      verifiedSearch,
      setVerifiedSearch,
      activeClaim,
      setActiveClaim,
      wizard,
      setWizard,
      lastRef,
      setLastRef,
      submittedClaims,
      setSubmittedClaims,
      editFromReview,
      setEditFromReview,
    ],
  )

  return <ClaimContext.Provider value={value}>{children}</ClaimContext.Provider>
}

export function useClaim() {
  const ctx = useContext(ClaimContext)
  if (!ctx) throw new Error('useClaim must be used within ClaimProvider')
  return ctx
}
