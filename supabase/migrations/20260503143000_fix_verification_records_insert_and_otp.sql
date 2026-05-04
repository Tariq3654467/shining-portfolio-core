/*
  Fix verification flow for authenticated clients:

  1. Allow users to INSERT their own verification_records row (was service_role only).
  2. Separate OTP fields so email and phone flows do not overwrite each other.
*/

DROP POLICY IF EXISTS "Users can insert own verification" ON verification_records;
CREATE POLICY "Users can insert own verification"
  ON verification_records FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

ALTER TABLE verification_records ADD COLUMN IF NOT EXISTS email_otp_code text;
ALTER TABLE verification_records ADD COLUMN IF NOT EXISTS email_otp_expires_at timestamptz;
ALTER TABLE verification_records ADD COLUMN IF NOT EXISTS phone_otp_code text;
ALTER TABLE verification_records ADD COLUMN IF NOT EXISTS phone_otp_expires_at timestamptz;
