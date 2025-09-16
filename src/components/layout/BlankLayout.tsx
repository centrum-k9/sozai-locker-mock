import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, UserPlus } from 'lucide-react';

interface BlankLayoutProps {
  children: ReactNode;
  showCTA?: boolean;
}

export function BlankLayout({ children, showCTA = false }: BlankLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header for public pages */}
      {showCTA && (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-glow text-primary-foreground font-bold text-sm">
                SL
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                ラクコラ
              </span>
              <Badge variant="secondary" className="ml-2 text-xs">
                MVP
              </Badge>
            </Link>

            {/* Right side CTA */}
            <div className="flex items-center space-x-2">
              <Button variant="outline" asChild>
                <Link to="/auth?mode=signup">
                  <UserPlus className="h-4 w-4 mr-2" />
                  新規登録
                </Link>
              </Button>
              <Button variant="default" className="hero-gradient hover:opacity-90 transition-opacity" asChild>
                <Link to="/auth">
                  <User className="h-4 w-4 mr-2" />
                  ログイン
                </Link>
              </Button>
            </div>
          </div>
        </header>
      )}
      {children}
    </div>
  );
}