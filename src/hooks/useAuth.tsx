import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/core/types';
import { userApi } from '@/services/mockClient';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (mock localStorage check)
    const initAuth = async () => {
      try {
        const savedAuth = localStorage.getItem('sozai-locker-auth');
        if (savedAuth) {
          const mockUser = await userApi.get();
          setUser(mockUser);
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock login - always succeeds for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockUser = await userApi.get();
      setUser(mockUser);
      localStorage.setItem('sozai-locker-auth', 'true');
    } catch (error) {
      throw new Error('ログインに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sozai-locker-auth');
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};