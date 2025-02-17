-- Create messages table with proper defaults and constraints
CREATE TABLE messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    read_status BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for faster lookups
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_messages_read_status ON messages(receiver_id, read_status) WHERE read_status = false;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_messages_updated_at
    BEFORE UPDATE ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users can read messages they've sent or received
CREATE POLICY "Users can read their own messages"
    ON messages FOR SELECT
    TO authenticated
    USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Users can send messages
CREATE POLICY "Users can send messages"
    ON messages FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = sender_id);

-- Users can update read_status of received messages
CREATE POLICY "Users can update read_status of received messages"
    ON messages FOR UPDATE
    TO authenticated
    USING (auth.uid() = receiver_id)
    WITH CHECK (
        auth.uid() = receiver_id
        AND (OLD.read_status IS DISTINCT FROM NEW.read_status)
        AND (
            OLD.* IS NOT DISTINCT FROM NEW.* 
            OR NEW.* IS NOT DISTINCT FROM OLD.* || jsonb_build_object('read_status', NEW.read_status)::messages
        )
    );
