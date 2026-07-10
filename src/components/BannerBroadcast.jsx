import { useState } from 'react'

export default function BannerBroadcast({ broadcast }) {
  const [idNascosti, setIdNascosti] = useState([])

  const broadcastVisibili = broadcast.filter((b) => !idNascosti.includes(b.id))

  if (broadcastVisibili.length === 0) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
      {broadcastVisibili.map((b) => (
        <div key={b.id} className="banner-broadcast">
          <span aria-hidden="true">📢</span>
          <span className="banner-broadcast-testo">{b.testo}</span>
          <button
            type="button"
            className="banner-broadcast-chiudi"
            onClick={() => setIdNascosti((prec) => [...prec, b.id])}
            aria-label="Nascondi avviso"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
