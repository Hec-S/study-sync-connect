import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PortfolioGrid } from "./PortfolioGrid";
import { PortfolioItemDialog } from "./PortfolioItemDialog";
import { Grid, List, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/Navbar";

export type PortfolioItem = {
  id: string;
  title: string;
  description: string;
  date: string;
  links: string[];
  isPublic: boolean;
  files: string[];
};

export const PortfolioPage = () => {
  const [isGridView, setIsGridView] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  // Mock data - replace with actual data fetching
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([
    {
      id: "1",
      title: "Web Development Project",
      description: "Built a full-stack web application using React and Node.js",
      date: "2024-02",
      links: ["https://github.com/example/project"],
      isPublic: true,
      files: [],
    },
    {
      id: "2",
      title: "UI/UX Design Portfolio",
      description: "Collection of user interface designs and prototypes",
      date: "2024-01",
      links: ["https://behance.net/example"],
      isPublic: false,
      files: [],
    },
  ]);

  const handleAddItem = (newItem: Omit<PortfolioItem, "id">) => {
    const item = {
      ...newItem,
      id: Math.random().toString(36).substr(2, 9),
    };
    setPortfolioItems((prev) => [...prev, item]);
    toast({
      title: "Success",
      description: "Portfolio item added successfully",
    });
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-bold">My Portfolio</h1>
            <div className="flex items-center gap-2">
              <div className="border rounded-lg p-1 flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={!isGridView ? "bg-muted" : ""}
                  onClick={() => setIsGridView(false)}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={isGridView ? "bg-muted" : ""}
                  onClick={() => setIsGridView(true)}
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </div>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </div>

          {portfolioItems.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">Build Your Portfolio</h2>
              <p className="text-muted-foreground mb-4">
                Showcase your projects and experiences to stand out
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Item
              </Button>
            </div>
          ) : (
            <PortfolioGrid
              items={portfolioItems}
              isGridView={isGridView}
              onUpdate={(updatedItems) => setPortfolioItems(updatedItems)}
            />
          )}
        </div>

        <PortfolioItemDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={handleAddItem}
        />
      </div>
    </div>
  );
};