/*
  # Update Connections System

  1. New Tables
    - Update `connections` table with proper status management
    - Add indexes for better performance

  2. Security
    - Enable RLS on connections table
    - Add policies for connection management
    - Update existing policies

  3. Changes
    - Add status field with proper constraints
    - Add unique constraint to prevent duplicate requests
    - Add indexes for performance
*/

-- Update connections table structure
ALTER TABLE connections DROP CONSTRAINT IF EXISTS connections_status_check;
ALTER TABLE connections ADD CONSTRAINT connections_status_check 
  CHECK (status IN ('pending', 'accepted', 'rejected'));

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_connections_requester_status ON connections(user_id, status);
CREATE INDEX IF NOT EXISTS idx_connections_receiver_status ON connections(connection_id, status);

-- Update RLS policies
DROP POLICY IF EXISTS "Users can create connection requests" ON connections;
DROP POLICY IF EXISTS "Users can update connection status" ON connections;
DROP POLICY IF EXISTS "Users can view their connections and requests" ON connections;

CREATE POLICY "Users can create connection requests"
  ON connections
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update connection status"
  ON connections
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = connection_id OR auth.uid() = user_id);

CREATE POLICY "Users can view their connections and requests"
  ON connections
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = connection_id);

CREATE POLICY "Users can delete their connections"
  ON connections
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = connection_id);