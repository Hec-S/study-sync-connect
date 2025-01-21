import React from "react";
import { PortfolioItem } from "./PortfolioPage";
import { PortfolioCard } from "./PortfolioCard";

interface PortfolioGridProps {
  items: PortfolioItem[];
  isGridView: boolean;
  onUpdate: (items: PortfolioItem[]) => void;
}

export const PortfolioGrid = ({ items, isGridView, onUpdate }: PortfolioGridProps) => {
  const handleTogglePrivacy = (id: string) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, isPublic: !item.isPublic } : item
    );
    onUpdate(updatedItems);
  };

  return (
    <div
      className={`grid gap-4 ${
        isGridView
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          : "grid-cols-1"
      }`}
    >
      {items.map((item) => (
        <PortfolioCard
          key={item.id}
          item={item}
          isGridView={isGridView}
          onTogglePrivacy={() => handleTogglePrivacy(item.id)}
        />
      ))}
    </div>
  );
};