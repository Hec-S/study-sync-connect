
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationsProvider } from "@/contexts/NotificationsContext";
import { useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import ProfessorRatingLanding from "@/pages/ProfessorRatingLanding";
import WorkHubLanding from "@/pages/WorkHubLanding";
import UtepAssistantLanding from "@/pages/UtepAssistantLanding";
import PortfolioLanding from "@/pages/PortfolioLanding";
import { PortfolioFeedPage } from "@/pages/PortfolioFeedPage";
import { PortfolioPage } from "@/components/portfolio/PortfolioPage";
import { ProjectDetails } from "@/components/ProjectDetails";
import { MarketplacePage } from "@/components/marketplace/MarketplacePage";
import { ProfilePage } from "@/components/profile/ProfilePage";
import { ConnectionsPage } from "@/components/connections/ConnectionsPage";
import { ProfessorRatingPage } from "@/components/professor/ProfessorRatingPage";
import { ProfessorProfilePage } from "@/components/professor/ProfessorProfilePage";
import { UtepAssistantPage } from "@/components/utep-assistant/UtepAssistantPage";
import { useEffect } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AppContent = () => {
  const { user } = useAuth();
  
  useEffect(() => {
    if (user) {
      // Get school from user metadata
      const userSchool = user?.user_metadata?.school_name || 'default';
      // Apply theme to document
      document.documentElement.setAttribute('data-theme', userSchool);
    } else {
      // Reset theme when user is not signed in
      document.documentElement.removeAttribute('data-theme');
    }

    return () => {
      // Reset theme when component unmounts
      document.documentElement.removeAttribute('data-theme');
    };
  }, [user]);

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/portfolio" element={<ProtectedRoute><PortfolioPage /></ProtectedRoute>} />
      <Route path="/project/:projectId" element={<ProjectDetails />} />
      <Route path="/marketplace" element={<MarketplacePage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/profile/:userId" element={<ProfilePage />} />
      <Route path="/connections" element={<ConnectionsPage />} />
      <Route path="/profile/:userId/connections" element={<ConnectionsPage />} />
      <Route path="/professor-rating-landing" element={<ProfessorRatingLanding />} />
      <Route path="/work-hub-landing" element={<WorkHubLanding />} />
      <Route path="/utep-assistant-landing" element={<UtepAssistantLanding />} />
      <Route path="/portfolio-landing" element={<PortfolioLanding />} />
      <Route path="/portfolio-feed" element={<ProtectedRoute><PortfolioFeedPage /></ProtectedRoute>} />
      <Route path="/professor-rating" element={<ProfessorRatingPage />} />
      <Route path="/professor/:id" element={<ProfessorProfilePage />} />
      <Route path="/utep-assistant" element={<ProtectedRoute><UtepAssistantPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationsProvider>
          <BrowserRouter>
            <TooltipProvider>
              <AppContent />
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
