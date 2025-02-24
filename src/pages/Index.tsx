
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { MarketplaceProjectGrid } from "@/components/marketplace/MarketplaceProjectGrid";
import { MarketplaceProject } from "@/components/marketplace/MarketplacePage";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Search, Sparkles, GraduationCap, Users, MessageSquare, Brain } from "lucide-react";
import { SearchResults } from "@/components/search/SearchResults";
import { Database } from "@/integrations/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleAssistantClick = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You need to be signed in to access the UTEP Assistant",
        variant: "destructive"
      });
    } else {
      navigate('/utep-assistant');
    }
  };

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

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['marketplace_projects'],
    queryFn: async () => {
      const { data: projects, error: projectsError } = await supabase
        .from('marketplace_projects')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4);
      if (projectsError) throw projectsError;

      const ownerIds = [...new Set((projects || []).map(p => p.owner_id))];
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', ownerIds);
      if (profilesError) throw profilesError;

      const ownerNames = (profiles || []).reduce((acc, profile) => ({
        ...acc,
        [profile.id]: profile.full_name
      }), {} as Record<string, string | null>);

      return (projects || []).map(project => ({
        ...project,
        owner_name: ownerNames[project.owner_id] || null
      })) as MarketplaceProject[];
    }
  });

  return (
    <div className={`min-h-screen ${user ? 'bg-[#041E42]' : 'bg-background'}`}>
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fadeIn">
          {/* Hero Section */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <h1 className={`text-3xl md:text-5xl font-bold ${user ? 'text-[#FF8200]' : 'text-primary'}`}>
              ImStudents
            </h1>
            <GraduationCap className={`w-8 h-8 md:w-12 md:h-12 ${user ? 'text-[#FF8200]' : 'text-primary'} animate-bounce`} />
          </div>
          
          <p className={`text-lg md:text-xl ${user ? 'text-[#B1B3B3]' : 'text-muted-foreground'} mb-12 leading-relaxed px-4 md:px-0`}>
            Connect with talented students, collaborate on amazing projects, and build your portfolio together.
          </p>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12 px-4 md:px-0">
            <div 
              onClick={() => navigate('/professor-rating')}
              className={`p-4 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border cursor-pointer group
                ${user ? 'bg-[#041E42] border-[#B1B3B3]/20 hover:border-[#FF8200]/50' : 'bg-card hover:border-primary/50 border-border'}`}
            >
              <GraduationCap className={`w-6 h-6 md:w-8 md:h-8 mx-auto mb-3 md:mb-4 group-hover:scale-110 transition-transform
                ${user ? 'text-[#FF8200]' : 'text-primary'}`} />
              <h3 className={`font-semibold text-base md:text-lg mb-2 ${user ? 'text-white' : 'text-card-foreground'}`}>
                Professor Rating
              </h3>
              <p className={user ? 'text-[#B1B3B3] text-xs md:text-sm' : 'text-muted-foreground text-xs md:text-sm'}>
                Rate and review your professors to help other students
              </p>
            </div>
            <div 
              onClick={() => navigate('/marketplace')}
              className={`p-4 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border cursor-pointer group
                ${user ? 'bg-[#041E42] border-[#B1B3B3]/20 hover:border-[#FF8200]/50' : 'bg-card hover:border-primary/50 border-border'}`}
            >
              <Sparkles className={`w-6 h-6 md:w-8 md:h-8 mx-auto mb-3 md:mb-4 group-hover:scale-110 transition-transform
                ${user ? 'text-[#FF8200]' : 'text-primary'}`} />
              <h3 className={`font-semibold text-base md:text-lg mb-2 ${user ? 'text-white' : 'text-card-foreground'}`}>
                Work Hub
              </h3>
              <p className={user ? 'text-[#B1B3B3] text-xs md:text-sm' : 'text-muted-foreground text-xs md:text-sm'}>
                Find projects and collaborate with fellow students
              </p>
            </div>
            <div 
              onClick={handleAssistantClick}
              className={`p-4 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border cursor-pointer group
                ${user ? 'bg-[#041E42] border-[#B1B3B3]/20 hover:border-[#FF8200]/50' : 'bg-card hover:border-primary/50 border-border'}`}
            >
              <Brain className={`w-6 h-6 md:w-8 md:h-8 mx-auto mb-3 md:mb-4 group-hover:scale-110 transition-transform
                ${user ? 'text-[#FF8200]' : 'text-primary'}`} />
              <h3 className={`font-semibold text-base md:text-lg mb-2 ${user ? 'text-white' : 'text-card-foreground'}`}>
                UTEP Assistant
              </h3>
              <p className={user ? 'text-[#B1B3B3] text-xs md:text-sm' : 'text-muted-foreground text-xs md:text-sm'}>
                Your AI-powered guide for academic success
              </p>
            </div>
          </div>
          
          {/* Search Section */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-12 px-4 md:px-0">
            <div className="flex-1 relative">
              <Input 
                type="text" 
                placeholder="Search UTEP..." 
                value={searchQuery} 
                onChange={e => setSearchQuery(e.target.value)} 
                onFocus={() => setShowResults(true)} 
                className={`pl-10 h-10 md:h-12 text-base md:text-lg ${
                  user ? 'bg-[#041E42]/50 border-[#B1B3B3]/20 text-white placeholder:text-[#B1B3B3]/60' 
                  : 'bg-background border-input text-foreground placeholder:text-muted-foreground'
                }`} 
              />
              <Search className={`w-4 h-4 md:w-5 md:h-5 absolute left-3 top-3 md:top-3.5 ${user ? 'text-[#FF8200]' : 'text-primary'}`} />
              {showResults && (searchResults.length > 0 || isSearching) && (
                <div className={`absolute top-full mt-1 w-full rounded-lg shadow-lg z-50 ${
                  user ? 'bg-[#041E42] border border-[#B1B3B3]/20' : 'bg-popover border border-border'
                }`}>
                  <SearchResults results={searchResults} isLoading={isSearching} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Latest Projects Section */}
        <section className={`mb-20 rounded-2xl shadow-lg p-8 max-w-[1400px] mx-auto border ${
          user ? 'bg-[#041E42]/80 backdrop-blur-lg border-[#B1B3B3]/20' : 'bg-card/80 backdrop-blur-lg border-border'
        }`}>
          <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12 pb-6 ${
            user ? 'border-b border-[#B1B3B3]/20' : 'border-b border-border'
          }`}>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h2 className={`text-3xl md:text-4xl font-bold ${user ? 'text-[#FF8200]' : 'text-primary'}`}>
                  Student Work Hub
                </h2>
              </div>
              <p className={`text-lg ${user ? 'text-[#B1B3B3]' : 'text-muted-foreground'}`}>
                Find projects and collaborate with fellow students
              </p>
            </div>
            <Button 
              onClick={() => navigate('/marketplace')} 
              className={user ? 
                "bg-[#FF8200] hover:bg-[#FF8200]/90 text-white shadow-md hover:shadow-lg transition-all duration-300" 
                : "bg-primary hover:bg-primary/90"
              } 
              size="lg"
            >
              <Search className="h-5 w-5 mr-2" />
              Find Projects
            </Button>
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="relative">
                <div className={`animate-spin rounded-full h-12 w-12 border-4 ${
                  user ? 'border-[#FF8200] border-t-transparent' : 'border-primary border-t-transparent'
                }`}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`h-6 w-6 rounded-full ${
                    user ? 'bg-[#FF8200]/20' : 'bg-primary/20'
                  } animate-pulse`}></div>
                </div>
              </div>
            </div>
          ) : projects.length === 0 ? (
            <div className={`text-center py-16 rounded-xl border ${
              user ? 'bg-[#041E42]/50 border-[#B1B3B3]/20' : 'bg-card/50 border-border'
            }`}>
              <h3 className={`text-2xl font-semibold mb-3 ${user ? 'text-white' : 'text-foreground'}`}>
                No Projects Found
              </h3>
              <p className={user ? 'text-[#B1B3B3] text-lg' : 'text-muted-foreground text-lg'}>
                Be the first to post a project and start collaborating!
              </p>
            </div>
          ) : (
            <MarketplaceProjectGrid projects={projects} isGridView={true} onUpdate={() => {}} currentUser={user} />
          )}
        </section>
      </main>
    </div>
  );
};

export default Index;
