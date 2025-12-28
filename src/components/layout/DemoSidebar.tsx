import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Home,
  FileImage,
  FolderOpen,
  Users,
  Calendar,
  User,
  Settings,
  Bell,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

const menuItems = [
  {
    title: 'ダッシュボード',
    url: '/demo',
    icon: Home,
  },
  {
    title: '素材',
    url: '/demo/assets',
    icon: FileImage,
  },
  {
    title: 'コレクション',
    url: '/demo/collections',
    icon: FolderOpen,
  },
  {
    title: 'コラボ',
    url: '/demo/collabs',
    icon: Calendar,
  },
  {
    title: 'フレンド',
    url: '/demo/friends',
    icon: Users,
  },
];

const settingsItems = [
  {
    title: 'プロフィール',
    url: '/demo/my-profile',
    icon: User,
  },
  {
    title: '通知',
    url: '/demo/notifications',
    icon: Bell,
  },
  {
    title: '設定',
    url: '/demo/settings',
    icon: Settings,
  },
];

export function DemoSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border/40 p-4">
        <Link to="/lp" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-glow text-primary-foreground font-bold text-sm">
            SL
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            ラクコラ
          </span>
        </Link>
        <Badge variant="secondary" className="mt-2 bg-accent text-accent-foreground w-fit">
          <Sparkles className="w-3 h-3 mr-1" />
          デモモード
        </Badge>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>メニュー</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                  >
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>設定</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                  >
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40 p-4">
        <Link to="/auth">
          <Button className="w-full hero-gradient hover:opacity-90">
            アカウント作成
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
        <p className="text-xs text-muted-foreground text-center mt-2">
          無料で始められます
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
