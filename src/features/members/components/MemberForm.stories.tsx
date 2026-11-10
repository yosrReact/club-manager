import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { MESSAGES } from '../domain/validation'
import { MemberForm } from './MemberForm'

const meta = {
  title: 'Members/MemberForm',
  component: MemberForm,
  args: { onSubmit: fn(() => ({})) },
} satisfies Meta<typeof MemberForm>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {}

export const WithValidationErrors: Story = {
  args: {
    onSubmit: fn(() => ({
      lastName: MESSAGES.lastNameRequired,
      email: MESSAGES.emailInvalid,
    })),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.type(canvas.getByLabelText('Prénom'), 'Sami')
    await userEvent.type(canvas.getByLabelText('Email'), 'sami.club.tn')
    await userEvent.click(canvas.getByRole('button', { name: "Ajouter l'adhérent" }))

    await expect(args.onSubmit).toHaveBeenCalledOnce()
    await expect(canvas.getByText(MESSAGES.lastNameRequired)).toBeVisible()
    await expect(canvas.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true')
  },
}

export const SuccessfulSubmission: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.type(canvas.getByLabelText('Prénom'), 'Sami')
    await userEvent.type(canvas.getByLabelText('Nom'), 'Ben Ali')
    await userEvent.type(canvas.getByLabelText('Email'), 'sami@club.tn')
    await userEvent.type(canvas.getByLabelText('Date de naissance'), '2012-03-15')
    await userEvent.click(canvas.getByRole('button', { name: "Ajouter l'adhérent" }))

    await expect(args.onSubmit).toHaveBeenCalledWith({
      firstName: 'Sami',
      lastName: 'Ben Ali',
      email: 'sami@club.tn',
      birthDate: '2012-03-15',
    })
    // The form is reset after a successful submission
    await expect(canvas.getByLabelText('Prénom')).toHaveValue('')
  },
}
