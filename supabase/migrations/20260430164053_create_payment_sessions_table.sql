/*
  # Create payment sessions table

  1. New Tables
    - `payment_sessions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, FK to auth.users)
      - `plan` (text - silver/gold/platinum)
      - `stripe_session_id` (text, unique)
      - `status` (text - pending/completed/failed)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `payment_sessions`
    - Users can only read their own payment history
*/

CREATE TABLE IF NOT EXISTS payment_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan text NOT NULL,
  stripe_session_id text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE payment_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own payment sessions"
  ON payment_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage payment sessions"
  ON payment_sessions FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_payment_sessions_user_id ON payment_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_sessions_stripe_id ON payment_sessions(stripe_session_id);
