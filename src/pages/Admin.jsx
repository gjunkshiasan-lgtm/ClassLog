import { useState, useEffect, useCallback } from 'react'
import { chiamaFunzione } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'
import { tempoRelativo, ETICHETTE_CATEGORIE } from '../lib/formattazione'
import LayoutApp from '../components/LayoutApp'

function AccessoNegato() {
  return (
    <div className="stato-vuoto">
      <span style={{ fontSize: 40 }}>🔒</span>
      <h3 className="text-headline-md" style={{ margin: 0 }}>Accesso Riservato</h3>
      <p className="text-body-md">
        Questa sezione è visibile solo agli Admin e al ROOT della classe.
        Se pensi sia un errore, contatta il ROOT della tua classe per essere promosso.
      </p>
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

function CodaApprovazione({ utente }) {
  const [post, setPost] = useState([])
  const [numeroParoleVietate, setNumeroParoleVietate] = useState(0)
  const [filtroAttivo, setFiltroAttivo] = useState(true)
  const [caricamento, setCaricamento] = useState(true)
  const [errore, setErrore] = useState('')

  const caricaCoda = useCallback(async () => {
    setErrore('')
    try {
      const risposta = await chiamaFunzione('admin-coda-approvazione', { utente_id: utente.id })
      setPost(risposta.post)
      setNumeroParoleVietate(risposta.numero_parole_vietate)
    } catch (err) {
      setErrore(err.message)
    } finally {
      setCaricamento(false)
    }
  }, [utente.id])

  useEffect(() => {
    caricaCoda()
  }, [caricaCoda])

  async function gestisciModerazione(postId, azione) {
    try {
      await chiamaFunzione('admin-modera-post', { post_id: postId, utente_id: utente.id, azione })
      setPost((prec) => prec.filter((p) => p.id !== postId))
    } catch (err) {
      setErrore(err.message)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      <div className="admin-sezione-controlli">
        <div className="admin-riga-controllo">
          <div className="admin-riga-controllo-testo">
            <span className="text-body-md" style={{ fontWeight: 600 }}>Filtro Parole Vietate</span>
            <span style={{ fontSize: 13, color: 'var(--color-on-surface-variant)' }}>
              Intercettando {numeroParoleVietate} termini
            </span>
          </div>
          <label className="toggle-switch">
            <input type="checkbox" checked={filtroAttivo} onChange={(e) => setFiltroAttivo(e.target.checked)} />
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

function FormBanUtente({ utenteTarget, motiviPredefiniti, onBanna, onAnnulla }) {
  const [giorni, setGiorni] = useState(3)
  const [motivo, setMotivo] = useState('')
  const [inviando, setInviando] = useState(false)

  async function gestisciConferma() {
    if (!motivo.trim() || giorni < 1) return
    setInviando(true)
    await onBanna(utenteTarget.id, giorni, motivo.trim())
    setInviando(false)
  }

  return (
    <div className="pannello-ban-form">
      <span className="text-label-caps" style={{ color: 'var(--color-error)' }}>
        Banna @{utenteTarget.nickname}
      </span>

      <table className="tabella-motivi-ban">
        <thead>
          <tr>
            <th>Motivo suggerito</th>
            <th>Giorni</th>
          </tr>
        </thead>
        <tbody>
          {motiviPredefiniti.map((m) => (
            <tr
              key={m.id}
              className="selezionabile"
              onClick={() => { setMotivo(m.motivo); setGiorni(m.giorni_suggeriti) }}
            >
              <td>{m.motivo}</td>
              <td>{m.giorni_suggeriti}g</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="campo-input-wrap">
        <input
          id="motivo-ban-custom"
          className="input-brutalist"
          type="text"
          placeholder=" "
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          disabled={inviando}
        />
        <label className="campo-label" htmlFor="motivo-ban-custom">Motivo del ban</label>
      </div>

      <div className="campo-input-wrap">
        <input
          id="giorni-ban"
          className="input-brutalist"
          type="number"
          min={1}
          max={365}
          value={giorni}
          onChange={(e) => setGiorni(Number(e.target.value))}
          disabled={inviando}
        />
        <label className="campo-label" htmlFor="giorni-ban">Giorni di sospensione</label>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
        <button className="btn-rifiuta" style={{ flex: 1 }} onClick={gestisciConferma} disabled={inviando || !motivo.trim()}>
          {inviando ? <span className="spinner" aria-hidden="true" /> : `🚫 Banna per ${giorni}g`}
        </button>
        <button className="btn-azione-piccolo" onClick={onAnnulla} disabled={inviando}>Annulla</button>
      </div>
    </div>
  )
}

function RigaUtente({ u, onBanna, onRimuoviBan, onPromuovi, onRimuoviAdmin, motiviPredefiniti }) {
  const [mostraFormBan, setMostraFormBan] = useState(false)

  return (
    <div className="riga-utente">
      <div className="riga-utente-header">
        <span className="text-body-md" style={{ fontWeight: 600 }}>@{u.nickname}</span>
        <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
          <span className={`badge-ruolo ${u.ruolo}`}>{u.ruolo}</span>
          {u.bannato_attualmente && <span className="badge-bannato">Bannato</span>}
        </div>
      </div>

      {u.bannato_attualmente && (
        <span style={{ fontSize: 13, color: 'var(--color-error)' }}>
          Motivo: {u.motivo_ban} — fino al {new Date(u.bannato_fino_a).toLocaleDateString('it-IT')}
        </span>
      )}

      {u.ruolo !== 'root' && (
        <div className="riga-utente-azioni">
          {u.bannato_attualmente ? (
            <button className="btn-azione-piccolo" onClick={() => onRimuoviBan(u.id)}>
              ✅ Rimuovi Ban
            </button>
          ) : (
            <button className="btn-azione-piccolo pericolo" onClick={() => setMostraFormBan(!mostraFormBan)}>
              🚫 Banna
            </button>
          )}

          {u.ruolo === 'admin' ? (
            <button className="btn-azione-piccolo" onClick={() => onRimuoviAdmin(u.id)}>
              Rimuovi Admin
            </button>
          ) : (
            <button className="btn-azione-piccolo" onClick={() => onPromuovi(u.id)}>
              ⬆️ Promuovi Admin
            </button>
          )}
        </div>
      )}

      {mostraFormBan && (
        <FormBanUtente
          utenteTarget={u}
          motiviPredefiniti={motiviPredefiniti}
          onAnnulla={() => setMostraFormBan(false)}
          onBanna={async (id, giorni, motivo) => {
            await onBanna(id, giorni, motivo)
            setMostraFormBan(false)
          }}
        />
      )}
    </div>
  )
}

function GestioneUtenti({ utente }) {
  const [utenti, setUtenti] = useState([])
  const [motiviPredefiniti, setMotiviPredefiniti] = useState([])
  const [caricamento, setCaricamento] = useState(true)
  const [errore, setErrore] = useState('')

  const caricaUtenti = useCallback(async () => {
    setErrore('')
    try {
      const risposta = await chiamaFunzione('root-ottieni-utenti', { richiedente_id: utente.id })
      setUtenti(risposta.utenti)
      setMotiviPredefiniti(risposta.motivi_ban_predefiniti)
    } catch (err) {
      setErrore(err.message)
    } finally {
      setCaricamento(false)
    }
  }, [utente.id])

  useEffect(() => {
    caricaUtenti()
  }, [caricaUtenti])

  async function eseguiAzione(utente_target_id, azione, extra = {}) {
    try {
      await chiamaFunzione('root-gestisci-utente', {
        richiedente_id: utente.id,
        utente_target_id,
        azione,
        ...extra,
      })
      await caricaUtenti()
    } catch (err) {
      setErrore(err.message)
    }
  }

  if (caricamento) {
    return (
      <div className="stato-vuoto">
        <span className="spinner" aria-hidden="true" style={{ width: 28, height: 28 }} />
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      {errore && (
        <div className="messaggio-errore" role="alert">
          <span aria-hidden="true">⚠️</span>
          <span>{errore}</span>
        </div>
      )}

      {utenti.map((u) => (
        <RigaUtente
          key={u.id}
          u={u}
          motiviPredefiniti={motiviPredefiniti}
          onBanna={(id, giorni, motivo) => eseguiAzione(id, 'banna', { giorni_ban: giorni, motivo_ban: motivo })}
          onRimuoviBan={(id) => eseguiAzione(id, 'rimuovi_ban')}
          onPromuovi={(id) => eseguiAzione(id, 'promuovi_admin')}
          onRimuoviAdmin={(id) => eseguiAzione(id, 'rimuovi_admin')}
        />
      ))}
    </div>
  )
}

function DashboardAdmin({ utente }) {
  const [tab, setTab] = useState('coda')
  const eRoot = utente.ruolo === 'root'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      <h2 className="text-headline-md" style={{ margin: 0 }}>Controlli di Sistema</h2>

      {eRoot && (
        <div className="root-tab-selector">
          <button
            className={`root-tab-btn ${tab === 'coda' ? 'attivo' : ''}`}
            onClick={() => setTab('coda')}
          >
            Coda Approvazione
          </button>
          <button
            className={`root-tab-btn ${tab === 'utenti' ? 'attivo' : ''}`}
            onClick={() => setTab('utenti')}
          >
            Gestione Utenti
          </button>
        </div>
      )}

      {tab === 'coda' && <CodaApprovazione utente={utente} />}
      {tab === 'utenti' && eRoot && <GestioneUtenti utente={utente} />}
    </div>
  )
}

export default function Admin() {
  const { utente } = useAuth()
  const puoModerare = utente?.ruolo === 'admin' || utente?.ruolo === 'root'

  return (
    <LayoutApp>
      {puoModerare ? <DashboardAdmin utente={utente} /> : <AccessoNegato />}
    </LayoutApp>
  )
}