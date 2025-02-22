import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { MarketplaceProjectGrid } from "@/components/marketplace/MarketplaceProjectGrid";
import { MarketplaceProject } from "@/components/marketplace/MarketplacePage";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Search, Sparkles, GraduationCap, Users, MessageSquare } from "lucide-react";
import { SearchResults } from "@/components/search/SearchResults";
import { Database } from "@/integrations/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const searchUsers = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const searchTerm = searchQuery.trim();
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .ilike("full_name", `%${searchTerm}%`)
          .limit(10);

        if (error) throw error;
        setSearchResults(data || []);
      } catch (error) {
        console.error("Search error:", error);
        toast({
          title: "Failed to search users",
          description: "Please try again",
          variant: "destructive"
        });
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimeout = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounceTimeout);
  }, [searchQuery]);

  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['marketplace_projects'],
    queryFn: async () => {
      // First get all projects
      const { data: projects, error: projectsError } = await supabase
        .from('marketplace_projects')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4);

      if (projectsError) throw projectsError;

      // Then get all profiles for the project owners
      const ownerIds = [...new Set((projects || []).map(p => p.owner_id))];
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', ownerIds);

      if (profilesError) throw profilesError;

      // Create a map of owner_id to full_name
      const ownerNames = (profiles || []).reduce((acc, profile) => ({
        ...acc,
        [profile.id]: profile.full_name
      }), {} as Record<string, string | null>);

      // Combine the data
      const projectsWithOwnerNames = (projects || []).map(project => ({
        ...project,
        owner_name: ownerNames[project.owner_id] || null
      }));

      return projectsWithOwnerNames as MarketplaceProject[];
    },
  });
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fadeIn">
          {/* Hero Section */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <h1 className="text-3xl md:text-5xl font-bold text-primary">
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
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowResults(true)}
                className="pl-10 h-10 md:h-12 text-base md:text-lg shadow-sm"
              />
              <Search className="w-4 h-4 md:w-5 md:h-5 absolute left-3 top-3 md:top-3.5 text-primary" />
              {showResults && (searchResults.length > 0 || isSearching) && (
                <div className="absolute top-full mt-1 w-full bg-background border rounded-lg shadow-lg z-50">
                  <SearchResults results={searchResults} isLoading={isSearching} />
                </div>
              )}
            </div>
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
        </div>

        {/* Latest Projects Section */}
        <section className="mb-20 bg-gradient-to-b from-white/50 to-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-8 max-w-[1400px] mx-auto border border-gray-100/50">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12 pb-6 border-b border-gray-100">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h2 className="text-3xl md:text-4xl font-bold text-black">
                  Student Work Hub
                </h2>
              </div>
              <p className="text-lg text-muted-foreground">
                Find projects and collaborate with fellow students
              </p>
            </div>
            <Button 
              onClick={() => navigate('/marketplace')}
              className="bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all duration-300"
              size="lg"
            >
              <Search className="h-5 w-5 mr-2" />
              Find Projects
            </Button>
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-6 w-6 rounded-full bg-primary/20 animate-pulse"></div>
                </div>
              </div>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-16 bg-gray-50/50 rounded-xl border border-gray-100/50">
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">No Projects Found</h3>
              <p className="text-gray-600 text-lg">Be the first to post a project and start collaborating!</p>
            </div>
          ) : (
            <MarketplaceProjectGrid
              projects={projects}
              isGridView={true}
              onUpdate={() => {}}
              currentUser={user}
            />
          )}
        </section>

      </main>
    </div>
  );
};

export default Index;
