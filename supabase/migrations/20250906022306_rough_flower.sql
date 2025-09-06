/*
  # Create profiles and connections tables

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `name` (text)
      - `email` (text, unique)
      - `avatar_url` (text)
      - `linkedin_url` (text)
      - `github_url` (text)
      - `theme` (text, default 'dark')
      - `created_at` (timestamp)
    - `connections`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `connection_id` (uuid, references auth.users)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
    - Add policies for viewing other users' public profile data
    - Add policies for managing connections

  3. Storage
    - Create avatars bucket for profile photo uploads
    - Set up storage policies for avatar management
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text,
  email text UNIQUE NOT NULL,
  avatar_url text,
  linkedin_url text,
  github_url text,
  theme text DEFAULT 'dark',
  created_at timestamptz DEFAULT now()
);

-- Create connections table
CREATE TABLE IF NOT EXISTS connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  connection_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, connection_id)
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Connections policies
CREATE POLICY "Users can view their connections"
  ON connections
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = connection_id);

CREATE POLICY "Users can create connections"
  ON connections
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their connections"
  ON connections
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create avatars storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for avatars
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