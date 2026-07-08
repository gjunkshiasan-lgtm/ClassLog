import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './lib/AuthContext'
import { ZoomProvider } from './lib/ZoomContext'
import RottaProtetta from './lib/RottaProtetta'
import Benvenuto from './pages/Benvenuto'
import Accedi from './pages/Accedi'
import Feed from './pages/Feed'
import CreaPost from './pages/CreaPost'
import Admin from './pages/Admin'
import Profilo from './pages/Profilo'
import Impostazioni from './pages/Impostazioni'
import RegolePlaceholder from './pages/RegolePlaceholder'
import Bannato from './pages/Bannato'

function App() {
  return (
    <AuthProvider>
      <ZoomProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Benvenuto />} />
            <Route path="/accedi" element={<Accedi />} />
            <Route path="/regole" element={<RegolePlaceholder />} />
            <Route path="/bannato" element={<Bannato />} />

            <Route
              path="/feed"
              element={
                <RottaProtetta>
                  <Feed />
                </RottaProtetta>
              }
            />
            <Route
              path="/crea"
              element={
                <RottaProtetta>
                  <CreaPost />
                </RottaProtetta>
              }
            />
            <Route
              path="/admin"
              element={
                <RottaProtetta>
                  <Admin />
                </RottaProtetta>
              }
            />
            <Route
              path="/profilo"
              element={
                <RottaProtetta>
                  <Profilo />
                </RottaProtetta>
              }
            />
            <Route
              path="/impostazioni"
              element={
                <RottaProtetta>
                  <Impostazioni />
                </RottaProtetta>
              }
            />
          </Routes>
        </BrowserRouter>
      </ZoomProvider>
    </AuthProvider>
  )
}

export default App
