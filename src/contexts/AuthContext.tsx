import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { fetchProfile } from "@/services/auth";
import { AuthContextType, UserProfile } from "@/types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
      navigate("/");
    }
  };

  useEffect(() => {
    console.log("[AuthContext] Initializing auth state...");
    
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          const userProfile = await fetchProfile(session.user.id);
          setProfile(userProfile);
        }
      } catch (error) {
        console.error("[AuthContext] Error initializing auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    return () => {
      console.log("[AuthContext] Cleaning up auth subscriptions");
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      toast.success("Successfully signed in!");
    } catch (error: any) {
      console.error("[AuthContext] Sign in error:", error);
      throw error;
    }
  };

  const signUp = async (
    email: string,
    password: string,
    metadata: {
      full_name: string;
      school_name: string;
      major: string;
    }
  ) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });
      if (error) throw error;
      toast.success("Successfully signed up! Please check your email for verification.");
    } catch (error: any) {
      console.error("[AuthContext] Sign up error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log("[AuthContext] Starting sign out process...");
      setIsLoading(true);
      
      // Force clear local state first
      setUser(null);
      setProfile(null);
      localStorage.removeItem("redirectPath");
      
      // Then sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      console.log("[AuthContext] Sign out completed successfully");
      toast.success("Successfully signed out!");
      navigate("/");
    } catch (error: any) {
      console.error("[AuthContext] Sign out error:", error);
      toast.error(error.message || "Failed to sign out");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        signIn,
        signUp,
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