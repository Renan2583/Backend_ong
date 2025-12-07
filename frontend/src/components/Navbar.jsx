import { Link } from "react-router-dom";
import { useAuth } from '../hooks/useAuth.js';
import ongSVG from '../assets/ong-adapv.svg'
import "../styles/global.css"

export default function Navbar() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    if (window.confirm('Deseja sair do sistema?')) {
      await logout();
    }
  };

  return (
    <nav className="navbar navbar-bg">
      <Link className="navbar-brand" to="/">
        <img src={ongSVG} className="d-inline-block p-2 align-center" alt="Ong ADAPV SVG" />
        <strong>ONG ADAPV</strong>
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/Animais">
              Animais
            </Link>
          </li>
          {user && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/Inscricoes">
                  Vagas
                </Link>
              </li>
              <div className="navbar-nav">
                <span className="navbar-text me-3">
                  Olá, {user.email} ({user.role})
                </span>
                <button
                  className="btn btn-outline-light btn-sm"
                  onClick={handleLogout}
                >
                  Sair
                </button>
              </div>
            </>
          )}

        </ul>

      </div>
    </nav >
  );
}
