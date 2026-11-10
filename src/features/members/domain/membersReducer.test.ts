import { describe, expect, it } from 'vitest'
import { countUnpaid, membersReducer } from './membersReducer'
import type { Member } from './types'

const sami: Member = {
  id: '1',
  firstName: 'Sami',
  lastName: 'Ben Ali',
  email: 'sami@club.tn',
  birthDate: '2012-03-15',
  feePaid: false,
}
const elise: Member = { ...sami, id: '2', firstName: 'Élise', email: 'elise@club.tn', feePaid: true }

describe('membersReducer', () => {
  it('adds a member at the end of the list', () => {
    expect(membersReducer([sami], { type: 'added', member: elise })).toEqual([sami, elise])
  })

  it('removes a member by id (US-05)', () => {
    expect(membersReducer([sami, elise], { type: 'removed', id: '1' })).toEqual([elise])
  })

  it('marks a fee as paid without touching other members (US-04)', () => {
    const result = membersReducer([sami, elise], { type: 'feePaid', id: '1' })
    expect(result[0].feePaid).toBe(true)
    expect(result[1]).toBe(elise)
  })

  it('does not mutate the previous state', () => {
    const state = [sami]
    membersReducer(state, { type: 'feePaid', id: '1' })
    expect(state[0].feePaid).toBe(false)
  })
})

describe('countUnpaid', () => {
  it('counts members whose fee is not paid', () => {
    expect(countUnpaid([sami, elise])).toBe(1)
  })
})
