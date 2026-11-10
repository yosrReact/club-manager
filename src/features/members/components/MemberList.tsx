import { useState } from 'react'
import { getCategory } from '../domain/category'
import type { Member } from '../domain/types'

interface MemberListProps {
  members: readonly Member[]
  seasonStartYear: number
  onMarkFeePaid: (id: string) => void
  onRemove: (id: string) => void
  /** Message shown when the list is empty. */
  emptyMessage?: string
}

export const NO_RESULT_MESSAGE = 'Aucun adhérent ne correspond à votre recherche.'
export const EMPTY_CLUB_MESSAGE = "Aucun adhérent pour le moment. Ajoutez le premier avec le formulaire."

export function MemberList({
  members,
  seasonStartYear,
  onMarkFeePaid,
  onRemove,
  emptyMessage = NO_RESULT_MESSAGE,
}: MemberListProps) {
  const [pendingRemovalId, setPendingRemovalId] = useState<string | null>(null)

  if (members.length === 0) {
    return <p className="empty">{emptyMessage}</p>
  }

  return (
    <ul className="member-list" aria-label="Liste des adhérents">
      {members.map((member) => {
        const fullName = `${member.firstName} ${member.lastName}`
        return (
          <li key={member.id} className="member-card" aria-label={fullName}>
            <div className="member-main">
              <strong>{fullName}</strong>
              <span className="badge">{getCategory(member.birthDate, seasonStartYear)}</span>
              <span className="email">{member.email}</span>
            </div>
            <div className="member-actions">
              <span className={member.feePaid ? 'fee fee-paid' : 'fee fee-unpaid'}>
                {member.feePaid ? 'Payée' : 'Non payée'}
              </span>
              {!member.feePaid && (
                <button type="button" onClick={() => onMarkFeePaid(member.id)}>
                  Marquer comme payée
                </button>
              )}
              {pendingRemovalId === member.id ? (
                <span className="confirm" role="group" aria-label={`Confirmer le retrait de ${fullName}`}>
                  <button type="button" className="danger" onClick={() => onRemove(member.id)}>
                    Confirmer
                  </button>
                  <button type="button" onClick={() => setPendingRemovalId(null)}>
                    Annuler
                  </button>
                </span>
              ) : (
                <button type="button" className="secondary" onClick={() => setPendingRemovalId(member.id)}>
                  Retirer
                </button>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
