import { useState, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { chiamaFunzione, supabase } from './supabaseClient'
import Bloccato from '../pages/Bloccato'

const ROTTE_SEMPRE_ACCESSIBILI = ['/impostazioni']

export default function RottaProtetta({ children }) {
  const { utente, caricamento, accedi } = useAuth()
  const location = useLocation()
  const [statoPiattaforma, setStatoPiattaforma] = useState(null)
  const [controllando, setControllando] = useState(true)

  useEffect(() => {
    if (!utente) {
      setControllando(false)
      return
    }
    let cancellato = false

    async function eseguiControlli() {
      try {
        const rispostaPiattaforma = await chiamaFunzione('controlla-stato-piattaforma', { utente_id: utente.id })
        if (!cancellato) setStatoPiattaforma(rispostaPiattaforma)

        // Controlla ban utente in tempo reale
        const { data: datiUtente } = await supabase
          .from('utenti')
          .select('bannato_fino_a, motivo_ban')
          .eq('id', utente.id)
          .single()

        if (!cancellato && datiUtente) {
          // Se lo stato di ban nel DB è diverso da quello salvato nel localStorage/Context, aggiorniamo la sessione
          if (datiUtente.bannato_fino_a !== utente.bannato_fino_a) {
            accedi({ ...utente, bannato_fino_a: datiUtente.bannato_fino_a, motivo_ban: datiUtente.motivo_ban })
          }
        }
      } catch (err) {
        if (!cancellato) setStatoPiattaforma({ blocco_orario_attivo: false, classe_sospesa: false })
      } finally {
        if (!cancellato) setControllando(false)
      }
    }

    eseguiControlli()

    return () => { cancellato = true }
  }, [utente, location.pathname, accedi])

  if (caricamento || controllando) return null

  if (!utente) {
    return <Navigate to="/accedi" replace />
  }

  const eAncoraBannato = utente.bannato_fino_a && new Date(utente.bannato_fino_a) > new Date()
  if (eAncoraBannato) {
    return <Navigate to="/bannato" replace />
  }

  const rottaSempreAccessibile = ROTTE_SEMPRE_ACCESSIBILI.includes(location.pathname)

  if (!rottaSempreAccessibile && statoPiattaforma?.blocco_orario_attivo) {
    return <Bloccato tipo="orario" messaggio={statoPiattaforma.messaggio_blocco_orario} />
  }

  if (!rottaSempreAccessibile && statoPiattaforma?.classe_sospesa) {
    return <Bloccato tipo="sospensione" messaggio={statoPiattaforma.motivo_sospensione} />
  }

  return children
}
