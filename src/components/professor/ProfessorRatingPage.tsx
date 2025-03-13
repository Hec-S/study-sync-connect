import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { searchProfessors, getAllProfessors } from "@/services/professorRatings";
import { AnimatePresence } from "framer-motion";
import type { ProfessorRating } from "@/integrations/supabase/types";

// Import modular components
import { BackToTop } from "@/components/ui/back-to-top";
import { ProfessorSearchBar } from "./ProfessorSearchBar";
import { ProfessorSearchResults } from "./ProfessorSearchResults";
import { ProfessorFilters } from "./ProfessorFilters";
import { ProfessorGrid } from "./ProfessorGrid";
import { ProfessorRatingForm } from "./ProfessorRatingForm";
import { RecentReviewsList } from "./RecentReviewsList";

export const ProfessorRatingPage = () => {
  const topRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [searchResults, setSearchResults] = useState<ProfessorRating[]>([]);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [professorName, setProfessorName] = useState("");
  const [loading, setLoading] = useState(false);
  const [displayedProfessors, setDisplayedProfessors] = useState<ProfessorRating[]>([]);
  const [sortOption, setSortOption] = useState("name-asc");
  const [filterMajor, setFilterMajor] = useState("all");
  const [filterSchool, setFilterSchool] = useState("all");
  const [uniqueMajors, setUniqueMajors] = useState<string[]>([]);
  const [uniqueSchools, setUniqueSchools] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    if (!user) {
      toast.error("Please sign in to access professor ratings");
      navigate("/");
    } else {
      // Check if we were passed a professor name from another component
      const state = location.state as { professorName?: string } | null;
      if (state?.professorName) {
        setProfessorName(state.professorName);
        setShowRatingForm(true);
      }
      
      // Fetch all professors
      fetchAllProfessors();
      
      // Fetch filter options
      fetchFilterOptions();
    }
  }, [user, navigate, location.state]);
  
  // Fetch professors when page, sort, or filters change
  useEffect(() => {
    if (user) {
      fetchAllProfessors();
    }
  }, [currentPage, sortOption, filterMajor, filterSchool]);
  
  const fetchAllProfessors = async () => {
    try {
      setLoading(true);
      const result = await getAllProfessors(currentPage, pageSize, sortOption, filterMajor, filterSchool);
      setDisplayedProfessors(result.professors);
      setTotalCount(result.totalCount);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error("Error fetching professors:", error);
      toast.error("Failed to load professors");
    } finally {
      setLoading(false);
    }
  };
  
  // Extract unique majors and schools for filtering
  const fetchFilterOptions = async () => {
    try {
      // Get all professors without pagination to extract filters
      const result = await getAllProfessors(1, 1000);
      const professors = result.professors;
      
      if (professors.length > 0) {
        const majors = [...new Set(professors.map(prof => prof.major))].filter(Boolean).sort();
        const schools = [...new Set(professors.map(prof => prof.school))].filter(Boolean).sort();
        
        setUniqueMajors(majors);
        setUniqueSchools(schools);
      }
    } catch (error) {
      console.error("Error fetching filters:", error);
    }
  };
  
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      // If search is empty, show all professors
      setSearchResults([]);
      return;
    }
    
    setLoading(true);
    try {
      const results = await searchProfessors(query);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching professors:", error);
      toast.error("Failed to search professors");
    } finally {
      setLoading(false);
    }
  };
  
  const handleSelectProfessor = (professor: ProfessorRating) => {
    setProfessorName(professor.professor_name);
    setShowRatingForm(true);
    setSearchResults([]);
  };
  
  const handleClearSearch = () => {
    setSearchResults([]);
  };
  
  const handleAddRating = () => {
    setShowRatingForm(true);
    // Scroll to top to show the form
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleRatingSuccess = () => {
    setShowRatingForm(false);
    setProfessorName("");
    // Refresh the professors list
    fetchAllProfessors();
  };
  
  const handleResetFilters = () => {
    setFilterMajor("all");
    setFilterSchool("all");
  };

  // If user is not authenticated, show login required screen
  if (!user) {
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

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto py-8 px-4">
          <div ref={topRef}></div>
          
          {/* Hero Section with Search */}
          <ProfessorSearchBar 
            onSearch={handleSearch}
            onAddRating={handleAddRating}
          />
          
          {/* Rating Form */}
          <AnimatePresence>
            {showRatingForm && (
              <ProfessorRatingForm 
                initialProfessorName={professorName}
                onClose={() => setShowRatingForm(false)}
                onSuccess={handleRatingSuccess}
                user={user}
              />
            )}
          </AnimatePresence>
          
          {/* Search Results */}
          <AnimatePresence>
            {searchResults.length > 0 && (
              <ProfessorSearchResults 
                results={searchResults}
                onClear={handleClearSearch}
                onSelectProfessor={handleSelectProfessor}
              />
            )}
          </AnimatePresence>
          
          {/* Filters */}
          {searchResults.length === 0 && (
            <ProfessorFilters 
              totalCount={totalCount}
              sortOption={sortOption}
              filterMajor={filterMajor}
              filterSchool={filterSchool}
              uniqueMajors={uniqueMajors}
              uniqueSchools={uniqueSchools}
              onSortChange={setSortOption}
              onMajorChange={setFilterMajor}
              onSchoolChange={setFilterSchool}
              onResetFilters={handleResetFilters}
            />
          )}
          
          {/* All Professors Grid */}
          {searchResults.length === 0 && (
            <ProfessorGrid 
              professors={displayedProfessors}
              loading={loading}
              currentPage={currentPage}
              totalPages={totalPages}
              totalCount={totalCount}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          )}

          {/* Recent Reviews */}
          <RecentReviewsList />
          
          {/* Back to Top Button */}
          <BackToTop targetRef={topRef} />
        </div>
      </div>
    </>
  );
};

export default ProfessorRatingPage;
