
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, BookOpen, GraduationCap, ThumbsUp } from "lucide-react";
import { Navbar } from "@/components/Navbar";

export const ProfessorRatingPage = () => {
  const [professorName, setProfessorName] = useState("");
  const [course, setCourse] = useState("");
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement rating submission
    console.log({ professorName, course, rating, review });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto py-8 px-4">
          <div className="max-w-4xl mx-auto text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <GraduationCap className="w-12 h-12 text-primary animate-bounce" />
              <h1 className="text-4xl font-bold text-gray-800">Rate Your Professor</h1>
            </div>
            <p className="text-lg text-gray-600">Help other students make informed decisions by sharing your experience</p>
          </div>
          
          <div className="max-w-2xl mx-auto">
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

                  <Button type="submit" size="lg" className="w-full text-lg h-12">
                    Submit Rating
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="mt-12 space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-6">
                <ThumbsUp className="w-6 h-6 text-primary" />
                Recent Reviews
              </h2>
              <div className="space-y-4">
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">Dr. Smith</h3>
                        <p className="text-primary font-medium">Computer Science 101</p>
                      </div>
                      <div className="flex gap-1">
                        {Array(4).fill(0).map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      Great professor! Very knowledgeable and makes complex topics easy to understand.
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">Prof. Johnson</h3>
                        <p className="text-primary font-medium">Mathematics 201</p>
                      </div>
                      <div className="flex gap-1">
                        {Array(5).fill(0).map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      Excellent teaching style and very helpful during office hours.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
