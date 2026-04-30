/*
  # Add verification and search capability fields

  1. New Tables
    - `verification_records`
      - `id` (uuid, primary key)
      - `user_id` (uuid, FK to auth.users)
      - `email_verified` (boolean, default false)
      - `phone_verified` (boolean, default false)
      - `phone_number` (text, nullable)
      - `verification_code` (text, nullable)
      - `code_expires_at` (timestamptz, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Modified Tables
    - `biodatas`: No changes needed, JSONB payload handles all fields dynamically

  3. Security
    - Enable RLS on `verification_records`
    - Users can only read/update their own verification records
*/

CREATE TABLE IF NOT EXISTS verification_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_verified boolean DEFAULT false,
  phone_verified boolean DEFAULT false,
  phone_number text,
  verification_code text,
  code_expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_user_verification UNIQUE (user_id)
);

ALTER TABLE verification_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own verification"
  ON verification_records FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own verification"
  ON verification_records FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can insert verification"
  ON verification_records FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_verification_user_id ON verification_records(user_id);
