import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  fetchCurrentAdmin,
  loginAdmin,
  logoutAdmin,
} from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkSession = useCallback(async () => {
    setIsLoading(true);
    try {
      const currentAdmin = await fetchCurrentAdmin();
      setAdmin(currentAdmin);
    } catch {
      setAdmin(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    const handleExpired = () => {
      setAdmin(null);
    };
    window.addEventListener('auth:expired', handleExpired);
    return () => window.removeEventListener('auth:expired', handleExpired);
  }, []);

  const login = useCallback(async (credentials) => {
    const authenticatedAdmin = await loginAdmin(credentials);
    setAdmin(authenticatedAdmin);
    return authenticatedAdmin;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutAdmin();
    } finally {
      setAdmin(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        admin,
        isAuthenticated: Boolean(admin),
        isLoading,
        login,
        logout,
        checkSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return ctx;
};
