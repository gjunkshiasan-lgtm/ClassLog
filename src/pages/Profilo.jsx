import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { chiamaFunzione } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'
import LayoutApp from '../components/LayoutApp'

function dataFormattata(dataIso) {
  return new Date(dataIso).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })
}

const ETICHETTE_RUOLO = {
  root: '👑 ROOT',
  admin: '🛡️ Admin',
  studente: 'Studente',
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

export default function Profilo() {
  const navigate = useNavigate()
  const { utente, esci } = useAuth()
  const [statistiche, setStatistiche] = useState(null)
  const [caricamento, setCaricamento] = useState(true)
  const [errore, setErrore] = useState('')

  const caricaStatistiche = useCallback(async () => {
    setErrore('')
    try {
      const risposta = await chiamaFunzione('profilo-statistiche', { utente_id: utente.id })
      setStatistiche(risposta.statistiche)
    } catch (err) {
      setErrore(err.message)
    } finally {
      setCaricamento(false)
    }
  }, [utente.id])

  useEffect(() => {
    caricaStatistiche()
  }, [caricaStatistiche])

  function gestisciUscita() {
    esci()
    navigate('/accedi')
  }

  function gestisciAccountEliminato() {
    esci()
    navigate('/accedi')
  }

  return (
    <LayoutApp>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
        <div className="profilo-header">
          <div className="profilo-avatar" aria-hidden="true">👤</div>
          <div>
            <h2 className="text-headline-md" style={{ margin: 0 }}>{utente.nickname}</h2>
            <span className="text-label-caps" style={{ color: 'var(--color-primary-fixed-dim)' }}>
              {ETICHETTE_RUOLO[utente.ruolo] ?? utente.ruolo}
            </span>
          </div>
        </div>

        {caricamento && (
          <div className="stato-vuoto">
            <span className="spinner" aria-hidden="true" style={{ width: 28, height: 28 }} />
          </div>
        )}

        {!caricamento && errore && (
          <div className="messaggio-errore" role="alert">
            <span aria-hidden="true">⚠️</span>
            <span>{errore}</span>
          </div>
        )}

        {!caricamento && statistiche && (
          <>
            <div className="profilo-stats-griglia">
              <div className="profilo-stat-card">
                <span className="profilo-stat-numero">{statistiche.numero_cronache_pubblicate}</span>
                <span className="text-label-caps" style={{ color: 'var(--color-on-surface-variant)' }}>Cronache</span>
              </div>
              <div className="profilo-stat-card">
                <span className="profilo-stat-numero">{statistiche.totale_mi_piace}</span>
                <span className="text-label-caps" style={{ color: 'var(--color-on-surface-variant)' }}>Mi Piace Ricevuti</span>
              </div>
            </div>

            <div className="neo-card">
              <span className="text-label-caps" style={{ color: 'var(--color-on-surface-variant)' }}>Membro dal</span>
              <span className="text-body-md">{dataFormattata(statistiche.creato_il)}</span>
            </div>
          </>
        )}

        <SezioneEliminaAccount utente={utente} onEliminato={gestisciAccountEliminato} />

        <button className="btn-brutalist btn-secondary-outline" onClick={gestisciUscita}>
          Esci
        </button>
      </div>
    </LayoutApp>
  )
}
