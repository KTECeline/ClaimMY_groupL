'use client'

import { useMemo } from 'react'
import { useClaim } from '@/context/claim-context'

/**
 * Which documents this particular claim needs — the claim's own list, plus a
 * Power of Attorney when claiming for a living relative, or the death
 * certificate and letter of administration for an estate.
 *
 * Card sorting put "Document checklist" firmly inside the Guided Claim
 * cluster, and the checklist has to reflect the route the user picked in
 * step 1 — otherwise it is the same generic list eGUMIS already shows.
 */
export function useRequiredDocs(): string[] {
  const { activeClaim, wizard } = useClaim()

  return useMemo(() => {
    const base = activeClaim?.requiredDocs ?? ['mykad', 'bank-statement']
    const docs = new Set(base)

    if (wizard.mode === 'family') docs.add('poa')
    if (wizard.mode === 'deceased') {
      docs.delete('poa')
      docs.add('death-cert')
      docs.add('grant')
    }

    return [...docs]
  }, [activeClaim, wizard.mode])
}
