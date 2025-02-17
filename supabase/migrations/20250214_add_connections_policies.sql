-- Enable RLS
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;

-- Policy for viewing connections (users can see their own connections)
CREATE POLICY "Users can view their own connections"
ON connections FOR SELECT
TO authenticated
USING (
  auth.uid() = requester_id OR 
  auth.uid() = receiver_id
);

-- Policy for creating connections (users can only create as requester)
CREATE POLICY "Users can create connection requests"
ON connections FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = requester_id AND
  status = 'pending'::connection_status
);

-- Policy for updating connections (receiver can accept/reject, requester can cancel)
CREATE POLICY "Users can update their connections"
ON connections FOR UPDATE
TO authenticated
USING (
  (auth.uid() = receiver_id AND status = 'pending'::connection_status) OR
  (auth.uid() = requester_id AND status = 'pending'::connection_status)
);

-- Policy for deleting connections (either user can delete)
CREATE POLICY "Users can delete their connections"
ON connections FOR DELETE
TO authenticated
USING (
  auth.uid() = requester_id OR 
  auth.uid() = receiver_id
);

-- Function to check if users are connected
CREATE OR REPLACE FUNCTION are_users_connected(user1_id UUID, user2_id UUID)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM connections
    WHERE 
      status = 'accepted'::connection_status AND
      ((requester_id = user1_id AND receiver_id = user2_id) OR
       (requester_id = user2_id AND receiver_id = user1_id));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get connection count for a user
CREATE OR REPLACE FUNCTION get_connection_count(user_id UUID)
RETURNS integer AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::integer FROM connections
    WHERE 
      status = 'accepted'::connection_status AND
      (requester_id = user_id OR receiver_id = user_id)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_connections_status ON connections(status);
CREATE INDEX IF NOT EXISTS idx_connections_requester_status ON connections(requester_id, status);
CREATE INDEX IF NOT EXISTS idx_connections_receiver_status ON connections(receiver_id, status);
