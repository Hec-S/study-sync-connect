import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StarIcon } from "lucide-react";
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
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Professor Rating</h1>
        
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Rate a Professor</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="professorName">Professor Name</Label>
                  <Input
                    id="professorName"
                    placeholder="Enter professor's name"
                    value={professorName}
                    onChange={(e) => setProfessorName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="course">Course</Label>
                  <Input
                    id="course"
                    placeholder="Enter course name/code"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Rating</Label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Button
                        key={star}
                        type="button"
                        variant={rating >= star ? "default" : "outline"}
                        size="icon"
                        onClick={() => setRating(star)}
                        className="h-8 w-8"
                      >
                        <StarIcon className="h-4 w-4" />
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="review">Review</Label>
                  <Textarea
                    id="review"
                    placeholder="Write your review here..."
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    rows={4}
                  />
                </div>

                <Button type="submit" className="w-full">
                  Submit Rating
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Recent Ratings</h2>
            <div className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">Dr. Smith</h3>
                      <p className="text-sm text-gray-500">Computer Science 101</p>
                    </div>
                    <div className="flex">
                      {Array(4).fill(0).map((_, i) => (
                        <StarIcon key={i} className="h-4 w-4 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm">
                    Great professor! Very knowledgeable and makes complex topics easy to understand.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">Prof. Johnson</h3>
                      <p className="text-sm text-gray-500">Mathematics 201</p>
                    </div>
                    <div className="flex">
                      {Array(5).fill(0).map((_, i) => (
                        <StarIcon key={i} className="h-4 w-4 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm">
                    Excellent teaching style and very helpful during office hours.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
