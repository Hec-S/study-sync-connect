import React from "react";
import { MarketplaceProject } from "./MarketplacePage";
import { MarketplaceProjectCard } from "./MarketplaceProjectCard";
import { User } from "@supabase/supabase-js";

interface MarketplaceProjectGridProps {
  projects: MarketplaceProject[];
  isGridView: boolean;
  onUpdate: (id: string, project: Partial<MarketplaceProject>) => void;
  currentUser: User | null;
}

export const MarketplaceProjectGrid = ({
  projects,
  isGridView,
  onUpdate,
  currentUser,
}: MarketplaceProjectGridProps) => {
  return (
    <div
      className={`grid grid-cols-1 gap-6 ${
        !isGridView ? "grid-cols-1" : "md:grid-cols-2"
      } max-w-[1400px] mx-auto px-4 md:gap-8 lg:gap-10`}
    >
      {projects.map((project) => (
        <MarketplaceProjectCard
          key={project.id}
          project={project}
          isGridView={isGridView}
          onUpdate={onUpdate}
          isOwner={currentUser?.id === project.owner_id}
          currentUser={currentUser}
        />
      ))}
    </div>
  );
};
