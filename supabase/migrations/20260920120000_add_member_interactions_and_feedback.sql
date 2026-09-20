-- Member recommendations, private interest requests, and user feedback.

CREATE TABLE IF NOT EXISTS profile_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recommender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT unique_profile_recommendation UNIQUE (recommender_id, profile_user_id),
  CONSTRAINT no_self_recommendation CHECK (recommender_id <> profile_user_id)
);

CREATE TABLE IF NOT EXISTS profile_interests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT unique_profile_interest UNIQUE (sender_id, recipient_id),
  CONSTRAINT no_self_interest CHECK (sender_id <> recipient_id)
);

CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name text,
  email text,
  subject text NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profile_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view recommendation counts" ON profile_recommendations
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Members can manage their recommendations" ON profile_recommendations
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = recommender_id AND recommender_id <> profile_user_id);
CREATE POLICY "Members can remove their recommendations" ON profile_recommendations
  FOR DELETE TO authenticated USING (auth.uid() = recommender_id);

CREATE POLICY "Members can view their interests" ON profile_interests
  FOR SELECT TO authenticated USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "Members can send interests" ON profile_interests
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender_id AND sender_id <> recipient_id);
CREATE POLICY "Recipients can update interest status" ON profile_interests
  FOR UPDATE TO authenticated USING (auth.uid() = recipient_id) WITH CHECK (auth.uid() = recipient_id);

CREATE POLICY "Anyone can submit feedback" ON feedback
  FOR INSERT TO anon, authenticated WITH CHECK (user_id IS NULL OR user_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_profile_recommendations_profile ON profile_recommendations(profile_user_id);
CREATE INDEX IF NOT EXISTS idx_profile_interests_recipient ON profile_interests(recipient_id);
