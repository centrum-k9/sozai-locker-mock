import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { DemoSidebar } from '@/components/layout/DemoSidebar';
import { Header } from '@/components/layout/Header';
import { BlankLayout } from '@/components/layout/BlankLayout';
import { GlobalConfetti } from '@/features/collab/components/GlobalConfetti';

// Public Pages
import Landing from '@/pages/Landing';
import PublicProfile from '@/pages/public/PublicProfile';

// Demo Pages
import DemoDashboard from '@/pages/demo/DemoDashboard';

// Authenticated Pages
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import MyProfile from '@/pages/MyProfile';
import Profile from '@/pages/Profile';
import Assets from '@/pages/Assets';
import AssetDetail from '@/pages/AssetDetail';
import Collections from '@/pages/Collections';
import CollectionDetail from '@/pages/CollectionDetail';
import Settings from '@/pages/Settings';
import Share from '@/pages/Share';
import Notifications from '@/pages/Notifications';
import FriendsAssets from '@/pages/FriendsAssets';
import Collabs from '@/pages/Collabs';
import CollabDetail from '@/pages/CollabDetail';
import DiscordIntegration from '@/pages/DiscordIntegration';
import OverlayGenerator from '@/pages/OverlayGenerator';
import OverlayViewer from '@/pages/OverlayViewer';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

// Demo Layout Component
function DemoLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DemoSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="flex items-center px-4 w-full">
              <SidebarTrigger className="mr-4" />
              <div className="flex-1" />
            </div>
          </header>

          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/demo" element={<DemoDashboard />} />
              <Route path="/demo/assets" element={<DemoDashboard />} />
              <Route path="/demo/assets/:id" element={<DemoDashboard />} />
              <Route path="/demo/collections" element={<DemoDashboard />} />
              <Route path="/demo/collabs" element={<DemoDashboard />} />
              <Route path="/demo/collabs/:id" element={<DemoDashboard />} />
              <Route path="/demo/friends" element={<DemoDashboard />} />
              <Route path="/demo/my-profile" element={<DemoDashboard />} />
              <Route path="/demo/notifications" element={<DemoDashboard />} />
              <Route path="/demo/settings" element={<DemoDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

// Layout wrapper component to handle authenticated vs public layouts
function AppLayout() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  // Demo routes
  const isDemoRoute = location.pathname.startsWith('/demo');
  if (isDemoRoute) {
    return <DemoLayout />;
  }
  
  // Public routes that should not have sidebar
  const publicRoutes = ['/lp', '/profile/', '/s/', '/auth'];
  const isPublicRoute = publicRoutes.some(route => {
    if (route === '/lp' || route === '/auth') return location.pathname === route;
    return location.pathname.startsWith(route);
  });

  // Root path handling: show auth for unauthenticated, dashboard for authenticated
  const isRootPath = location.pathname === '/';
  
  // If it's a public route and user is not authenticated, use blank layout
  if ((isPublicRoute || isRootPath) && !isAuthenticated) {
    return (
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/lp" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile/:userId" element={<PublicProfile />} />
        <Route path="/s/:slug" element={<Share />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  }
  
  // Authenticated layout with sidebar
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="flex items-center px-4 w-full">
              <SidebarTrigger className="mr-4" />
              <Header />
            </div>
          </header>

          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/lp" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/my-profile" element={<MyProfile />} />
              <Route path="/profile/:userId" element={<Profile />} />
              <Route path="/assets" element={<Assets />} />
              <Route path="/assets/:id" element={<AssetDetail />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/collections/:id" element={<CollectionDetail />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/friends" element={<FriendsAssets />} />
              <Route path="/collabs" element={<Collabs />} />
              <Route path="/collabs/:id" element={<CollabDetail />} />
              <Route path="/collabs/:id/overlay" element={<OverlayGenerator />} />
              <Route path="/integrations/discord" element={<DiscordIntegration />} />
              <Route path="/overlay/:configId" element={<OverlayViewer />} />
              <Route path="/s/:slug" element={<Share />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <AppLayout />
            <Toaster />
            <Sonner />
            <GlobalConfetti />
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;