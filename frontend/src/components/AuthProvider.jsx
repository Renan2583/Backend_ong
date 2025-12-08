import { useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext.js';
import apiService from '../services/api.js';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userData = await apiService.checkAuth();
      setUser(userData);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (cpf, senha) => {
    try {
      await apiService.login(cpf, senha);
      await checkAuth();
      return true;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
      setUser(null);
    } catch (error) {
      console.error('Erro no logout:', error);
      setUser(null); // Garante que o usuário é deslogado mesmo se houver erro
    }
  };

  console.log('user', user)
  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;