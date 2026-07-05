import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

export default function RottaProtetta({ children }) {
  const { utente, caricamento } = useAuth()

  if (caricamento) return null

  if (!utente) {
    return <Navigate to="/accedi" replace />
  }

  return children
}
