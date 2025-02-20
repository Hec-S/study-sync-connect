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
  School,
  UserPlus,
  UserCheck,
  Clock,
  UserX,
  Users,
  MessageSquare
} from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileDialog } from "./ProfileDialog";
import { MessageDialog } from "./MessageDialog";
import { PortfolioGrid } from "../portfolio/PortfolioGrid";
import type { PortfolioItem } from "../portfolio/PortfolioPage";

type Profile = {
  id: string;
  full_name: string | null;
  major: string | null;
  graduation_year: number | null;
  description: string | null;
  school_name: string | null;
  avatar_url: string | null;
};

type ConnectionStatus = Database["public"]["Enums"]["connection_status"];

type ConnectionState = {
  status: ConnectionStatus | null;
  id: string | null;
  isRequester: boolean;
};

export const ProfilePage = () => {
  const [connectionState, setConnectionState] = useState<ConnectionState>({
    status: null,
    id: null,
    isRequester: false
  });
  const { userId } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [isPortfolioLoading, setIsPortfolioLoading] = useState(true);
  const [workOpportunities, setWorkOpportunities] = useState<MarketplaceProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionCount, setConnectionCount] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Determine if viewing own profile
  const isOwnProfile = !userId || (user && userId === user.id);
  const targetUserId = userId || user?.id;

  useEffect(() => {
    if (targetUserId) {
      Promise.all([
        fetchProfile(),
        fetchWorkOpportunities(),
        fetchConnectionStatus(),
        fetchConnectionCount()
      ]).finally(() => setIsLoading(false));

      // Fetch portfolio items separately to not block the main profile load
      fetchPortfolioItems();
    }
  }, [targetUserId]);

  const fetchConnectionCount = async () => {
    if (!targetUserId) return;

    try {
      const { data, error } = await supabase
        .rpc('get_connection_count', {
          user_id: targetUserId
        });

      if (error) throw error;
      setConnectionCount(data || 0);
    } catch (error) {
      console.error('Error fetching connection count:', error);
      toast({
        title: "Error",
        description: "Failed to load connection count",
        variant: "destructive",
      });
    }
  };

  const fetchConnectionStatus = async () => {
    if (!user?.id || isOwnProfile || !targetUserId) {
      setConnectionState({
        status: null,
        id: null,
        isRequester: false
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('connections')
        .select('*')
        .or(
          `and(requester_id.eq.${user.id},receiver_id.eq.${targetUserId}),` +
          `and(requester_id.eq.${targetUserId},receiver_id.eq.${user.id})`
        )
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setConnectionState({
          status: data.status,
          id: data.id,
          isRequester: data.requester_id === user.id
        });
      } else {
        setConnectionState({
          status: null,
          id: null,
          isRequester: false
        });
      }
    } catch (error) {
      console.error('Error fetching connection status:', error);
      toast({
        title: "Error",
        description: "Failed to load connection status",
        variant: "destructive",
      });
    }
  };

  const handleConnect = async () => {
    if (!user?.id || !targetUserId) {
      toast({
        title: "Error",
        description: "You must be logged in to connect with others",
        variant: "destructive",
      });
      return;
    }

    try {
      // Check if a connection already exists
      const { data: existingConnection, error: checkError } = await supabase
        .from('connections')
        .select('*')
        .or(
          `and(requester_id.eq.${user.id},receiver_id.eq.${targetUserId}),` +
          `and(requester_id.eq.${targetUserId},receiver_id.eq.${user.id})`
        )
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingConnection) {
        toast({
          title: "Error",
          description: "A connection already exists with this user",
          variant: "destructive",
        });
        return;
      }

      // Create new connection request
      const { data, error } = await supabase
        .from('connections')
        .insert([{
          requester_id: user.id,
          receiver_id: targetUserId,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') { // Unique violation
          toast({
            title: "Error",
            description: "A connection already exists with this user",
            variant: "destructive",
          });
          return;
        }
        throw error;
      }

      setConnectionState({
        status: 'pending',
        id: data.id,
        isRequester: true
      });

      toast({
        title: "Success",
        description: "Connection request sent",
      });
    } catch (error) {
      console.error('Error sending connection request:', error);
      toast({
        title: "Error",
        description: "Failed to send connection request. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleCancelRequest = async () => {
    if (!connectionState.id) return;

    try {
      const { error } = await supabase
        .from('connections')
        .delete()
        .eq('id', connectionState.id);

      if (error) throw error;

      setConnectionState({
        status: null,
        id: null,
        isRequester: false
      });

      toast({
        title: "Success",
        description: "Connection request cancelled",
      });
    } catch (error) {
      console.error('Error cancelling connection request:', error);
      toast({
        title: "Error",
        description: "Failed to cancel connection request",
        variant: "destructive",
      });
    }
  };

  const getConnectionButton = () => {
    if (isOwnProfile) return null;

    switch (connectionState.status) {
      case 'pending':
        return connectionState.isRequester ? (
          <Button
            size="sm"
            variant="outline"
            onClick={handleCancelRequest}
            className="text-yellow-600 hover:text-yellow-700"
          >
            <Clock className="h-4 w-4 mr-2" />
            Cancel Request
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            className="text-yellow-600"
            disabled
          >
            <Clock className="h-4 w-4 mr-2" />
            Pending Response
          </Button>
        );
      case 'accepted':
        return (
          <Button
            size="sm"
            variant="outline"
            className="text-green-600"
            disabled
          >
            <UserCheck className="h-4 w-4 mr-2" />
            Connected
          </Button>
        );
      default:
        return (
          <Button
            size="sm"
            onClick={handleConnect}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Connect
          </Button>
        );
    }
  };

  const fetchProfile = async () => {
    if (!targetUserId) {
      toast({
        title: "Error",
        description: "Invalid profile ID",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', targetUserId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') { // No rows returned
          toast({
            title: "Error",
            description: "Profile not found",
            variant: "destructive",
          });
          return;
        }
        throw error;
      }

      // Transform the data to match our Profile type
      setProfile({
        ...data,
        description: data.Description,
        avatar_url: data.avatar_url || null,
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile. Please try again later.",
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
    if (!targetUserId) return;

    try {
      setIsPortfolioLoading(true);
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
    } finally {
      setIsPortfolioLoading(false);
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
      // Transform the profile data to match database column names
      const { description, avatar_url, ...rest } = updatedProfile;
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...rest,
          Description: description,
          avatar_url: avatar_url
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      // Transform the data to match our Profile type
      setProfile({
        ...data,
        description: data.Description,
        avatar_url: data.avatar_url || null,
      });
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

  const LoadingSkeleton = () => (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      <div className="relative">
        <div className="h-48 bg-gradient-to-r from-blue-600 to-purple-600" />
        
        <div className="container mx-auto px-8">
          <Card className="max-w-7xl mx-auto -mt-24 relative z-10 border-border border-gray-500">
            <div className="flex flex-row items-start gap-8 p-8">
              {/* Avatar Skeleton */}
              <div className="w-32 h-32 rounded-full bg-gray-200 animate-pulse" />

              {/* Profile Info Skeleton */}
              <div className="space-y-4 flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-4 w-96 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>

                {/* Description Skeleton */}
                <div className="relative pl-8 mt-4">
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Stats Section Skeleton */}
      <div className="container mx-auto px-8 mt-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <Card key={i} className="border-border border-gray-500">
                <CardContent className="p-6 text-center">
                  <div className="h-6 w-24 mx-auto bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-4 w-16 mx-auto bg-gray-200 rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Portfolio Section Skeleton */}
      <div className="container mx-auto px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mb-6" />
          
          <div className="grid gap-4">
            {[...Array(2)].map((_, i) => (
              <Card key={i} className="border-border border-gray-500">
                <CardContent className="p-6">
                  <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-4" />
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return <LoadingSkeleton />;
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
                {profile.avatar_url && (
                  <AvatarImage src={profile.avatar_url} alt={profile.full_name || "Profile"} />
                )}
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
                    {isOwnProfile ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsDialogOpen(true)}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    ) : (
                      <>
                        {getConnectionButton()}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsMessageDialogOpen(true)}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Description */}
                {profile.description ? (
                  <p className="text-muted-foreground">
                    {profile.description}
                  </p>
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
          <div className="grid grid-cols-2 gap-6">
            <Card className="border-border border-gray-500">
              <CardContent className="p-6 text-center">
                <h3 className="text-2xl font-bold">{portfolioItems.length}</h3>
                <p className="text-muted-foreground">Projects</p>
              </CardContent>
            </Card>
            <Card className="border-border border-gray-500">
              <CardContent className="p-6 text-center">
                <h3 className="text-2xl font-bold">{connectionCount}</h3>
                <Link 
                  to={isOwnProfile ? "/connections" : `/profile/${targetUserId}/connections`} 
                  className="text-muted-foreground hover:text-primary flex items-center justify-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  Connections
                </Link>
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

          {isPortfolioLoading ? (
            <Card className="border-border border-gray-500">
              <CardContent className="p-12">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              </CardContent>
            </Card>
          ) : portfolioItems.length === 0 ? (
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
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Project
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-4">
                {isOwnProfile && (
                  <Button asChild className="ml-auto">
                    <Link to="/portfolio">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Project
                    </Link>
                  </Button>
                )}
              </div>
              <PortfolioGrid
                items={portfolioItems}
                isGridView={true}
                onUpdate={() => fetchPortfolioItems()}
                onDelete={() => fetchPortfolioItems()}
                currentUser={user}
              />
            </div>
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

      <MessageDialog
        open={isMessageDialogOpen}
        onOpenChange={setIsMessageDialogOpen}
        receiverId={targetUserId || ""}
        receiverName={profile.full_name || "User"}
      />
    </div>
  );
};
