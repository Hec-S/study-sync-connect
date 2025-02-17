import React from "react";
import { PortfolioItem } from "./PortfolioPage";
import { PortfolioCard } from "./PortfolioCard";
import { User } from "@supabase/supabase-js";

interface PortfolioGridProps {
  items: PortfolioItem[];
  isGridView: boolean;
  onUpdate: (id: string, item: Partial<PortfolioItem>) => void;
  onDelete: (id: string) => void;
  currentUser: User | null;
}

export const PortfolioGrid = ({
  items,
  isGridView,
  onUpdate,
  onDelete,
  currentUser,
}: PortfolioGridProps) => {
  return (
    <div className="grid gap-4">
      {items.map((item) => (
        <PortfolioCard
          key={item.id}
          item={item}
          isGridView={isGridView}
          onUpdate={onUpdate}
          onDelete={onDelete}
          currentUser={currentUser}
        />
      ))}
    </div>
  );
};
