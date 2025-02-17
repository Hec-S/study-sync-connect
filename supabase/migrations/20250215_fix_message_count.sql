-- Drop existing function if it exists
DROP FUNCTION IF EXISTS get_unread_message_count;

-- Create function to get unread message count for a user
CREATE OR REPLACE FUNCTION get_unread_message_count(user_id_param UUID)
RETURNS INTEGER AS $$
DECLARE
    unread_count INTEGER;
BEGIN
    SELECT COUNT(DISTINCT sender_id)
    INTO unread_count
    FROM messages
    WHERE receiver_id = user_id_param 
    AND read_status = false;
    
    RETURN unread_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_unread_message_count TO authenticated;

-- Create index to optimize the count query
CREATE INDEX IF NOT EXISTS idx_messages_unread_by_sender ON messages(receiver_id, sender_id) 
WHERE read_status = false;

-- You can run this query to test:
-- SELECT get_unread_message_count('your-user-id-here');
