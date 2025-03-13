export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type ProfessorRating = {
  id: string;
  professor_name: string;
  major: string;
  school: string;
  difficulty: number;
  num_ratings: number;
  average_rating: number;
  created_at: string;
  updated_at: string;
};

export type ProfessorReview = {
  id: string;
  professor_id: string;
  user_id: string;
  course: string;
  rating: number;
  review: string;
  created_at: string;
  updated_at: string;
};

export type Connection = {
  id: string;
  requester_id: string;
  receiver_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
};

export type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read_status: boolean;
  created_at: string;
};

export type Project = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  thumbnail_url?: string;
  likes?: number;
  comments?: number;
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      portfolio_likes: {
        Row: {
          id: string
          portfolio_item_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          portfolio_item_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          portfolio_item_id?: string
          user_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_likes_portfolio_item_id_fkey"
            columns: ["portfolio_item_id"]
            referencedRelation: "portfolio_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "portfolio_likes_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      portfolio_comments: {
        Row: {
          id: string
          portfolio_item_id: string
          user_id: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          portfolio_item_id: string
          user_id: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          portfolio_item_id?: string
          user_id?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_comments_portfolio_item_id_fkey"
            columns: ["portfolio_item_id"]
            referencedRelation: "portfolio_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "portfolio_comments_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      connections: {
        Row: {
          created_at: string
          id: string
          receiver_id: string
          requester_id: string
          status: Database["public"]["Enums"]["connection_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          receiver_id: string
          requester_id: string
          status?: Database["public"]["Enums"]["connection_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          receiver_id?: string
          requester_id?: string
          status?: Database["public"]["Enums"]["connection_status"]
          updated_at?: string
        }
        Relationships: []
      }
      marketplace_projects: {
        Row: {
          assigned_to: string | null
          budget_range: string
          category: string
          created_at: string | null
          deadline: string
          description: string
          id: string
          owner_id: string
          required_skills: string[] | null
          school_name: string | null
          status: Database["public"]["Enums"]["project_status"] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          budget_range: string
          category: string
          created_at?: string | null
          deadline: string
          description: string
          id?: string
          owner_id: string
          required_skills?: string[] | null
          school_name?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          budget_range?: string
          category?: string
          created_at?: string | null
          deadline?: string
          description?: string
          id?: string
          owner_id?: string
          required_skills?: string[] | null
          school_name?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          read_status: boolean | null
          receiver_id: string
          sender_id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          read_status?: boolean | null
          receiver_id: string
          sender_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          read_status?: boolean | null
          receiver_id?: string
          sender_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      newsletter_subscriptions: {
        Row: {
          created_at: string
          email: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      portfolio_items: {
        Row: {
          category: string
          completion_date: string | null
          created_at: string
          description: string
          id: string
          image_url: string | null
          owner_id: string
          project_url: string | null
          skills: string[]
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          completion_date?: string | null
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          owner_id: string
          project_url?: string | null
          skills?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          completion_date?: string | null
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          owner_id?: string
          project_url?: string | null
          skills?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          Description: string | null
          full_name: string | null
          graduation_year: number | null
          id: string
          major: string | null
          school_name: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          Description?: string | null
          full_name?: string | null
          graduation_year?: number | null
          id: string
          major?: string | null
          school_name?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          Description?: string | null
          full_name?: string | null
          graduation_year?: number | null
          id?: string
          major?: string | null
          school_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      professor_ratings: {
        Row: {
          id: string
          professor_name: string
          major: string
          school: string
          difficulty: number
          num_ratings: number
          average_rating: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          professor_name: string
          major: string
          school: string
          difficulty: number
          num_ratings?: number
          average_rating?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          professor_name?: string
          major?: string
          school?: string
          difficulty?: number
          num_ratings?: number
          average_rating?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      professor_reviews: {
        Row: {
          id: string
          professor_id: string
          user_id: string
          course: string
          rating: number
          review: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          professor_id: string
          user_id: string
          course: string
          rating: number
          review: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          professor_id?: string
          user_id?: string
          course?: string
          rating?: number
          review?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "professor_reviews_professor_id_fkey"
            columns: ["professor_id"]
            referencedRelation: "professor_ratings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "professor_reviews_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      are_users_connected: {
        Args: {
          user1_id: string
          user2_id: string
        }
        Returns: boolean
      }
      get_connection_count: {
        Args: {
          user_id: string
        }
        Returns: number
      }
      get_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          user_id: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      mark_messages_as_read: {
        Args: {
          sender_id_param: string
          receiver_id_param: string
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user"
      connection_status: "pending" | "accepted" | "rejected"
      message_status: "read" | "unread"
      project_status: "open" | "in_progress" | "completed" | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
