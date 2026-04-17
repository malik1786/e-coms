import { createContext, useContext, useState, useEffect } from 'react';
import { loginAdmin } from '../lib/api';

const AdminAuthContext = createContext(null);
const TOKEN_KEY = 'client2_admin_token';

const readToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
};

const storeToken = (token) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
};

const removeToken = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
};

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(readToken);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setToken(readToken());
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);

      const data = await loginAdmin(credentials);

      if (!data?.token) {
        throw new Error('Invalid login response');
      }

      storeToken(data.token);
      setToken(data.token);

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    removeToken();
    setToken(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        token,
        isAuthenticated: Boolean(token),
        login,
        logout,
        loading,
        error
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error('useAdminAuth must be used inside AdminAuthProvider');
  }

  return context;
};