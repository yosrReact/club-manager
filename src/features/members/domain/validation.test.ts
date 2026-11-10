import { describe, expect, it } from 'vitest'
import type { Member, MemberInput } from './types'
import { hasErrors, MESSAGES, validateMember } from './validation'

const TODAY = new Date(2026, 10, 10) // 10 November 2026

const validInput: MemberInput = {
  firstName: 'Sami',
  lastName: 'Ben Ali',
  email: 'sami@club.tn',
  birthDate: '2012-03-15',
}

const existing: Member = { ...validInput, id: '1', feePaid: false }

describe('validateMember (US-01)', () => {
  it('accepts a valid member', () => {
    expect(validateMember(validInput, [], TODAY)).toEqual({})
  })

  it.each([
    { field: 'firstName', message: MESSAGES.firstNameRequired },
    { field: 'lastName', message: MESSAGES.lastNameRequired },
    { field: 'email', message: MESSAGES.emailRequired },
    { field: 'birthDate', message: MESSAGES.birthDateRequired },
  ] as const)('requires $field', ({ field, message }) => {
    const errors = validateMember({ ...validInput, [field]: '' }, [], TODAY)
    expect(errors[field]).toBe(message)
  })

  it('treats a name made only of spaces as empty', () => {
    expect(validateMember({ ...validInput, lastName: '   ' }, [], TODAY).lastName).toBe(MESSAGES.lastNameRequired)
  })

  // Equivalence partitions for the email format
  it.each(['sami.club.tn', 'sami@club', '@club.tn', 'sami @club.tn'])('rejects the invalid email "%s"', (email) => {
    expect(validateMember({ ...validInput, email }, [], TODAY).email).toBe(MESSAGES.emailInvalid)
  })

  it('rejects an email already used, regardless of case', () => {
    const errors = validateMember({ ...validInput, email: 'SAMI@club.tn' }, [existing], TODAY)
    expect(errors.email).toBe(MESSAGES.emailTaken)
  })

  // Boundary values around today
  it('accepts a birth date equal to today', () => {
    expect(validateMember({ ...validInput, birthDate: '2026-11-10' }, [], TODAY).birthDate).toBeUndefined()
  })

  it('rejects a birth date one day in the future', () => {
    expect(validateMember({ ...validInput, birthDate: '2026-11-11' }, [], TODAY).birthDate).toBe(
      MESSAGES.birthDateInFuture,
    )
  })

  it('reports every invalid field at once', () => {
    const errors = validateMember({ firstName: '', lastName: '', email: 'x', birthDate: '' }, [], TODAY)
    expect(Object.keys(errors).sort()).toEqual(['birthDate', 'email', 'firstName', 'lastName'])
    expect(hasErrors(errors)).toBe(true)
  })
})
