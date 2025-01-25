import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserProfile } from "@/types/auth";

export const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    console.log("[AuthService] Fetching profile for user:", userId);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("[AuthService] Error fetching profile:", error);
      return null;
    }

    console.log("[AuthService] Profile fetched successfully:", data);
    return data;
  } catch (error) {
    console.error("[AuthService] Error fetching profile:", error);
    return null;
  }
};

export const handleSignIn = async (email: string, password: string) => {
  console.log("[AuthService] Attempting sign in with Supabase...");
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("[AuthService] Sign in error:", error);
    let errorMessage = "Failed to sign in";
    
    if (error.message.includes("Invalid login credentials")) {
      errorMessage = "Invalid email or password";
    } else if (error.message.includes("Email not confirmed")) {
      errorMessage = "Please verify your email before signing in";
    }
    
    throw new Error(errorMessage);
  }
  
  console.log("[AuthService] Sign in successful");
  toast.success("Successfully signed in!");
};

export const handleSignUp = async (
  email: string,
  password: string,
  metadata: {
    full_name: string;
    school_name: string;
    major: string;
  }
) => {
  console.log("[AuthService] Attempting sign up with Supabase...");
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });

  if (error) {
    console.error("[AuthService] Sign up error:", error);
    let errorMessage = "Failed to sign up";
    
    if (error.message.includes("already registered")) {
      errorMessage = "This email is already registered";
    }
    
    throw new Error(errorMessage);
  }
  
  console.log("[AuthService] Sign up successful");
  toast.success("Successfully signed up! Please check your email for verification.");
};

export const handleSignOut = async () => {
  console.log("[AuthService] Starting Supabase sign out...");
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("[AuthService] Sign out error:", error);
      throw error;
    }
    // Clear any local storage items related to auth
    localStorage.removeItem("redirectPath");
    console.log("[AuthService] Sign out successful, local storage cleaned");
    toast.success("Successfully signed out!");
  } catch (error) {
    console.error("[AuthService] Sign out error:", error);
    throw error;
  }
};