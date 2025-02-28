import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationsContext";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NotificationBadge } from "@/components/ui/notification-badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserPlus, Users, Check, X, MessageSquare, Send, Folder } from "lucide-react";
import { PortfolioFeedCard } from "@/components/portfolio/PortfolioFeedCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import React, { useEffect, useState, useRef } from "react";
import type { Connection, Message, Project } from "@/integrations/supabase/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link, useSearchParams } from "react-router-dom";

type Profile = {
  full_name: string | null;
  school_name: string | null;
};

type ConnectionWithProfile = Connection & {
  other_user_profile: Profile | null;
};

type MessageWithProfile = Message & {
  sender_profile: Profile | null;
  receiver_profile: Profile | null;
};

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
  likes_count?: number;
  comments_count?: number;
};

type PortfolioItem = DatabasePortfolioItem & {
  likes_count: number;
  comments_count: number;
  is_liked?: boolean;
  user_profile: Profile | null;
};

// Helper function to get counts from the database response
const getCounts = (item: DatabasePortfolioItem) => ({
  likes_count: item.likes_count || 0,
  comments_count: item.comments_count || 0
});

export const ConnectionsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const { messageCount: unreadMessages, requestCount: pendingConnectionsCount, refreshCounts, markMessagesAsRead } = useNotifications();
  const [connections, setConnections] = useState<ConnectionWithProfile[]>([]);
  const [pendingRequests, setPendingRequests] = useState<ConnectionWithProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<MessageWithProfile[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const messageEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const [messageOffset, setMessageOffset] = useState(0);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isLoadingMoreMessages, setIsLoadingMoreMessages] = useState(false);
  const [previousScrollHeight, setPreviousScrollHeight] = useState(0);

  // Auto-scroll to bottom when conversation changes or new messages arrive, but only if already at bottom
  useEffect(() => {
    if (activeConversation && messageEndRef.current && isAtBottom) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeConversation, messages, isAtBottom]);

  // Handle scroll events in the message container
  const handleMessageScroll = () => {
    if (!messageContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = messageContainerRef.current;
    // Consider "at bottom" if within 50px of the bottom
    const atBottom = scrollHeight - scrollTop - clientHeight < 50;
    setIsAtBottom(atBottom);
    
    // Check if user is near the top (within 50px) to load more messages
    const isNearTop = scrollTop < 50;
    if (isNearTop && !isLoadingMoreMessages && hasMoreMessages && activeConversation && messages.length > 0) {
      // Save current scroll height before loading more messages
      setPreviousScrollHeight(scrollHeight);
      // Load more messages
      loadMoreMessages();
    }
  };

  // Function to load more messages
  const loadMoreMessages = async () => {
    if (!user?.id || !hasMoreMessages || isLoadingMoreMessages) return;
    
    setIsLoadingMoreMessages(true);
    try {
      const newOffset = messageOffset + 50; // Load 50 more messages
      
      // Get older messages with pagination for the active conversation
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*, read_status')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${activeConversation},receiver_id.eq.${user.id},sender_id.eq.${activeConversation}`)
        .order('created_at', { ascending: false }) // Newest first for pagination
        .range(newOffset, newOffset + 49);
      
      if (messagesError) {
        console.error('Error fetching more messages:', messagesError);
        throw messagesError;
      }
      
      // If no more messages, set hasMoreMessages to false
      if (!messagesData || messagesData.length < 50) {
        setHasMoreMessages(false);
      }
      
      if (!messagesData?.length) {
        setIsLoadingMoreMessages(false);
        return;
      }
      
      // Reverse to show oldest first in the UI
      const chronologicalMessages = [...messagesData].reverse();
      
      // Transform messages with sender and receiver profiles
      const transformedMessages = await Promise.all(chronologicalMessages.map(async (message) => {
        const [senderResponse, receiverResponse] = await Promise.all([
          supabase
            .from('profiles')
            .select('full_name, school_name')
            .eq('id', message.sender_id)
            .single(),
          supabase
            .from('profiles')
            .select('full_name, school_name')
            .eq('id', message.receiver_id)
            .single()
        ]);
        
        return {
          ...message,
          sender_profile: senderResponse.data,
          receiver_profile: receiverResponse.data
        };
      }));
      
      // Add older messages to the beginning of the messages array
      setMessages(prev => [...transformedMessages, ...prev]);
      setMessageOffset(newOffset);
      
      // Restore scroll position after new messages are loaded
      setTimeout(() => {
        if (messageContainerRef.current) {
          const newScrollHeight = messageContainerRef.current.scrollHeight;
          const scrollDifference = newScrollHeight - previousScrollHeight;
          messageContainerRef.current.scrollTop = scrollDifference > 0 ? scrollDifference + 10 : 10;
        }
      }, 200);
      
    } catch (error) {
      console.error('Error loading more messages:', error);
      toast({
        title: "Error",
        description: "Failed to load more messages",
        variant: "destructive",
      });
    } finally {
      setIsLoadingMoreMessages(false);
    }
  };

  // Function to scroll to bottom on demand
  const scrollToBottom = () => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
      setIsAtBottom(true);
    }
  };

  // Focus input when conversation changes and mark messages as read
  useEffect(() => {
    if (activeConversation && inputRef.current) {
      inputRef.current.focus();
      // Mark messages from this sender as read
      markMessagesAsRead(activeConversation);
    }
  }, [activeConversation, markMessagesAsRead]);

  const [portfolioProjects, setPortfolioProjects] = useState<PortfolioItem[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Set initial tab from URL
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'messages' && activeConversation) {
      handleTabChange('messages');
    }
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      Promise.all([
        fetchConnections(),
        fetchPendingRequests(),
        fetchMessages(),
        fetchPortfolioProjects()
      ]).finally(() => setIsLoading(false));

      // Subscribe to message changes
      const subscription = supabase
        .channel('messages')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'messages',
            filter: 'receiver_id=eq.' + user.id
          },
          async (payload) => {
            if (payload.eventType === 'INSERT') {
              const newMessage = payload.new as Message;
              const [senderResponse, receiverResponse] = await Promise.all([
                supabase
                  .from('profiles')
                  .select('full_name, school_name')
                  .eq('id', newMessage.sender_id)
                  .single(),
                supabase
                  .from('profiles')
                  .select('full_name, school_name')
                  .eq('id', newMessage.receiver_id)
                  .single()
              ]);

              if (senderResponse.error || receiverResponse.error) {
                console.error('Error fetching profiles:', senderResponse.error || receiverResponse.error);
                return;
              }

              setMessages(prev => [...prev, {
                ...newMessage,
                sender_profile: senderResponse.data,
                receiver_profile: receiverResponse.data
              }]);

              if (!newMessage.read_status) {
                await refreshCounts();
              }
            } else if (payload.eventType === 'UPDATE') {
              const updatedMessage = payload.new as Message;
              setMessages(prev => prev.map(msg => 
                msg.id === updatedMessage.id
                  ? { ...msg, ...updatedMessage }
                  : msg
              ));

              if (payload.old.read_status === false && updatedMessage.read_status === true) {
                await refreshCounts();
              }
            }
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  // Optimized message loading with pagination
  const fetchMessages = async (limit = 50, offset = 0) => {
    if (!user?.id) return;

    try {
      if (offset === 0) {
        setMessageOffset(0);
        setHasMoreMessages(true);
      }
      
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*, read_status')
        .or('sender_id.eq.' + user.id + ',receiver_id.eq.' + user.id)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (messagesError) {
        console.error('Error fetching messages:', messagesError);
        throw messagesError;
      }

      const chronologicalMessages = [...(messagesData || [])].reverse();

      const transformedMessages = await Promise.all(chronologicalMessages.map(async (message) => {
        const [senderResponse, receiverResponse] = await Promise.all([
          supabase
            .from('profiles')
            .select('full_name, school_name')
            .eq('id', message.sender_id)
            .single(),
          supabase
            .from('profiles')
            .select('full_name, school_name')
            .eq('id', message.receiver_id)
            .single()
        ]);

        return {
          ...message,
          sender_profile: senderResponse.data,
          receiver_profile: receiverResponse.data
        };
      }));

      setMessages(transformedMessages);
      
      setTimeout(() => {
        if (messageEndRef.current && isAtBottom) {
          messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = async () => {
    if (!user?.id || !activeConversation || !newMessage.trim()) return;

    const messageContent = newMessage.trim();
    setNewMessage('');
    
    try {
      const { data: newMessageData, error } = await supabase
        .from('messages')
        .insert([{
          sender_id: user.id,
          receiver_id: activeConversation,
          content: messageContent,
          read_status: false
        }])
        .select()
        .single();

      if (error) throw error;

      const [senderResponse, receiverResponse] = await Promise.all([
        supabase
          .from('profiles')
          .select('full_name, school_name')
          .eq('id', user.id)
          .single(),
        supabase
          .from('profiles')
          .select('full_name, school_name')
          .eq('id', activeConversation)
          .single()
      ]);

      const newMessageWithProfiles = {
        ...newMessageData,
        sender_profile: senderResponse.data,
        receiver_profile: receiverResponse.data
      };

      setMessages(prev => [...prev, newMessageWithProfiles]);
      
      setTimeout(() => {
        if (messageEndRef.current) {
          messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
          setIsAtBottom(true);
        }
      }, 100);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const fetchConnections = async () => {
    if (!user?.id) return;

    try {
      const { data: connectionsData, error: connectionsError } = await supabase
        .from('connections')
        .select('*')
        .eq('status', 'accepted')
        .or('requester_id.eq.' + user.id + ',receiver_id.eq.' + user.id)
        .order('created_at', { ascending: false });

      if (connectionsError) throw connectionsError;

      const transformedConnections = await Promise.all((connectionsData || []).map(async (connection) => {
        const otherUserId = connection.requester_id === user.id 
          ? connection.receiver_id 
          : connection.requester_id;

        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name, school_name')
          .eq('id', otherUserId)
          .single();

        return {
          ...connection,
          other_user_profile: profileData
        };
      }));

      setConnections(transformedConnections);
    } catch (error) {
      console.error('Error fetching connections:', error);
      toast({
        title: "Error",
        description: "Failed to load connections",
        variant: "destructive",
      });
    }
  };

  const fetchPendingRequests = async () => {
    if (!user?.id) return;

    try {
      const { data: requestsData, error: requestsError } = await supabase
        .from('connections')
        .select('*')
        .eq('receiver_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (requestsError) throw requestsError;

      const transformedRequests = await Promise.all((requestsData || []).map(async (request) => {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name, school_name')
          .eq('id', request.requester_id)
          .single();

        return {
          ...request,
          other_user_profile: profileData
        };
      }));

      setPendingRequests(transformedRequests);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      toast({
        title: "Error",
        description: "Failed to load pending requests",
        variant: "destructive",
      });
    }
  };

  const handleTabChange = async (value: string) => {
    setSearchParams({ tab: value });
    
    if (value === 'portfolio' && portfolioProjects.length === 0) {
      await fetchPortfolioProjects();
    }
  };

  const fetchPortfolioProjects = async (offset = 0) => {
    if (!user?.id || !hasMore) return;

    try {
      setIsLoadingMore(true);

      const { data: projectsData, error: projectsError } = await supabase
        .from('portfolio_items')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + 4);

      if (projectsError) throw projectsError;

      if (!projectsData || projectsData.length < 5) {
        setHasMore(false);
      }

      if (!projectsData?.length) {
        setPortfolioProjects([]);
        return;
      }

      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, full_name, school_name')
        .in('id', projectsData.map(item => item.owner_id));

      const { data: likesData } = await supabase
        .from('portfolio_likes')
        .select('portfolio_item_id')
        .eq('user_id', user.id)
        .in('portfolio_item_id', projectsData.map(item => item.id));

      const likedItemIds = new Set(likesData?.map(like => like.portfolio_item_id));

      const transformedProjects = projectsData.map(item => {
        const counts = getCounts(item);
        return {
          ...item,
          user_profile: profilesData?.find(profile => profile.id === item.owner_id) || null,
          is_liked: likedItemIds.has(item.id),
          likes_count: counts.likes_count,
          comments_count: counts.comments_count
        };
      });

      setPortfolioProjects(prev => 
        offset === 0 ? transformedProjects : [...prev, ...transformedProjects]
      );
    } catch (error) {
      console.error('Error fetching portfolio projects:', error);
      toast({
        title: "Error",
        description: "Failed to load portfolio projects",
        variant: "destructive",
      });
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
    const bottom = e.currentTarget.scrollHeight - e.currentTarget.scrollTop === e.currentTarget.clientHeight;
    if (bottom && !isLoadingMore && hasMore) {
      await fetchPortfolioProjects(portfolioProjects.length);
    }
  };

  const handleAcceptRequest = async (connectionId: string) => {
    try {
      const { error } = await supabase
        .from('connections')
        .update({ status: 'accepted' })
        .eq('id', connectionId);

      if (error) throw error;

      setPendingRequests(prev => prev.filter(req => req.id !== connectionId));
      await Promise.all([
        fetchConnections(),
        refreshCounts()
      ]);

      toast({
        title: "Success",
        description: "Connection request accepted",
      });
    } catch (error) {
      console.error('Error accepting connection request:', error);
      toast({
        title: "Error",
        description: "Failed to accept connection request",
        variant: "destructive",
      });
    }
  };

  const handleRejectRequest = async (connectionId: string) => {
    try {
      const { error } = await supabase
        .from('connections')
        .update({ status: 'rejected' })
        .eq('id', connectionId);

      if (error) throw error;

      setPendingRequests(prev => prev.filter(req => req.id !== connectionId));
      await refreshCounts();

      toast({
        title: "Success",
        description: "Connection request rejected",
      });
    } catch (error) {
      console.error('Error rejecting connection request:', error);
      toast({
        title: "Error",
        description: "Failed to reject connection request",
        variant: "destructive",
      });
    }
  };

  const handleLike = async (itemId: string) => {
    if (!user) return;

    try {
      const item = portfolioProjects.find(i => i.id === itemId);
      if (!item) return;

      if (item.is_liked) {
        const { error } = await supabase
          .from('portfolio_likes')
          .delete()
          .eq('portfolio_item_id', itemId)
          .eq('user_id', user.id);

        if (error) throw error;

        setPortfolioProjects(prev => prev.map(item => 
          item.id === itemId
            ? { ...item, is_liked: false, likes_count: Math.max(0, item.likes_count - 1) }
            : item
        ));
      } else {
        const { error } = await supabase
          .from('portfolio_likes')
          .insert({
            portfolio_item_id: itemId,
            user_id: user.id
          });

        if (error) throw error;

        setPortfolioProjects(prev => prev.map(item => 
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

  const handleRemoveConnection = async (connectionId: string) => {
    try {
      const { error } = await supabase
        .from('connections')
        .delete()
        .eq('id', connectionId);

      if (error) throw error;

      setConnections(prev => prev.filter(conn => conn.id !== connectionId));

      toast({
        title: "Success",
        description: "Connection removed",
      });
    } catch (error) {
      console.error('Error removing connection:', error);
      toast({
        title: "Error",
        description: "Failed to remove connection",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-4">Please sign in to view connections</h1>
        </div>
      </>
    );
  }

  // Helper: Build conversations list from messages grouped by conversation partner
  const conversations = Object.values(
    messages.reduce((acc: { [key: string]: MessageWithProfile }, message) => {
      const conversationId = message.sender_id === user.id ? message.receiver_id : message.sender_id;
      // Always keep the latest message for this conversation
      if (!acc[conversationId] || new Date(message.created_at) > new Date(acc[conversationId].created_at)) {
        acc[conversationId] = message;
      }
      return acc;
    }, {} as { [key: string]: MessageWithProfile })
  ).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  // Filter messages for the active conversation
  const activeMessages = activeConversation
    ? messages.filter(msg =>
        msg.sender_id === activeConversation || msg.receiver_id === activeConversation
      )
    : [];

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Connections</h1>
        </div>

        <Tabs defaultValue={searchParams.get('tab') || 'connections'} className="w-full" onValueChange={handleTabChange}>
          <TabsList className="mb-4">
            <TabsTrigger value="connections" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              My Connections
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex items-center gap-2">
              <div className="relative">
                <UserPlus className="h-4 w-4" />
                {pendingConnectionsCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-xs">
                    {pendingConnectionsCount}
                  </Badge>
                )}
              </div>
              Connection Requests
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <div className="relative">
                <MessageSquare className="h-4 w-4" />
                <NotificationBadge type="messages" />
              </div>
              Messages
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="flex items-center gap-2">
              <Folder className="h-4 w-4" />
              Portfolio Feed
            </TabsTrigger>
          </TabsList>

          {/* Connections Tab */}
          <TabsContent value="connections">
            <Card className="p-6">
              {connections.length === 0 ? (
                <div className="text-center text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-2" />
                  <h3 className="text-lg font-medium">No connections yet</h3>
                  <p className="mb-4">Start connecting with other students to grow your network!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {connections.map((connection) => (
                    <div key={connection.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback>
                            {connection.other_user_profile?.full_name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <Link 
                            to={`/profile/${connection.requester_id === user?.id ? connection.receiver_id : connection.requester_id}`}
                            className="font-medium hover:text-primary"
                          >
                            {connection.other_user_profile?.full_name}
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            {connection.other_user_profile?.school_name}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveConnection(connection.id)}
                        className="text-destructive hover:text-destructive/90"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Requests Tab */}
          <TabsContent value="requests">
            <Card className="p-6">
              {pendingRequests.length === 0 ? (
                <div className="text-center text-muted-foreground">
                  <UserPlus className="h-12 w-12 mx-auto mb-2" />
                  <h3 className="text-lg font-medium">No pending requests</h3>
                  <p className="mb-4">You don't have any connection requests at the moment.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback>
                            {request.other_user_profile?.full_name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <Link 
                            to={`/profile/${request.requester_id}`}
                            className="font-medium hover:text-primary"
                          >
                            {request.other_user_profile?.full_name}
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            {request.other_user_profile?.school_name}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleAcceptRequest(request.id)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRejectRequest(request.id)}
                          className="text-destructive hover:text-destructive/90"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages">
            <Card className="p-0 overflow-hidden">
              <div className="grid grid-cols-[320px_1fr] h-[600px] max-h-[80vh]">
                {/* Left sidebar: Conversations list */}
                <div className="border-r overflow-y-auto">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold text-lg">Messages</h3>
                  </div>
                  {conversations.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      No conversations yet.
                    </div>
                  ) : (
                    conversations.map(convo => {
                      // Determine conversation partner name
                      const conversationPartnerId = convo.sender_id === user.id ? convo.receiver_id : convo.sender_id;
                      const partnerProfile = convo.sender_id === user.id ? convo.receiver_profile : convo.sender_profile;
                      return (
                        <button
                          key={conversationPartnerId}
                          onClick={() => setActiveConversation(conversationPartnerId)}
                          className={`w-full text-left p-4 border-b hover:bg-muted ${
                            activeConversation === conversationPartnerId ? 'bg-muted' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>
                                {partnerProfile?.full_name?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{partnerProfile?.full_name || 'Unknown User'}</p>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {convo.content}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
                {/* Right panel: Active conversation */}
                <div className="flex flex-col h-full">
                  <div className="flex-1 overflow-y-auto p-4 h-full max-h-[calc(600px-120px)]" ref={messageContainerRef} onScroll={handleMessageScroll}>
                    {activeConversation ? (
                      activeMessages.length === 0 ? (
                        <div className="text-center text-muted-foreground">
                          No messages in this conversation yet.
                        </div>
                      ) : (
                        activeMessages.map(msg => (
                          <div
                            key={msg.id}
                            className={`mb-2 flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`rounded-lg p-2 max-w-xs ${msg.sender_id === user.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'}`}>
                              {msg.content}
                            </div>
                          </div>
                        ))
                      )
                    ) : (
                      <div className="text-center text-muted-foreground">
                        Select a conversation to start messaging.
                      </div>
                    )}
                    <div ref={messageEndRef} />
                  </div>
                  {activeConversation && (
                    <div className="p-4 border-t flex gap-2">
                      <input
                        ref={inputRef}
                        type="text"
                        className="flex-1 border rounded px-3 py-2"
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSendMessage();
                        }}
                      />
                      <Button onClick={handleSendMessage}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio">
            <Card className="p-4">
              <ScrollArea onScroll={handleScroll} className="h-[600px]">
                {portfolioProjects.length === 0 ? (
                  <div className="text-center text-muted-foreground py-10">
                    No portfolio projects yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {portfolioProjects.map(project => (
                      <PortfolioFeedCard
                        key={project.id}
                        id={project.id}
                        title={project.title}
                        description={project.description}
                        imageUrl={project.image_url}
                        createdAt={project.created_at}
                        likes={project.likes_count}
                        comments={project.comments_count}
                        user={{
                          id: project.owner_id,
                          name: project.user_profile?.full_name || 'Unknown',
                          school: project.user_profile?.school_name || 'Unknown'
                        }}
                        isLiked={project.is_liked}
                        onLike={() => handleLike(project.id)}
                      />
                    ))}
                    {isLoadingMore && (
                      <div className="text-center py-4 text-muted-foreground">
                        Loading more projects...
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};
