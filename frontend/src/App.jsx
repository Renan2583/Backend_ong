import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider from './components/AuthProvider.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Navbar from './components/Navbar.jsx';
import Login from "./pages/Login";
import Home from "./pages/Home";
import Caes from "./pages/Caes";
import Gatos from "./pages/Gatos";
import Animais from "./pages/Animais";
import Pessoas from "./pages/Pessoas";
import Especies from "./pages/Especies";
import Racas from "./pages/Racas";
import Veterinarios from "./pages/Veterinarios";
import Recursos from "./pages/Recursos";
import Doacoes from "./pages/Doacoes";
import Atendimentos from "./pages/Atendimentos";
import Adocoes from "./pages/Adocoes";

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <div className="App">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Navigate to="/login" replace />} />
              
              {/* Rotas protegidas */}
              <Route path="/home" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              <Route path="/Caes" element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <Caes />
                  </>
                </ProtectedRoute>
              } />
              <Route path="/Gatos" element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <Gatos />
                  </>
                </ProtectedRoute>
              } />
              <Route path="/animais" element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <Animais />
                  </>
                </ProtectedRoute>
              } />
              <Route path="/pessoas" element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <Pessoas />
                  </>
                </ProtectedRoute>
              } />
              <Route path="/especies" element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <Especies />
                  </>
                </ProtectedRoute>
              } />
              <Route path="/racas" element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <Racas />
                  </>
                </ProtectedRoute>
              } />
              <Route path="/veterinarios" element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <Veterinarios />
                  </>
                </ProtectedRoute>
              } />
              <Route path="/recursos" element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <Recursos />
                  </>
                </ProtectedRoute>
              } />
              <Route path="/doacoes" element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <Doacoes />
                  </>
                </ProtectedRoute>
              } />
              <Route path="/atendimentos" element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <Atendimentos />
                  </>
                </ProtectedRoute>
              } />
              <Route path="/adocoes" element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <Adocoes />
                  </>
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </AuthProvider>
      </Router>
    </>
  )
}

export default App
