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
            <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors">
              {title}
            </CardTitle>
            <Badge variant="secondary" className="mt-2">
              {category}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Badge key={skill} variant="outline" className="bg-blue-50 hover:bg-blue-100 transition-colors">
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>Due: {deadline}</span>
        </div>
        <Button className="group-hover:gap-4 transition-all duration-300">
          <MessageSquare className="w-4 h-4" />
          <span>Connect</span>
          <ArrowRight className="w-0 h-4 opacity-0 group-hover:w-4 group-hover:opacity-100 transition-all duration-300" />
        </Button>
      </CardFooter>
    </Card>
  );
};