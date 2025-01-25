import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MessageSquare, ArrowRight, Bookmark } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProjectCardProps {
  title: string;
  description: string;
  category: string;
  deadline: string;
  skills: string[];
}

const getCategoryColor = (category: string): string => {
  const colors: { [key: string]: string } = {
    Design: "bg-pink-100 text-pink-800 hover:bg-pink-200",
    Development: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    Research: "bg-purple-100 text-purple-800 hover:bg-purple-200",
    Marketing: "bg-green-100 text-green-800 hover:bg-green-200",
  };
  return colors[category] || "bg-gray-100 text-gray-800 hover:bg-gray-200";
};

export const ProjectCard = ({ title, description, category, deadline, skills }: ProjectCardProps) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const truncatedDescription = isExpanded ? description : description.slice(0, 100) + (description.length > 100 ? "..." : "");

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
      description: `You've requested to connect for "${title}"`,
    });
    // In a real application, this would trigger a connection request
    console.log("Connecting to project:", title);
  };

  return (
    <Card className="group h-full flex flex-col justify-between w-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fadeIn bg-white border-gray-100">
      <div>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg md:text-xl font-semibold group-hover:text-primary transition-colors line-clamp-2">
                {title}
              </CardTitle>
              <Badge 
                variant="secondary" 
                className={`mt-2 text-xs md:text-sm ${getCategoryColor(category)}`}
              >
                {category}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${isBookmarked ? 'text-primary' : 'text-gray-400'}`}
              onClick={() => setIsBookmarked(!isBookmarked)}
            >
              <Bookmark className="h-4 w-4" fill={isBookmarked ? "currentColor" : "none"} />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <p className="text-sm md:text-base text-gray-600 mb-4">
            {truncatedDescription}
            {description.length > 100 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="ml-1 text-primary hover:underline font-medium"
              >
                {isExpanded ? "Show less" : "Read more"}
              </button>
            )}
          </p>
          <div className="flex flex-wrap gap-1.5 md:gap-2">
            {skills.map((skill) => (
              <Badge 
                key={skill} 
                variant="outline" 
                className="text-xs md:text-sm bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </div>
      
      <CardFooter className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between items-center border-t pt-4 mt-auto">
        <div className="flex items-center gap-1.5 text-xs md:text-sm text-gray-500">
          <Calendar className="w-3 h-3 md:w-4 md:h-4" />
          <span>Due: {deadline}</span>
        </div>
        <Button 
          size="sm" 
          className="w-full sm:w-auto group-hover:gap-3 transition-all duration-300 text-xs md:text-sm bg-primary hover:bg-primary/90"
          onClick={handleConnect}
        >
          <MessageSquare className="w-3 h-3 md:w-4 md:h-4" />
          <span>Connect</span>
          <ArrowRight className="w-0 h-3 md:h-4 opacity-0 group-hover:w-3 md:group-hover:w-4 group-hover:opacity-100 transition-all duration-300" />
        </Button>
      </CardFooter>
    </Card>
  );
};