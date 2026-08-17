'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const PREFIX = 'claimmy:'

/**
 * useState backed by localStorage. SSR-safe: the first render always returns
 * `initial`, then the stored value is read in an effect and applied. That keeps
 * server and client markup identical while still surviving a refresh — which is
 * the whole point (journey map: "data lost on browser back-button").
 */
export function usePersistentState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial)
  const [hydrated, setHydrated] = useState(false)
  const storageKey = PREFIX + key

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey)
      if (raw !== null) setValue(JSON.parse(raw) as T)
    } catch {
      // corrupt or unavailable storage — fall back to `initial`
    }
    setHydrated(true)
  }, [storageKey])

  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(value))
    } catch {
      // quota / private mode — the prototype still works in memory
    }
  }, [storageKey, value, hydrated])

  return [value, setValue, hydrated] as const
}

/** Wipe every ClaimMY key — used by "reset demo" in Settings. */
export function clearPersistedState() {
  try {
    const keys: string[] = []
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i)
      if (k?.startsWith(PREFIX)) keys.push(k)
    }
    keys.forEach((k) => window.localStorage.removeItem(k))
  } catch {
    // nothing to do
  }
}

/**
 * Read-once flag for first-run experiences (coach marks). `hydrated` matters
 * here: until storage has been read, `seen` is false, so callers must wait
 * before showing anything — otherwise the coach marks flash on every visit.
 */
export function useOnceFlag(key: string) {
  const [seen, setSeen, hydrated] = usePersistentState(`once:${key}`, false)
  const marked = useRef(false)

  const mark = useCallback(() => {
    if (marked.current) return
    marked.current = true
    setSeen(true)
  }, [setSeen])

  return [seen, mark, hydrated] as const
}
