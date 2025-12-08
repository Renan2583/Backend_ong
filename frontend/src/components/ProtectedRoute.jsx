import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { canAccessRoute } from '../utils/permissions';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontSize: '1.2rem'
    }}>Carregando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Verifica se o usuário tem permissão para acessar a rota
  if (!canAccessRoute(user, location.pathname)) {
    return <Navigate to="/home" replace />;
  }

  // Se a rota requer admin e o usuário não é admin
  if (requireAdmin && user?.tipo !== 'Admin') {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default ProtectedRoute;
