
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, BookOpen, GraduationCap, Search, LockKeyhole, User } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const ProfessorRatingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Array<{
    id: string;
    professor_name: string;
  }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [professorName, setProfessorName] = useState("");
  const [course, setCourse] = useState("");
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [searchResults, setSearchResults] = useState<Array<{
    id: string;
    professor_name: string;
    major: string | null;
    school: string | null;
    difficulty: number | null;
    num_ratings: number | null;
    average_rating: number | null;
    created_at: string;
    updated_at: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(false);
  const [isViewingAll, setIsViewingAll] = useState(false);
  const pageSize = 10; // Number of results per page
  
  // TEMPORARY: For testing purposes, bypass authentication check
  const testMode = true; // Set to false in production
  
  useEffect(() => {
    if (!user && !testMode) {
      toast.error("Please sign in to access professor ratings");
      navigate("/");
    }
  }, [user, navigate]);

  if (!user && !testMode) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
          <Card className="max-w-md mx-auto text-center p-6">
            <CardHeader>
              <LockKeyhole className="w-12 h-12 text-primary mx-auto mb-4" />
              <CardTitle className="text-2xl">Authentication Required</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Please sign in or create an account to access professor ratings.
              </p>
              <Button onClick={() => navigate("/")} size="lg" className="w-full">
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  // Function to fetch professor name suggestions
  const fetchSuggestions = async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('professor_ratings')
        .select('id, professor_name')
        .ilike('professor_name', `%${query}%`)
        .order('professor_name')
        .limit(5);
        
      if (error) {
        console.error('Error fetching suggestions:', error);
        return;
      }
      
      setSuggestions(data || []);
      console.log('Suggestions:', data); // Debug log
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  // Debounced function to fetch suggestions
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSuggestions(searchQuery);
    }, 300); // 300ms delay
    
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Function to search professors by name
  const searchProfessors = async (query: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('professor_ratings')
        .select('*')
        .ilike('professor_name', `%${query}%`)
        .order('average_rating', { ascending: false });
        
      if (error) {
        console.error('Error searching professors:', error);
        toast.error('Failed to search professors');
        return [];
      }
      
      // Return the data or empty array
      return data || [];
    } catch (error) {
      console.error('Error searching professors:', error);
      toast.error('Failed to search professors');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch all professors with pagination
  const fetchAllProfessors = async (page: number = 1) => {
    setIsLoading(true);
    try {
      // Calculate range for pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      
      const { data, error, count } = await supabase
        .from('professor_ratings')
        .select('*', { count: 'exact' })
        .order('average_rating', { ascending: false })
        .range(from, to);
        
      if (error) {
        console.error('Error fetching professors:', error);
        toast.error('Failed to fetch professors');
        return [];
      }
      
      // Check if there are more pages
      if (count) {
        setHasMorePages(count > (page * pageSize));
      } else {
        setHasMorePages(data && data.length === pageSize);
      }
      
      // Return the data or empty array
      return data || [];
    } catch (error) {
      console.error('Error fetching professors:', error);
      toast.error('Failed to fetch professors');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ professorName, course, rating, review });
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsViewingAll(false);
    setShowSuggestions(false);
    const results = await searchProfessors(searchQuery);
    setSearchResults(results);
  };

  // Handle suggestion selection
  const handleSelectSuggestion = async (professorName: string) => {
    setSearchQuery(professorName);
    setShowSuggestions(false);
    
    const results = await searchProfessors(professorName);
    setSearchResults(results);
    setIsViewingAll(false);
  };

  // Handle View All button click
  const handleViewAll = async () => {
    setIsViewingAll(true);
    setCurrentPage(1);
    const results = await fetchAllProfessors(1);
    setSearchResults(results);
  };

  // Handle pagination
  const handleNextPage = async () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    const results = await fetchAllProfessors(nextPage);
    setSearchResults(results);
  };

  const handlePrevPage = async () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      const results = await fetchAllProfessors(prevPage);
      setSearchResults(results);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto py-8 px-4">
          {/* Hero Section with Search */}
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <GraduationCap className="w-16 h-16 text-primary animate-bounce" />
              <h1 className="text-5xl font-bold text-gray-800">Find Your Professor</h1>
            </div>
            <p className="text-xl text-gray-600 mb-8">Search for professors and share your experience</p>
            
            {/* Search Bar with Suggestions */}
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto group">
              <div className="relative">
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search for a professor..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="h-14 pl-12 pr-20 text-lg rounded-full shadow-lg focus:ring-2 focus:ring-primary/50 transition-all"
                />
                <Search className="absolute left-4 top-4 h-6 w-6 text-gray-400 group-focus-within:text-primary transition-colors" />
                <Button 
                  type="submit"
                  size="lg"
                  className="absolute right-2 top-2 rounded-full px-6"
                >
                  Search
                </Button>
                
                {/* Suggestions Dropdown */}
                {showSuggestions && searchQuery.trim() !== "" && (
                  <div 
                    ref={suggestionsRef}
                    className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200"
                  >
                    {suggestions.length > 0 ? (
                      <ul className="py-2">
                        {suggestions.map((suggestion) => (
                          <li 
                            key={suggestion.id}
                            className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center gap-2 transition-colors"
                            onClick={() => handleSelectSuggestion(suggestion.professor_name)}
                          >
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-800">{suggestion.professor_name}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="py-3 px-4 text-gray-500 text-center">
                        No matching professors found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </form>

            {/* View All Button */}
            <Button
              onClick={handleViewAll}
              className="mt-4 bg-blue-50 text-primary hover:bg-blue-100 transition-colors"
            >
              View All Professors
            </Button>
          </div>

          {/* Search Results */}
          {isLoading ? (
            <div className="text-center py-8 max-w-2xl mx-auto">
              <p className="text-gray-600">Loading...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="max-w-2xl mx-auto mt-8 mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {isViewingAll ? "All Professors" : `Search Results for "${searchQuery}"`}
              </h2>
              <div className="space-y-4">
                {searchResults.map((professor, index) => (
                  <Card key={professor.id || index} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 
                            className="text-xl font-semibold text-gray-800 hover:text-primary cursor-pointer"
                            onClick={() => navigate(`/professor/${professor.id}`)}
                          >
                            {professor.professor_name}
                          </h3>
                          {(professor.school || professor.major) && (
                            <p className="text-primary font-medium">
                              {professor.school} {professor.major && `• ${professor.major}`}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          {Array(Math.round(professor.average_rating || 0))
                            .fill(0)
                            .map((_, i) => (
                              <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                            ))}
                        </div>
                      </div>
                      
                      {(professor.average_rating || professor.difficulty) && (
                        <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                          {professor.average_rating !== null && (
                            <div>
                              <p className="text-gray-500">Rating</p>
                              <p className="font-medium">{professor.average_rating.toFixed(1)}/5</p>
                            </div>
                          )}
                          {professor.difficulty !== null && (
                            <div>
                              <p className="text-gray-500">Difficulty</p>
                              <p className="font-medium">{professor.difficulty.toFixed(1)}/5</p>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <Button 
                        onClick={() => {
                          setProfessorName(professor.professor_name);
                          setShowRatingForm(true);
                        }}
                        className="mt-4 text-sm"
                      >
                        Rate this professor
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination Controls - Only show when viewing all */}
              {isViewingAll && (
                <div className="flex justify-between items-center mt-8">
                  <Button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    variant="outline"
                    className="px-4"
                  >
                    Previous
                  </Button>
                  
                  <span className="text-gray-600">
                    Page {currentPage}
                  </span>
                  
                  <Button
                    onClick={handleNextPage}
                    disabled={!hasMorePages}
                    variant="outline"
                    className="px-4"
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          ) : searchQuery && !isViewingAll && !isLoading ? (
            <div className="text-center py-8 max-w-2xl mx-auto">
              <p className="text-gray-600">No professors found matching "{searchQuery}"</p>
              <Button 
                onClick={() => {
                  setProfessorName(searchQuery);
                  setShowRatingForm(true);
                }}
                className="mt-4"
              >
                Add this professor
              </Button>
            </div>
          ) : null}

          {/* Rating Form */}
          {showRatingForm && (
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

                    <div className="flex gap-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="lg" 
                        className="w-full text-lg h-12"
                        onClick={() => setShowRatingForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" size="lg" className="w-full text-lg h-12">
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
