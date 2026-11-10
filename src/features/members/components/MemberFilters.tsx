import type { MemberFilter } from '../domain/filter'
import { CATEGORIES, type Category } from '../domain/types'

interface MemberFiltersProps {
  filter: MemberFilter
  onChange: (filter: MemberFilter) => void
}

export function MemberFilters({ filter, onChange }: MemberFiltersProps) {
  return (
    <div className="member-filters" role="search">
      <div className="field">
        <label htmlFor="search">Rechercher un adhérent</label>
        <input
          id="search"
          type="search"
          value={filter.query}
          onChange={(e) => onChange({ ...filter, query: e.target.value })}
        />
      </div>
      <div className="field">
        <label htmlFor="category">Catégorie</label>
        <select
          id="category"
          value={filter.category}
          onChange={(e) => onChange({ ...filter, category: e.target.value as Category | 'all' })}
        >
          <option value="all">Toutes</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
