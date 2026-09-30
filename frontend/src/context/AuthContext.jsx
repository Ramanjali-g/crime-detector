import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authApi, clearToken, getToken, setToken, usersApi } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(getToken()));

  // Restore the session from a saved token.
  useEffect(() => {
    if (!getToken()) {
      setLoading(false);
      return;
    }
    usersApi
      .me()
      .then((res) => setUser(res.data))
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  // The API layer fires this when any protected call returns 401.
  useEffect(() => {
    const onUnauthorized = () => setUser(null);
    window.addEventListener('cd:unauthorized', onUnauthorized);
    return () => window.removeEventListener('cd:unauthorized', onUnauthorized);
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await authApi.login({ email, password });
    setToken(data.token);
    setUser(data.user);
  }, []);

  const register = useCallback(async (name, email, password) => {
    const { data } = await authApi.register({ name, email, password });
    setToken(data.token);
    setUser(data.user);
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout, setUser }),
    [user, loading, login, register, logout]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
