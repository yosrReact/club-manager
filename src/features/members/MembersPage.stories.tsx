import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { MembersPage } from './MembersPage'

const meta = {
  title: 'Members/MembersPage',
  component: MembersPage,
  parameters: { layout: 'fullscreen' },
  args: {
    today: new Date(2026, 10, 10),
    initialMembers: [
      { id: '1', firstName: 'Sami', lastName: 'Ben Ali', email: 'sami@club.tn', birthDate: '2014-03-15', feePaid: false },
      { id: '2', firstName: 'Élise', lastName: 'Martin', email: 'elise@club.tn', birthDate: '1990-05-02', feePaid: true },
    ],
  },
} satisfies Meta<typeof MembersPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const EmptyClub: Story = {
  args: { initialMembers: [] },
}

/** Full journey: add a member, then find them with the search. */
export const AddAndSearch: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const form = within(canvas.getByRole('form', { name: 'Ajouter un adhérent' }))

    await userEvent.type(form.getByLabelText('Prénom'), 'Yasmine')
    await userEvent.type(form.getByLabelText('Nom'), 'Trabelsi')
    await userEvent.type(form.getByLabelText('Email'), 'yasmine@club.tn')
    await userEvent.type(form.getByLabelText('Date de naissance'), '2018-09-01')
    await userEvent.click(form.getByRole('button', { name: "Ajouter l'adhérent" }))

    await userEvent.type(canvas.getByLabelText('Rechercher un adhérent'), 'yas')
    await expect(canvas.getAllByRole('listitem')).toHaveLength(1)
    await expect(canvas.getByRole('listitem', { name: 'Yasmine Trabelsi' })).toBeVisible()
  },
}
