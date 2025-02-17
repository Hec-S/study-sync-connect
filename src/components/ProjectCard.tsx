
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MessageSquare, ArrowRight, Bookmark } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProjectCardProps {
  title: string;
  description: string;
  category: string;
  deadline: string;
  skills: string[];
  ownerId?: string;
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

export const ProjectCard = ({ title, description, category, deadline, skills, ownerId }: ProjectCardProps) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const truncatedDescription = isExpanded ? description : description.slice(0, 100) + (description.length > 100 ? "..." : "");

  const handleConnect = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to connect with others",
        variant: "destructive",
      });
      return;
    }

    if (!ownerId) {
      toast({
        title: "Error",
        description: "Could not find the project owner",
        variant: "destructive",
      });
      return;
    }

    if (ownerId === user.id) {
      toast({
        title: "Error",
        description: "You cannot connect with yourself",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    try {
      // Check if already connected
      const { data: existingConnection } = await supabase
        .from('connections')
        .select('*')
        .or(`and(requester_id.eq.${user.id},receiver_id.eq.${ownerId}),and(requester_id.eq.${ownerId},receiver_id.eq.${user.id})`)
        .single();

      if (existingConnection) {
        // If connected, navigate to messages
        navigate(`/connections?tab=messages&userId=${ownerId}`);
        return;
      }

      // If not connected, create connection request
      const { error: connectionError } = await supabase
        .from('connections')
        .insert([
          {
            requester_id: user.id,
            receiver_id: ownerId,
            status: 'pending'
          }
        ]);

      if (connectionError) throw connectionError;

      toast({
        title: "Connection request sent",
        description: "The user will be notified of your request",
      });

      // Navigate to connections page
      navigate('/connections');

    } catch (error) {
      console.error('Error connecting:', error);
      toast({
        title: "Error",
        description: "Failed to send connection request",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Link to={`/project/${title.toLowerCase().replace(/\s+/g, '-')}`} className="block no-underline">
      <Card className="group w-[300px] h-[400px] flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fadeIn bg-white border-border border-gray-200">
      <div>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg md:text-xl font-semibold group-hover:text-primary transition-colors line-clamp-2">
                {title}
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${isBookmarked ? 'text-primary' : 'text-gray-400'}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsBookmarked(!isBookmarked);
              }}
            >
              <Bookmark className="h-4 w-4" fill={isBookmarked ? "currentColor" : "none"} />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-hidden">
          <p className="text-sm md:text-base text-gray-600 mb-4 overflow-hidden">
            {truncatedDescription}
            {description.length > 100 && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
                className="ml-1 text-primary hover:underline font-medium"
              >
                {isExpanded ? "Show less" : "Read more"}
              </button>
            )}
          </p>
        </CardContent>
      </div>
      
      <CardFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-between items-center border-t pt-2 mt-auto">
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <Calendar className="w-3 h-3" />
          <span>Due: {deadline}</span>
        </div>
        <Button 
          size="sm" 
          className="w-full sm:w-auto group-hover:gap-3 transition-all duration-300 text-sm bg-primary hover:bg-primary/90"
          onClick={handleConnect}
          disabled={isConnecting}
        >
          <MessageSquare className="w-3 h-3" />
          <span>{isConnecting ? "Connecting..." : "Connect"}</span>
          <ArrowRight className="w-0 h-3 opacity-0 group-hover:w-3 group-hover:opacity-100 transition-all duration-300" />
        </Button>
      </CardFooter>
      </Card>
    </Link>
  );
};
