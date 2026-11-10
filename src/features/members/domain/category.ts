import type { Category } from './types'

/**
 * A sports season starts in September.
 * From September to December, the season started this year; otherwise it started last year.
 */
export function getSeasonStartYear(today: Date): number {
  const SEPTEMBER = 8 // months are 0-based
  return today.getMonth() >= SEPTEMBER ? today.getFullYear() : today.getFullYear() - 1
}

/** Age reached on December 31 of the season's start year. */
export function getSeasonAge(birthDate: string, seasonStartYear: number): number {
  const birthYear = Number(birthDate.slice(0, 4))
  return seasonStartYear - birthYear
}

/**
 * Age category, based on the age reached on December 31 of the season's start year.
 * See US-02 in docs/user-stories.md.
 */
export function getCategory(birthDate: string, seasonStartYear: number): Category {
  const age = getSeasonAge(birthDate, seasonStartYear)
  if (age <= 9) return 'U10'
  if (age <= 13) return 'U14'
  if (age <= 17) return 'U18'
  return 'Senior'
}
