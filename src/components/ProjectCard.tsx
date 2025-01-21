import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MessageSquare } from "lucide-react";

interface ProjectCardProps {
  title: string;
  description: string;
  category: string;
  deadline: string;
  skills: string[];
}

export const ProjectCard = ({ title, description, category, deadline, skills }: ProjectCardProps) => {
  return (
    <Card className="w-full transition-all hover:shadow-lg animate-fadeIn">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-semibold">{title}</CardTitle>
            <Badge variant="secondary" className="mt-2">
              {category}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Badge key={skill} variant="outline">
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
        <Button className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Connect
        </Button>
      </CardFooter>
    </Card>
  );
};