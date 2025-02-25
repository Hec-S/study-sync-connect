import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { PortfolioFeedCard } from "@/components/portfolio/PortfolioFeedCard";

type DatabasePortfolioItem = {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  category: string;
  completion_date?: string;
  project_url?: string;
  skills: string[];
};

type Profile = {
  id: string;
  full_name: string | null;
  school_name: string | null;
};

type PortfolioItem = DatabasePortfolioItem & {
  likes_count: number;
  comments_count: number;
  is_liked?: boolean;
  user_profile: Profile | null;
};

// Helper function to get counts from the database response
const getCounts = (item: any) => ({
  likes_count: item.likes_count || 0,
  comments_count: item.comments_count || 0
});

export const PortfolioFeedPage = () => {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchPortfolioItems();

      // Subscribe to new portfolio items
      const subscription = supabase
        .channel('portfolio_items')
        .on('postgres_changes', 
          { 
            event: 'INSERT',
            schema: 'public',
            table: 'portfolio_items'
          },
          async (payload) => {
            const newItem = payload.new as DatabasePortfolioItem;
            
            // Fetch user profile for the new item
            const { data: profileData } = await supabase
              .from('profiles')
              .select('id, full_name, school_name')
              .eq('id', newItem.owner_id)
              .single();

            // Check if user has liked the new item
            const { data: likeData } = await supabase
              .from('portfolio_likes')
              .select('id')
              .eq('portfolio_item_id', newItem.id)
              .eq('user_id', user.id)
              .single();

            const transformedItem: PortfolioItem = {
              ...newItem,
              user_profile: profileData,
              is_liked: !!likeData,
              ...getCounts(newItem)
            };

            setPortfolioItems(prev => [transformedItem, ...prev]);
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  const fetchPortfolioItems = async (offset = 0) => {
    if (!user?.id || !hasMore) return;

    try {
      setIsLoadingMore(true);

      // First fetch portfolio items
      const { data: itemsData, error: itemsError } = await supabase
        .from('portfolio_items')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + 4);

      if (itemsError) throw itemsError;

      // If no more items, set hasMore to false
      if (!itemsData || itemsData.length < 5) {
        setHasMore(false);
      }

      if (!itemsData?.length) {
        setPortfolioItems([]);
        return;
      }

      // Then fetch profiles for those items
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, full_name, school_name')
        .in('id', itemsData.map(item => item.owner_id));

      // Check which items are liked by the current user
      const { data: likesData } = await supabase
        .from('portfolio_likes')
        .select('portfolio_item_id')
        .eq('user_id', user.id)
        .in('portfolio_item_id', itemsData.map(item => item.id));

      const likedItemIds = new Set(likesData?.map(like => like.portfolio_item_id));

      // Combine the data
      const transformedItems: PortfolioItem[] = itemsData.map(item => ({
        ...item,
        user_profile: profilesData?.find(profile => profile.id === item.owner_id) || null,
        is_liked: likedItemIds.has(item.id),
        ...getCounts(item)
      }));

      setPortfolioItems(prev => 
        offset === 0 ? transformedItems : [...prev, ...transformedItems]
      );
    } catch (error) {
      console.error('Error fetching portfolio items:', error);
      toast({
        title: "Error",
        description: "Failed to load portfolio items",
        variant: "destructive",
      });
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleLike = async (itemId: string) => {
    if (!user) return;

    try {
      const item = portfolioItems.find(i => i.id === itemId);
      if (!item) return;

      if (item.is_liked) {
        // Unlike
        const { error } = await supabase
          .from('portfolio_likes')
          .delete()
          .eq('portfolio_item_id', itemId)
          .eq('user_id', user.id);

        if (error) throw error;

        setPortfolioItems(prev => prev.map(item => 
          item.id === itemId
            ? { ...item, is_liked: false, likes_count: Math.max(0, item.likes_count - 1) }
            : item
        ));
      } else {
        // Like
        const { error } = await supabase
          .from('portfolio_likes')
          .insert({
            portfolio_item_id: itemId,
            user_id: user.id
          });

        if (error) throw error;

        setPortfolioItems(prev => prev.map(item => 
          item.id === itemId
            ? { ...item, is_liked: true, likes_count: item.likes_count + 1 }
            : item
        ));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      });
    }
  };

  const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
    const bottom = e.currentTarget.scrollHeight - e.currentTarget.scrollTop === e.currentTarget.clientHeight;
    if (bottom && !isLoadingMore && hasMore) {
      await fetchPortfolioItems(portfolioItems.length);
    }
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-4">Please sign in to view the portfolio feed</h1>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Portfolio Feed</h1>
            <p className="text-muted-foreground">
              Discover amazing projects from the community
            </p>
          </div>
        </div>

        <Card className="p-0">
          <div 
            className="max-w-xl mx-auto py-4 px-0 overflow-y-auto"
            style={{ height: 'calc(100vh - 200px)' }}
            onScroll={handleScroll}
          >
            {portfolioItems.length === 0 && !isLoadingMore ? (
              <div className="text-center py-8 text-muted-foreground">
                <h3 className="text-lg font-medium">No projects yet</h3>
                <p>Be the first to share your work!</p>
              </div>
            ) : (
              <>
                {portfolioItems.map((item) => (
                  <PortfolioFeedCard
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    description={item.description}
                    imageUrl={item.image_url}
                    createdAt={item.created_at}
                    likes={item.likes_count}
                    comments={item.comments_count}
                    user={{
                      id: item.owner_id,
                      name: item.user_profile?.full_name || 'Unknown',
                      school: item.user_profile?.school_name || 'Unknown'
                    }}
                    isLiked={item.is_liked}
                    onLike={() => handleLike(item.id)}
                  />
                ))}
                {isLoadingMore && (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  </div>
                )}
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PortfolioFeedPage;
