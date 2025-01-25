import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("[ProtectedRoute] Current auth state:", { user, isLoading });
    
    if (!isLoading && !user) {
      console.log("[ProtectedRoute] No authenticated user found, redirecting to home");
      // Save the attempted path
      localStorage.setItem("redirectPath", location.pathname);
      toast.error("Please sign in to access this page");
      navigate("/");
    }
  }, [user, isLoading, navigate, location]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return user ? <>{children}</> : null;
};