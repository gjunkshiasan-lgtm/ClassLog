import { useState, useEffect, useCallback } from 'react'
import { chiamaFunzione } from '../lib/supabaseClient'
import { useAdminAuth } from '../lib/AdminAuthContext'
import { tempoRelativo, ETICHETTE_CATEGORIE } from '../lib/formattazione'
import LayoutApp from '../components/LayoutApp'

function LoginAdmin() {
  const { accediAdmin } = useAdminAuth()
  const [codiceClasse, setCodiceClasse] = useState('')
  const [passwordAdmin, setPasswordAdmin] = useState('')
  const [inviando, setInviando] = useState(false)
  const [errore, setErrore] = useState('')

  async function gestisciInvio(e) {
    e.preventDefault()
    setErrore('')

    if (!codiceClasse.trim() || !passwordAdmin) {
      setErrore('Inserisci Codice Classe e Password Admin.')
      return
    }

    setInviando(true)
    try {
      const risposta = await chiamaFunzione('admin-login', {
        codice_classe: codiceClasse.trim(),
        password_admin: passwordAdmin,
      })
      accediAdmin({ classeId: risposta.classe.id, nomeClasse: risposta.classe.nome_classe })
    } catch (err) {
      setErrore(err.message)
    } finally {
      setInviando(false)
    }
  }

  return (
    <div className="stato-vuoto" style={{ width: '100%' }}>
      <span style={{ fontSize: 40 }}>🖥️</span>
      <h3 className="text-headline-md" style={{ margin: 0 }}>Accesso Amministratore</h3>
      <p className="text-body-md">Area riservata alla gestione della classe.</p>

      <form
        onSubmit={gestisciInvio}
        style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', textAlign: 'left' }}
      >
        <div className="campo-input-wrap">
          <input
            id="codice-classe-admin"
            className="input-brutalist"
            type="text"
            placeholder=" "
            value={codiceClasse}
            onChange={(e) => setCodiceClasse(e.target.value)}
            style={{ textTransform: 'uppercase' }}
            disabled={inviando}
          />
          <label className="campo-label" htmlFor="codice-classe-admin">Codice Classe</label>
        </div>

        <div className="campo-input-wrap">
          <input
            id="password-admin"
            className="input-brutalist"
            type="password"
            placeholder=" "
            value={passwordAdmin}
            onChange={(e) => setPasswordAdmin(e.target.value)}
            disabled={inviando}
          />
          <label className="campo-label" htmlFor="password-admin">Password Admin</label>
        </div>

        {errore && (
          <div className="messaggio-errore" role="alert">
            <span aria-hidden="true">⚠️</span>
            <span>{errore}</span>
          </div>
        )}

        <button type="submit" className="btn-brutalist btn-primary" disabled={inviando}>
          {inviando ? <span className="spinner" aria-hidden="true" /> : <>Accedi come Admin</>}
        </button>
      </form>
    </div>
  )
}

function CardModerazione({ post, onModera }) {
  const [elaborando, setElaborando] = useState(false)

  async function gestisci(azione) {
    setElaborando(true)
    await onModera(post.id, azione)
    setElaborando(false)
  }

  const eSegnalato = post.stato === 'segnalato'

  return (
    <div className={`admin-card-moderazione ${eSegnalato ? 'segnalato' : ''}`}>
      <div className="admin-card-header">
        <span className="post-card-categoria-chip">
          {ETICHETTE_CATEGORIE[post.categoria] ?? post.categoria}
        </span>
        <span className="admin-card-id">
          {eSegnalato ? `🚩 SEGNALATO (${post.numero_segnalazioni})` : `ID: #${post.id.slice(0, 6).toUpperCase()}`}
        </span>
      </div>

      <h4 className="post-card-titolo" style={{ fontSize: 18 }}>{post.titolo}</h4>
      <p className="post-card-contenuto">{post.contenuto}</p>
      <span className="post-card-tempo">{tempoRelativo(post.creato_il)}</span>

      <div className="admin-card-azioni">
        <button className="btn-approva" onClick={() => gestisci('approva')} disabled={elaborando}>
          ✅ Approva
        </button>
        <button className="btn-rifiuta" onClick={() => gestisci('rifiuta')} disabled={elaborando}>
          ⊗ Rifiuta
        </button>
      </div>
    </div>
  )
}

function DashboardAdmin() {
  const { classeAdmin, esciAdmin } = useAdminAuth()
  const [post, setPost] = useState([])
  const [numeroParoleVietate, setNumeroParoleVietate] = useState(0)
  const [filtroAttivo, setFiltroAttivo] = useState(true)
  const [caricamento, setCaricamento] = useState(true)
  const [errore, setErrore] = useState('')

  const caricaCoda = useCallback(async () => {
    setErrore('')
    try {
      const risposta = await chiamaFunzione('admin-coda-approvazione', { classe_id: classeAdmin.classeId })
      setPost(risposta.post)
      setNumeroParoleVietate(risposta.numero_parole_vietate)
    } catch (err) {
      setErrore(err.message)
    } finally {
      setCaricamento(false)
    }
  }, [classeAdmin.classeId])

  useEffect(() => {
    caricaCoda()
  }, [caricaCoda])

  async function gestisciModerazione(postId, azione) {
    try {
      await chiamaFunzione('admin-modera-post', { post_id: postId, classe_id: classeAdmin.classeId, azione })
      setPost((prec) => prec.filter((p) => p.id !== postId))
    } catch (err) {
      setErrore(err.message)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="text-headline-md" style={{ margin: 0 }}>Controlli di Sistema</h2>
          <span className="text-body-md" style={{ color: 'var(--color-on-surface-variant)', fontSize: 14 }}>
            {classeAdmin.nomeClasse}
          </span>
        </div>
        <button className="link-testuale text-label-caps" onClick={esciAdmin}>Esci</button>
      </div>

      <div className="admin-sezione-controlli">
        <div className="admin-riga-controllo">
          <div className="admin-riga-controllo-testo">
            <span className="text-body-md" style={{ fontWeight: 600 }}>Filtro Parole Vietate</span>
            <span style={{ fontSize: 13, color: 'var(--color-on-surface-variant)' }}>
              Intercettando {numeroParoleVietate} termini
            </span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={filtroAttivo}
              onChange={(e) => setFiltroAttivo(e.target.checked)}
            />
            <span className="toggle-slider" />
          </label>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 className="text-headline-md" style={{ margin: 0, fontSize: 18 }}>In Attesa di Approvazione</h3>
        <span className="admin-badge-coda">{post.length} elementi in coda</span>
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

      {!caricamento && !errore && post.length === 0 && (
        <div className="stato-vuoto">
          <span style={{ fontSize: 32 }}>✅</span>
          <p className="text-body-md">Nessuna cronaca in attesa. Tutto sotto controllo!</p>
        </div>
      )}

      {!caricamento && post.map((p) => (
        <CardModerazione key={p.id} post={p} onModera={gestisciModerazione} />
      ))}
    </div>
  )
}

export default function Admin() {
  const { classeAdmin, caricamento } = useAdminAuth()

  return (
    <LayoutApp>
      {caricamento ? null : classeAdmin ? <DashboardAdmin /> : <LoginAdmin />}
    </LayoutApp>
  )
}
