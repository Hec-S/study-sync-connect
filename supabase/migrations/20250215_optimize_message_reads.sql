-- Create function to mark all messages from a sender as read
CREATE OR REPLACE FUNCTION mark_messages_as_read(sender_id_param UUID, receiver_id_param UUID)
RETURNS void AS $$
BEGIN
    UPDATE messages
    SET read_status = true
    WHERE sender_id = sender_id_param 
    AND receiver_id = receiver_id_param 
    AND read_status = false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION mark_messages_as_read TO authenticated;

-- Drop existing index if it exists
DROP INDEX IF EXISTS idx_messages_read_status;

-- Create optimized index for unread message counts
CREATE INDEX idx_messages_unread_count ON messages(receiver_id, read_status) 
WHERE read_status = false;
