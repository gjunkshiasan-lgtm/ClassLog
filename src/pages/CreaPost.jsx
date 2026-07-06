import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { chiamaFunzione } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'
import LayoutApp from '../components/LayoutApp'

const LIMITE_CARATTERI = 500

const CATEGORIE = [
  { valore: 'confessione', etichetta: '#Confessione' },
  { valore: 'gossip', etichetta: '#Gossip' },
  { valore: 'sfogo', etichetta: '#Sfogo' },
  { valore: 'cotta', etichetta: '#Cotta' },
  { valore: 'personalizzato', etichetta: '#Personalizzato' },
]

export default function CreaPost() {
  const navigate = useNavigate()
  const { utente } = useAuth()

  const [titolo, setTitolo] = useState('')
  const [contenuto, setContenuto] = useState('')
  const [categoria, setCategoria] = useState('confessione')
  const [inviando, setInviando] = useState(false)
  const [errore, setErrore] = useState('')
  const [successo, setSuccesso] = useState('')

  async function gestisciInvio(e) {
    e.preventDefault()
    setErrore('')
    setSuccesso('')

    if (!titolo.trim() || !contenuto.trim()) {
      setErrore('Inserisci sia un titolo che il contenuto della cronaca.')
      return
    }

    setInviando(true)
    try {
      const risposta = await chiamaFunzione('crea-post', {
        autore_id: utente.id,
        titolo: titolo.trim(),
        contenuto: contenuto.trim(),
        categoria,
      })

      setSuccesso(risposta.messaggio)
      setTitolo('')
      setContenuto('')
      setCategoria('confessione')

      setTimeout(() => navigate('/feed'), 1800)
    } catch (err) {
      setErrore(err.message)
    } finally {
      setInviando(false)
    }
  }

  return (
    <LayoutApp>
      <div className="banner-legale">
        <span aria-hidden="true">⚠️</span>
        <div>
          <span className="banner-legale-titolo">Protocollo Rigido</span>
          Promemoria: Non usare nomi veri, nomi di insegnanti o dettagli identificativi.
          Mantieni tutto anonimo e divertente! I contenuti inappropriati non saranno approvati.
        </div>
      </div>

      <h2 className="text-headline-md" style={{ margin: 0 }}>Nuova Cronaca</h2>

      <form onSubmit={gestisciInvio} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        <div className="campo-input-wrap">
          <input
            id="titolo-post"
            className="input-brutalist"
            type="text"
            placeholder=" "
            maxLength={100}
            value={titolo}
            onChange={(e) => setTitolo(e.target.value)}
            disabled={inviando}
          />
          <label className="campo-label" htmlFor="titolo-post">Titolo della cronaca</label>
        </div>

        <div>
          <textarea
            className="textarea-brutalist"
            placeholder="Scrivi qui la tua confessione, pettegolezzo o sfogo. Il vuoto sta ascoltando..."
            maxLength={LIMITE_CARATTERI}
            value={contenuto}
            onChange={(e) => setContenuto(e.target.value)}
            disabled={inviando}
          />
          <div className="textarea-footer">
            <span>🟢 Filtro: Attivo</span>
            <span>{contenuto.length} / {LIMITE_CARATTERI}</span>
          </div>
        </div>

        <div className="griglia-chip">
          {CATEGORIE.map((c) => (
            <button
              type="button"
              key={c.valore}
              className={`chip-categoria ${categoria === c.valore ? 'selezionata' : ''}`}
              onClick={() => setCategoria(c.valore)}
              disabled={inviando}
            >
              {c.etichetta}
            </button>
          ))}
        </div>

        {errore && (
          <div className="messaggio-errore" role="alert">
            <span aria-hidden="true">⚠️</span>
            <span>{errore}</span>
          </div>
        )}

        {successo && (
          <div className="messaggio-successo" role="status">
            <span aria-hidden="true">✅</span>
            <span>{successo}</span>
          </div>
        )}

        <button type="submit" className="btn-brutalist btn-primary-container" disabled={inviando}>
          {inviando ? <span className="spinner" aria-hidden="true" /> : <>Invia per Revisione ➤</>}
        </button>
      </form>
    </LayoutApp>
  )
}
