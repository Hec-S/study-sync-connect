import React, { useState, useCallback } from "react";
import { debounce } from "lodash";
import { Link } from "react-router-dom";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Edit, ExternalLink, Trash2 } from "lucide-react";
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

  const [isImageLoading, setIsImageLoading] = useState(true);

  const handleExternalLink = debounce((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(item.project_url, '_blank', 'noopener,noreferrer');
  }, 300, { leading: true, trailing: false });

  const handleUpdate = debounce((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onUpdate(item.id, item);
  }, 300, { leading: true, trailing: false });

  const handleDelete = debounce((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(item.id);
  }, 300, { leading: true, trailing: false });

  return (
    <Link to={`/project/${item.id}`} className="block no-underline">
      <Card className="group w-full transition-all duration-300 hover:shadow-lg hover:border-primary/20 cursor-pointer bg-white border-border border-gray-200 hover:scale-[1.02] overflow-hidden">
        <div className="flex flex-col md:flex-row gap-6 p-6 lg:p-8 relative min-h-[200px]">
          <div className="flex-1 space-y-4 min-w-0">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-lg md:text-xl font-bold group-hover:text-primary transition-colors">
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
                {item.image_url && (
                  <div className="relative w-full h-32">
                    {isImageLoading && (
                      <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-md" />
                    )}
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className={`w-full h-full object-cover rounded-md transition-opacity duration-200 ${
                        isImageLoading ? 'opacity-0' : 'opacity-100'
                      }`}
                      onLoad={() => setIsImageLoading(false)}
                      onError={() => setIsImageLoading(false)}
                    />
                  </div>
                )}
              </div>
              {isOwner && (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-gray-100/80"
                    onClick={handleUpdate}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-gray-100/80 text-destructive hover:text-destructive"
                    onClick={handleDelete}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap gap-2 items-center">
                <Badge 
                  variant="outline"
                  className="bg-gray-100 text-gray-800 border-gray-200 border shadow-sm"
                >
                  {item.category}
                </Badge>
              </div>

              <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                {item.description}
              </p>

              {item.skills && item.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {item.skills.map((skill, index) => (
                    <Badge 
                      key={index}
                      variant="outline"
                      className="bg-blue-100 text-blue-800 border-blue-200 border shadow-sm"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-between gap-4 md:w-48 md:border-l md:pl-6 lg:pl-8 md:py-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                Completed {new Date(item.completion_date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};
