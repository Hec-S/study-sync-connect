-- Drop existing function if it exists
DROP FUNCTION IF EXISTS mark_messages_as_read;
DROP FUNCTION IF EXISTS mark_all_messages_as_read;

-- Create function to mark all messages from a sender as read
CREATE OR REPLACE FUNCTION mark_messages_as_read(sender_id_param UUID, receiver_id_param UUID)
RETURNS void AS $$
BEGIN
    -- Since this is SECURITY DEFINER, we need to set the RLS context
    SET LOCAL ROLE postgres;
    
    UPDATE messages
    SET read_status = true,
        updated_at = TIMEZONE('utc'::text, NOW())
    WHERE sender_id = sender_id_param 
    AND receiver_id = receiver_id_param 
    AND read_status = false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to mark all messages as read for a user
CREATE OR REPLACE FUNCTION mark_all_messages_as_read(user_id_param UUID)
RETURNS void AS $$
BEGIN
    -- Since this is SECURITY DEFINER, we need to set the RLS context
    SET LOCAL ROLE postgres;
    
    UPDATE messages
    SET read_status = true,
        updated_at = TIMEZONE('utc'::text, NOW())
    WHERE receiver_id = user_id_param 
    AND read_status = false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION mark_messages_as_read TO authenticated;
GRANT EXECUTE ON FUNCTION mark_all_messages_as_read TO authenticated;

-- Drop existing index if it exists
DROP INDEX IF EXISTS idx_messages_read_status;

-- Create optimized index for unread message counts
CREATE INDEX IF NOT EXISTS idx_messages_unread_count ON messages(receiver_id, read_status) 
WHERE read_status = false;
