import type { Member } from './types'

export type MembersAction =
  | { type: 'added'; member: Member }
  | { type: 'removed'; id: string }
  | { type: 'feePaid'; id: string }

export function membersReducer(members: Member[], action: MembersAction): Member[] {
  switch (action.type) {
    case 'added':
      return [...members, action.member]
    case 'removed':
      return members.filter((m) => m.id !== action.id)
    case 'feePaid':
      return members.map((m) => (m.id === action.id ? { ...m, feePaid: true } : m))
  }
}

export function countUnpaid(members: readonly Member[]): number {
  return members.filter((m) => !m.feePaid).length
}
