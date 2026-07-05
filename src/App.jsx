import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './lib/AuthContext'
import RottaProtetta from './lib/RottaProtetta'
import Benvenuto from './pages/Benvenuto'
import Accedi from './pages/Accedi'
import FeedTemporaneo from './pages/FeedTemporaneo'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Benvenuto />} />
          <Route path="/accedi" element={<Accedi />} />
          <Route
            path="/feed"
            element={
              <RottaProtetta>
                <FeedTemporaneo />
              </RottaProtetta>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
