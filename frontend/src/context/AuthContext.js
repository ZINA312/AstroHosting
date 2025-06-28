import { createContext, useState, useEffect, useContext } from 'react';
import { userApi } from '../api/userApi';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); 
  const [authError, setAuthError] = useState(null); 
  const navigate = useNavigate();

  const loadUser = async () => {
    setLoading(true);
    setAuthError(null);
    try {
      const currentUserProfile = await userApi.getSelfProfile();
      setUser(currentUserProfile);
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Failed to load user profile from cookies:", err);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();

    const refreshInterval = setInterval(async () => {
      try {
        if (isAuthenticated) { 
          await userApi.refreshTokens();
          console.log("Tokens refreshed automatically.");
        }
      } catch (error) {
        console.error("Auto token refresh failed:", error);
        logout();
      }
    }, 1000 * 60 * 30); 

    return () => clearInterval(refreshInterval);
  }, []);

  const login = async (loginData) => {
    setLoading(true);
    setAuthError(null);
    try {
      const response = await userApi.login(loginData);
      await loadUser(); 
      return response;
    } catch (err) {
      console.error("Login error:", err);
      setAuthError(err.message || "Login failed.");
      setIsAuthenticated(false);
      setUser(null);
      throw err; 
    } finally {
      setLoading(false);
    }
  };

  const register = async (registerData) => {
    setLoading(true);
    setAuthError(null);
    try {
      const response = await userApi.register(registerData);
      return response;
    } catch (err) {
      console.error("Registration error:", err);
      setAuthError(err.message || "Registration failed.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setAuthError(null);
    try {
      setUser(null);
      setIsAuthenticated(false);
      document.cookie.split(";").forEach((c) => {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      navigate('/'); 
    } catch (err) {
      console.error("Logout error:", err);
      setAuthError(err.message || "Logout failed.");
    } finally {
      setLoading(false);
    }
  };

  const authContextValue = {
    user,
    isAuthenticated,
    loading,
    authError,
    login,
    register,
    logout,
    loadUser 
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};