import { useNavigate } from 'react-router-dom'

export default function RegolePlaceholder() {
  const navigate = useNavigate()
  return (
    <div className="pagina" style={{ justifyContent: 'center', alignItems: 'center', minHeight: '100dvh' }}>
      <div className="neo-card" style={{ maxWidth: 420, textAlign: 'center' }}>
        <span style={{ fontSize: 40 }}>📜</span>
        <h3 className="text-headline-md" style={{ margin: 0 }}>Regole e Privacy</h3>
        <p className="text-body-md">Questa pagina sarà completata in un pezzo successivo del progetto.</p>
        <button className="btn-brutalist btn-secondary-outline" onClick={() => navigate(-1)}>
          Torna indietro
        </button>
      </div>
    </div>
  )
}
