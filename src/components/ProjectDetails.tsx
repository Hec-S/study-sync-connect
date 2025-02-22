import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowLeft, MessageSquare, User as UserIcon } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";


interface BaseProject {
  id: string;
  title: string;
  description: string;
  category: string;
  owner_id: string;
  image_url?: string;
  project_url?: string;
  created_at: string;
  updated_at: string;
}

interface PortfolioProject extends BaseProject {
  completion_date: string;
  skills: string[];
}

interface MarketplaceProject extends BaseProject {
  deadline: string;
  required_skills: string[];
  budget_range: string;
  status: "open" | "completed" | "cancelled";
  school_name: string;
}

type ProjectDetails = PortfolioProject | MarketplaceProject;

const isPortfolioProject = (project: ProjectDetails): project is PortfolioProject => {
  return 'completion_date' in project && 'skills' in project;
};

export const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [ownerProfile, setOwnerProfile] = useState<{ id: string; full_name: string | null } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleConnect = () => {
    // Connect functionality will be implemented later
    console.log("Connect clicked for project:", projectId);
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        // Fetch project data
        const { data: portfolioData, error: portfolioError } = await supabase
          .from('portfolio_items')
          .select('*')
          .eq('id', projectId)
          .single();

        if (portfolioError) {
          console.error('Portfolio fetch error:', portfolioError);
        }

        if (portfolioData) {
          setProject(portfolioData as PortfolioProject);
          // Fetch owner profile
          const { data: ownerData, error: ownerError } = await supabase
            .from('profiles')
            .select('id, full_name')
            .eq('id', portfolioData.owner_id)
            .single();

          if (ownerError) {
            console.error('Owner fetch error:', ownerError);
          } else {
            setOwnerProfile(ownerData);
          }
          setIsLoading(false);
          return;
        }

        // If not found in portfolio_items, try marketplace_projects
        const { data: marketplaceData, error: marketplaceError } = await supabase
          .from('marketplace_projects')
          .select('*')
          .eq('id', projectId)
          .single();

        if (marketplaceError) {
          console.error('Marketplace fetch error:', marketplaceError);
          throw marketplaceError;
        }

        if (marketplaceData) {
          setProject(marketplaceData as MarketplaceProject);
          // Fetch owner profile
          const { data: ownerData, error: ownerError } = await supabase
            .from('profiles')
            .select('id, full_name')
            .eq('id', marketplaceData.owner_id)
            .single();

          if (ownerError) {
            console.error('Owner fetch error:', ownerError);
          } else {
            setOwnerProfile(ownerData);
          }
        } else {
          toast({
            title: "Error",
            description: "Project not found",
            variant: "destructive",
          });
          navigate(-1);
        }
      } catch (error: unknown) {
        console.error('Error fetching project:', error);
        toast({
          title: "Error",
          description: "Failed to load project details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <div className="space-y-6">
            {project.image_url && (
              <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">{project.title}</h1>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant="outline">{project.category}</Badge>
                    {ownerProfile && (
                      <Link 
                        to={`/profile/${ownerProfile.id}`}
                        className="flex items-center gap-2 hover:text-primary transition-colors no-underline"
                      >
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {ownerProfile.full_name?.charAt(0) || '?'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex items-center gap-1.5">
                          <UserIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{ownerProfile.full_name || 'Unknown User'}</span>
                        </div>
                      </Link>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {!isPortfolioProject(project) && (
                    <Button
                      variant="default"
                      className="gap-2"
                      onClick={handleConnect}
                    >
                      <MessageSquare className="h-4 w-4" />
                      Connect
                    </Button>
                  )}
                  {project.project_url && (
                    <a
                      href={project.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block"
                    >
                      <Button>
                        View Project
                      </Button>
                    </a>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  {isPortfolioProject(project)
                    ? `Completed ${new Date(project.completion_date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                      })}`
                    : `Due ${new Date(project.deadline).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}`}
                </span>
              </div>

              <div className="prose max-w-none">
                <p className="text-gray-600 whitespace-pre-wrap">{project.description}</p>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-semibold">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {(isPortfolioProject(project) ? project.skills : project.required_skills).map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
