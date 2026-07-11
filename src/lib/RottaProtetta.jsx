import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

export default function RottaProtetta({ children }) {
  const { utente, caricamento } = useAuth()

  if (caricamento) return null

  if (!utente) {
    return <Navigate to="/accedi" replace />
  }

  // Controllo ban lato client: se la scadenza salvata è ancora nel futuro,
  // reindirizziamo sempre alla schermata di ban (il controllo "vero" resta
  // comunque lato server ad ogni chiamata alle Edge Functions).
  const eAncoraBannato = utente.bannato_fino_a && new Date(utente.bannato_fino_a) > new Date()
  if (eAncoraBannato) {
    return <Navigate to="/bannato" replace />
  }

  return children
}
