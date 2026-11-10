import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import type { Member } from '../domain/types'
import { MemberList } from './MemberList'

const members: Member[] = [
  { id: '1', firstName: 'Sami', lastName: 'Ben Ali', email: 'sami@club.tn', birthDate: '2014-03-15', feePaid: false },
  { id: '2', firstName: 'Élise', lastName: 'Martin', email: 'elise@club.tn', birthDate: '1990-05-02', feePaid: true },
  { id: '3', firstName: 'Yasmine', lastName: 'Trabelsi', email: 'yasmine@club.tn', birthDate: '2018-09-01', feePaid: false },
]

const meta = {
  title: 'Members/MemberList',
  component: MemberList,
  args: {
    members,
    seasonStartYear: 2026,
    onMarkFeePaid: fn(),
    onRemove: fn(),
  },
} satisfies Meta<typeof MemberList>

export default meta
type Story = StoryObj<typeof meta>

export const WithMembers: Story = {}

export const Empty: Story = {
  args: { members: [] },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Aucun adhérent ne correspond à votre recherche.')).toBeVisible()
  },
}

export const MarkFeeAsPaid: Story = {
  play: async ({ canvasElement, args }) => {
    const card = within(within(canvasElement).getByRole('listitem', { name: 'Sami Ben Ali' }))
    await userEvent.click(card.getByRole('button', { name: 'Marquer comme payée' }))
    await expect(args.onMarkFeePaid).toHaveBeenCalledWith('1')
  },
}

export const RemovalConfirmation: Story = {
  play: async ({ canvasElement, args }) => {
    const card = within(within(canvasElement).getByRole('listitem', { name: 'Sami Ben Ali' }))
    await userEvent.click(card.getByRole('button', { name: 'Retirer' }))

    // Nothing is removed until the user confirms
    await expect(args.onRemove).not.toHaveBeenCalled()
    await userEvent.click(card.getByRole('button', { name: 'Confirmer' }))
    await expect(args.onRemove).toHaveBeenCalledWith('1')
  },
}
