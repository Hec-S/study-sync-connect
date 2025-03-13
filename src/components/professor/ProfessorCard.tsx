import { Card, CardContent } from "@/components/ui/card";
import { Star, GraduationCap, Award, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ProfessorRating } from "@/integrations/supabase/types";
import { motion } from "framer-motion";

interface ProfessorCardProps {
  professor: ProfessorRating;
  onClick: () => void;
}

export const ProfessorCard = ({ professor, onClick }: ProfessorCardProps) => {
  // Generate initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Determine color based on rating
  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-500";
    if (rating >= 3) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className="overflow-hidden h-full border-2 hover:border-primary/30 transition-all duration-300 cursor-pointer"
        onClick={onClick}
      >
        <CardContent className="p-0">
          {/* Professor Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 flex items-center gap-3">
            <div className="bg-primary/10 rounded-full h-12 w-12 flex items-center justify-center text-primary font-bold">
              {getInitials(professor.professor_name)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold line-clamp-1 text-gray-800">{professor.professor_name}</h3>
              <p className="text-sm text-gray-600 truncate">{professor.major || "General"}</p>
            </div>
            <div className={`text-xl font-bold ${getRatingColor(professor.average_rating)}`}>
              {professor.average_rating.toFixed(1)}
            </div>
          </div>
          
          {/* Card Body */}
          <div className="p-4">
            {/* School */}
            <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
              <BookOpen className="h-4 w-4 text-gray-400" />
              <span className="truncate">{professor.school || "Unknown School"}</span>
            </div>
            
            {/* Rating Stars */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex">
                {Array(5).fill(0).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-5 w-5 ${i < Math.round(professor.average_rating) ? 'text-yellow-400 fill-current' : 'text-gray-200'}`} 
                  />
                ))}
              </div>
              <span className="text-sm font-medium">
                ({professor.num_ratings} {professor.num_ratings === 1 ? 'review' : 'reviews'})
              </span>
            </div>
            
            {/* Difficulty Badge */}
            <div className="flex justify-between items-center mt-3">
              <Badge 
                variant="outline" 
                className="text-xs font-medium"
              >
                {professor.num_ratings} {professor.num_ratings === 1 ? 'rating' : 'ratings'}
              </Badge>
              
              <Badge 
                className={`text-xs font-medium px-3 py-1 ${
                  professor.difficulty < 2 ? 'bg-green-100 text-green-800 hover:bg-green-200' : 
                  professor.difficulty < 3.5 ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : 
                  'bg-red-100 text-red-800 hover:bg-red-200'
                }`}
              >
                {professor.difficulty < 2 ? 'Easy' : 
                 professor.difficulty < 3.5 ? 'Moderate' : 
                 'Challenging'} • {professor.difficulty.toFixed(1)}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProfessorCard;
