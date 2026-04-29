/*
  # Create biodatas table

  1. New Tables
    - `biodatas`
      - `id` (uuid, primary key, auto-generated)
      - `user_id` (uuid, foreign key to auth.users, not null)
      - `payload` (jsonb, not null) — stores all biodata form fields as a JSON object
      - `private_fields` (jsonb, default '{}') — tracks which fields the user marked as private
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `biodatas` table
    - SELECT: Users can only read their own biodata
    - INSERT: Users can only insert their own biodata
    - UPDATE: Users can only update their own biodata
    - DELETE: Users can only delete their own biodata

  3. Indexes
    - Index on `user_id` for fast lookups
    - Unique constraint on `user_id` to ensure one biodata per user
*/

CREATE TABLE IF NOT EXISTS biodatas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  payload jsonb NOT NULL DEFAULT '{}',
  private_fields jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_user_biodata UNIQUE (user_id)
);

ALTER TABLE biodatas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own biodata"
  ON biodatas FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own biodata"
  ON biodatas FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own biodata"
  ON biodatas FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own biodata"
  ON biodatas FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_biodatas_user_id ON biodatas(user_id);
