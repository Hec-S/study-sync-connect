import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Star, GraduationCap, BookOpen, Calendar, User, Loader2 } from "lucide-react";
import { getProfessor, getProfessorReviews } from "@/services/professorRatings";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { ProfessorRating, ProfessorReview } from "@/integrations/supabase/types";

export const ProfessorProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [professor, setProfessor] = useState<ProfessorRating | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const professorData = await getProfessor(id);
        setProfessor(professorData);
        
        const reviewsData = await getProfessorReviews(id);
        setReviews(reviewsData);
      } catch (error) {
        console.error("Error fetching professor data:", error);
        toast.error("Failed to load professor information");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-xl text-gray-600">Loading professor information...</p>
          </div>
        </div>
      </>
    );
  }

  if (!professor) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
          <Card className="max-w-md mx-auto text-center p-6">
            <CardHeader>
              <CardTitle className="text-2xl">Professor Not Found</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                The professor you're looking for could not be found.
              </p>
              <Button onClick={() => navigate("/professor-rating")} size="lg" className="w-full">
                Back to Professor Ratings
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto py-8 px-4">
          {/* Professor Header */}
          <div className="max-w-4xl mx-auto mb-8">
            <Card className="border-2 border-primary/10 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-4 rounded-full">
                    <GraduationCap className="w-12 h-12 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl">{professor.professor_name}</CardTitle>
                    <p className="text-primary font-medium">{professor.major} • {professor.school}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 mb-2">Average Rating</p>
                    <div className="flex justify-center gap-1 mb-1">
                      {Array(5).fill(0).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-6 w-6 ${i < Math.round(professor.average_rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <p className="text-2xl font-bold">{professor.average_rating.toFixed(1)}/5.0</p>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 mb-2">Difficulty</p>
                    <p className="text-2xl font-bold">{professor.difficulty.toFixed(1)}/5.0</p>
                    <p className="text-sm text-gray-500">
                      {professor.difficulty < 2 ? 'Easy' : 
                       professor.difficulty < 3.5 ? 'Moderate' : 'Challenging'}
                    </p>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 mb-2">Total Reviews</p>
                    <p className="text-2xl font-bold">{professor.num_ratings}</p>
                    <p className="text-sm text-gray-500">From students</p>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-center">
                  <Button 
                    onClick={() => navigate('/professor-rating', { state: { professorName: professor.professor_name } })}
                    className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    + Add Your Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Reviews Section */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-6">
              <BookOpen className="w-6 h-6 text-primary" />
              Student Reviews ({reviews.length})
            </h2>
            
            {reviews.length === 0 ? (
              <Card className="text-center p-6">
                <p className="text-gray-600">No reviews yet. Be the first to review this professor!</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-gray-400" />
                            <p className="text-gray-600">Anonymous Student</p>
                          </div>
                          <p className="text-primary font-medium">{review.course}</p>
                        </div>
                        <div className="flex gap-1">
                          {Array(5).fill(0).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 text-lg leading-relaxed">
                        {review.review}
                      </p>
                      <div className="mt-4 flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(review.created_at).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfessorProfilePage;
