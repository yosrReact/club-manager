import { expect, test, type Page } from '@playwright/test'

async function addMember(page: Page, member: { firstName: string; lastName: string; email: string; birthDate: string }) {
  const form = page.getByRole('form', { name: 'Ajouter un adhérent' })
  await form.getByLabel('Prénom', { exact: true }).fill(member.firstName)
  await form.getByLabel('Nom', { exact: true }).fill(member.lastName)
  await form.getByLabel('Email', { exact: true }).fill(member.email)
  await form.getByLabel('Date de naissance', { exact: true }).fill(member.birthDate)
  await form.getByRole('button', { name: "Ajouter l'adhérent" }).click()
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test('un adhérent ajouté est conservé après rechargement de la page', async ({ page }) => {
  await addMember(page, { firstName: 'Sami', lastName: 'Ben Ali', email: 'sami@club.tn', birthDate: '2012-03-15' })
  await expect(page.getByRole('listitem', { name: 'Sami Ben Ali' })).toBeVisible()

  await page.reload()

  await expect(page.getByRole('listitem', { name: 'Sami Ben Ali' })).toBeVisible()
  await expect(page.getByText('1 adhérent · 1 cotisation en attente')).toBeVisible()
})

test('parcours trésorier : paiement puis retrait avec confirmation', async ({ page }) => {
  await addMember(page, { firstName: 'Élise', lastName: 'Martin', email: 'elise@club.tn', birthDate: '1990-05-02' })
  const card = page.getByRole('listitem', { name: 'Élise Martin' })

  await card.getByRole('button', { name: 'Marquer comme payée' }).click()
  await expect(card.getByText('Payée', { exact: true })).toBeVisible()

  await card.getByRole('button', { name: 'Retirer' }).click()
  await card.getByRole('button', { name: 'Confirmer' }).click()
  await expect(page.getByText('Aucun adhérent pour le moment.', { exact: false })).toBeVisible()
})

test('les erreurs de saisie sont annoncées sans perdre ce qui a été tapé', async ({ page }) => {
  const form = page.getByRole('form', { name: 'Ajouter un adhérent' })
  await form.getByLabel('Prénom', { exact: true }).fill('Sami')
  await form.getByLabel('Email', { exact: true }).fill('sami.club.tn')
  await form.getByRole('button', { name: "Ajouter l'adhérent" }).click()

  await expect(page.getByRole('alert').filter({ hasText: 'Le nom est obligatoire.' })).toBeVisible()
  await expect(page.getByRole('alert').filter({ hasText: "L'email n'est pas valide." })).toBeVisible()
  await expect(form.getByLabel('Prénom', { exact: true })).toHaveValue('Sami')
})
