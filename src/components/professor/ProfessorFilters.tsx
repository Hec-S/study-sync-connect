import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Filter, ArrowUpDown, School } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";

interface ProfessorFiltersProps {
  totalCount: number;
  sortOption: string;
  filterMajor: string;
  filterSchool: string;
  uniqueMajors: string[];
  uniqueSchools: string[];
  onSortChange: (value: string) => void;
  onMajorChange: (value: string) => void;
  onSchoolChange: (value: string) => void;
  onResetFilters: () => void;
}

export const ProfessorFilters = ({
  totalCount,
  sortOption,
  filterMajor,
  filterSchool,
  uniqueMajors,
  uniqueSchools,
  onSortChange,
  onMajorChange,
  onSchoolChange,
  onResetFilters
}: ProfessorFiltersProps) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="max-w-6xl mx-auto mt-8 mb-4 px-4"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
          <School className="w-5 h-5 md:w-6 md:h-6 text-primary" />
          All Professors
          <span className="text-sm font-normal text-gray-500 ml-2">({totalCount})</span>
        </h2>
        
        <div className="flex flex-wrap gap-2 items-center">
          {/* Mobile Filter Sheet */}
          <div className="block md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[80vh] rounded-t-xl">
                <SheetHeader className="text-left">
                  <SheetTitle>Filter Professors</SheetTitle>
                  <SheetDescription>
                    Narrow down professors by major and school
                  </SheetDescription>
                </SheetHeader>
                <div className="py-6 space-y-6">
                  <div>
                    <Label htmlFor="mobile-major-filter" className="text-base font-medium block mb-2">Major</Label>
                    <Select value={filterMajor} onValueChange={onMajorChange}>
                      <SelectTrigger id="mobile-major-filter" className="w-full">
                        <SelectValue placeholder="Filter by major" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Majors</SelectItem>
                        {uniqueMajors.map(major => (
                          <SelectItem key={major} value={major}>{major}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="mobile-school-filter" className="text-base font-medium block mb-2">School</Label>
                    <Select value={filterSchool} onValueChange={onSchoolChange}>
                      <SelectTrigger id="mobile-school-filter" className="w-full">
                        <SelectValue placeholder="Filter by school" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Schools</SelectItem>
                        {uniqueSchools.map(school => (
                          <SelectItem key={school} value={school}>{school}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="mobile-sort" className="text-base font-medium block mb-2">Sort By</Label>
                    <Select value={sortOption} onValueChange={onSortChange}>
                      <SelectTrigger id="mobile-sort" className="w-full">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                        <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                        <SelectItem value="rating-high">Highest Rated</SelectItem>
                        <SelectItem value="rating-low">Lowest Rated</SelectItem>
                        <SelectItem value="difficulty-high">Most Difficult</SelectItem>
                        <SelectItem value="difficulty-low">Least Difficult</SelectItem>
                        <SelectItem value="reviews">Most Reviews</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={onResetFilters}
                  >
                    Reset Filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          {/* Desktop Filters */}
          <div className="hidden md:block">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>
          
          <div className="flex items-center gap-1">
            <ArrowUpDown className="h-4 w-4 text-gray-500" />
            <Select value={sortOption} onValueChange={onSortChange}>
              <SelectTrigger className="w-[180px] h-9">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                <SelectItem value="rating-high">Highest Rated</SelectItem>
                <SelectItem value="rating-low">Lowest Rated</SelectItem>
                <SelectItem value="difficulty-high">Most Difficult</SelectItem>
                <SelectItem value="difficulty-low">Least Difficult</SelectItem>
                <SelectItem value="reviews">Most Reviews</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {/* Desktop Filter Options */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <Label htmlFor="major-filter" className="mb-1 block">Major</Label>
                  <Select value={filterMajor} onValueChange={onMajorChange}>
                    <SelectTrigger id="major-filter">
                      <SelectValue placeholder="Filter by major" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Majors</SelectItem>
                      {uniqueMajors.map(major => (
                        <SelectItem key={major} value={major}>{major}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex-1 min-w-[200px]">
                  <Label htmlFor="school-filter" className="mb-1 block">School</Label>
                  <Select value={filterSchool} onValueChange={onSchoolChange}>
                    <SelectTrigger id="school-filter">
                      <SelectValue placeholder="Filter by school" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Schools</SelectItem>
                      {uniqueSchools.map(school => (
                        <SelectItem key={school} value={school}>{school}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end">
                  <Button 
                    variant="outline" 
                    onClick={onResetFilters}
                  >
                    Reset Filters
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProfessorFilters;
