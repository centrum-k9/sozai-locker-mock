import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AuthProvider } from '@/hooks/useAuth';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Header } from '@/components/layout/Header';

// Pages
import Landing from '@/pages/Landing';
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
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
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
                      <Route path="/" element={<Landing />} />
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
                      <Route path="/s/:slug" element={<Share />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                </div>
              </div>
            </SidebarProvider>

            <Toaster />
            <Sonner />
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;