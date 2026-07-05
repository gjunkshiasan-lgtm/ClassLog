import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

/**
 * Questa è una pagina TEMPORANEA solo per verificare che
 * login/registrazione funzionino. Verrà sostituita dal
 * vero Feed di Classe nel prossimo step del progetto.
 */
export default function FeedTemporaneo() {
  const navigate = useNavigate()
  const { utente, esci } = useAuth()

  function gestisciUscita() {
    esci()
    navigate('/accedi')
  }

  return (
    <div className="pagina" style={{ justifyContent: 'center', alignItems: 'center', minHeight: '100dvh' }}>
      <div className="griglia-decorativa" />
      <div className="neo-card" style={{ maxWidth: 420, zIndex: 1, textAlign: 'center' }}>
        <span style={{ fontSize: 40 }}>✅</span>
        <h2 className="text-headline-md" style={{ margin: 0 }}>Accesso Riuscito!</h2>
        <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
          Sei entrato come:
        </p>
        <div
          style={{
            backgroundColor: 'var(--color-surface-container-lowest)',
            border: '2px solid var(--color-outline-variant)',
            padding: 'var(--space-md)',
          }}
        >
          <span className="text-headline-md" style={{ color: 'var(--color-primary-fixed)' }}>
            {utente?.nickname}
          </span>
        </div>
        <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
          Questa è una schermata temporanea di verifica. Il vero Feed di Classe sarà il prossimo pezzo che costruiremo insieme.
        </p>
        <button className="btn-brutalist btn-secondary-outline" onClick={gestisciUscita}>
          Esci
        </button>
      </div>
    </div>
  )
}
