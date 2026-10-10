import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { clearToken, getStoredToken, setUnauthorizedHandler, storeToken } from '../services/api.js';
import { fetchMe, loginUser, registerUser } from '../services/authService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(getStoredToken()));

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(logout);
  }, [logout]);

  // Restore the session on first load
  useEffect(() => {
    if (!getStoredToken()) return;
    fetchMe()
      .then((data) => setUser(data.user))
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async ({ email, password, remember }) => {
    const data = await loginUser({ email, password });
    storeToken(data.token, remember);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async ({ name, email, password }) => {
    const data = await registerUser({ name, email, password });
    storeToken(data.token, true);
    setUser(data.user);
    return data.user;
  }, []);

  const value = useMemo(
    () => ({ user, setUser, loading, isAdmin: user?.role === 'ADMIN', login, register, logout }),
    [user, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
