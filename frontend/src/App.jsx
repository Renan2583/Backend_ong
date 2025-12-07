import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AuthProvider from './components/AuthProvider.jsx';
import Navbar from './components/Navbar.jsx';
import Login from "./pages/Login";
import Home from "./pages/Home";
import Caes from "./pages/Caes";

function App() {

  return (
    <>
      <Router>
        <AuthProvider>
          <div className="App">
            {!Home && <Navbar />}

            <Routes>
              <Route path="/login" element={<Login />} />

              <Route path="/" element={
                <Home />
              } />
              <Route path="/Caes" element={
                <Caes />
              } />

            </Routes>
          </div>
        </AuthProvider>
      </Router>
    </>
  )
}

export default App
