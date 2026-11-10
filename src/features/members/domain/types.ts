export const CATEGORIES = ['U10', 'U14', 'U18', 'Senior'] as const

export type Category = (typeof CATEGORIES)[number]

export interface Member {
  id: string
  firstName: string
  lastName: string
  email: string
  /** ISO date, e.g. "2012-03-15" */
  birthDate: string
  feePaid: boolean
}

export type MemberInput = Omit<Member, 'id' | 'feePaid'>

export type MemberErrors = Partial<Record<keyof MemberInput, string>>
