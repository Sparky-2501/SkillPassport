/*
  # Fix All SkillPassport Issues

  1. Database Schema Fixes
    - Ensure all tables exist with proper structure
    - Fix foreign key references
    - Update RLS policies
    - Create missing storage buckets

  2. Profile System Fixes
    - Fix profile table structure
    - Update theme field to match frontend expectations
    - Ensure proper user creation flow

  3. Connections System Fixes
    - Fix connection table references
    - Update status management
    - Fix duplicate policies

  4. Credentials System Fixes
    - Ensure proper credential storage
    - Fix evidence URL handling
    - Update storage policies
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can create connection requests" ON connections;
DROP POLICY IF EXISTS "Users can view their connections and requests" ON connections;
DROP POLICY IF EXISTS "Users can update connection status" ON connections;
DROP POLICY IF EXISTS "Users can delete their connections" ON connections;
DROP POLICY IF EXISTS "Users can insert own credentials" ON credentials;
DROP POLICY IF EXISTS "Users can view own credentials" ON credentials;
DROP POLICY IF EXISTS "Users can update own credentials" ON credentials;
DROP POLICY IF EXISTS "Users can delete own credentials" ON credentials;
DROP POLICY IF EXISTS "Connected users can view credentials" ON credentials;

-- Ensure profiles table has correct structure
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_theme_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_theme_check 
  CHECK (theme IN ('theme1', 'theme2', 'theme3', 'theme4', 'theme5', 'theme6'));

-- Update theme column default
ALTER TABLE profiles ALTER COLUMN theme SET DEFAULT 'theme1';

-- Update existing profiles with old theme values
UPDATE profiles SET theme = 'theme1' WHERE theme = 'dark' OR theme NOT IN ('theme1', 'theme2', 'theme3', 'theme4', 'theme5', 'theme6');

-- Ensure connections table references profiles correctly
ALTER TABLE connections DROP CONSTRAINT IF EXISTS connections_user_id_fkey;
ALTER TABLE connections DROP CONSTRAINT IF EXISTS connections_connection_id_fkey;
ALTER TABLE connections ADD CONSTRAINT connections_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE connections ADD CONSTRAINT connections_connection_id_fkey 
  FOREIGN KEY (connection_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Ensure credentials table exists with correct structure
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

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE credentials ENABLE ROW LEVEL SECURITY;

-- Create comprehensive profiles policies
CREATE POLICY "Anyone can view profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create connections policies
CREATE POLICY "Users can view connections"
  ON connections
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = connection_id);

CREATE POLICY "Users can create connections"
  ON connections
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update connections"
  ON connections
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = connection_id OR auth.uid() = user_id);

CREATE POLICY "Users can delete connections"
  ON connections
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = connection_id);

-- Create credentials policies
CREATE POLICY "Users can manage own credentials"
  ON credentials
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Connected users can view credentials"
  ON credentials
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM connections
      WHERE (user_id = auth.uid() AND connection_id = credentials.user_id AND status = 'accepted')
         OR (connection_id = auth.uid() AND user_id = credentials.user_id AND status = 'accepted')
    )
  );

-- Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('certificates', 'certificates', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Certificate files are publicly accessible"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'certificates');

CREATE POLICY "Users can upload certificates"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'certificates' AND auth.uid()::text = (storage.foldername(name))[1]);

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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_connections_user_status ON connections(user_id, status);
CREATE INDEX IF NOT EXISTS idx_connections_connection_status ON connections(connection_id, status);
CREATE INDEX IF NOT EXISTS idx_credentials_user_id ON credentials(user_id);
CREATE INDEX IF NOT EXISTS idx_credentials_created_at ON credentials(created_at DESC);