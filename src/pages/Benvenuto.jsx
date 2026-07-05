import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { chiamaFunzione } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'

// Liste usate solo per l'ANTEPRIMA visiva del nickname prima dell'invio.
// Il nickname DEFINITIVO viene sempre generato/validato dal server.
const AGGETTIVI = [
  'Curioso', 'Silenzioso', 'Rapido', 'Astuto', 'Coraggioso', 'Distratto',
  'Misterioso', 'Vivace', 'Instancabile', 'Sognatore', 'Ribelle', 'Geniale',
  'Sfuggente', 'Audace', 'Notturno', 'Elettrico',
]
const SOSTANTIVI = [
  'Tasso', 'Falco', 'Lupo', 'Gufo', 'Volpe', 'Corvo', 'Grillo', 'Delfino',
  'Drago', 'Fantasma', 'Pinguino', 'Squalo', 'Lince', 'Airone', 'Bradipo', 'Colibri',
]

function generaNicknamePreview() {
  const agg = AGGETTIVI[Math.floor(Math.random() * AGGETTIVI.length)]
  const sost = SOSTANTIVI[Math.floor(Math.random() * SOSTANTIVI.length)]
  const numero = Math.floor(Math.random() * 90) + 10
  return `${agg}${sost}${numero}`
}

export default function Benvenuto() {
  const navigate = useNavigate()
  const { accedi } = useAuth()

  const [nicknamePreview, setNicknamePreview] = useState(generaNicknamePreview())
  const [codiceClasse, setCodiceClasse] = useState('')
  const [password, setPassword] = useState('')
  const [inviando, setInviando] = useState(false)
  const [errore, setErrore] = useState('')

  function rigeneraPreview() {
    setNicknamePreview(generaNicknamePreview())
  }

  async function gestisciInvio(e) {
    e.preventDefault()
    setErrore('')

    if (!codiceClasse.trim() || !password) {
      setErrore('Inserisci sia il Codice Classe che una password.')
      return
    }
    if (password.length < 6) {
      setErrore('La password deve avere almeno 6 caratteri.')
      return
    }

    setInviando(true)
    try {
      const risposta = await chiamaFunzione('registrazione', {
        codice_classe: codiceClasse.trim(),
        password,
        nickname_richiesto: nicknamePreview,
      })

      accedi({
        id: risposta.utente.id,
        nickname: risposta.utente.nickname,
      })

      navigate('/feed')
    } catch (err) {
      setErrore(err.message)
    } finally {
      setInviando(false)
    }
  }

  return (
    <div className="pagina">
      <div className="griglia-decorativa" />
      <header className="header-brand">
        <h1 className="text-headline-md">CLASS CHRONICLES</h1>
      </header>

      <main className="pagina-contenuto">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', textAlign: 'center' }}>
          <h2 className="text-display-lg" style={{ margin: 0 }}>
            ENTRA<br />NELLA RETE
          </h2>
          <p className="text-body-lg" style={{ color: 'var(--color-on-surface-variant)', margin: 0 }}>
            Anonimato totale. Alta energia. Proteggi la tua identità.
          </p>
        </div>

        <form onSubmit={gestisciInvio} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
          {/* Card generazione identità */}
          <div className="neo-card">
            <div className="neo-card-header">
              <span className="text-label-caps" style={{ color: 'var(--color-secondary)' }}>Alias Attuale</span>
              <span aria-hidden="true">🔒</span>
            </div>

            <div
              style={{
                backgroundColor: 'var(--color-surface-container-lowest)',
                border: '2px solid var(--color-outline-variant)',
                padding: 'var(--space-md)',
                textAlign: 'center',
                minHeight: 80,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span
                className="text-headline-md"
                style={{ color: 'var(--color-primary-fixed)', letterSpacing: '0.05em', wordBreak: 'break-all' }}
              >
                {nicknamePreview}
              </span>
            </div>

            <button
              type="button"
              className="btn-brutalist btn-primary-container"
              onClick={rigeneraPreview}
              disabled={inviando}
            >
              🔄 Genera Nickname Casuale
            </button>
          </div>

          {/* Card accesso classe */}
          <div className="neo-card">
            <div className="neo-card-header">
              <span className="text-label-caps" style={{ color: 'var(--color-on-surface-variant)' }}>
                Portale di Accesso
              </span>
              <span aria-hidden="true">🚪</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
              <div className="campo-input-wrap">
                <input
                  id="codice-classe"
                  className="input-brutalist"
                  type="text"
                  placeholder=" "
                  autoComplete="off"
                  value={codiceClasse}
                  onChange={(e) => setCodiceClasse(e.target.value)}
                  style={{ textTransform: 'uppercase' }}
                  disabled={inviando}
                />
                <label className="campo-label" htmlFor="codice-classe">Codice Classe Privato</label>
              </div>

              <div className="campo-input-wrap">
                <input
                  id="password-registrazione"
                  className="input-brutalist"
                  type="password"
                  placeholder=" "
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={inviando}
                />
                <label className="campo-label" htmlFor="password-registrazione">Password Univoca (min. 6 caratteri)</label>
              </div>
            </div>

            {errore && (
              <div className="messaggio-errore" role="alert">
                <span aria-hidden="true">⚠️</span>
                <span>{errore}</span>
              </div>
            )}

            <button type="submit" className="btn-brutalist btn-primary" disabled={inviando}>
              {inviando ? (
                <span className="spinner" aria-hidden="true" />
              ) : (
                <>Entra nella Classe →</>
              )}
            </button>
          </div>
        </form>

        <p className="text-body-md" style={{ textAlign: 'center', color: 'var(--color-on-surface-variant)' }}>
          Hai già un account?{' '}
          <button type="button" className="link-testuale" onClick={() => navigate('/accedi')}>
            Accedi qui
          </button>
        </p>
      </main>
    </div>
  )
}
