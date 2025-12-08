import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ongSVG from '../assets/ong-adapv.svg';
import '../styles/footer.css';

export default function Footer() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (window.confirm('Deseja sair do sistema?')) {
      await logout();
      navigate('/login');
    }
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <img src={ongSVG} className="footer-logo-img" alt="Ong ADAPV SVG" />
          <span className="footer-logo-text">ONG ADAPV</span>
        </div>

        {user && (
          <button
            className="btn-footer-logout"
            onClick={handleLogout}
          >
            Sair
          </button>
        )}
      </div>
    </footer>
  );
}

