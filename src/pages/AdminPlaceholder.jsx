import LayoutApp from '../components/LayoutApp'

/**
 * Placeholder temporaneo: il vero Pannello Admin
 * è il prossimo pezzo che costruiremo.
 */
export default function AdminPlaceholder() {
  return (
    <LayoutApp>
      <div className="stato-vuoto">
        <span style={{ fontSize: 40 }}>🖥️</span>
        <h3 className="text-headline-md" style={{ margin: 0 }}>Pannello Admin</h3>
        <p className="text-body-md">In costruzione: sarà il prossimo pezzo che aggiungeremo.</p>
      </div>
    </LayoutApp>
  )
}
