export interface UserProfile {
  id: string;
  full_name: string | null;
  school_name: string | null;
  major: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthContextType {
  user: null;
  profile: null;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signUp: () => Promise<void>;
  signOut: () => Promise<void>;
}