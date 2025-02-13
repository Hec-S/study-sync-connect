import React from "react";
import { Link } from "react-router-dom";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Edit, MessageSquare } from "lucide-react";
import { MarketplaceProject } from "./MarketplacePage";
import { User } from "@supabase/supabase-js";

interface MarketplaceProjectCardProps {
  project: MarketplaceProject;
  isGridView: boolean;
  onUpdate: (id: string, project: Partial<MarketplaceProject>) => void;
  isOwner: boolean;
  currentUser: User | null;
}

export const MarketplaceProjectCard = ({
  project,
  isGridView,
  onUpdate,
  isOwner,
  currentUser,
}: MarketplaceProjectCardProps) => {
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Finance': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'Academic': 'bg-blue-100 text-blue-800 border-blue-200',
      'Design': 'bg-purple-100 text-purple-800 border-purple-200',
      'Development': 'bg-orange-100 text-orange-800 border-orange-200',
      'Research': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'Marketing': 'bg-pink-100 text-pink-800 border-pink-200',
      'Writing': 'bg-teal-100 text-teal-800 border-teal-200',
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusColor = (status: MarketplaceProject["status"]) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800 border-green-200";
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleConnect = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Connect functionality will be implemented later
    console.log("Connect clicked for project:", project.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onUpdate(project.id, project);
  };

  return (
    <Link to={`/project/${project.id}`} className="block no-underline">
      <Card className="group w-full transition-all duration-300 hover:shadow-lg hover:border-primary/20 cursor-pointer bg-white border-border border-gray-200 hover:scale-[1.02] overflow-hidden">
        <div className="flex flex-col md:flex-row gap-6 p-6 lg:p-8 relative min-h-[200px]">
          <div className="flex-1 space-y-4 min-w-0">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-lg md:text-xl font-bold group-hover:text-primary transition-colors">
                  {project.title}
                </CardTitle>
                <div className="text-base font-semibold text-primary">
                  {project.budget_range}
                </div>
              </div>
              {isOwner && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-gray-100/80"
                  onClick={handleEdit}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap gap-2 items-center">
                <Badge 
                  variant="outline"
                  className={`${getStatusColor(project.status)} border shadow-sm`}
                >
                  {project.status.replace("_", " ")}
                </Badge>
              </div>

              <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">{project.description}</p>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-4 md:w-48 md:border-l md:pl-6 lg:pl-8 md:py-2">
            {project.owner_name && (
              <div className="text-blue-600 font-medium text-center">
                {project.owner_name}
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  Due {new Date(project.deadline).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              
              <Button
                variant="default"
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2.5 shadow-md hover:shadow-lg transition-all duration-300 rounded-lg"
                onClick={handleConnect}
                onMouseDown={(e) => e.preventDefault()}
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                Connect
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};
