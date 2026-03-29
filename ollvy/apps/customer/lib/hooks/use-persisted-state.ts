'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * A useState hook that persists state to localStorage.
 * Automatically syncs state across tabs/windows.
 */
export function usePersistedState<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  // Initialize with default value (will be replaced by localStorage value on mount)
  const [state, setState] = useState<T>(defaultValue)
  const [isHydrated, setIsHydrated] = useState(false)
  // Track if we're currently handling a storage event to prevent race conditions
  const isHandlingStorageEvent = useRef(false)
  // Track the last value we wrote to prevent echo updates
  const lastWrittenValue = useRef<string | null>(null)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(key)
      if (stored !== null) {
        const parsed = JSON.parse(stored)
        setState(parsed)
        lastWrittenValue.current = stored
      }
    } catch (e) {
      console.warn(`Failed to load persisted state for key "${key}":`, e)
    }
    setIsHydrated(true)
  }, [key])

  // Save to localStorage when state changes (after hydration)
  useEffect(() => {
    if (!isHydrated) return
    // Don't save if we're handling a storage event from another tab
    if (isHandlingStorageEvent.current) return
    try {
      const serialized = JSON.stringify(state)
      // Avoid writing the same value we just read from storage event
      if (serialized !== lastWrittenValue.current) {
        localStorage.setItem(key, serialized)
        lastWrittenValue.current = serialized
      }
    } catch (e) {
      console.warn(`Failed to save persisted state for key "${key}":`, e)
    }
  }, [key, state, isHydrated])

  // Listen for changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        // Skip if this is our own write echoing back
        if (e.newValue === lastWrittenValue.current) return
        try {
          isHandlingStorageEvent.current = true
          const parsed = JSON.parse(e.newValue)
          setState(parsed)
          lastWrittenValue.current = e.newValue
          // Reset flag after state update is processed
          requestAnimationFrame(() => {
            isHandlingStorageEvent.current = false
          })
        } catch (e) {
          isHandlingStorageEvent.current = false
          // Ignore parse errors
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key])

  return [state, setState]
}

/**
 * Hook for persisting Set state (converts to/from array for JSON storage)
 */
export function usePersistedSet<T>(
  key: string,
  defaultValue: Set<T> = new Set()
): [Set<T>, (value: Set<T> | ((prev: Set<T>) => Set<T>)) => void] {
  const [arrayState, setArrayState] = usePersistedState<T[]>(
    key,
    Array.from(defaultValue)
  )

  const setState = useCallback(
    (value: Set<T> | ((prev: Set<T>) => Set<T>)) => {
      if (typeof value === 'function') {
        setArrayState(prev => Array.from(value(new Set(prev))))
      } else {
        setArrayState(Array.from(value))
      }
    },
    [setArrayState]
  )

  return [new Set(arrayState), setState]
}
