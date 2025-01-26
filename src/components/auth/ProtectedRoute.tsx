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

  console.log("[ProtectedRoute] Current auth state:", { user, isLoading });

  useEffect(() => {
    if (!isLoading && !user) {
      console.log("[ProtectedRoute] No authenticated user found, redirecting to home");
      localStorage.setItem("redirectPath", location.pathname);
      toast.error("Please sign in to access this page");
      navigate("/");
    } else if (!isLoading && user) {
      console.log("[ProtectedRoute] User authenticated, allowing access");
      const savedPath = localStorage.getItem("redirectPath");
      if (savedPath) {
        console.log("[ProtectedRoute] Found saved path:", savedPath);
        localStorage.removeItem("redirectPath");
        if (savedPath !== location.pathname) {
          console.log("[ProtectedRoute] Navigating to saved path");
          navigate(savedPath);
        }
      }
    }
  }, [user, isLoading, navigate, location]);

  if (isLoading) {
    console.log("[ProtectedRoute] Still loading auth state...");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  console.log("[ProtectedRoute] Rendering protected content:", !!user);
  return user ? children : null;
};