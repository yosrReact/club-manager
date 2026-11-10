import type { Member } from './domain/types'

const STORAGE_KEY = 'club-manager.members'

/** Reads members from localStorage. Returns an empty list if storage is unavailable or corrupted. */
export function loadMembers(): Member[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? (parsed as Member[]) : []
  } catch {
    return []
  }
}

export function saveMembers(members: readonly Member[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members))
  } catch {
    // Storage can be full or blocked (private mode): the app keeps working in memory.
  }
}
