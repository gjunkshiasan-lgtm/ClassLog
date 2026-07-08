import { createContext, useContext, useState, useEffect } from 'react'

const ZoomContext = createContext(null)
const CHIAVE_STORAGE_ZOOM = 'classchronicles_zoom_testo'

const ZOOM_MINIMO = 80
const ZOOM_MASSIMO = 140
const PASSO_ZOOM = 10
const ZOOM_DEFAULT = 100

export function ZoomProvider({ children }) {
  const [livelloZoom, setLivelloZoom] = useState(() => {
    const salvato = localStorage.getItem(CHIAVE_STORAGE_ZOOM)
    return salvato ? Number(salvato) : ZOOM_DEFAULT
  })

  useEffect(() => {
    document.documentElement.style.fontSize = `${livelloZoom}%`
    localStorage.setItem(CHIAVE_STORAGE_ZOOM, String(livelloZoom))
  }, [livelloZoom])

  function aumentaZoom() {
    setLivelloZoom((prec) => Math.min(ZOOM_MASSIMO, prec + PASSO_ZOOM))
  }

  function diminuisciZoom() {
    setLivelloZoom((prec) => Math.max(ZOOM_MINIMO, prec - PASSO_ZOOM))
  }

  function ripristinaZoom() {
    setLivelloZoom(ZOOM_DEFAULT)
  }

  return (
    <ZoomContext.Provider
      value={{ livelloZoom, aumentaZoom, diminuisciZoom, ripristinaZoom, ZOOM_MINIMO, ZOOM_MASSIMO }}
    >
      {children}
    </ZoomContext.Provider>
  )
}

export function useZoom() {
  const ctx = useContext(ZoomContext)
  if (!ctx) throw new Error('useZoom deve essere usato dentro un ZoomProvider')
  return ctx
}
