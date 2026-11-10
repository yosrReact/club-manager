import { useState } from "react";
import { getSeasonStartYear } from "./domain/category";
import { filterMembers, type MemberFilter } from "./domain/filter";
import { countUnpaid } from "./domain/membersReducer";
import type { Member, MemberInput } from "./domain/types";
import { hasErrors, validateMember } from "./domain/validation";
import { MemberFilters } from "./components/MemberFilters";
import { MemberForm } from "./components/MemberForm";
import {
  EMPTY_CLUB_MESSAGE,
  MemberList,
  NO_RESULT_MESSAGE,
} from "./components/MemberList";
import { useMembers } from "./useMembers";

interface MembersPageProps {
  /** Injected so that tests and stories are deterministic. */
  today: Date;
  initialMembers?: Member[];
}

export function MembersPage({ today, initialMembers }: MembersPageProps) {
  const { members, addMember, removeMember, markFeePaid } =
    useMembers(initialMembers);
  const [filter, setFilter] = useState<MemberFilter>({
    query: "",
    category: "all",
  });
  const seasonStartYear = getSeasonStartYear(today);

  function handleSubmit(input: MemberInput) {
    const errors = validateMember(input, members, today);
    if (!hasErrors(errors)) addMember(input);
    return errors;
  }

  const visibleMembers = filterMembers(members, filter, seasonStartYear);
  const unpaid = countUnpaid(members);

  return (
    <main className="members-page">
      <header>
        <h1>Adhérents du club</h1>
        <p className="summary" aria-live="polite">
          {members.length} adhérent{members.length > 1 ? "s" : ""} · {unpaid}{" "}
          cotisation
          {unpaid > 1 ? "s" : ""} en attente
        </p>
        <p className="season">
          Saison {seasonStartYear}-{seasonStartYear + 1}
        </p>
      </header>
      <div className="layout">
        <MemberForm onSubmit={handleSubmit} />
        <section aria-labelledby="list-title">
          <h2 id="list-title">Liste des adhérents</h2>
          <MemberFilters filter={filter} onChange={setFilter} />
          <MemberList
            members={visibleMembers}
            seasonStartYear={seasonStartYear}
            onMarkFeePaid={markFeePaid}
            onRemove={removeMember}
            emptyMessage={members.length === 0 ? EMPTY_CLUB_MESSAGE : NO_RESULT_MESSAGE}
          />
        </section>
      </div>
    </main>
  );
}
