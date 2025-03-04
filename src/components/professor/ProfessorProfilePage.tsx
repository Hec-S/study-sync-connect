import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, BookOpen, GraduationCap, ThumbsUp, ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const ProfessorProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [professor, setProfessor] = useState<{
    id: string;
    professor_name: string;
    major: string | null;
    school: string | null;
    difficulty: number | null;
    num_ratings: number | null;
    average_rating: number | null;
    created_at?: string;
    updated_at?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [course, setCourse] = useState("");
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  
  // TEMPORARY: For testing purposes, bypass authentication check
  const testMode = true; // Set to false in production
  
  useEffect(() => {
    if (!user && !testMode) {
      toast.error("Please sign in to view professor profiles");
      navigate("/");
      return;
    }
    
    fetchProfessor();
  }, [id, user, navigate]);

  const fetchProfessor = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('professor_ratings')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        console.error('Error fetching professor:', error);
        toast.error('Failed to fetch professor details');
        navigate('/professor-rating');
        return;
      }
      
      if (!data) {
        toast.error('Professor not found');
        navigate('/professor-rating');
        return;
      }
      
      setProfessor(data);
    } catch (error) {
      console.error('Error fetching professor:', error);
      toast.error('Failed to fetch professor details');
      navigate('/professor-rating');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!professor) return;
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    
    if (!course.trim()) {
      toast.error('Please enter a course');
      return;
    }
    
    // In a real application, you would save the review to the database
    // and update the professor's ratings
    console.log({ 
      professorId: professor.id,
      professorName: professor.professor_name,
      course, 
      rating, 
      review 
    });
    
    // Show success message
    toast.success('Review submitted successfully');
    
    // Reset form
    setCourse("");
    setRating(0);
    setReview("");
    setShowReviewForm(false);
    
    // Refresh professor data
    fetchProfessor();
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
          <p className="text-xl text-gray-600">Loading professor details...</p>
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
                Return to Professor Ratings
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
          {/* Back Button */}
          <Button
            onClick={() => navigate("/professor-rating")}
            variant="ghost"
            className="mb-6 pl-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Search
          </Button>
          
          {/* Professor Header */}
          <div className="max-w-4xl mx-auto text-center mb-10">
            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl p-8 shadow-md">
              <div className="bg-white rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center shadow-lg">
                <GraduationCap className="w-14 h-14 text-primary" />
              </div>
              <h1 className="text-5xl font-bold text-gray-800 mb-3">{professor.professor_name}</h1>
              {(professor.school || professor.major) && (
                <p className="text-xl text-primary font-medium">
                  {professor.school} {professor.major && `• ${professor.major}`}
                </p>
              )}
            </div>
          </div>
          
          {/* Professor Stats */}
          <div className="max-w-4xl mx-auto mb-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 py-3">
                  <h3 className="text-center text-white font-medium">Overall Rating</h3>
                </div>
                <CardContent className="pt-6 pb-8 flex flex-col items-center">
                  <div className="flex justify-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`h-7 w-7 ${star <= Math.round(professor.average_rating || 0) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <p className="font-bold text-4xl text-blue-600">
                    {professor.average_rating ? professor.average_rating.toFixed(1) : 'N/A'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">out of 5.0</p>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all">
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 py-3">
                  <h3 className="text-center text-white font-medium">Difficulty</h3>
                </div>
                <CardContent className="pt-6 pb-8 flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center mb-3">
                    <p className="font-bold text-4xl text-indigo-600">
                      {professor.difficulty ? professor.difficulty.toFixed(1) : 'N/A'}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">out of 5.0</p>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 py-3">
                  <h3 className="text-center text-white font-medium">Number of Ratings</h3>
                </div>
                <CardContent className="pt-6 pb-8 flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                    <p className="font-bold text-4xl text-purple-600">
                      {professor.num_ratings || '0'}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">total ratings</p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Add Review Button */}
          <div className="max-w-4xl mx-auto text-center mb-12">
            <Button
              onClick={() => setShowReviewForm(true)}
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-md hover:shadow-lg transition-all px-8 py-6 text-lg rounded-full"
            >
              <Star className="h-5 w-5 mr-2 fill-current" /> Rate This Professor
            </Button>
          </div>
          
          {/* Review Form */}
          {showReviewForm && (
            <div className="max-w-2xl mx-auto mb-12">
              <Card className="border-0 shadow-xl overflow-hidden">
                <CardHeader className="space-y-1 bg-gradient-to-r from-blue-500 to-indigo-500 py-6">
                  <CardTitle className="text-2xl text-center text-white flex items-center justify-center gap-2">
                    <BookOpen className="w-6 h-6" />
                    Rate {professor.professor_name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-8 px-8">
                  <form onSubmit={handleSubmitReview} className="space-y-6">
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

                    <div className="space-y-2 mb-8">
                      <Label className="text-lg">Rating</Label>
                      <div className="flex gap-3 justify-center p-6 bg-blue-50 rounded-xl">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Button
                            key={star}
                            type="button"
                            variant="ghost"
                            size="lg"
                            onClick={() => setRating(star)}
                            className={`h-16 w-16 rounded-full transition-all duration-300 ${
                              rating >= star 
                                ? "bg-yellow-400 hover:bg-yellow-500 text-white" 
                                : "bg-white hover:bg-yellow-100 text-gray-400 hover:text-yellow-500 border-2 border-gray-200"
                            }`}
                          >
                            <Star className={`h-8 w-8 ${rating >= star ? "fill-current" : ""}`} />
                          </Button>
                        ))}
                      </div>
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

                    <div className="flex gap-4 mt-8">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="lg" 
                        className="w-full text-lg h-14 rounded-full"
                        onClick={() => setShowReviewForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        size="lg" 
                        className="w-full text-lg h-14 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 rounded-full"
                      >
                        Submit Rating
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
          
        </div>
      </div>
    </>
  );
};

export default ProfessorProfilePage;
