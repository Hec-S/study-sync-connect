import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Grid, List, Plus, User } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { PortfolioItemDialog } from "./PortfolioItemDialog";
import { PortfolioGrid } from "./PortfolioGrid";

export type PortfolioItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  completion_date: string;
  skills: string[];
  owner_id: string;
  image_url?: string;
  project_url?: string;
  created_at: string;
  updated_at: string;
};

export const PortfolioPage = () => {
  const [isGridView, setIsGridView] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchItems();
    }
  }, [user]);

  const fetchItems = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching portfolio items:', error);
      toast({
        title: "Error",
        description: "Failed to load portfolio items",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = async (newItem: Omit<PortfolioItem, "id" | "created_at" | "updated_at" | "owner_id">) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add portfolio items",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('portfolio_items')
        .insert([{
          ...newItem,
          owner_id: user.id,
        }])
        .select()
        .single();

      if (error) throw error;

      setItems((prev) => [data, ...prev]);
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Portfolio item added successfully",
      });
    } catch (error) {
      console.error('Error adding portfolio item:', error);
      toast({
        title: "Error",
        description: "Failed to add portfolio item",
        variant: "destructive",
      });
    }
  };

  const handleUpdateItem = async (id: string, updatedItem: Partial<PortfolioItem>) => {
    try {
      const { data, error } = await supabase
        .from('portfolio_items')
        .update(updatedItem)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...data } : item))
      );
      toast({
        title: "Success",
        description: "Portfolio item updated successfully",
      });
    } catch (error) {
      console.error('Error updating portfolio item:', error);
      toast({
        title: "Error",
        description: "Failed to update portfolio item",
        variant: "destructive",
      });
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('portfolio_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setItems((prev) => prev.filter((item) => item.id !== id));
      toast({
        title: "Success",
        description: "Portfolio item deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting portfolio item:', error);
      toast({
        title: "Error",
        description: "Failed to delete portfolio item",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-center">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-bold">
                    My Portfolio
                  </h1>
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="rounded-full"
                  >
                    <Link to="/profile">
                      <User className="h-5 w-5" />
                    </Link>
                  </Button>
                </div>
                <p className="text-muted-foreground">
                  Showcase your completed projects
                </p>
              </div>
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
                  Add Project
                </Button>
              </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">No Portfolio Items Yet</h2>
              <p className="text-muted-foreground mb-4">
                Add your first project to showcase your work
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Project
              </Button>
            </div>
          ) : (
            <PortfolioGrid
              items={items}
              isGridView={isGridView}
              onUpdate={handleUpdateItem}
              onDelete={handleDeleteItem}
              currentUser={user}
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
