import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Settings, 
  LogOut, 
  Upload, 
  Menu,
  Home,
  FileImage,
  FolderOpen,
  Share2,
  Users
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAnalytics } from '@/hooks/useAnalytics';
import { cn } from '@/lib/utils';

export const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { trackClick } = useAnalytics();
  const location = useLocation();

  const handleLogout = () => {
    trackClick('logout', 'header');
    logout();
  };

  const navigation = [
    { name: 'ダッシュボード', href: '/dashboard', icon: Home },
    { name: '素材', href: '/assets', icon: FileImage },
    { name: 'コレクション', href: '/collections', icon: FolderOpen },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          onClick={() => trackClick('logo', 'header')}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-glow text-primary-foreground font-bold text-sm">
            SL
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            SozaiLocker
          </span>
          <Badge variant="secondary" className="ml-2 text-xs">
            MVP
          </Badge>
        </Link>

        {/* Navigation */}
        {isAuthenticated && (
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.href);
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                  onClick={() => trackClick(`nav-${item.name}`, 'header')}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        )}

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {isAuthenticated ? (
            <>
              {/* New Action Buttons */}
              <Link to="/dashboard?upload=true">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => trackClick('upload-header', 'header')}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  素材をアップロード
                </Button>
              </Link>

              <Button 
                variant="outline"
                size="sm"
                onClick={() => {
                  // Generate profile share link
                  const shareUrl = `${window.location.origin}/profile/${user?.id}`;
                  navigator.clipboard.writeText(shareUrl);
                  trackClick('share-profile-header', 'header');
                }}
              >
                <Share2 className="h-4 w-4 mr-2" />
                素材を共有
              </Button>

              <Link to="/friends">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => trackClick('friends-header', 'header')}
                >
                  <Users className="h-4 w-4 mr-2" />
                  友だちの素材をDL
                </Button>
              </Link>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
                        {user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link 
                      to="/settings" 
                      className="flex items-center"
                      onClick={() => trackClick('settings', 'user-menu')}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      設定
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    ログアウト
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link to="/auth">
              <Button 
                variant="default"
                className="hero-gradient hover:opacity-90 transition-opacity"
                onClick={() => trackClick('login', 'header')}
              >
                <User className="h-4 w-4 mr-2" />
                ログイン
              </Button>
            </Link>
          )}

          {/* Mobile Menu */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {isAuthenticated && navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link 
                        to={item.href}
                        className="flex items-center"
                        onClick={() => trackClick(`mobile-nav-${item.name}`, 'mobile-menu')}
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        {item.name}
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};