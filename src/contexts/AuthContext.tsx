import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean }>;
  signUp: (email: string, password: string, profile: { 
    full_name: string;
    school_name: string;
    major: string;
    graduation_year: number;
  }) => Promise<{ success: boolean }>;
  signOut: () => Promise<{ success: boolean }>;
  error: string | null;
};

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleAuthError = async (error: Error) => {
    console.error('Auth error:', error);
    if (error.message.includes('Invalid Refresh Token') || 
        error.message.includes('Refresh Token Not Found')) {
      // Clear local storage and state
      localStorage.clear();
      setUser(null);
      setError('Session expired. Please sign in again.');
      // Force reload to clear any cached state
      window.location.href = '/';
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check active sessions and sets the user
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }

        setUser(session?.user ?? null);
        
        // Listen for changes on auth state (signed in, signed out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('Auth state changed:', event);
          if (event === 'TOKEN_REFRESHED') {
            console.log('Token refreshed successfully');
          }
          if (event === 'SIGNED_OUT') {
            localStorage.clear();
          }
          setUser(session?.user ?? null);
          setLoading(false);
        });

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        if (error instanceof Error) {
          handleAuthError(error);
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signUp = async (email: string, password: string, profile: {
    full_name: string;
    school_name: string;
    major: string;
    graduation_year: number;
  }) => {
    setError(null);
    setLoading(true);
    
    // Validate required fields
    if (!profile.full_name || !profile.school_name || !profile.major || !profile.graduation_year) {
      throw new Error("All profile fields are required");
    }

    try {
      console.log("Starting sign up process...");
      
      // Begin transaction
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: profile.full_name, // Store in auth metadata as backup
            school_name: profile.school_name,
            major: profile.major,
            graduation_year: profile.graduation_year
          }
        }
      });
      
      if (signUpError) {
        console.error("Sign up error:", signUpError);
        throw new Error(`Authentication failed: ${signUpError.message}`);
      }
      
      if (!signUpData.user) {
        throw new Error("No user data returned from sign up");
      }

      console.log("User created successfully:", signUpData.user.id);
      
      // Create profile with all fields
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: signUpData.user.id,
          full_name: profile.full_name,
          school_name: profile.school_name,
          major: profile.major,
          graduation_year: profile.graduation_year
        }, {
          onConflict: 'id'
        });
      
      if (profileError) {
        console.error("Profile creation error:", profileError);
        // Attempt to clean up auth user if profile creation fails
        await supabase.auth.admin.deleteUser(signUpData.user.id);
        throw new Error(`Profile creation failed: ${profileError.message}`);
      }

      console.log("Profile created successfully");
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to sign up";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      // Clear any existing session data
      localStorage.clear();
      // Attempt sign in
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        console.error("Sign in error details:", JSON.stringify(signInError, null, 2));
        throw new Error(signInError.message);
      }

      // Verify session was created
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error("Session error details:", JSON.stringify(sessionError, null, 2));
        handleAuthError(sessionError);
        throw new Error(sessionError.message);
      }
      if (!session) {
        console.error("No session established after sign in");
        throw new Error("Failed to establish session");
      }
      console.log("Session established:", session);

      // Get or create profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select()
        .eq('id', session.user.id)
        .single();
      
      if (profileError) {
        console.error("Profile error details:", JSON.stringify(profileError, null, 2));
        if (profileError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
          throw new Error(profileError.message);
        }
      }

      if (!profile) {
        // Create profile if it doesn't exist
        const { error: createError } = await supabase
          .from('profiles')
          .insert([{ id: session.user.id }]);
        if (createError) {
        console.error("Profile creation error details:", JSON.stringify(createError, null, 2));
        throw new Error(createError.message);
      }
      }

      setUser(session.user);
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to sign in";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setError(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear user state
      setUser(null);
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to sign out";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, error }}>
      {children}
    </AuthContext.Provider>
  );
};
