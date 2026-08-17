'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { usePersistentState } from '@/lib/use-persistent-state'
import { FAMILY, type FamilyMember } from '@/lib/mock-data'

export type Profile = {
  name: string
  ic: string
  phone: string
  email: string
  address: string
}

export type AlertPrefs = {
  // NOTIFICATION TYPES (S-24)
  newMoney: boolean
  statusUpdates: boolean
  reminders: boolean
  marketing: boolean
  // CHANNEL (S-24)
  push: boolean
  email: boolean
  sms: boolean
}

export type SecurityPrefs = {
  biometric: boolean
  pin: boolean
  twoFactor: boolean
  loginAlerts: boolean
}

export type DisplayPrefs = {
  /** Larger type, bigger tap targets, heavier borders — the Tan Lai Keong persona. */
  simpleMode: boolean
  reduceMotion: boolean
  highContrast: boolean
}

const defaultProfile: Profile = {
  name: 'Ahmad bin Razali',
  ic: '900214-08-5127',
  phone: '012-345 6789',
  email: 'ahmad.razali@email.com',
  address: 'No 12, Jalan Kenanga 3, Taman Seri Indah, 47100 Puchong, Selangor',
}

const defaultAlerts: AlertPrefs = {
  newMoney: true,
  statusUpdates: true,
  reminders: true,
  marketing: false,
  push: true,
  email: false,
  sms: false,
}

const defaultSecurity: SecurityPrefs = {
  biometric: true,
  pin: true,
  twoFactor: false,
  loginAlerts: true,
}

const defaultDisplay: DisplayPrefs = {
  simpleMode: false,
  reduceMotion: false,
  highContrast: false,
}

type SettingsContextValue = {
  profile: Profile
  updateProfile: (patch: Partial<Profile>) => void
  alerts: AlertPrefs
  toggleAlert: (key: keyof AlertPrefs) => void
  security: SecurityPrefs
  toggleSecurity: (key: keyof SecurityPrefs) => void
  display: DisplayPrefs
  toggleDisplay: (key: keyof DisplayPrefs) => void
  /** Family list lives here so members added in S-18 actually persist. */
  family: FamilyMember[]
  addFamilyMember: (member: FamilyMember) => void
  removeFamilyMember: (id: string) => void
  restoreFamilyMember: (member: FamilyMember, index: number) => void
  vaultUnlocked: boolean
  unlockVault: () => void
  lockVault: () => void
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = usePersistentState('profile', defaultProfile)
  const [alerts, setAlerts] = usePersistentState('alerts', defaultAlerts)
  const [security, setSecurity] = usePersistentState('security', defaultSecurity)
  const [display, setDisplay] = usePersistentState('display', defaultDisplay)
  const [family, setFamily] = usePersistentState('family', FAMILY)
  // Deliberately NOT persisted — plain state, so the vault relocks on every
  // reload. Documents are the most sensitive thing in the app; remembering
  // "unlocked" across sessions would defeat the lock screen entirely.
  const [vaultUnlocked, setVaultUnlocked] = useState(false)

  // Drive Simple Mode / contrast from data attributes so globals.css owns the styling.
  useEffect(() => {
    const root = document.documentElement
    root.dataset.simple = display.simpleMode ? 'true' : 'false'
    root.dataset.contrast = display.highContrast ? 'high' : 'normal'
  }, [display.simpleMode, display.highContrast])

  const value = useMemo<SettingsContextValue>(
    () => ({
      profile,
      updateProfile: (patch) => setProfile((p) => ({ ...p, ...patch })),
      alerts,
      toggleAlert: (key) => setAlerts((a) => ({ ...a, [key]: !a[key] })),
      security,
      toggleSecurity: (key) => setSecurity((s) => ({ ...s, [key]: !s[key] })),
      display,
      toggleDisplay: (key) => setDisplay((d) => ({ ...d, [key]: !d[key] })),
      family,
      addFamilyMember: (member) => setFamily((f) => [...f, member]),
      removeFamilyMember: (id) =>
        setFamily((f) => f.filter((m) => m.id !== id)),
      restoreFamilyMember: (member, index) =>
        setFamily((f) => {
          const next = [...f]
          next.splice(index, 0, member)
          return next
        }),
      vaultUnlocked,
      unlockVault: () => setVaultUnlocked(true),
      lockVault: () => setVaultUnlocked(false),
    }),
    [
      profile,
      setProfile,
      alerts,
      setAlerts,
      security,
      setSecurity,
      display,
      setDisplay,
      family,
      setFamily,
      vaultUnlocked,
      setVaultUnlocked,
    ],
  )

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  )
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
