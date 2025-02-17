-- Drop existing policies
DROP POLICY IF EXISTS "Users can update read_status of received messages" ON messages;

-- Create optimized policy for read status updates
CREATE POLICY "Users can update read_status of received messages"
    ON messages FOR UPDATE
    TO authenticated
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

-- Create optimized indexes
DROP INDEX IF EXISTS idx_messages_read_status;
DROP INDEX IF EXISTS idx_messages_unread;
DROP INDEX IF EXISTS idx_messages_receiver_unread;

-- Create index for unread message counts
CREATE INDEX IF NOT EXISTS idx_messages_unread_count 
ON messages(receiver_id, sender_id) 
WHERE read_status = false;

-- Create index for message filtering
CREATE INDEX IF NOT EXISTS idx_messages_conversation 
ON messages(sender_id, receiver_id, created_at DESC);
