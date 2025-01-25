import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserProfile } from "@/types/auth";

export const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
};

export const handleSignIn = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  toast.success("Successfully signed in!");
};

export const handleSignUp = async (
  email: string,
  password: string,
  metadata: {
    full_name: string;
    school_name: string;
  }
) => {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });

  if (error) throw error;
  toast.success("Successfully signed up! Please check your email for verification.");
};

export const handleSignOut = async () => {
  console.log("Signing out...");
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Sign out error:", error);
    throw error;
  }
  // Clear any local storage items related to auth
  localStorage.removeItem("redirectPath");
  console.log("Sign out successful");
  toast.success("Successfully signed out!");
};