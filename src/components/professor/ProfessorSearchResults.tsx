import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ProfessorCard } from "./ProfessorCard";
import { motion, AnimatePresence } from "framer-motion";
import type { ProfessorRating } from "@/integrations/supabase/types";

interface ProfessorSearchResultsProps {
  results: ProfessorRating[];
  onClear: () => void;
  onSelectProfessor: (professor: ProfessorRating) => void;
}

export const ProfessorSearchResults = ({ 
  results, 
  onClear, 
  onSelectProfessor 
}: ProfessorSearchResultsProps) => {
  if (results.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-6xl mx-auto mt-6 px-4"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Search Results</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClear}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <AnimatePresence>
          {results.map((professor, index) => (
            <motion.div
              key={professor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <ProfessorCard 
                professor={professor}
                onClick={() => onSelectProfessor(professor)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ProfessorSearchResults;
