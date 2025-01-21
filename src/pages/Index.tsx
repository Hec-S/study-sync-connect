import { Navbar } from "@/components/Navbar";
import { ProjectGrid } from "@/components/ProjectGrid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Sparkles } from "lucide-react";

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
            <Sparkles className="w-8 h-8 text-primary animate-pulse" />
          </div>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Connect with talented students, collaborate on amazing projects, and build your portfolio together.
          </p>
          
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

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto mb-16">
            {['Design', 'Development', 'Research', 'Marketing'].map((category) => (
              <div
                key={category}
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 cursor-pointer"
              >
                <p className="font-medium text-gray-900">{category}</p>
                <p className="text-sm text-gray-500">Projects</p>
              </div>
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