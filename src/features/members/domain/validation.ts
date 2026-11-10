import type { Member, MemberErrors, MemberInput } from './types'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const MESSAGES = {
  firstNameRequired: 'Le prénom est obligatoire.',
  lastNameRequired: 'Le nom est obligatoire.',
  emailRequired: "L'email est obligatoire.",
  emailInvalid: "L'email n'est pas valide.",
  emailTaken: 'Cet email est déjà utilisé par un autre adhérent.',
  birthDateRequired: 'La date de naissance est obligatoire.',
  birthDateInFuture: 'La date de naissance ne peut pas être dans le futur.',
} as const

function toIsoDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * Validates a new member against the business rules of US-01.
 * Returns an empty object when the input is valid.
 */
export function validateMember(
  input: MemberInput,
  existingMembers: readonly Member[],
  today: Date,
): MemberErrors {
  const errors: MemberErrors = {}

  if (!input.firstName.trim()) errors.firstName = MESSAGES.firstNameRequired
  if (!input.lastName.trim()) errors.lastName = MESSAGES.lastNameRequired

  const email = input.email.trim().toLowerCase()
  if (!email) {
    errors.email = MESSAGES.emailRequired
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = MESSAGES.emailInvalid
  } else if (existingMembers.some((m) => m.email.toLowerCase() === email)) {
    errors.email = MESSAGES.emailTaken
  }

  if (!input.birthDate) {
    errors.birthDate = MESSAGES.birthDateRequired
  } else if (input.birthDate > toIsoDate(today)) {
    errors.birthDate = MESSAGES.birthDateInFuture
  }

  return errors
}

export function hasErrors(errors: MemberErrors): boolean {
  return Object.keys(errors).length > 0
}
