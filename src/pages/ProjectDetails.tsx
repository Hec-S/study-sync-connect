import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MessageSquare, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          profiles:owner_id (
            full_name,
            school_name
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const handleConnect = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to connect with project owners",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    toast({
      title: "Connection request sent!",
      description: `You've requested to connect for "${project?.title}"`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-8 w-48 mb-6" />
            <Skeleton className="h-4 w-24 mb-4" />
            <Skeleton className="h-32 w-full mb-6" />
            <Skeleton className="h-8 w-32" />
          </div>
        </main>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
            <Button onClick={() => navigate(-1)} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>

          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{project.title}</h1>
              <Badge variant="secondary" className="mb-4">
                {project.category}
              </Badge>
            </div>

            <div className="prose max-w-none mb-8">
              <p className="text-gray-600">{project.description}</p>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {project.skills.map((skill: string) => (
                <Badge key={skill} variant="outline" className="bg-blue-50">
                  {skill}
                </Badge>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mb-8">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-5 w-5" />
                <span>Due: {new Date(project.deadline).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <span>Posted by: {project.profiles?.full_name || 'Anonymous'}</span>
                {project.profiles?.school_name && (
                  <span className="text-gray-400">• {project.profiles.school_name}</span>
                )}
              </div>
            </div>

            <Button 
              size="lg"
              onClick={handleConnect}
              className="w-full sm:w-auto"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Connect with Project Owner
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetails;