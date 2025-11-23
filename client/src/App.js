import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Onboarding from './pages/Onboarding'
import ForgotPassword from './pages/ForgotPassword'
import { useCookies } from 'react-cookie'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

const App = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['user'])
  const authToken = cookies.AuthToken

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/dashboard"
          element={authToken ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/onboarding"
          element={authToken ? <Onboarding /> : <Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
