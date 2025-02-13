import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Edit, ExternalLink, Image, Trash2 } from "lucide-react";
import { PortfolioItem } from "./PortfolioPage";
import { User } from "@supabase/supabase-js";

interface PortfolioCardProps {
  item: PortfolioItem;
  isGridView: boolean;
  onUpdate: (id: string, item: Partial<PortfolioItem>) => void;
  onDelete: (id: string) => void;
  currentUser: User | null;
}

export const PortfolioCard = ({
  item,
  isGridView,
  onUpdate,
  onDelete,
  currentUser,
}: PortfolioCardProps) => {
  const isOwner = currentUser?.id === item.owner_id;

  const handleExternalLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(item.project_url, '_blank', 'noopener,noreferrer');
  };

  const handleUpdate = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onUpdate(item.id, item);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(item.id);
  };

  return (
    <Link to={`/project/${item.id}`} className="block">
      <Card
        className="group w-[300px] h-[400px] transition-all duration-300 hover:shadow-lg cursor-pointer flex flex-col border-border border-gray-200"
      >
        {item.image_url && (
          <div className="relative h-[160px] overflow-hidden">
            <img
              src={item.image_url}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className={isGridView ? "" : "flex-1"}>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                  {item.title}
                  {item.project_url && (
                    <button
                      onClick={handleExternalLink}
                      className="inline-flex items-center ml-2 text-muted-foreground hover:text-primary bg-transparent border-none cursor-pointer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  )}
                </CardTitle>
                <Badge variant="outline">{item.category}</Badge>
              </div>
              {isOwner && (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleUpdate}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={handleDelete}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-hidden space-y-4">
            <p className="text-muted-foreground line-clamp-3">{item.description}</p>

            {item.skills && item.skills.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Skills Used:</p>
                <div className="flex flex-wrap gap-2 overflow-y-auto max-h-[80px]">
                  {item.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="border-t pt-2 mt-auto">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>
                Completed{" "}
                {new Date(item.completion_date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                })}
              </span>
            </div>
          </CardFooter>
        </div>
      </Card>
    </Link>
  );
};
