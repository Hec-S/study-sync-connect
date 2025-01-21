import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye, EyeOff, Link as LinkIcon, Edit, Trash } from "lucide-react";
import { PortfolioItem } from "./PortfolioPage";

interface PortfolioCardProps {
  item: PortfolioItem;
  isGridView: boolean;
  onTogglePrivacy: () => void;
}

export const PortfolioCard = ({ item, isGridView, onTogglePrivacy }: PortfolioCardProps) => {
  return (
    <Card className={`group transition-all duration-300 hover:shadow-lg ${
      isGridView ? "" : "flex flex-row items-start"
    }`}>
      <div className={isGridView ? "" : "flex-1"}>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
              {item.title}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={onTogglePrivacy}
            >
              {item.isPublic ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <p className="text-muted-foreground mb-4">{item.description}</p>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Calendar className="h-4 w-4" />
            <span>{new Date(item.date).toLocaleDateString('en-US', { 
              year: 'numeric',
              month: 'long'
            })}</span>
          </div>

          {item.links.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {item.links.map((link, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  <LinkIcon className="h-3 w-3" />
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {new URL(link).hostname}
                  </a>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </div>

      <CardFooter className={`${isGridView ? "border-t" : "border-l"} p-2`}>
        <div className={`flex ${isGridView ? "w-full justify-between" : "flex-col gap-2"}`}>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive">
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};