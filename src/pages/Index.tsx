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
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Campus Connect
            </h1>
            <GraduationCap className="w-12 h-12 text-primary animate-bounce" />
          </div>
          
          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            Connect with talented students, collaborate on amazing projects, and build your portfolio together.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <Users className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Find Collaborators</h3>
              <p className="text-gray-600 text-sm">Connect with skilled students who share your interests</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <Sparkles className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Share Projects</h3>
              <p className="text-gray-600 text-sm">Post your project ideas and find the perfect team</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <MessageSquare className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Collaborate</h3>
              <p className="text-gray-600 text-sm">Work together seamlessly with built-in tools</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-12">
            <div className="flex-1 relative">
              <Input
                placeholder="Search projects or skills..."
                className="pl-10 h-12 text-lg shadow-sm"
              />
              <Search className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" />
            </div>
            <Button size="lg" className="h-12 text-lg shadow-sm">
              Find Projects
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto mb-16">
            {['Design', 'Development', 'Research', 'Marketing', 'Writing', 'Data Science'].map((category) => (
              <Button
                key={category}
                variant="outline"
                className="bg-white hover:bg-blue-50 transition-colors"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900">
              Latest Projects
            </h2>
            <Button variant="outline">
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