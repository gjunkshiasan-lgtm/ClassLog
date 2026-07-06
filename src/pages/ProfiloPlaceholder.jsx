import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import LayoutApp from '../components/LayoutApp'

/**
 * Placeholder temporaneo: il vero Profilo con
 * eliminazione account arriverà in un pezzo successivo.
 */
export default function ProfiloPlaceholder() {
  const navigate = useNavigate()
  const { utente, esci } = useAuth()

  function gestisciUscita() {
    esci()
    navigate('/accedi')
  }

  return (
    <LayoutApp>
      <div className="stato-vuoto">
        <span style={{ fontSize: 40 }}>👤</span>
        <h3 className="text-headline-md" style={{ margin: 0 }}>{utente?.nickname}</h3>
        <p className="text-body-md">
          Il profilo completo (statistiche, eliminazione account) sarà un pezzo successivo.
        </p>
        <button className="btn-brutalist btn-secondary-outline" style={{ width: 'auto', padding: '12px 24px' }} onClick={gestisciUscita}>
          Esci
        </button>
      </div>
    </LayoutApp>
  )
}
