import { getCategory } from './category'
import type { Category, Member } from './types'

/** Lowercases and removes accents, so that "Élise" matches "elise". */
export function normalize(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
}

export interface MemberFilter {
  query: string
  category: Category | 'all'
}

/** Filters members by name (case and accent insensitive) and by age category. See US-03. */
export function filterMembers(
  members: readonly Member[],
  filter: MemberFilter,
  seasonStartYear: number,
): Member[] {
  const query = normalize(filter.query)
  return members.filter((member) => {
    const fullName = normalize(`${member.firstName} ${member.lastName}`)
    const matchesQuery = query === '' || fullName.includes(query)
    const matchesCategory =
      filter.category === 'all' || getCategory(member.birthDate, seasonStartYear) === filter.category
    return matchesQuery && matchesCategory
  })
}
