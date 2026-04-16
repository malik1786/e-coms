import { createContext, useContext, useState } from 'react';
import { loginAdmin } from '../lib/api';

const AdminAuthContext = createContext(null);
const TOKEN_KEY = 'client2_admin_token';

const readToken = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  return localStorage.getItem(TOKEN_KEY);
};

const storeToken = (token) => {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(TOKEN_KEY, token);
};

const removeToken = () => {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem(TOKEN_KEY);
};

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(readToken);

  const login = async (credentials) => {
    const data = await loginAdmin(credentials);
    storeToken(data.token);
    setToken(data.token);
    return data;
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
        logout
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
