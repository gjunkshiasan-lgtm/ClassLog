import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { chiamaFunzione } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'
import { useZoom } from '../lib/ZoomContext'
import LayoutApp from '../components/LayoutApp'

function ControlloZoom() {
  const { livelloZoom, aumentaZoom, diminuisciZoom, ripristinaZoom, ZOOM_MINIMO, ZOOM_MASSIMO } = useZoom()

  return (
    <div className="controllo-zoom">
      <div>
        <span className="text-body-md" style={{ fontWeight: 600, display: 'block' }}>Dimensione Testo</span>
        <button
          type="button"
          className="link-testuale"
          style={{ fontSize: 12, color: 'var(--color-on-surface-variant)' }}
          onClick={ripristinaZoom}
        >
          Ripristina predefinito
        </button>
      </div>
      <div className="controllo-zoom-bottoni">
        <button
          type="button"
          className="btn-zoom"
          onClick={diminuisciZoom}
          disabled={livelloZoom <= ZOOM_MINIMO}
          aria-label="Riduci dimensione testo"
        >
          A-
        </button>
        <span className="zoom-percentuale">{livelloZoom}%</span>
        <button
          type="button"
          className="btn-zoom"
          onClick={aumentaZoom}
          disabled={livelloZoom >= ZOOM_MASSIMO}
          aria-label="Aumenta dimensione testo"
        >
          A+
        </button>
      </div>
    </div>
  )
}

function SezioneEliminaAccount({ utente, onEliminato }) {
  const [mostraForm, setMostraForm] = useState(false)
  const [password, setPassword] = useState('')
  const [inviando, setInviando] = useState(false)
  const [errore, setErrore] = useState('')

  async function gestisciEliminazione() {
    if (!password) return
    setErrore('')
    setInviando(true)
    try {
      await chiamaFunzione('elimina-account', { utente_id: utente.id, password })
      onEliminato()
    } catch (err) {
      setErrore(err.message)
      setInviando(false)
    }
  }

  return (
    <div className="zona-pericolo">
      <div className="zona-pericolo-danger-header">
        <span aria-hidden="true">⚠️</span>
        <span>Zona Pericolo</span>
      </div>

      {!mostraForm ? (
        <>
          <p className="text-body-md" style={{ margin: 0, textAlign: 'center', color: 'var(--color-on-surface-variant)', fontSize: 14 }}>
            L'avvio di questo protocollo eliminerà permanentemente il tuo account.
            Le tue cronache resteranno visibili ma anonime.
          </p>
          <button className="btn-autodistruzione" onClick={() => setMostraForm(true)}>
            🗑️ Elimina Account e Dati
          </button>
        </>
      ) : (
        <div className="conferma-autodistruzione-box">
          <p className="text-body-md" style={{ margin: 0 }}>
            Questa azione non può essere annullata. Inserisci la tua password per confermare.
          </p>

          {errore && (
            <div className="messaggio-errore" role="alert">
              <span aria-hidden="true">⚠️</span>
              <span>{errore}</span>
            </div>
          )}

          <div className="campo-input-wrap">
            <input
              id="password-elimina-account"
              className="input-brutalist"
              type="password"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={inviando}
            />
            <label className="campo-label" htmlFor="password-elimina-account">La tua password</label>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            <button
              className="btn-autodistruzione"
              style={{ flex: 1 }}
              onClick={gestisciEliminazione}
              disabled={inviando || !password}
            >
              {inviando ? <span className="spinner" aria-hidden="true" /> : 'Elimina Account Permanentemente'}
            </button>
            <button
              className="btn-azione-piccolo"
              onClick={() => { setMostraForm(false); setPassword(''); setErrore('') }}
              disabled={inviando}
            >
              Annulla
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function RigaAvanzate({ utente, onAccountEliminato }) {
  const [espansa, setEspansa] = useState(false)

  return (
    <div className="impostazioni-riga">
      <button
        type="button"
        className="impostazioni-riga-header"
        onClick={() => setEspansa(!espansa)}
        aria-expanded={espansa}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <span aria-hidden="true">⚙️</span>
          <span className="text-body-md" style={{ fontWeight: 600 }}>Impostazioni Avanzate</span>
        </span>
        <span aria-hidden="true">{espansa ? '▲' : '▼'}</span>
      </button>

      {espansa && (
        <div className="impostazioni-riga-contenuto">
          <ControlloZoom />
          <SezioneEliminaAccount utente={utente} onEliminato={onAccountEliminato} />
        </div>
      )}
    </div>
  )
}

export default function Impostazioni() {
  const navigate = useNavigate()
  const { utente, esci } = useAuth()

  function gestisciAccountEliminato() {
    esci()
    navigate('/accedi')
  }

  return (
    <LayoutApp>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
        <h2 className="text-headline-md" style={{ margin: 0 }}>Impostazioni</h2>

        <RigaAvanzate utente={utente} onAccountEliminato={gestisciAccountEliminato} />
      </div>
    </LayoutApp>
  )
}
