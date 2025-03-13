import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, BookOpenCheck, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

interface ProfessorSearchBarProps {
  onSearch: (query: string) => void;
  onAddRating: () => void;
}

export const ProfessorSearchBar = ({ onSearch, onAddRating }: ProfessorSearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto text-center mb-8 md:mb-12"
    >
      <div className="flex flex-col md:flex-row items-center justify-center gap-3 mb-6">
        <GraduationCap className="w-16 h-16 text-primary animate-bounce" />
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mt-2 md:mt-0">Find Your Professor</h1>
      </div>
      <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8 px-4">Search for professors and share your experience</p>
      
      {/* Search Bar */}
      <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto group px-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search for a professor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-12 md:h-14 pl-12 pr-20 text-base md:text-lg rounded-full shadow-lg focus:ring-2 focus:ring-primary/50 transition-all"
          />
          <Search className="absolute left-4 top-3.5 md:top-4 h-5 w-5 md:h-6 md:w-6 text-gray-400 group-focus-within:text-primary transition-colors" />
          <Button 
            type="submit"
            size="sm"
            className="absolute right-2 top-1.5 md:top-2 rounded-full px-4 md:px-6"
          >
            Search
          </Button>
        </div>
      </form>

      {/* Quick Action Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={onAddRating}
          className="mt-6 bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          size="lg"
        >
          <BookOpenCheck className="mr-2 h-5 w-5" />
          Add New Professor Rating
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default ProfessorSearchBar;
