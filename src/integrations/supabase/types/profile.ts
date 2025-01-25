export type Profile = {
  Row: {
    created_at: string;
    full_name: string | null;
    id: string;
    major: string | null;
    school_name: string | null;
    updated_at: string;
  };
  Insert: {
    created_at?: string;
    full_name?: string | null;
    id: string;
    major?: string | null;
    school_name?: string | null;
    updated_at?: string;
  };
  Update: {
    created_at?: string;
    full_name?: string | null;
    id?: string;
    major?: string | null;
    school_name?: string | null;
    updated_at?: string;
  };
  Relationships: [
    {
      foreignKeyName: "profiles_id_fkey";
      columns: ["id"];
      referencedRelation: "users";
      referencedColumns: ["id"];
    }
  ];
};