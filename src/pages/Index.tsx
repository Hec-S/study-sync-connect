import { Navbar } from "@/components/Navbar";
import { ProjectGrid } from "@/components/ProjectGrid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Sparkles, GraduationCap, Users, MessageSquare } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fadeIn">
          <div className="flex items-center justify-center gap-2 mb-6">
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Campus Connect
            </h1>
            <GraduationCap className="w-8 h-8 md:w-12 md:h-12 text-primary animate-bounce" />
          </div>
          
          <p className="text-lg md:text-xl text-gray-600 mb-12 leading-relaxed px-4 md:px-0">
            Connect with talented students, collaborate on amazing projects, and build your portfolio together.
          </p>

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
              <p className="text-gray-600 text-xs md:text-sm">Work together seamlessly with built-in tools</p>
            </div>
          </div>
          
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
        </div>

        <div className="mb-12 px-4 md:px-0">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
              Latest Projects
            </h2>
            <Button variant="outline" className="text-sm md:text-base">
              View All
            </Button>
          </div>
          <ProjectGrid />
        </div>
      </main>
    </div>
  );
};

export default Index;