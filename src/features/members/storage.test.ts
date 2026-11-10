import { describe, expect, it } from 'vitest'
import type { Member } from './domain/types'
import { loadMembers, saveMembers } from './storage'

const sami: Member = {
  id: '1',
  firstName: 'Sami',
  lastName: 'Ben Ali',
  email: 'sami@club.tn',
  birthDate: '2012-03-15',
  feePaid: false,
}

describe('storage', () => {
  it('returns an empty list when nothing is stored', () => {
    expect(loadMembers()).toEqual([])
  })

  it('saves and reloads members', () => {
    saveMembers([sami])
    expect(loadMembers()).toEqual([sami])
  })

  it('ignores corrupted data instead of crashing', () => {
    localStorage.setItem('club-manager.members', '{not json')
    expect(loadMembers()).toEqual([])
  })

  it('ignores data that is not a list', () => {
    localStorage.setItem('club-manager.members', '{"id":"1"}')
    expect(loadMembers()).toEqual([])
  })
})
