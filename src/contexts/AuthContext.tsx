import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AuthContextType, UserProfile } from "@/types/auth";
import { fetchProfile, handleSignIn, handleSignUp, handleSignOut } from "@/services/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("[AuthContext] Initializing auth state...");
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("[AuthContext] Initial session check:", session ? "Session found" : "No session");
      setUser(session?.user ?? null);
      if (session?.user) {
        console.log("[AuthContext] Fetching initial profile for user:", session.user.id);
        fetchProfile(session.user.id).then(setProfile);
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("[AuthContext] Auth state changed:", event, "Session:", session ? "Present" : "None");
      setUser(session?.user ?? null);
      
      if (session?.user) {
        console.log("[AuthContext] Fetching profile after auth change for user:", session.user.id);
        const profile = await fetchProfile(session.user.id);
        setProfile(profile);
        
        // Handle redirect after sign in
        const redirectPath = localStorage.getItem("redirectPath");
        if (redirectPath && event === 'SIGNED_IN') {
          console.log("[AuthContext] Redirecting to:", redirectPath);
          localStorage.removeItem("redirectPath");
          navigate(redirectPath);
        }
      } else {
        console.log("[AuthContext] Clearing profile data");
        setProfile(null);
        // Only navigate on sign out
        if (event === 'SIGNED_OUT') {
          console.log("[AuthContext] Sign out detected, navigating to home");
          navigate("/");
        }
      }
      setIsLoading(false);
    });

    return () => {
      console.log("[AuthContext] Cleaning up auth subscriptions");
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signIn = async (email: string, password: string) => {
    try {
      console.log("[AuthContext] Attempting sign in for email:", email);
      await handleSignIn(email, password);
      const redirectPath = localStorage.getItem("redirectPath") || "/";
      localStorage.removeItem("redirectPath");
      navigate(redirectPath);
    } catch (error: any) {
      console.error("[AuthContext] Sign in error:", error);
      toast.error(error.message || "Failed to sign in");
      throw error;
    }
  };

  const signUp = async (email: string, password: string, metadata: {
    full_name: string;
    school_name: string;
    major: string;
  }) => {
    try {
      console.log("[AuthContext] Attempting sign up for email:", email);
      await handleSignUp(email, password, metadata);
      toast.success("Please check your email to verify your account!");
    } catch (error: any) {
      console.error("[AuthContext] Sign up error:", error);
      toast.error(error.message || "Failed to sign up");
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log("[AuthContext] Starting sign out process...");
      // Force clear all auth state first
      setUser(null);
      setProfile(null);
      localStorage.removeItem("redirectPath");
      
      // Then sign out from Supabase
      await supabase.auth.signOut({ scope: 'local' });
      
      console.log("[AuthContext] Sign out completed successfully");
      toast.success("Successfully signed out!");
      navigate("/");
    } catch (error: any) {
      console.error("[AuthContext] Sign out error:", error);
      toast.error(error.message || "Failed to sign out");
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}