// context/AuthContext.tsx
'use client';

import { createContext, useState, useContext, ReactNode } from 'react';

interface AuthContextType {
  userType: 'admin' | 'user' | null;
  setUserType: (userType: 'admin' | 'user' | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  userType: null,
  setUserType: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userType, setUserType] = useState<'admin' | 'user' | null>(null);
  return (
    <AuthContext.Provider value={{ userType, setUserType }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
