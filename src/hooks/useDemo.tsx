import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface DemoContextType {
  isDemo: boolean;
  setIsDemo: (value: boolean) => void;
  demoUser: {
    id: string;
    email: string;
    displayName: string;
    avatarUrl: string | null;
    twitterHandle: string | null;
    bio: string | null;
  };
}

const demoUser = {
  id: 'demo-user-1',
  email: 'demo@rakukora.app',
  displayName: 'デモユーザー',
  avatarUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150&h=150&fit=crop&crop=face',
  twitterHandle: '@demo_vtuber',
  bio: 'ラクコラのデモアカウントです。自由に触ってみてください！',
};

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [isDemo, setIsDemo] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check if we're on a demo route
    const isDemoRoute = location.pathname.startsWith('/demo');
    setIsDemo(isDemoRoute);
  }, [location.pathname]);

  return (
    <DemoContext.Provider value={{ isDemo, setIsDemo, demoUser }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
}
