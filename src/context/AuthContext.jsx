
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import api, { TOKEN_KEY } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(
    Boolean(localStorage.getItem(TOKEN_KEY))
  );

  // Restore the session on first load.
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    api
      .get('/auth/me')
      .then((res) => {
        if (!cancelled) {
          setUser(res.data.user);
        }
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);

        if (!cancelled) {
          setUser(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // The axios interceptor fires this when the token is rejected.
  useEffect(() => {
    const onLogout = () => {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
      setLoading(false);
    };

    window.addEventListener('auth:logout', onLogout);

    return () => {
      window.removeEventListener('auth:logout', onLogout);
    };
  }, []);

  const authenticate = useCallback(async (path, payload) => {
    const { data } = await api.post(path, payload);

    if (!data.token || !data.user) {
      throw new Error('Invalid authentication response');
    }

    localStorage.setItem(TOKEN_KEY, data.token);
    setUser(data.user);

    return data.user;
  }, []);

  const login = useCallback(
    (payload) => authenticate('/auth/login', payload),
    [authenticate]
  );

  const register = useCallback(
    (payload) => authenticate('/auth/register', payload),
    [authenticate]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setLoading(false);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      setUser,
      login,
      register,
      logout,
    }),
    [user, loading, login, register, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }

  return ctx;
};
