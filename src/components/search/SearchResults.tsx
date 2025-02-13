import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface SearchResultsProps {
  results: Profile[];
  isLoading: boolean;
}

export const SearchResults = ({ results, isLoading }: SearchResultsProps) => {
  if (isLoading) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        Searching...
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        No users found
      </div>
    );
  }

  return (
    <div className="max-h-[300px] overflow-auto">
      {results.map((profile) => (
        <Link
          key={profile.id}
          to={`/profile/${profile.id}`}
          className="flex items-center gap-3 p-3 hover:bg-accent transition-colors"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={undefined} alt={profile.full_name || ""} />
            <AvatarFallback>
              {profile.full_name?.charAt(0).toUpperCase() || <User className="h-4 w-4" />}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{profile.full_name || "Unnamed User"}</div>
            <div className="text-sm text-muted-foreground">
              {profile.school_name && profile.major
                ? `${profile.school_name} • ${profile.major}`
                : profile.school_name || profile.major || "No details provided"}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};
