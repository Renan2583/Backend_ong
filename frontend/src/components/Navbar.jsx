import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../hooks/useAuth.js';
import { getMenuItems } from '../utils/permissions.js';
import ongSVG from '../assets/ong-adapv.svg';
import "../styles/global.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    if (window.confirm('Deseja sair do sistema?')) {
      await logout();
      navigate('/login');
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Obtém os itens do menu baseado nas permissões do usuário
  const menuItems = getMenuItems(user);

  return (
    <nav className="navbar navbar-bg">
      <div className="navbar-container">
        <Link className="navbar-brand" to="/">
          <img src={ongSVG} className="navbar-logo" alt="Ong ADAPV SVG" />
          <strong>ONG ADAPV</strong>
        </Link>

        
        <button
          className="navbar-toggle"
          type="button"
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

        {/* Menu */}
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul className="navbar-nav">
            {menuItems.map((item) => (
              <li key={item.path} className="nav-item">
                <Link 
                  className="nav-link" 
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {item.label.replace(item.icon + ' ', '')}
                </Link>
              </li>
            ))}
          </ul>

         
          {user && (
            <div className="navbar-user">
              <span className="user-info">
                Olá, <strong>{user.nome || user.email}</strong>
                <span className="user-type">({user.tipo || 'Usuário'})</span>
              </span>
              <button
                className="btn-logout"
                onClick={handleLogout}
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
