import React, { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { ProjectGrid } from "@/components/ProjectGrid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Sparkles, GraduationCap, Users, MessageSquare, Globe } from "lucide-react";
import { PortfolioPage } from "@/components/portfolio/PortfolioPage";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingProjectGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} className="space-y-4 p-6 border rounded-lg bg-white/50">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-20 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>
    ))}
  </div>
);

const LoadingPortfolio = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-48" />
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-40 w-full" />
      ))}
    </div>
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      
      {/* Coming Soon Section - Hidden */}
      <div className="container mx-auto px-4 py-8 md:py-16 text-center animate-fadeIn hidden">
        <div className="max-w-3xl mx-auto space-y-6 md:space-y-8">
          <div className="flex items-center justify-center gap-2 md:gap-4">
            <Globe className="w-8 h-8 md:w-16 md:h-16 text-primary animate-pulse" />
            <h1 className="text-3xl md:text-6xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              Campus Connect
            </h1>
            <GraduationCap className="w-8 h-8 md:w-16 md:h-16 text-primary animate-bounce" />
          </div>
          
          <div className="space-y-4 md:space-y-6">
            <h2 className="text-2xl md:text-5xl font-bold text-gray-700">
              Coming Soon
            </h2>
            <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Your platform for connecting with fellow students, collaborating on projects, 
              and building your academic portfolio together.
            </p>
          </div>

          <div className="pt-4 md:pt-8">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white px-6 md:px-8 py-4 md:py-6 text-base md:text-lg"
            >
              Get Notified
            </Button>
          </div>
        </div>
      </div>

      {/* Main Site Content - Visible */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Campus Connect
          </h1>
          <GraduationCap className="w-8 h-8 md:w-12 md:h-12 text-primary animate-bounce" />
        </div>
        
        <p className="text-lg md:text-xl text-gray-600 mb-12 leading-relaxed px-4 md:px-0">
          Connect with talented students, collaborate on amazing projects, and build your portfolio together.
        </p>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12 px-4 md:px-0">
          <div className="p-4 md:p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <Users className="w-6 h-6 md:w-8 md:h-8 text-primary mx-auto mb-3 md:mb-4" />
            <h3 className="font-semibold text-base md:text-lg mb-2">Find Collaborators</h3>
            <p className="text-gray-600 text-xs md:text-sm">Connect with skilled students who share your interests</p>
          </div>
          <div className="p-4 md:p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-primary mx-auto mb-3 md:mb-4" />
            <h3 className="font-semibold text-base md:text-lg mb-2">Share Projects</h3>
            <p className="text-gray-600 text-xs md:text-sm">Post your project ideas and find the perfect team</p>
          </div>
          <div className="p-4 md:p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <MessageSquare className="w-6 h-6 md:w-8 md:h-8 text-primary mx-auto mb-3 md:mb-4" />
            <h3 className="font-semibold text-base md:text-lg mb-2">Collaborate</h3>
            <p className="text-gray-600 text-xs md:text-sm">Connect directly with fellow students to collaborate on projects together</p>
          </div>
        </div>
        
        {/* Search Section */}
        <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-12 px-4 md:px-0">
          <div className="flex-1 relative">
            <Input
              placeholder="Search projects or skills..."
              className="pl-10 h-10 md:h-12 text-base md:text-lg shadow-sm"
            />
            <Search className="w-4 h-4 md:w-5 md:h-5 absolute left-3 top-3 md:top-3.5 text-gray-400" />
          </div>
          <Button size="lg" className="h-10 md:h-12 text-base md:text-lg shadow-sm">
            Find Projects
          </Button>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 max-w-2xl mx-auto mb-16 px-4 md:px-0">
          {['Design', 'Development', 'Research', 'Marketing', 'Writing', 'Data Science'].map((category) => (
            <Button
              key={category}
              variant="outline"
              className="text-sm md:text-base bg-white hover:bg-blue-50 transition-colors"
            >
              {category}
            </Button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
