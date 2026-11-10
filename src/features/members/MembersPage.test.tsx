import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import type { Member } from './domain/types'
import { MembersPage } from './MembersPage'

const TODAY = new Date(2026, 10, 10) // 10 November 2026, season 2026-2027

const sami: Member = {
  id: '1',
  firstName: 'Sami',
  lastName: 'Ben Ali',
  email: 'sami@club.tn',
  birthDate: '2014-03-15', // U14
  feePaid: false,
}
const elise: Member = {
  id: '2',
  firstName: 'Élise',
  lastName: 'Martin',
  email: 'elise@club.tn',
  birthDate: '1990-05-02', // Senior
  feePaid: true,
}

function setup(initialMembers: Member[] = []) {
  const user = userEvent.setup()
  render(<MembersPage today={TODAY} initialMembers={initialMembers} />)
  const form = screen.getByRole('form', { name: 'Ajouter un adhérent' })

  async function fillForm(values: Partial<Record<'Prénom' | 'Nom' | 'Email' | 'Date de naissance', string>>) {
    for (const [label, value] of Object.entries(values)) {
      await user.type(within(form).getByLabelText(label), value)
    }
  }
  const submit = () => user.click(within(form).getByRole('button', { name: "Ajouter l'adhérent" }))

  return { user, form, fillForm, submit }
}

describe('US-01 : ajouter un adhérent', () => {
  it('ajoute un adhérent valide et réinitialise le formulaire', async () => {
    const { form, fillForm, submit } = setup()
    await fillForm({ Prénom: 'Sami', Nom: 'Ben Ali', Email: 'sami@club.tn', 'Date de naissance': '2012-03-15' })
    await submit()

    expect(screen.getByRole('listitem', { name: 'Sami Ben Ali' })).toBeInTheDocument()
    expect(within(form).getByLabelText('Prénom')).toHaveValue('')
  })

  it("affiche une erreur quand le nom manque et n'ajoute personne", async () => {
    const { fillForm, submit } = setup()
    await fillForm({ Prénom: 'Sami', Email: 'sami@club.tn', 'Date de naissance': '2012-03-15' })
    await submit()

    expect(screen.getByText('Le nom est obligatoire.')).toBeInTheDocument()
    expect(screen.getByLabelText('Nom')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
  })

  it('refuse un email déjà utilisé, quelle que soit la casse', async () => {
    const { fillForm, submit } = setup([sami])
    await fillForm({ Prénom: 'Samir', Nom: 'Ben Ali', Email: 'SAMI@club.tn', 'Date de naissance': '2012-03-15' })
    await submit()

    expect(screen.getByText('Cet email est déjà utilisé par un autre adhérent.')).toBeInTheDocument()
  })
})

describe('US-02 : catégorie calculée', () => {
  it("affiche la catégorie d'âge de chaque adhérent", () => {
    setup([sami, elise])
    expect(within(screen.getByRole('listitem', { name: 'Sami Ben Ali' })).getByText('U14')).toBeInTheDocument()
    expect(within(screen.getByRole('listitem', { name: 'Élise Martin' })).getByText('Senior')).toBeInTheDocument()
  })
})

describe('US-03 : rechercher et filtrer', () => {
  it('recherche sans tenir compte des accents', async () => {
    const { user } = setup([sami, elise])
    await user.type(screen.getByLabelText('Rechercher un adhérent'), 'elise')

    expect(screen.getByRole('listitem', { name: 'Élise Martin' })).toBeInTheDocument()
    expect(screen.queryByRole('listitem', { name: 'Sami Ben Ali' })).not.toBeInTheDocument()
  })

  it('filtre par catégorie', async () => {
    const { user } = setup([sami, elise])
    await user.selectOptions(screen.getByLabelText('Catégorie'), 'U14')

    expect(screen.getAllByRole('listitem')).toHaveLength(1)
    expect(screen.getByRole('listitem', { name: 'Sami Ben Ali' })).toBeInTheDocument()
  })

  it('indique quand aucun adhérent ne correspond', async () => {
    const { user } = setup([sami])
    await user.type(screen.getByLabelText('Rechercher un adhérent'), 'zzz')

    expect(screen.getByText('Aucun adhérent ne correspond à votre recherche.')).toBeInTheDocument()
  })

  it("invite à ajouter un premier adhérent quand le club est vide", () => {
    setup([])
    expect(screen.getByText(/Aucun adhérent pour le moment/)).toBeInTheDocument()
  })
})

describe('US-04 : cotisations', () => {
  it('enregistre un paiement et met à jour le compteur', async () => {
    const { user } = setup([sami, elise])
    expect(screen.getByText(/1 cotisation en attente/)).toBeInTheDocument()

    const card = screen.getByRole('listitem', { name: 'Sami Ben Ali' })
    await user.click(within(card).getByRole('button', { name: 'Marquer comme payée' }))

    expect(within(card).getByText('Payée')).toBeInTheDocument()
    expect(screen.getByText(/0 cotisation en attente/)).toBeInTheDocument()
  })
})

describe('US-05 : retirer un adhérent', () => {
  it('retire un adhérent après confirmation', async () => {
    const { user } = setup([sami, elise])
    const card = screen.getByRole('listitem', { name: 'Sami Ben Ali' })
    await user.click(within(card).getByRole('button', { name: 'Retirer' }))
    await user.click(within(card).getByRole('button', { name: 'Confirmer' }))

    expect(screen.queryByRole('listitem', { name: 'Sami Ben Ali' })).not.toBeInTheDocument()
  })

  it("garde l'adhérent si la suppression est annulée", async () => {
    const { user } = setup([sami])
    const card = screen.getByRole('listitem', { name: 'Sami Ben Ali' })
    await user.click(within(card).getByRole('button', { name: 'Retirer' }))
    await user.click(within(card).getByRole('button', { name: 'Annuler' }))

    expect(screen.getByRole('listitem', { name: 'Sami Ben Ali' })).toBeInTheDocument()
  })
})
