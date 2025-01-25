import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { fetchProfile } from "@/services/auth";

interface AuthContextType {
  user: User | null;
  profile: any | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleAuthStateChange = async (event: string, session: Session | null) => {
    console.log("[AuthContext] Auth state changed:", event, "Session:", session ? "Present" : "None");
    
    if (event === "SIGNED_IN" && session?.user) {
      setUser(session.user);
      try {
        console.log("[AuthContext] Fetching profile after auth change for user:", session.user.id);
        const userProfile = await fetchProfile(session.user.id);
        setProfile(userProfile);
      } catch (error) {
        console.error("[AuthContext] Error fetching profile:", error);
      }
    } else if (event === "SIGNED_OUT") {
      setUser(null);
      setProfile(null);
    }
  };

  useEffect(() => {
    console.log("[AuthContext] Initializing auth state...");
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id)
          .then(userProfile => setProfile(userProfile))
          .catch(error => console.error("[AuthContext] Error fetching initial profile:", error));
      }
      setLoading(false);
    });

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    return () => {
      console.log("[AuthContext] Cleaning up auth subscriptions");
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      console.log("[AuthContext] Starting sign out process...");
      
      // Sign out from Supabase first
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Then clear local state
      setUser(null);
      setProfile(null);
      localStorage.removeItem("redirectPath");
      
      console.log("[AuthContext] Sign out completed successfully");
      toast.success("Successfully signed out!");
      navigate("/");
    } catch (error: any) {
      console.error("[AuthContext] Sign out error:", error);
      toast.error(error.message || "Failed to sign out");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};