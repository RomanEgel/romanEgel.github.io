import React, { createContext, useContext, ReactNode } from 'react';

interface AuthContextType {
  authorization: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ authorization, children }: { authorization: string, children: ReactNode }) => {
  return (
    <AuthContext.Provider value={{ authorization }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};