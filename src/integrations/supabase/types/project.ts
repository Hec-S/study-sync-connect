export type Project = {
  Row: {
    category: string;
    created_at: string;
    deadline: string;
    description: string;
    id: string;
    owner_id: string;
    skills: string[];
    title: string;
    updated_at: string;
    profiles?: {
      full_name: string | null;
      school_name: string | null;
      major: string | null;
    } | null;
  };
  Insert: {
    category: string;
    created_at?: string;
    deadline: string;
    description: string;
    id?: string;
    owner_id: string;
    skills?: string[];
    title: string;
    updated_at?: string;
  };
  Update: {
    category?: string;
    created_at?: string;
    deadline?: string;
    description?: string;
    id?: string;
    owner_id?: string;
    skills?: string[];
    title?: string;
    updated_at?: string;
  };
  Relationships: [
    {
      foreignKeyName: "projects_owner_id_fkey";
      columns: ["owner_id"];
      referencedRelation: "profiles";
      referencedColumns: ["id"];
    }
  ];
};