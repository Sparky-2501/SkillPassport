/*
  # Enhanced SkillPassport Database Schema

  1. New Tables
    - `credentials`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `type` (text) - Certificate, Diploma, Badge, Other
      - `name` (text) - credential name
      - `issuer` (text) - issuing organization
      - `issue_date` (date) - when credential was issued
      - `evidence_url` (text) - public URL of uploaded PDF
      - `created_at` (timestamp)

  2. Enhanced Tables
    - `connections` - add status field for request/accept flow
    - `profiles` - add theme field for multi-theme support

  3. Storage
    - Create `certificates` bucket for PDF uploads

  4. Security
    - Enable RLS on all tables
    - Add policies for credential privacy (only connected users can view)
    - Add policies for connection requests
*/

-- Create credentials table
CREATE TABLE IF NOT EXISTS credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('Certificate', 'Diploma', 'Badge', 'Other')),
  name text NOT NULL,
  issuer text NOT NULL,
  issue_date date NOT NULL,
  evidence_url text,
  created_at timestamptz DEFAULT now()
);

-- Update connections table to add status field
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'connections' AND column_name = 'status'
  ) THEN
    ALTER TABLE connections ADD COLUMN status text DEFAULT 'accepted' CHECK (status IN ('pending', 'accepted', 'rejected'));
  END IF;
END $$;

-- Update profiles table to add theme field if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'theme'
  ) THEN
    ALTER TABLE profiles ADD COLUMN theme text DEFAULT 'dark';
  END IF;
END $$;

-- Enable RLS
ALTER TABLE credentials ENABLE ROW LEVEL SECURITY;

-- Credentials policies
CREATE POLICY "Users can insert own credentials"
  ON credentials
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own credentials"
  ON credentials
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own credentials"
  ON credentials
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own credentials"
  ON credentials
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Connected users can view credentials"
  ON credentials
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM connections
      WHERE (user_id = auth.uid() AND connection_id = credentials.user_id AND status = 'accepted')
         OR (connection_id = auth.uid() AND user_id = credentials.user_id AND status = 'accepted')
    )
  );

-- Update connections policies for status-based flow
DROP POLICY IF EXISTS "Users can create connections" ON connections;
DROP POLICY IF EXISTS "Users can view their connections" ON connections;
DROP POLICY IF EXISTS "Users can delete their connections" ON connections;

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

-- Create storage bucket for certificates
INSERT INTO storage.buckets (id, name, public)
VALUES ('certificates', 'certificates', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for certificates
CREATE POLICY "Users can upload certificates"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'certificates' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view certificates"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'certificates');

CREATE POLICY "Users can update own certificates"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'certificates' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own certificates"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'certificates' AND auth.uid()::text = (storage.foldername(name))[1]);