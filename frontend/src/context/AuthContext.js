// Mock function for testing UI

import { createContext, useState, useContext } from 'react';

const AuthMockContext = createContext();

export function AuthMockProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const toggleAuth = () => setIsAuthenticated(prev => !prev);
  
  return (
    <AuthMockContext.Provider value={{ isAuthenticated, toggleAuth }}>
      {children}
    </AuthMockContext.Provider>
  );
}

export function useAuthMock() {
  return useContext(AuthMockContext);
}