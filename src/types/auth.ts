import { User } from "@supabase/supabase-js";

export interface UserProfile {
  id: string;
  full_name: string | null;
  school_name: string | null;
}

export interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata: { 
    full_name: string;
    school_name: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
}