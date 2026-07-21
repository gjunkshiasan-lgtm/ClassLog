const FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLScnXRS5MAHirzkRLMryTlp-p9d8aGgctXADgtsz66xqaSThXA/viewform'

/**
 * Banner compatto che invita l'utente a compilare il form anonimo di feedback.
 * Usato in Benvenuto, Accedi, Bannato e Impostazioni.
 */
export default function BannerFeedback() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--space-md)',
        padding: 'var(--space-sm) var(--space-md)',
        backgroundColor: 'var(--color-surface-container)',
        border: '2px solid var(--color-outline-variant)',
        marginTop: 'var(--space-lg)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span className="text-label-caps" style={{ color: 'var(--color-secondary)', fontSize: 11 }}>
          💬 Feedback Anonimo
        </span>
        <span className="text-body-md" style={{ fontSize: 13, color: 'var(--color-on-surface-variant)' }}>
          C'è qualcosa che non va? Hai un suggerimento?
        </span>
      </div>
      <a
        href={FORM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-brutalist btn-secondary-outline"
        style={{ whiteSpace: 'nowrap', fontSize: 13, padding: '6px 12px', flexShrink: 0 }}
      >
        Scrivi →
      </a>
    </div>
  )
}
