import { useEffect, useReducer } from 'react'
import { membersReducer } from './domain/membersReducer'
import type { Member, MemberInput } from './domain/types'
import { loadMembers, saveMembers } from './storage'

export function useMembers(initialMembers?: Member[], createId: () => string = () => crypto.randomUUID()) {
  const [members, dispatch] = useReducer(membersReducer, initialMembers, (init) => init ?? loadMembers())

  useEffect(() => {
    saveMembers(members)
  }, [members])

  return {
    members,
    addMember: (input: MemberInput) =>
      dispatch({
        type: 'added',
        member: {
          ...input,
          firstName: input.firstName.trim(),
          lastName: input.lastName.trim(),
          email: input.email.trim(),
          id: createId(),
          feePaid: false,
        },
      }),
    removeMember: (id: string) => dispatch({ type: 'removed', id }),
    markFeePaid: (id: string) => dispatch({ type: 'feePaid', id }),
  }
}
