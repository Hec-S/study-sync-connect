import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  console.log("[ProtectedRoute] Auth state:", { user, isLoading });

  useEffect(() => {
    if (!isLoading && !user) {
      console.log("[ProtectedRoute] No authenticated user, redirecting to home");
      localStorage.setItem("redirectPath", location.pathname);
      toast.error("Please sign in to access this page");
      navigate("/");
    }
  }, [user, isLoading, navigate, location]);

  // Show loading state while checking auth
  if (isLoading) {
    console.log("[ProtectedRoute] Loading auth state...");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // Only render children if user is authenticated
  return user ? children : null;
};