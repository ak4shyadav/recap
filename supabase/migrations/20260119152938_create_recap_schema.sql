/*
  # Create Recap Application Schema

  1. New Tables
    - `recaps`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `input_text` (text, the original input from user)
      - `executive_summary` (text)
      - `key_highlights` (jsonb array)
      - `decisions_taken` (jsonb array)
      - `risks_blockers` (jsonb array)
      - `action_items` (jsonb array)
      - `next_steps` (jsonb array)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `recaps` table
    - Add policy for users to read their own recaps
    - Add policy for users to insert their own recaps
    - Add policy for users to update their own recaps
    - Add policy for users to delete their own recaps
*/

CREATE TABLE IF NOT EXISTS recaps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  input_text text NOT NULL,
  executive_summary text NOT NULL DEFAULT '',
  key_highlights jsonb DEFAULT '[]'::jsonb,
  decisions_taken jsonb DEFAULT '[]'::jsonb,
  risks_blockers jsonb DEFAULT '[]'::jsonb,
  action_items jsonb DEFAULT '[]'::jsonb,
  next_steps jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE recaps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own recaps"
  ON recaps FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recaps"
  ON recaps FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recaps"
  ON recaps FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own recaps"
  ON recaps FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_recaps_user_id ON recaps(user_id);
CREATE INDEX IF NOT EXISTS idx_recaps_created_at ON recaps(created_at DESC);