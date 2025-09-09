import { NavLink, useLocation } from 'react-router-dom';
import { 
  User, 
  FileImage, 
  Users, 
  Settings,
  Home,
  Bell,
  Heart
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import { downloadNotificationApi } from '@/services/mockClient';

const mainItems = [
  { title: 'ダッシュボード', url: '/dashboard', icon: Home },
  { title: 'マイページ', url: '/my-profile', icon: User },
  { title: '自分の素材', url: '/assets', icon: FileImage },
  { title: '友達の素材', url: '/friends', icon: Users },
  { title: '設定', url: '/settings', icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user } = useAuth();
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const currentPath = location.pathname;

  useEffect(() => {
    const loadNotifications = async () => {
      if (!user) return;
      try {
        const notifications = await downloadNotificationApi.getByUser(user.id);
        setUnreadNotifications(notifications.filter(n => !n.read).length);
      } catch (error) {
        console.error('Failed to load notifications:', error);
      }
    };

    loadNotifications();
  }, [user]);

  const isActive = (path: string) => {
    if (path === '/dashboard') return currentPath === '/dashboard' || currentPath === '/';
    return currentPath === path;
  };

  const getNavCls = (isActiveRoute: boolean) =>
    isActiveRoute 
      ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" 
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground";

  return (
    <Sidebar
      className={state === "collapsed" ? "w-14" : "w-64"}
      collapsible="icon"
    >
      <SidebarContent className="bg-sidebar">
        {/* User Profile Section */}
        {state !== "collapsed" && user && (
          <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-primary-foreground font-semibold">
                {user.displayName?.[0] || user.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {user.displayName || user.name}
                </p>
                <p className="text-xs text-sidebar-foreground/60 truncate">
                  @{user.name}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60">
            通知
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/notifications" 
                    className={({ isActive }) => getNavCls(isActive)}
                  >
                    <Bell className="mr-2 h-4 w-4" />
                    {state !== "collapsed" && (
                      <div className="flex items-center justify-between w-full">
                        <span>ダウンロード通知</span>
                        {unreadNotifications > 0 && (
                          <Badge variant="destructive" className="ml-2 h-5 text-xs">
                            {unreadNotifications > 99 ? '99+' : unreadNotifications}
                          </Badge>
                        )}
                      </div>
                    )}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60">
            メニュー
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === '/dashboard'}
                      className={({ isActive }) => getNavCls(isActive || (item.url === '/dashboard' && currentPath === '/'))}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {state !== "collapsed" && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Actions */}
        {state !== "collapsed" && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-sidebar-foreground/60">
              クイックアクション
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to="/assets?filter=favorites" 
                      className={({ isActive }) => getNavCls(isActive)}
                    >
                      <Heart className="mr-2 h-4 w-4" />
                      <span>お気に入り</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}