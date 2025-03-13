import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, BookOpen, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { addReview } from "@/services/professorRatings";
import { toast } from "sonner";

interface ProfessorRatingFormProps {
  initialProfessorName?: string;
  onClose: () => void;
  onSuccess: () => void;
  user: any;
}

export const ProfessorRatingForm = ({ 
  initialProfessorName = "", 
  onClose, 
  onSuccess,
  user
}: ProfessorRatingFormProps) => {
  const [professorName, setProfessorName] = useState(initialProfessorName);
  const [course, setCourse] = useState("");
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [difficulty, setDifficulty] = useState(3);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!professorName || !course || !rating || !review) {
      toast.error("Please fill out all fields");
      return;
    }
    
    setSubmitting(true);
    try {
      await addReview({
        professor_name: professorName,
        major: "Unknown", // This could be improved with a dropdown
        school: user?.user_metadata?.school_name || "Unknown",
        course,
        rating,
        review,
        difficulty
      });
      
      toast.success("Review submitted successfully!");
      onSuccess();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto mt-6"
    >
      <Card className="border-2 border-primary/10 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="space-y-1 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            Share Your Experience
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="professorName" className="text-lg">Professor Name</Label>
              <Input
                id="professorName"
                placeholder="Enter professor's name"
                value={professorName}
                onChange={(e) => setProfessorName(e.target.value)}
                className="h-12 text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="course" className="text-lg">Course</Label>
              <Input
                id="course"
                placeholder="Enter course name/code (e.g., CS 1301)"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="h-12 text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-lg">Rating</Label>
              <div className="flex gap-2 justify-center p-4 bg-gray-50 rounded-lg">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button
                    key={star}
                    type="button"
                    variant={rating >= star ? "default" : "outline"}
                    size="lg"
                    onClick={() => setRating(star)}
                    className={`h-12 w-12 transition-all duration-200 ${
                      rating >= star 
                        ? "bg-primary hover:bg-primary/90" 
                        : "hover:border-primary/50"
                    }`}
                  >
                    <Star className={`h-6 w-6 ${rating >= star ? "fill-current" : ""}`} />
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-lg">Difficulty</Label>
              <div className="flex gap-2 justify-center p-4 bg-gray-50 rounded-lg">
                {[1, 2, 3, 4, 5].map((level) => (
                  <Button
                    key={level}
                    type="button"
                    variant={difficulty >= level ? "default" : "outline"}
                    size="lg"
                    onClick={() => setDifficulty(level)}
                    className={`h-12 w-12 transition-all duration-200 ${
                      difficulty >= level 
                        ? "bg-primary hover:bg-primary/90" 
                        : "hover:border-primary/50"
                    }`}
                  >
                    {level}
                  </Button>
                ))}
              </div>
              <p className="text-center text-sm text-gray-500">
                {difficulty === 1 ? 'Very Easy' : 
                 difficulty === 2 ? 'Easy' : 
                 difficulty === 3 ? 'Moderate' : 
                 difficulty === 4 ? 'Difficult' : 'Very Difficult'}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="review" className="text-lg">Your Review</Label>
              <Textarea
                id="review"
                placeholder="Share your experience with this professor... What did you like? What could be improved?"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows={5}
                className="resize-none text-lg"
              />
            </div>

            <div className="flex gap-4">
              <Button 
                type="button" 
                variant="outline" 
                size="lg" 
                className="w-full text-lg h-12"
                onClick={onClose}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                size="lg" 
                className="w-full text-lg h-12"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Rating'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProfessorRatingForm;
