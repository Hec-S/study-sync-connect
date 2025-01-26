import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  return (
    <Card
      className={`group transition-all duration-300 hover:shadow-lg ${
        isGridView ? "" : "flex flex-row items-start"
      }`}
    >
      {item.image_url && (
        <div className={`relative ${isGridView ? "aspect-video" : "w-48"} overflow-hidden`}>
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
                  <a
                    href={item.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center ml-2 text-muted-foreground hover:text-primary"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
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
                  onClick={() => onUpdate(item.id, item)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => onDelete(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{item.description}</p>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                Completed{" "}
                {new Date(item.completion_date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                })}
              </span>
            </div>
          </div>

          {item.skills && item.skills.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Skills Used:</p>
              <div className="flex flex-wrap gap-2">
                {item.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
};