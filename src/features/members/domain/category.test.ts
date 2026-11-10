import { describe, expect, it } from 'vitest'
import { getCategory, getSeasonAge, getSeasonStartYear } from './category'

describe('getSeasonStartYear', () => {
  it('considers that the season started last year before September', () => {
    expect(getSeasonStartYear(new Date(2027, 7, 31))).toBe(2026) // 31 August 2027
  })

  it('considers that the season starts this year from September 1st', () => {
    expect(getSeasonStartYear(new Date(2026, 8, 1))).toBe(2026) // 1 September 2026
  })
})

describe('getSeasonAge', () => {
  it('returns the age reached on December 31 of the season start year', () => {
    // Born late December: already counts the full year
    expect(getSeasonAge('2012-12-31', 2026)).toBe(14)
    expect(getSeasonAge('2012-01-01', 2026)).toBe(14)
  })
})

// US-02, boundary value analysis: each limit is tested on both sides.
describe('getCategory (US-02)', () => {
  const season = 2026

  it.each([
    { age: 6, expected: 'U10' },
    { age: 9, expected: 'U10' },
    { age: 10, expected: 'U14' },
    { age: 13, expected: 'U14' },
    { age: 14, expected: 'U18' },
    { age: 17, expected: 'U18' },
    { age: 18, expected: 'Senior' },
    { age: 45, expected: 'Senior' },
  ])('a member reaching $age on Dec 31 is in category $expected', ({ age, expected }) => {
    const birthDate = `${season - age}-06-15`
    expect(getCategory(birthDate, season)).toBe(expected)
  })
})
