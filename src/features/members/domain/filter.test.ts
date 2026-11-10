import { describe, expect, it } from 'vitest'
import { filterMembers, normalize } from './filter'
import type { Member } from './types'

const SEASON = 2026

function member(id: string, firstName: string, lastName: string, birthDate: string): Member {
  return { id, firstName, lastName, email: `${id}@club.tn`, birthDate, feePaid: false }
}

const sami = member('1', 'Sami', 'Ben Ali', '2014-03-15') // 12 years old: U14
const elise = member('2', 'Élise', 'Martin', '1990-05-02') // Senior
const yasmine = member('3', 'Yasmine', 'Trabelsi', '2013-09-01') // 13 years old: U14
const all = [sami, elise, yasmine]

describe('normalize', () => {
  it('removes accents and case', () => {
    expect(normalize('  Élise ')).toBe('elise')
  })
})

// US-03, decision table: query (empty / matching / not matching) x category (all / specific)
describe('filterMembers (US-03)', () => {
  it('returns everyone with an empty query and all categories', () => {
    expect(filterMembers(all, { query: '', category: 'all' }, SEASON)).toEqual(all)
  })

  it('finds a member regardless of case and accents', () => {
    expect(filterMembers(all, { query: 'elise', category: 'all' }, SEASON)).toEqual([elise])
  })

  it('searches on the full name', () => {
    expect(filterMembers(all, { query: 'ben ali', category: 'all' }, SEASON)).toEqual([sami])
  })

  it('filters by category', () => {
    expect(filterMembers(all, { query: '', category: 'U14' }, SEASON)).toEqual([sami, yasmine])
  })

  it('combines query and category', () => {
    expect(filterMembers(all, { query: 'yas', category: 'U14' }, SEASON)).toEqual([yasmine])
  })

  it('returns nothing when the query matches but the category does not', () => {
    expect(filterMembers(all, { query: 'elise', category: 'U14' }, SEASON)).toEqual([])
  })

  it('returns nothing when no name matches', () => {
    expect(filterMembers(all, { query: 'zzz', category: 'all' }, SEASON)).toEqual([])
  })
})
