import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import type { MarketplaceProject } from "../marketplace/MarketplacePage";
import { MarketplaceProjectGrid } from "../marketplace/MarketplaceProjectGrid";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Pencil, 
  GraduationCap, 
  Quote, 
  Plus,
  School
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ProfileDialog } from "./ProfileDialog";
import { PortfolioGrid } from "../portfolio/PortfolioGrid";
import type { PortfolioItem } from "../portfolio/PortfolioPage";

type Profile = {
  id: string;
  full_name: string | null;
  major: string | null;
  graduation_year: number | null;
  description: string | null;
  school_name: string | null;
};

export const ProfilePage = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [workOpportunities, setWorkOpportunities] = useState<MarketplaceProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Determine if viewing own profile
  const isOwnProfile = !userId || (user && userId === user.id);
  const targetUserId = userId || user?.id;

  useEffect(() => {
    if (targetUserId) {
      Promise.all([
        fetchProfile(),
        fetchPortfolioItems(),
        fetchWorkOpportunities()
      ]).finally(() => setIsLoading(false));
    }
  }, [targetUserId]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', targetUserId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
    }
  };

  const fetchWorkOpportunities = async () => {
    try {
      const { data, error } = await supabase
        .from('marketplace_projects')
        .select('*')
        .eq('owner_id', targetUserId)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) throw error;
      // Filter out any projects with 'in_progress' status since it's not part of our MarketplaceProject type
      const filteredData = (data || []).filter(
        project => project.status !== 'in_progress'
      ) as MarketplaceProject[];
      setWorkOpportunities(filteredData);
    } catch (error) {
      console.error('Error fetching work opportunities:', error);
      toast({
        title: "Error",
        description: "Failed to load work opportunities",
        variant: "destructive",
      });
    }
  };

  const fetchPortfolioItems = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('owner_id', targetUserId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPortfolioItems(data || []);
    } catch (error) {
      console.error('Error fetching portfolio items:', error);
      toast({
        title: "Error",
        description: "Failed to load portfolio items",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProfile = async (updatedProfile: Partial<Profile>) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to update your profile",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updatedProfile)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Navbar />
        <div className="container mx-auto px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Navbar />
        <div className="container mx-auto px-8 py-8">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">Profile Not Found</h2>
            <p className="text-muted-foreground">
              The requested profile could not be found
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative">
        <div className="h-48 bg-gradient-to-r from-blue-600 to-purple-600" />
        
        <div className="container mx-auto px-8">
          <Card className="max-w-7xl mx-auto -mt-24 relative z-10 border-border border-gray-500">
            <div className="flex flex-row items-start gap-8 p-8">
              {/* Avatar */}
              <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                <AvatarFallback className="text-2xl">
                  {profile.full_name?.charAt(0)}
                </AvatarFallback>
              </Avatar>

              {/* Profile Info */}
              <div className="space-y-4 flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold">
                      {profile.full_name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-2 text-muted-foreground mt-1">
                      <School className="w-4 h-4" />
                      <span>{profile.school_name}</span>
                      <span>•</span>
                      <GraduationCap className="w-4 h-4" />
                      <span>{profile.major}</span>
                      <span>•</span>
                      <span>Class of {profile.graduation_year}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {isOwnProfile && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsDialogOpen(true)}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </div>

                {/* Description */}
                {profile.description ? (
                  <div className="relative pl-8">
                    <Quote className="absolute -left-1 top-0 w-6 h-6 text-muted-foreground/20" />
                    <p className="text-muted-foreground">
                      {profile.description}
                    </p>
                  </div>
                ) : isOwnProfile ? (
                  <Button
                    variant="ghost"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    Add a description to tell others about yourself
                  </Button>
                ) : null}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-8 mt-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-6">
            <Card className="border-border border-gray-500">
              <CardContent className="p-6 text-center">
                <h3 className="text-2xl font-bold">{portfolioItems.length}</h3>
                <p className="text-muted-foreground">Projects</p>
              </CardContent>
            </Card>
            <Card className="border-border border-gray-500">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold">{profile.major}</h3>
                <p className="text-muted-foreground">Major</p>
              </CardContent>
            </Card>
            <Card className="border-border border-gray-500">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold">{profile.school_name}</h3>
                <p className="text-muted-foreground">School</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Portfolio Section */}
      <div className="container mx-auto px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Portfolio</h2>
              <p className="text-muted-foreground">
                Showcase of completed projects
              </p>
            </div>
          </div>

          {portfolioItems.length === 0 ? (
            <Card className="border-border border-gray-500">
              <CardContent className="p-12 text-center">
                <h3 className="text-lg font-semibold mb-2">No Projects Yet</h3>
                <p className="text-muted-foreground mb-4">
                  {isOwnProfile 
                    ? "Start building your portfolio by adding your first project"
                    : "This user hasn't added any projects yet"}
                </p>
                {isOwnProfile && (
                  <Button asChild>
                    <Link to="/portfolio">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Project
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <PortfolioGrid
              items={portfolioItems}
              isGridView={true}
              onUpdate={() => fetchPortfolioItems()}
              onDelete={() => fetchPortfolioItems()}
              currentUser={user}
            />
          )}
        </div>
      </div>

      {/* Work Opportunities Section */}
      <div className="container mx-auto px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Work Opportunities</h2>
              <p className="text-muted-foreground">
                Open projects looking for collaborators
              </p>
            </div>
          </div>

          {workOpportunities.length === 0 ? (
            <Card className="border-border border-gray-500">
              <CardContent className="p-12 text-center">
                <h3 className="text-lg font-semibold mb-2">No Open Opportunities</h3>
                <p className="text-muted-foreground mb-4">
                  {isOwnProfile 
                    ? "Start posting work opportunities for others to collaborate on"
                    : "This user hasn't posted any work opportunities yet"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <MarketplaceProjectGrid
              projects={workOpportunities}
              isGridView={true}
              onUpdate={fetchWorkOpportunities}
              currentUser={user}
            />
          )}
        </div>
      </div>

      <ProfileDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        profile={profile}
        onSubmit={handleUpdateProfile}
      />
    </div>
  );
};
