# STATO DEL PROGETTO: Class Chronicles

Questo file riassume lo stato attuale dello sviluppo di **Class Chronicles**, un diario digitale anonimo per classi scolastiche (React/Vite + Supabase).
Aggiornalo regolarmente per tenere traccia dei progressi.

## STATO ATTUALE (Completato e Funzionante)

- **Accesso e Ruoli**:
  - Registrazione/Login completati.
  - Onboarding funzionante.
  - Creazione classe: nome selezionato da Numero(1-5)+Lettera (es. "3C"), codice classe generato automaticamente dal sistema (4 caratteri), mostrato una sola volta con pulsante "Copia".
  - Accettazione responsabilità ROOT e regole community integrata in fase di creazione/ingresso classe.
  - Ruoli: `studente`, `admin`, `root`.
  - Ban temporizzato con motivazione e promozione ad admin.

- **Funzionalità Base**:
  - Feed per visualizzare i post.
  - Crea Post: con filtro parole vietate bloccante e domande-spunto.
  - Like funzionante sui post.
  - Banner Broadcast visibile lato utente (già pronto e funzionante).

- **Moderazione e Sicurezza**:
  - Segnalazioni (sia per post che per utenti).
  - Richiesta rimozione anonima ("Mi riconosco").
  - Autodistruzione classe e backup testuale (funzioni esclusive del ROOT).
  - Profilo e Impostazioni: include zoom dell'interfaccia (non solo del testo) e eliminazione account (anonimizzazione, non cancellazione fisica dal DB per mantenere coerenza sui post).
  - Pagina Regole/Privacy.
  - **Blocco Orario Globale**: Intervallo orario (es. 23:00-07:00) valido per tutte le classi. Feed/Crea/Admin bloccati (messaggio via `src/pages/Bloccato.jsx` e `src/lib/RottaProtetta.jsx`), Impostazioni sempre raggiungibili. Gestito via tabella `impostazioni_piattaforma`.
  - **Sospensione Automatica Classi**: Classi con segnalazioni in attesa da PIÙ DI 7 GIORNI non esaminate vengono sospese automaticamente. Gestito via Edge Function `controlla-stato-piattaforma` al caricamento pagina. Colonne `sospesa`, `sospesa_il`, `motivo_sospensione` sulla tabella `classi`.

- **PWA (Progressive Web App)**:
  - PWA completa con icone personalizzate.
  - Installabile su iOS, Android e Samsung.
  - Guida visiva "Aggiungi alla Home" specifica per il dispositivo rilevato.

## DA FARE SUBITO (In Ordine)

1. **Test Blocco Orario Globale**:
   - Da Supabase: impostare `blocco_orario_attivo=true` nella tabella `impostazioni_piattaforma` (con orario corrente incluso).
   - Verificare che il sito blocchi Feed/Crea/Admin e permetta l'accesso a Impostazioni.
   - Ripristinare `blocco_orario_attivo=false`.

2. **Test Sospensione Automatica**:
   - Modificare manualmente in Supabase il campo `creato_il` di un post segnalato o in `segnalazioni_utenti` per farlo risultare più vecchio di 7 giorni.
   - Verificare che al successivo accesso la classe risulti sospesa.
   - Per riattivare, impostare `sospesa=false` sulla tabella `classi`.

3. **Revisione Moderazione (`src/pages/Admin.jsx`)**:
   - Confermare che admin/root vedano correttamente le code di approvazione/segnalazioni senza effetti collaterali legati a Blocco Orario o Sospensione Automatica.

## DA FARE DOPO (Roadmap Aperta)

- **Chat di supporto anonima**: *ATTENZIONE* - Solo intenzione per ora. NON procedere senza chiarire:
  - Chi risponde? È monitorata sempre? Cosa succede per vere emergenze senza supervisione attiva?
  - Discutere e confermare dettagliatamente con l'utente prima di scrivere codice.

## VINCOLI DI SICUREZZA ASSOLUTI

> **NON VIOLARE MAI QUESTE REGOLE** anche se sembrano utili o suggerite altrove:

- NESSUN fingerprinting o tracciamento di dispositivo/hardware ID.
- NESSUNA raccolta di IP o dati tecnici per "log da consegnare alle autorità" (la promessa è l'anonimato REALE).
- Ogni modifica legata a privacy/anonimato/sorveglianza va discussa e confermata **esplicitamente** con l'utente PRIMA di implementarla, illustrando i rischi chiaramente.

## METODO DI LAVORO PREFERITO

- Procedere **un pezzo alla volta**, passo dopo passo, mai tutto insieme.
- Dopo ogni modifica, eseguire una build locale (`npm run build`) per verificare errori PRIMA di invitare l'utente a pubblicare su GitHub.
- L'utente si occupa personalmente della pubblicazione (`git add/commit/push`).
- Le istruzioni devono essere concrete e passo-passo. L'utente usa PowerShell: preferire comandi come `Set-Content` o `Add-Content` rispetto al copia-incolla manuale.
