import { Navbar } from "@/components/Navbar";
import { ProjectGrid } from "@/components/ProjectGrid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Connect, Collaborate, Create
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Find the perfect collaborator for your college projects
          </p>
          
          <div className="flex gap-2 max-w-md mx-auto">
            <Input
              placeholder="Search projects or skills..."
              className="flex-1"
            />
            <Button>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Latest Projects
          </h2>
          <ProjectGrid />
        </div>
      </main>
    </div>
  );
};

export default Index;