import { useState } from 'react'
import { MembersPage } from './features/members/MembersPage'

export default function App() {
  // Read the current date once, outside of rendering logic.
  const [today] = useState(() => new Date())
  return <MembersPage today={today} />
}
