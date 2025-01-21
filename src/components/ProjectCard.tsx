import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MessageSquare, ArrowRight } from "lucide-react";

interface ProjectCardProps {
  title: string;
  description: string;
  category: string;
  deadline: string;
  skills: string[];
}

export const ProjectCard = ({ title, description, category, deadline, skills }: ProjectCardProps) => {
  return (
    <Card className="group w-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fadeIn bg-white border-gray-100">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg md:text-xl font-semibold group-hover:text-primary transition-colors line-clamp-2">
              {title}
            </CardTitle>
            <Badge variant="secondary" className="mt-2 text-xs md:text-sm">
              {category}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm md:text-base text-gray-600 mb-4 line-clamp-2">{description}</p>
        <div className="flex flex-wrap gap-1.5 md:gap-2">
          {skills.map((skill) => (
            <Badge key={skill} variant="outline" className="text-xs md:text-sm bg-blue-50 hover:bg-blue-100 transition-colors">
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between items-center">
        <div className="flex items-center gap-1.5 text-xs md:text-sm text-gray-500">
          <Calendar className="w-3 h-3 md:w-4 md:h-4" />
          <span>Due: {deadline}</span>
        </div>
        <Button size="sm" className="w-full sm:w-auto group-hover:gap-3 transition-all duration-300 text-xs md:text-sm">
          <MessageSquare className="w-3 h-3 md:w-4 md:h-4" />
          <span>Connect</span>
          <ArrowRight className="w-0 h-3 md:h-4 opacity-0 group-hover:w-3 md:group-hover:w-4 group-hover:opacity-100 transition-all duration-300" />
        </Button>
      </CardFooter>
    </Card>
  );
};