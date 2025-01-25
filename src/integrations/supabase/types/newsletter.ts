export type NewsletterSubscription = {
  Row: {
    created_at: string;
    email: string;
    id: string;
    updated_at: string;
  };
  Insert: {
    created_at?: string;
    email: string;
    id?: string;
    updated_at?: string;
  };
  Update: {
    created_at?: string;
    email?: string;
    id?: string;
    updated_at?: string;
  };
  Relationships: [];
};