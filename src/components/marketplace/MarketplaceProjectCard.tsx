import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, Edit } from "lucide-react";
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
  const getStatusColor = (status: MarketplaceProject["status"]) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleApply = () => {
    if (!currentUser) return;
    onUpdate(project.id, {
      status: "in_progress",
      assigned_to: currentUser.id,
    });
  };

  return (
    <Card
      className={`group transition-all duration-300 hover:shadow-lg ${
        isGridView ? "" : "flex flex-row items-start"
      }`}
    >
      <div className={isGridView ? "" : "flex-1"}>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                {project.title}
              </CardTitle>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{project.category}</Badge>
                <Badge className={getStatusColor(project.status)}>
                  {project.status.replace("_", " ")}
                </Badge>
              </div>
            </div>
            {isOwner && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onUpdate(project.id, project)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{project.description}</p>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                Due {new Date(project.deadline).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span>{project.budget_range}</span>
            </div>
          </div>

          {project.required_skills && project.required_skills.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Required Skills:</p>
              <div className="flex flex-wrap gap-2">
                {project.required_skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {project.status === "open" && !isOwner && currentUser && (
            <Button
              className="w-full mt-4"
              onClick={handleApply}
            >
              Apply for Project
            </Button>
          )}
        </CardContent>
      </div>
    </Card>
  );
};
