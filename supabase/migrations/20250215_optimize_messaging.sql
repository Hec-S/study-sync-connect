-- Drop existing indexes and policies
DROP INDEX IF EXISTS idx_messages_read_status;
DROP INDEX IF EXISTS idx_messages_unread;
DROP INDEX IF EXISTS idx_messages_receiver_unread;
DROP INDEX IF EXISTS idx_messages_unread_by_sender;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can mark received messages as read" ON messages;

-- Create optimized index for unread message counts
CREATE INDEX IF NOT EXISTS idx_messages_unread_count 
ON messages(receiver_id, sender_id) 
WHERE read_status = false;

-- Create policy for marking messages as read
CREATE POLICY "Users can mark received messages as read"
ON messages FOR UPDATE
USING (auth.uid() = receiver_id)
WITH CHECK (
    auth.uid() = receiver_id
    AND (OLD.read_status IS DISTINCT FROM NEW.read_status)
    AND (
        -- Only allow updating read_status field
        OLD.sender_id = NEW.sender_id
        AND OLD.receiver_id = NEW.receiver_id
        AND OLD.content = NEW.content
        AND NEW.read_status = true
    )
);

-- Create function to mark messages as read for a specific sender
CREATE OR REPLACE FUNCTION mark_messages_as_read(sender_id_param UUID, receiver_id_param UUID)
RETURNS void AS $$
BEGIN
    UPDATE messages
    SET read_status = true,
        updated_at = TIMEZONE('utc'::text, NOW())
    WHERE sender_id = sender_id_param 
    AND receiver_id = receiver_id_param 
    AND read_status = false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to mark all messages as read
CREATE OR REPLACE FUNCTION mark_all_messages_as_read(user_id_param UUID)
RETURNS void AS $$
BEGIN
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
