import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationsProvider } from "@/contexts/NotificationsContext";
import Index from "./pages/Index";
import { PortfolioPage } from "@/components/portfolio/PortfolioPage";
import { ProjectDetails } from "@/components/ProjectDetails";
import { MarketplacePage } from "@/components/marketplace/MarketplacePage";
import { ProfilePage } from "@/components/profile/ProfilePage";
import { ConnectionsPage } from "@/components/connections/ConnectionsPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationsProvider>
          <BrowserRouter>
          <TooltipProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/portfolio" element={<ProtectedRoute><PortfolioPage /></ProtectedRoute>} />
              <Route path="/project/:projectId" element={<ProjectDetails />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/:userId" element={<ProfilePage />} />
              <Route path="/connections" element={<ConnectionsPage />} />
              <Route path="/profile/:userId/connections" element={<ConnectionsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </BrowserRouter>
        </NotificationsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
