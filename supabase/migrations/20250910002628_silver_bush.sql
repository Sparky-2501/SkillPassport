/*
  # Enhanced Connections System

  1. New Tables
    - `connections`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `connection_id` (uuid, references profiles)
      - `status` (text, enum: pending/accepted/rejected)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `connections` table
    - Add policies for users to manage their own connections
    - Add policies for viewing connection requests

  3. Indexes
    - Add performance indexes for faster queries
    - Add unique constraint to prevent duplicate connections
*/

-- Create connections table
CREATE TABLE IF NOT EXISTS connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  connection_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, connection_id)
);

-- Enable RLS
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can create connection requests"
  ON connections
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their connections and requests"
  ON connections
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = connection_id);

CREATE POLICY "Users can update connection status"
  ON connections
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = connection_id OR auth.uid() = user_id);

CREATE POLICY "Users can delete their connections"
  ON connections
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = connection_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_connections_user_id ON connections(user_id);
CREATE INDEX IF NOT EXISTS idx_connections_connection_id ON connections(connection_id);
CREATE INDEX IF NOT EXISTS idx_connections_status ON connections(status);