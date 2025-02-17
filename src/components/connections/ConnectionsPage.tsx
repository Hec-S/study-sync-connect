import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationsContext";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NotificationBadge } from "@/components/ui/notification-badge";
import { UserPlus, Users, Check, X, MessageSquare, Send } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import type { Connection, Message } from "@/integrations/supabase/types";
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
        fetchMessages()
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
              // Fetch complete message data with profiles separately
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

              // Add the new message with profiles
              setMessages(prev => [...prev, {
                ...newMessage,
                sender_profile: senderResponse.data,
                receiver_profile: receiverResponse.data
              }]);

              // Only refresh counts for new unread messages
              if (!newMessage.read_status) {
                await refreshCounts();
              }
            } else if (payload.eventType === 'UPDATE') {
              const updatedMessage = payload.new as Message;
              
              // Update message while preserving profile data
              setMessages(prev => prev.map(msg => 
                msg.id === updatedMessage.id
                  ? { ...msg, ...updatedMessage }
                  : msg
              ));

              // If message was marked as read, update the count
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

  const fetchMessages = async () => {
    if (!user?.id) return;

    try {
      // Get all messages in a single query with proper read status
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*, read_status')
        .or('sender_id.eq.' + user.id + ',receiver_id.eq.' + user.id)
        .order('created_at', { ascending: true });

      if (messagesError) {
        console.error('Error fetching messages:', messagesError);
        throw messagesError;
      }

      // Transform messages with sender and receiver profiles
      const transformedMessages = await Promise.all((messagesData || []).map(async (message) => {
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

    try {
      const { error } = await supabase
        .from('messages')
        .insert([{
          sender_id: user.id,
          receiver_id: activeConversation,
          content: newMessage.trim(),
          read_status: false
        }]);

      if (error) throw error;

      setNewMessage('');
      await fetchMessages();

      toast({
        title: "Success",
        description: "Message sent",
      });
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
      // First get all accepted connections
      const { data: connectionsData, error: connectionsError } = await supabase
        .from('connections')
        .select('*')
        .eq('status', 'accepted')
        .or('requester_id.eq.' + user.id + ',receiver_id.eq.' + user.id)
        .order('created_at', { ascending: false });

      if (connectionsError) throw connectionsError;

      // Then fetch profiles for the other users in each connection
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
      // Get pending requests
      const { data: requestsData, error: requestsError } = await supabase
        .from('connections')
        .select('*')
        .eq('receiver_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (requestsError) throw requestsError;

      // Fetch profiles for requesters
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
    // Update URL with current tab
    setSearchParams({ tab: value });
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
        </TabsList>

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

        <TabsContent value="messages">
          <Card className="p-6">
            <div className="grid grid-cols-[300px_1fr] gap-6 min-h-[600px]">
              {/* Conversations List */}
              <div className="border-r pr-6">
                <div className="mb-4">
                  <h3 className="font-medium">Conversations</h3>
                </div>
                <div className="space-y-4">
                  {connections.map((connection) => {
                    const otherUserId = connection.requester_id === user?.id 
                      ? connection.receiver_id 
                      : connection.requester_id;
                    
                    // Only show unread indicator for messages where user is the receiver
                    const hasUnreadMessages = messages.some(msg => 
                      msg.sender_id === otherUserId && 
                      msg.receiver_id === user?.id && 
                      !msg.read_status
                    );
                    
                    return (
                      <button
                        key={connection.id}
                        onClick={async () => {
                          setActiveConversation(otherUserId);
                          
                          // Mark messages as read when opening conversation
                          const unreadMessages = messages.filter(msg => 
                            msg.sender_id === otherUserId && 
                            msg.receiver_id === user?.id && 
                            !msg.read_status
                          );
                          
                          if (unreadMessages.length > 0) {
                            try {
                              await markMessagesAsRead(otherUserId);
                              // Update local state immediately
                              setMessages(prev => prev.map(msg => 
                                msg.sender_id === otherUserId && 
                                msg.receiver_id === user?.id && 
                                !msg.read_status
                                  ? { ...msg, read_status: true }
                                  : msg
                              ));
                            } catch (error) {
                              console.error('Error marking messages as read:', error);
                              toast({
                                title: "Error",
                                description: "Failed to update message status",
                                variant: "destructive",
                              });
                            }
                          }
                        }}
                        className={`flex items-center gap-4 p-4 w-full rounded-lg transition-colors ${
                          activeConversation === otherUserId
                            ? 'bg-primary/10'
                            : hasUnreadMessages
                            ? 'bg-blue-50 hover:bg-blue-100'
                            : 'hover:bg-muted'
                        }`}
                      >
                        <Avatar>
                          <AvatarFallback>
                            {connection.other_user_profile?.full_name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                          <div className="font-medium">
                            {connection.other_user_profile?.full_name}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {connection.other_user_profile?.school_name}
                          </p>
                        </div>
                        {hasUnreadMessages && (
                          <div className="ml-auto">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Message Thread */}
              <div className="flex flex-col">
                {activeConversation ? (
                  <>
                    {/* Messages */}
                    <div className="flex-1 space-y-4 mb-4 overflow-y-auto">
                      {messages
                        .filter(msg => 
                          (msg.sender_id === user?.id && msg.receiver_id === activeConversation) ||
                          (msg.receiver_id === user?.id && msg.sender_id === activeConversation)
                        )
                        .map((message) => (
                          <div
                            key={message.id}
                            className={`flex flex-col ${
                              message.sender_id === user?.id ? 'items-end' : 'items-start'
                            }`}
                          >
                            <span className="text-xs text-muted-foreground mb-1">
                              {message.sender_id === user?.id ? 'You' : message.sender_profile?.full_name}
                            </span>
                            <div
                              className={`max-w-[70%] rounded-lg p-3 ${
                                message.sender_id === user?.id
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted'
                              }`}
                            >
                              <p>{message.content}</p>
                              <span className="text-xs opacity-70">
                                {new Date(message.created_at).toLocaleTimeString()}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>

                    {/* Message Input */}
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <label 
                          htmlFor="message-input"
                          className="sr-only" // Visually hidden but accessible to screen readers
                        >
                          Type a message
                        </label>
                        <input
                          id="message-input"
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                          placeholder="Type a message..."
                          className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Select a conversation to start messaging
                  </div>
                )}
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </>
  );
};

export default ConnectionsPage;
