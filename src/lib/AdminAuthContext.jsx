import { createContext, useContext, useState, useEffect } from 'react'

const AdminAuthContext = createContext(null)
const CHIAVE_STORAGE_ADMIN = 'classchronicles_sessione_admin'

/**
 * Sessione Admin separata da quella studente: un utente potrebbe
 * essere sia studente che Admin nello stesso browser.
 */
export function AdminAuthProvider({ children }) {
  const [classeAdmin, setClasseAdmin] = useState(null)
  const [caricamento, setCaricamento] = useState(true)

  useEffect(() => {
    const salvato = localStorage.getItem(CHIAVE_STORAGE_ADMIN)
    if (salvato) {
      try {
        setClasseAdmin(JSON.parse(salvato))
      } catch {
        localStorage.removeItem(CHIAVE_STORAGE_ADMIN)
      }
    }
    setCaricamento(false)
  }, [])

  function accediAdmin(dati) {
    setClasseAdmin(dati)
    localStorage.setItem(CHIAVE_STORAGE_ADMIN, JSON.stringify(dati))
  }

  function esciAdmin() {
    setClasseAdmin(null)
    localStorage.removeItem(CHIAVE_STORAGE_ADMIN)
  }

  return (
    <AdminAuthContext.Provider value={{ classeAdmin, accediAdmin, esciAdmin, caricamento }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth deve essere usato dentro un AdminAuthProvider')
  return ctx
}
