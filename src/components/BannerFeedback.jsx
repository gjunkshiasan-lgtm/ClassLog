const FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLScnXRS5MAHirzkRLMryTlp-p9d8aGgctXADgtsz66xqaSThXA/viewform'

/**
 * Link di testo blu che invita l'utente a compilare il form anonimo di feedback.
 * Usato in Benvenuto, Accedi, Bannato e Impostazioni.
 */
export default function BannerFeedback() {
  return (
    <div style={{ textAlign: 'center', marginTop: 'var(--space-lg)' }}>
      <a
        href={FORM_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: '#4da6ff',
          textDecoration: 'underline',
          fontSize: 14,
          cursor: 'pointer',
        }}
      >
        💬 Hai un feedback? Scrivici qui
      </a>
    </div>
  )
}
