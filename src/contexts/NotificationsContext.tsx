import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "@/integrations/supabase/client";
import type { Message } from "@/integrations/supabase/types";

interface NotificationsContextType {
  messageCount: number;
  requestCount: number;
  refreshCounts: () => Promise<void>;
  markMessagesAsRead: (senderId: string) => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [messageCount, setMessageCount] = useState(0);
  const [requestCount, setRequestCount] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);

  const fetchMessageCount = async () => {
    if (!user?.id) {
      setMessageCount(0);
      return;
    }
    try {
      // Get total count of unread messages
      const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', user.id)
        .eq('read_status', false);
      
      if (error) throw error;
      setMessageCount(count || 0);
    } catch (error) {
      console.error('Error fetching message count:', error);
      setMessageCount(0);
    }
  };

  const fetchRequestCount = async () => {
    if (!user?.id) {
      setRequestCount(0);
      return;
    }
    try {
      // Efficient count-only query for pending requests
      const { count, error } = await supabase
        .from('connections')
        .select('id', { count: 'exact', head: true })
        .eq('receiver_id', user.id)
        .eq('status', 'pending');
      
      if (error) throw error;
      setRequestCount(count || 0);
    } catch (error) {
      console.error('Error fetching request count:', error);
      setRequestCount(0);
    }
  };

  const refreshCounts = async () => {
    await Promise.all([fetchMessageCount(), fetchRequestCount()]);
  };

  const markMessagesAsRead = async (senderId: string) => {
    if (!user?.id) return;

    try {
      const { error: updateError } = await supabase
        .from('messages')
        .update({ 
          read_status: true,
          updated_at: new Date().toISOString()
        })
        .eq('sender_id', senderId)
        .eq('receiver_id', user.id)
        .eq('read_status', false);

      if (updateError) throw updateError;

      // Update local state
      setMessages(prev => prev.map(msg => 
        msg.sender_id === senderId && msg.receiver_id === user.id && !msg.read_status
          ? { ...msg, read_status: true }
          : msg
      ));

      // Refresh message count
      await fetchMessageCount();
    } catch (error) {
      console.error('Error in markMessagesAsRead:', error);
      // Refresh everything to ensure accuracy
      await Promise.all([fetchMessages(), fetchMessageCount()]);
    }
  };

  const fetchMessages = async () => {
    if (!user?.id) {
      setMessages([]);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    }
  };

  useEffect(() => {
    if (user) {
      Promise.all([refreshCounts(), fetchMessages()]);

      // Subscribe to real-time updates
      const subscription = supabase
        .channel('notifications')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'connections',
          filter: `receiver_id=eq.${user.id} AND status=eq.pending`
        }, (payload) => {
          fetchRequestCount();
        })
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'messages',
          filter: `receiver_id=eq.${user.id}`
        }, (payload) => {
          if (payload.eventType === 'INSERT') {
            const newMessage = payload.new as Message;
            setMessages(prev => [...prev, newMessage]);
            
            // Increment count for any new unread message
            if (!newMessage.read_status && newMessage.receiver_id === user.id) {
              setMessageCount(prev => prev + 1);
            }
          } else if (payload.eventType === 'UPDATE') {
            const updatedMessage = payload.new as Message;
            setMessages(prev => prev.map(msg => 
              msg.id === updatedMessage.id ? updatedMessage : msg
            ));
            
            // Decrement count when a message is marked as read
            if (payload.old.read_status === false && updatedMessage.read_status === true) {
              setMessageCount(prev => Math.max(0, prev - 1));
            }
          }
        })
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  return (
    <NotificationsContext.Provider value={{
      messageCount,
      requestCount,
      refreshCounts,
      markMessagesAsRead,
    }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
}
