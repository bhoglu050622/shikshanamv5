import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import React from "react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Comprehensive localStorage utility with SSR safety and error handling
export class LocalStorageManager {
  private static isClient(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined'
  }

  private static getStorageKey(key: string): string {
    return `shikshanam_${key}`
  }

  static setItem(key: string, value: any): boolean {
    if (!this.isClient()) {
      console.warn('localStorage not available (SSR)')
      return false
    }

    try {
      const storageKey = this.getStorageKey(key)
      const serializedValue = JSON.stringify(value)
      localStorage.setItem(storageKey, serializedValue)
      return true
    } catch (error) {
      console.error(`Failed to set localStorage item '${key}':`, error)
      return false
    }
  }

  static getItem<T = any>(key: string, defaultValue?: T): T | null {
    if (!this.isClient()) {
      return defaultValue || null
    }

    try {
      const storageKey = this.getStorageKey(key)
      const item = localStorage.getItem(storageKey)
      if (item === null) {
        return defaultValue || null
      }
      return JSON.parse(item)
    } catch (error) {
      console.error(`Failed to get localStorage item '${key}':`, error)
      return defaultValue || null
    }
  }

  static removeItem(key: string): boolean {
    if (!this.isClient()) {
      return false
    }

    try {
      const storageKey = this.getStorageKey(key)
      localStorage.removeItem(storageKey)
      return true
    } catch (error) {
      console.error(`Failed to remove localStorage item '${key}':`, error)
      return false
    }
  }

  static clear(): boolean {
    if (!this.isClient()) {
      return false
    }

    try {
      // Only clear shikshanam-related items
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith('shikshanam_')) {
          localStorage.removeItem(key)
        }
      })
      return true
    } catch (error) {
      console.error('Failed to clear localStorage:', error)
      return false
    }
  }

  static hasItem(key: string): boolean {
    if (!this.isClient()) {
      return false
    }

    try {
      const storageKey = this.getStorageKey(key)
      return localStorage.getItem(storageKey) !== null
    } catch (error) {
      console.error(`Failed to check localStorage item '${key}':`, error)
      return false
    }
  }

  static getSize(key: string): number {
    if (!this.isClient()) {
      return 0
    }

    try {
      const storageKey = this.getStorageKey(key)
      const item = localStorage.getItem(storageKey)
      return item ? new Blob([item]).size : 0
    } catch (error) {
      console.error(`Failed to get localStorage item size '${key}':`, error)
      return 0
    }
  }

  static getTotalSize(): number {
    if (!this.isClient()) {
      return 0
    }

    try {
      let totalSize = 0
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith('shikshanam_')) {
          const item = localStorage.getItem(key)
          if (item) {
            totalSize += new Blob([item]).size
          }
        }
      })
      return totalSize
    } catch (error) {
      console.error('Failed to calculate localStorage total size:', error)
      return 0
    }
  }

  static cleanup(maxSize: number = 5 * 1024 * 1024): boolean {
    if (!this.isClient()) {
      return false
    }

    try {
      const currentSize = this.getTotalSize()
      if (currentSize <= maxSize) {
        return true
      }

      // Get all shikshanam items with their sizes and timestamps
      const items: Array<{ key: string; size: number; timestamp: number }> = []
      const keys = Object.keys(localStorage)
      
      keys.forEach(key => {
        if (key.startsWith('shikshanam_')) {
          const item = localStorage.getItem(key)
          if (item) {
            try {
              const parsed = JSON.parse(item)
              items.push({
                key,
                size: new Blob([item]).size,
                timestamp: parsed.timestamp || Date.now()
              })
            } catch {
              // If item can't be parsed, remove it
              localStorage.removeItem(key)
            }
          }
        }
      })

      // Sort by timestamp (oldest first)
      items.sort((a, b) => a.timestamp - b.timestamp)

      // Remove oldest items until we're under the limit
      let removedSize = 0
      for (const item of items) {
        if (currentSize - removedSize <= maxSize) {
          break
        }
        localStorage.removeItem(item.key)
        removedSize += item.size
      }

      return true
    } catch (error) {
      console.error('Failed to cleanup localStorage:', error)
      return false
    }
  }
}

// Convenience functions for common localStorage operations
export const storage = {
  set: LocalStorageManager.setItem.bind(LocalStorageManager),
  get: LocalStorageManager.getItem.bind(LocalStorageManager),
  remove: LocalStorageManager.removeItem.bind(LocalStorageManager),
  clear: LocalStorageManager.clear.bind(LocalStorageManager),
  has: LocalStorageManager.hasItem.bind(LocalStorageManager),
  getSize: LocalStorageManager.getSize.bind(LocalStorageManager),
  getTotalSize: LocalStorageManager.getTotalSize.bind(LocalStorageManager),
  cleanup: LocalStorageManager.cleanup.bind(LocalStorageManager)
}

// React hook for localStorage with SSR safety
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = React.useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }
    const item = LocalStorageManager.getItem(key, initialValue)
    return item !== null ? item : initialValue
  })

  const setValue = React.useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      LocalStorageManager.setItem(key, valueToStore)
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  return [storedValue, setValue] as const
}
