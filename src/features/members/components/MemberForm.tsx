import { useState, type FormEvent } from 'react'
import type { MemberErrors, MemberInput } from '../domain/types'

const EMPTY: MemberInput = { firstName: '', lastName: '', email: '', birthDate: '' }

interface MemberFormProps {
  /** Returns the validation errors; an empty object means the member was added. */
  onSubmit: (input: MemberInput) => MemberErrors
}

export function MemberForm({ onSubmit }: MemberFormProps) {
  const [values, setValues] = useState<MemberInput>(EMPTY)
  const [errors, setErrors] = useState<MemberErrors>({})

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = onSubmit(values)
    setErrors(result)
    if (Object.keys(result).length === 0) setValues(EMPTY)
  }

  function field(name: keyof MemberInput, label: string, type = 'text') {
    const errorId = `${name}-error`
    return (
      <div className="field">
        <label htmlFor={name}>{label}</label>
        <input
          id={name}
          name={name}
          type={type}
          value={values[name]}
          onChange={(e) => setValues({ ...values, [name]: e.target.value })}
          aria-invalid={errors[name] ? true : undefined}
          aria-describedby={errors[name] ? errorId : undefined}
        />
        {errors[name] && (
          <p id={errorId} className="field-error" role="alert">
            {errors[name]}
          </p>
        )}
      </div>
    )
  }

  return (
    <form className="member-form" onSubmit={handleSubmit} noValidate aria-label="Ajouter un adhérent">
      <h2>Nouvel adhérent</h2>
      {field('firstName', 'Prénom')}
      {field('lastName', 'Nom')}
      {field('email', 'Email', 'email')}
      {field('birthDate', 'Date de naissance', 'date')}
      <button type="submit">Ajouter l'adhérent</button>
    </form>
  )
}
