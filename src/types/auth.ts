import { User } from "@supabase/supabase-js";

export interface UserProfile {
  id: string;
  full_name: string | null;
  school_name: string | null;
  major: string | null;
  graduation_year: number | null;
  created_at: string;
  updated_at: string;
}

export interface SignUpFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  university: string;
  fieldOfStudy: string;
  graduationYear: number;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ success: boolean }>;
  signUp: (
    email: string,
    password: string,
    profile: {
      full_name: string;
      school_name: string;
      major: string;
      graduation_year: number;
    }
  ) => Promise<{ success: boolean }>;
  signOut: () => Promise<{ success: boolean }>;
}
