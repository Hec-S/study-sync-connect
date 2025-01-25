import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Calendar, User, School } from "lucide-react";
import { getCategoryColor } from "@/components/ProjectCard";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: project, isLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          profiles:owner_id (
            full_name,
            school_name
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-8 w-48 mb-6" />
            <Skeleton className="h-4 w-24 mb-8" />
            <Skeleton className="h-32 w-full mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
            </div>
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
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Project Not Found
            </h1>
            <p className="text-gray-600 mb-8">
              This project is no longer available or may have been removed.
            </p>
            <Button onClick={() => navigate("/home")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Latest Projects
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
            variant="ghost"
            className="mb-6"
            onClick={() => navigate("/home")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Latest Projects
          </Button>

          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {project.title}
                </h1>
                <Badge className={getCategoryColor(project.category)}>
                  {project.category}
                </Badge>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Due: {project.deadline}</span>
              </div>
            </div>

            <div className="prose max-w-none mb-8">
              <p className="text-gray-600">{project.description}</p>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {project.skills.map((skill: string) => (
                <Badge
                  key={skill}
                  variant="outline"
                  className="bg-blue-50 hover:bg-blue-100"
                >
                  {skill}
                </Badge>
              ))}
            </div>

            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold mb-4">Project Owner</h2>
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">
                    {project.profiles?.full_name || "Anonymous"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <School className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">
                    {project.profiles?.school_name || "School not specified"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetails;