import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Loader2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { ProfessorCard } from "./ProfessorCard";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem } from "@/components/ui/pagination";
import { motion, AnimatePresence } from "framer-motion";
import type { ProfessorRating } from "@/integrations/supabase/types";

// Skeleton loader for professor cards
const ProfessorCardSkeleton = () => (
  <div className="rounded-lg border-2 border-gray-100 overflow-hidden h-full animate-pulse">
    <div className="bg-gray-100 p-4 flex items-center gap-3">
      <div className="bg-gray-200 rounded-full h-12 w-12"></div>
      <div className="flex-1">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="h-6 w-6 bg-gray-200 rounded"></div>
    </div>
    <div className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-4 w-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
      <div className="flex gap-1 mb-3">
        {Array(5).fill(0).map((_, i) => (
          <div key={i} className="h-5 w-5 bg-gray-200 rounded-full"></div>
        ))}
        <div className="h-5 bg-gray-200 rounded w-16 ml-2"></div>
      </div>
      <div className="flex justify-between mt-3">
        <div className="h-6 bg-gray-200 rounded w-20"></div>
        <div className="h-6 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  </div>
);

interface ProfessorGridProps {
  professors: ProfessorRating[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const ProfessorGrid = ({
  professors,
  loading,
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  onPageChange
}: ProfessorGridProps) => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="max-w-6xl mx-auto mt-6 px-4"
    >
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {Array(6).fill(0).map((_, index) => (
            <ProfessorCardSkeleton key={index} />
          ))}
        </div>
      ) : professors.length === 0 ? (
        <Card className="p-6 text-center">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-8">
              <div className="bg-gray-100 rounded-full p-4 mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No professors found</h3>
              <p className="text-gray-600 max-w-md">
                Try adjusting your filters or search for a different professor.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <AnimatePresence>
              {professors.map((professor, index) => (
                <motion.div
                  key={professor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <ProfessorCard 
                    professor={professor}
                    onClick={() => navigate(`/professor/${professor.id}`)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <>
              <div className="mt-8 flex justify-center">
                <Pagination>
                  <PaginationContent className="flex flex-wrap justify-center gap-1">
                    <PaginationItem className="hidden sm:block">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => onPageChange(1)}
                        disabled={currentPage === 1}
                        className="h-9 w-9"
                      >
                        <ChevronsLeft className="h-4 w-4" />
                      </Button>
                    </PaginationItem>
                    <PaginationItem>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="h-9 w-9"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                    </PaginationItem>
                    
                    {/* Page Numbers - Desktop */}
                    <div className="hidden sm:flex">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          // If 5 or fewer pages, show all
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          // If near the start
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          // If near the end
                          pageNum = totalPages - 4 + i;
                        } else {
                          // If in the middle
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <PaginationItem key={pageNum}>
                            <Button
                              variant={currentPage === pageNum ? "default" : "outline"}
                              onClick={() => onPageChange(pageNum)}
                              className="h-9 w-9"
                            >
                              {pageNum}
                            </Button>
                          </PaginationItem>
                        );
                      })}
                      
                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <>
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                          <PaginationItem>
                            <Button
                              variant="outline"
                              onClick={() => onPageChange(totalPages)}
                              className="h-9 w-9"
                            >
                              {totalPages}
                            </Button>
                          </PaginationItem>
                        </>
                      )}
                    </div>
                    
                    {/* Current Page Indicator - Mobile */}
                    <div className="flex sm:hidden items-center px-3">
                      <span className="text-sm font-medium">
                        Page {currentPage} of {totalPages}
                      </span>
                    </div>
                    
                    <PaginationItem>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="h-9 w-9"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </PaginationItem>
                    <PaginationItem className="hidden sm:block">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => onPageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        className="h-9 w-9"
                      >
                        <ChevronsRight className="h-4 w-4" />
                      </Button>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
              
              <div className="mt-2 text-center text-sm text-gray-500">
                Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} professors
              </div>
            </>
          )}
        </>
      )}
    </motion.div>
  );
};

export default ProfessorGrid;
