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

function CardIdentita({ nicknamePreview, onRigenera, disabled }) {
  return (
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
        onClick={onRigenera}
        disabled={disabled}
      >
        🔄 Genera Nickname Casuale
      </button>
    </div>
  )
}

function FormEntraClasse({ nicknamePreview }) {
  const navigate = useNavigate()
  const { accedi } = useAuth()

  const [codiceClasse, setCodiceClasse] = useState('')
  const [password, setPassword] = useState('')
  const [inviando, setInviando] = useState(false)
  const [errore, setErrore] = useState('')

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
        ruolo: risposta.utente.ruolo,
      })

      navigate('/feed')
    } catch (err) {
      setErrore(err.message)
    } finally {
      setInviando(false)
    }
  }

  return (
    <form onSubmit={gestisciInvio} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
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
          {inviando ? <span className="spinner" aria-hidden="true" /> : <>Entra nella Classe →</>}
        </button>
      </div>
    </form>
  )
}

function FormCreaClasse({ nicknamePreview }) {
  const navigate = useNavigate()
  const { accedi } = useAuth()

  const [nomeClasse, setNomeClasse] = useState('')
  const [codiceClasse, setCodiceClasse] = useState('')
  const [password, setPassword] = useState('')
  const [inviando, setInviando] = useState(false)
  const [errore, setErrore] = useState('')

  async function gestisciInvio(e) {
    e.preventDefault()
    setErrore('')

    if (!nomeClasse.trim() || !codiceClasse.trim() || !password) {
      setErrore('Compila tutti i campi per creare la classe.')
      return
    }
    if (password.length < 6) {
      setErrore('La password deve avere almeno 6 caratteri.')
      return
    }
    if (codiceClasse.trim().length < 4) {
      setErrore('Il Codice Classe deve avere almeno 4 caratteri.')
      return
    }

    setInviando(true)
    try {
      const risposta = await chiamaFunzione('crea-classe', {
        nome_classe: nomeClasse.trim(),
        codice_classe: codiceClasse.trim(),
        password,
      })

      accedi({
        id: risposta.utente.id,
        nickname: risposta.utente.nickname,
        ruolo: risposta.utente.ruolo,
      })

      navigate('/feed')
    } catch (err) {
      setErrore(err.message)
    } finally {
      setInviando(false)
    }
  }

  return (
    <form onSubmit={gestisciInvio} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
      <div className="neo-card">
        <div className="neo-card-header">
          <span className="text-label-caps" style={{ color: 'var(--color-on-surface-variant)' }}>
            Fonda una Nuova Classe
          </span>
          <span aria-hidden="true">👑</span>
        </div>

        <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)', margin: 0, fontSize: 14 }}>
          Diventerai il <strong style={{ color: 'var(--color-primary-fixed-dim)' }}>ROOT</strong> di questa classe:
          potrai approvare cronache, gestire segnalazioni, promuovere altri Admin e bannare utenti.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
          <div className="campo-input-wrap">
            <input
              id="nome-classe"
              className="input-brutalist"
              type="text"
              placeholder=" "
              autoComplete="off"
              maxLength={60}
              value={nomeClasse}
              onChange={(e) => setNomeClasse(e.target.value)}
              disabled={inviando}
            />
            <label className="campo-label" htmlFor="nome-classe">Nome Classe (univoco, es. "5A Liceo Rossi 2026")</label>
          </div>

          <div className="campo-input-wrap">
            <input
              id="nuovo-codice-classe"
              className="input-brutalist"
              type="text"
              placeholder=" "
              autoComplete="off"
              value={codiceClasse}
              onChange={(e) => setCodiceClasse(e.target.value)}
              style={{ textTransform: 'uppercase' }}
              disabled={inviando}
            />
            <label className="campo-label" htmlFor="nuovo-codice-classe">Nuovo Codice Classe (min. 4 caratteri)</label>
          </div>

          <div className="campo-input-wrap">
            <input
              id="password-root"
              className="input-brutalist"
              type="password"
              placeholder=" "
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={inviando}
            />
            <label className="campo-label" htmlFor="password-root">La tua Password (min. 6 caratteri)</label>
          </div>
        </div>

        {errore && (
          <div className="messaggio-errore" role="alert">
            <span aria-hidden="true">⚠️</span>
            <span>{errore}</span>
          </div>
        )}

        <button type="submit" className="btn-brutalist btn-primary-container" disabled={inviando}>
          {inviando ? <span className="spinner" aria-hidden="true" /> : <>👑 Crea Classe e Diventa ROOT</>}
        </button>
      </div>
    </form>
  )
}

export default function Benvenuto() {
  const navigate = useNavigate()
  const [nicknamePreview, setNicknamePreview] = useState(generaNicknamePreview())
  const [tabAttivo, setTabAttivo] = useState('entra')

  function rigeneraPreview() {
    setNicknamePreview(generaNicknamePreview())
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

        <CardIdentita nicknamePreview={nicknamePreview} onRigenera={rigeneraPreview} />

        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          <button
            type="button"
            className={`chip-categoria ${tabAttivo === 'entra' ? 'selezionata' : ''}`}
            style={{ flex: 1 }}
            onClick={() => setTabAttivo('entra')}
          >
            🚪 Entra in Classe
          </button>
          <button
            type="button"
            className={`chip-categoria ${tabAttivo === 'crea' ? 'selezionata' : ''}`}
            style={{ flex: 1 }}
            onClick={() => setTabAttivo('crea')}
          >
            👑 Crea Classe
          </button>
        </div>

        {tabAttivo === 'entra' ? (
          <FormEntraClasse nicknamePreview={nicknamePreview} />
        ) : (
          <FormCreaClasse nicknamePreview={nicknamePreview} />
        )}

        <p className="text-body-md" style={{ textAlign: 'center', color: 'var(--color-on-surface-variant)' }}>
          Hai già un account?{' '}
          <button type="button" className="link-testuale" onClick={() => navigate('/')}>
            Accedi qui
          </button>
        </p>
      </main>
    </div>
  )
}