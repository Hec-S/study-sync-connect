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
  customCategory?: string;
  status: "open" | "completed" | "cancelled";
  owner_id: string;
  owner_name?: string | null;
  created_at: string;
  updated_at: string;
  school_name: string;
};

export const MarketplacePage = () => {
  const [isGridView, setIsGridView] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [projects, setProjects] = useState<MarketplaceProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      // First get all projects
      const { data: projects, error: projectsError } = await supabase
        .from('marketplace_projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;

      // Then get all profiles for the project owners
      const ownerIds = [...new Set((projects || []).map(p => p.owner_id))];
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', ownerIds);

      if (profilesError) throw profilesError;

      // Create a map of owner_id to full_name
      const ownerNames = (profiles || []).reduce((acc, profile) => ({
        ...acc,
        [profile.id]: profile.full_name
      }), {} as Record<string, string | null>);

      // Combine the data
      const projectsWithOwnerNames = (projects || []).map(project => ({
        ...project,
        owner_name: ownerNames[project.owner_id] || null
      }));

      setProjects(projectsWithOwnerNames as MarketplaceProject[]);
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

  const handleAddProject = async (newProject: Omit<MarketplaceProject, "id" | "created_at" | "updated_at" | "owner_id" | "status" | "school_name">) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to post a project",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Get user's school name from profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('school_name, full_name')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        // Continue with default values
      }

      const { data, error } = await supabase
        .from('marketplace_projects')
        .insert([{
          ...newProject,
          owner_id: user.id,
          status: 'open' as const, // Explicitly type as project_status enum
          school_name: profileData?.school_name || "Unknown School", // Use fallback if profile fetch fails
        }])
        .select()
        .single();

      if (error) throw error;

      // Add the owner's name to the new project data
      const newProjectWithOwner = {
        ...data,
        owner_name: profileData?.full_name || null
      } as MarketplaceProject;
      
      setProjects((prev) => [newProjectWithOwner, ...prev]);
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Project posted successfully",
      });
    } catch (error) {
      console.error('Error adding project:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to post project",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
        prev.map((project) => (project.id === id ? { ...project, ...data as MarketplaceProject } : project))
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
              <h1 className="text-2xl md:text-3xl font-bold">Student Work Hub</h1>
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
              <Button 
                onClick={() => {
                  if (!user) {
                    toast({
                      title: "Sign in required",
                      description: "Please sign in to post a project",
                      variant: "destructive",
                    });
                    return;
                  }
                  setIsDialogOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Post
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
              <Button 
                onClick={() => {
                  if (!user) {
                    toast({
                      title: "Sign in required",
                      description: "Please sign in to post a project",
                      variant: "destructive",
                    });
                    return;
                  }
                  setIsDialogOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Post
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
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};
