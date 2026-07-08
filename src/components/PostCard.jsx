import { useState } from 'react'
import { tempoRelativo, ETICHETTE_CATEGORIE } from '../lib/formattazione'
import ModalRichiediRimozione from './ModalRichiediRimozione'

export default function PostCard({ post, onSegnala, onRichiediRimozione }) {
  const [segnalazioneInviata, setSegnalazioneInviata] = useState(false)
  const [mostraConfermaSegnalazione, setMostraConfermaSegnalazione] = useState(false)
  const [mostraModalRimozione, setMostraModalRimozione] = useState(false)
  const [richiestaRimozioneInviata, setRichiestaRimozioneInviata] = useState(false)

  async function gestisciSegnalazione() {
    await onSegnala(post.id)
    setSegnalazioneInviata(true)
    setMostraConfermaSegnalazione(false)
  }

  async function gestisciRichiestaRimozione(motivo) {
    await onRichiediRimozione(post.id, motivo)
    setRichiestaRimozioneInviata(true)
    setMostraModalRimozione(false)
  }

  if (segnalazioneInviata) {
    return (
      <article className="post-card" style={{ opacity: 0.6 }}>
        <p className="text-body-md" style={{ margin: 0, textAlign: 'center', color: 'var(--color-on-surface-variant)' }}>
          🚩 Cronaca segnalata. Grazie per aver contribuito a mantenere la classe sicura.
        </p>
      </article>
    )
  }

  return (
    <article className="post-card">
      <div className="post-card-header">
        <div className="post-card-autore">
          <span aria-hidden="true">🔒</span>
          <span>@{post.autore_nickname}</span>
        </div>
        <span className="post-card-tempo">{tempoRelativo(post.creato_il)}</span>
      </div>

      <span className="post-card-categoria-chip">
        {ETICHETTE_CATEGORIE[post.categoria] ?? post.categoria}
      </span>

      <h3 className="post-card-titolo">{post.titolo}</h3>
      <p className="post-card-contenuto">{post.contenuto}</p>

      {richiestaRimozioneInviata && (
        <div className="messaggio-successo" role="status">
          <span aria-hidden="true">✅</span>
          <span>Richiesta di rimozione inviata in forma anonima.</span>
        </div>
      )}

      <div className="post-card-azioni" style={{ flexWrap: 'wrap' }}>
        <span className="post-card-azione-btn" style={{ cursor: 'default' }}>
          <span aria-hidden="true">❤️</span>
          <span>{post.numero_mi_piace}</span>
        </span>

        {!richiestaRimozioneInviata && (
          <button
            type="button"
            className="post-card-azione-btn"
            onClick={() => setMostraModalRimozione(true)}
          >
            <span aria-hidden="true">🙈</span>
            <span>Mi riconosco</span>
          </button>
        )}

        {!mostraConfermaSegnalazione ? (
          <button
            type="button"
            className="post-card-azione-btn segnala"
            style={{ marginLeft: 'auto' }}
            onClick={() => setMostraConfermaSegnalazione(true)}
          >
            <span aria-hidden="true">🚩</span>
            <span>Segnala</span>
          </button>
        ) : (
          <span style={{ marginLeft: 'auto', display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
            <span className="text-body-md" style={{ fontSize: 13, color: 'var(--color-on-surface-variant)' }}>
              Confermi?
            </span>
            <button
              type="button"
              className="post-card-azione-btn segnala"
              onClick={gestisciSegnalazione}
              style={{ fontWeight: 700 }}
            >
              Sì
            </button>
            <button
              type="button"
              className="post-card-azione-btn"
              onClick={() => setMostraConfermaSegnalazione(false)}
            >
              No
            </button>
          </span>
        )}
      </div>

      {mostraModalRimozione && (
        <ModalRichiediRimozione
          onConferma={gestisciRichiestaRimozione}
          onChiudi={() => setMostraModalRimozione(false)}
        />
      )}
    </article>
  )
}
