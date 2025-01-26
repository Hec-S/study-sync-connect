import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Grid, List, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { MarketplaceProjectDialog } from "./MarketplaceProjectDialog";
import { MarketplaceProjectGrid } from "./MarketplaceProjectGrid";

export type MarketplaceProject = {
  id: string;
  title: string;
  description: string;
  category: string;
  budget_range: string;
  required_skills: string[];
  deadline: string;
  status: "open" | "in_progress" | "completed" | "cancelled";
  owner_id: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
};

export const MarketplacePage = () => {
  const [isGridView, setIsGridView] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [projects, setProjects] = useState<MarketplaceProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('marketplace_projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProject = async (newProject: Omit<MarketplaceProject, "id" | "created_at" | "updated_at" | "owner_id" | "status" | "assigned_to">) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to post a project",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('marketplace_projects')
        .insert([{
          ...newProject,
          owner_id: user.id,
          status: 'open',
        }])
        .select()
        .single();

      if (error) throw error;

      setProjects((prev) => [data, ...prev]);
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Project posted successfully",
      });
    } catch (error) {
      console.error('Error adding project:', error);
      toast({
        title: "Error",
        description: "Failed to post project",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProject = async (id: string, updatedProject: Partial<MarketplaceProject>) => {
    try {
      const { data, error } = await supabase
        .from('marketplace_projects')
        .update(updatedProject)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setProjects((prev) =>
        prev.map((project) => (project.id === id ? { ...project, ...data } : project))
      );
      toast({
        title: "Success",
        description: "Project updated successfully",
      });
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: "Error",
        description: "Failed to update project",
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
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Project Marketplace</h1>
              <p className="text-muted-foreground">Find projects or post your own</p>
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
                Post Project
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">No Projects Yet</h2>
              <p className="text-muted-foreground mb-4">
                Be the first to post a project
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Post Your Project
              </Button>
            </div>
          ) : (
            <MarketplaceProjectGrid
              projects={projects}
              isGridView={isGridView}
              onUpdate={handleUpdateProject}
              currentUser={user}
            />
          )}
        </div>

        <MarketplaceProjectDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={handleAddProject}
        />
      </div>
    </div>
  );
};
